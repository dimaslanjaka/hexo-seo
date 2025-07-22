const Bluebird = require('bluebird');
const { deepmerge } = require('deepmerge-ts');
const Hexo = require('hexo');
const { fs, path } = require('sbg-utility');

const base = path.resolve(__dirname, '../site/');
const base_node_modules = path.join(base, 'node_modules');

// override process.cwd()
process.cwd = () => base;

/**
 * hexo instance caller
 * @param {Record<string,any>} config
 * @returns
 */
function envHexo(config) {
  const hexo = new Hexo(base, Object.assign(config, { silent: true }));
  const initialized = hexo
    .init()
    // load hexo plugins
    .then(() => {
      return Bluebird.all(fs.readdir(base_node_modules)).each((pluginName) => {
        if (pluginName.startsWith('hexo-')) {
          // console.log('load plugin', pluginName, require.resolve(pluginName, { paths: [base] }));
          return hexo.loadPlugin(require.resolve(pluginName, { paths: [base] }));
        }
      });
    })
    .then(() => hexo.load())
    .then(() => {
      hexo.config = deepmerge(hexo.config, config);
      return hexo;
    });
  // bind global hexo instance
  global.hexo = hexo;
  return initialized;
}

module.exports = { baseSite: base, envHexo };
