const Bluebird = require('bluebird');
const { deepmerge } = require('deepmerge-ts');
const Hexo = require('hexo');
const fs = require('fs-extra');
const path = require('upath');

const baseSite = path.resolve(__dirname, '../tmp/site/');
module.exports.baseSite = baseSite;
const base_node_modules = path.join(baseSite, 'node_modules');
module.exports.base_node_modules = base_node_modules;

// override process.cwd()
process.cwd = () => baseSite;

/**
 * hexo instance caller
 * @param {Record<string,any>} config
 * @returns
 */
function envHexo(config) {
  const hexo = new Hexo(baseSite, Object.assign({ silent: true }, config || {}));
  hexo.config = deepmerge(hexo.config, config || {});
  const initialized = hexo
    .init()
    // load hexo plugins
    .then(() => {
      return Bluebird.all(fs.readdir(base_node_modules)).each((pluginName) => {
        if (pluginName.startsWith('hexo-')) {
          try {
            return hexo.loadPlugin(require.resolve(pluginName, { paths: [baseSite] }));
          } catch {
            // ignore if plugin not found
          }
        }
      });
    })
    .then(() => hexo.load())
    .then(() => {
      hexo.config = deepmerge(hexo.config, config || {});
      return hexo;
    });
  // bind global hexo instance
  global.hexo = hexo;
  return initialized;
}

module.exports.baseSite = baseSite;
module.exports.envHexo = envHexo;
