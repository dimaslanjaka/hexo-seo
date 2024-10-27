import Bluebird from 'bluebird';
import Hexo from 'hexo';
import { generateFeeds } from './feeds';
import { hexoSeoSearch } from './search';

/**
 * Initialize CLI utilities
 * @param hexo Hexo instance
 */
export function initCLI(hexo: Hexo) {
  hexo.extend.console.register(
    'seo-search',
    `Index your content and save as hexo-seo-search.json to ${hexo.config.public_dir} and ${hexo.config.source_dir} directory`,
    {},
    hexoSeoSearch
  );
  hexo.extend.console.register(
    'seo-feed',
    `Index your content and save as rss.xml to ${hexo.config.public_dir} and ${hexo.config.source_dir} directory`,
    {},
    generateFeeds
  );
  hexo.extend.console.register('seo', 'hexo-seo all in one generation', async function (args, callback) {
    await Bluebird.promisify(hexoSeoSearch).call(this, args, callback);
    await Bluebird.promisify(generateFeeds).call(this, args, callback);
  });
}
