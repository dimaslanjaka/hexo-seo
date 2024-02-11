const base = __dirname + '/../site/';
process.cwd = () => base;

const path = require('path');
const Bluebird = require('bluebird');
const Hexo = require('hexo');
const { fs } = require('sbg-utility');
const hexo = new Hexo(base, { silent: true });

// the actual path of your post
const postToRender = base + '/source/_posts/unit-test/categories.md';

// Initialize Hexo
hexo
  .init()
  // load hexo plugins
  .then(() => {
    return Bluebird.all(fs.readdir(base + '/node_modules')).each((pluginName) => {
      if (pluginName.startsWith('hexo-')) {
        // console.log('load plugin', pluginName, require.resolve(pluginName, { paths: [base] }));
        return hexo.loadPlugin(require.resolve(pluginName, { paths: [base] }));
      }
    });
  })
  .then(() => {
    // Load the Hexo database
    return hexo.load();
  })
  .then(() => {
    const { compile } = Object.assign({}, hexo.extend.renderer.store.njk);
    // Setup layout
    hexo.theme.setView('layout.njk', ['<html>', '{{ body }}', '</html>'].join('\n'));
    // Restore compile function
    hexo.extend.renderer.store.njk.compile = compile;
    // hexo.extend.filter.register('after_render:html', function (data) {
    //   console.log(arguments);
    //   return data;
    // });
  })
  .then(async () => {
    // render post path
    const postPath = path.join(postToRender);
    // const post = await hexo.post.render(postPath);
    // console.log(post.content); // output post html
    // const render = await hexo.render.render({ path: postPath });
    // console.log(render);

    // const body = fs.readFileSync(postPath);
    const body = ['layout: layout', '---', '', fs.readFileSync(postPath)].join('\n');
    const view = new hexo.theme.View('_layout.njk', body);
    const content = await view.render({
      config: hexo.config,
      page: {}
    });
    console.log(content);
  })
  .catch((err) => {
    console.error(err);
  })
  .finally(() => {
    // Stop Hexo gracefully
    return hexo.exit();
  });
