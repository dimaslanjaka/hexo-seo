const index = require('./dist/src');
hexo.log.debug('hexo-seo running on production mode');
if (typeof index.default == 'function') {
  index.default(hexo);
}
