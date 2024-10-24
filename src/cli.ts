import Hexo from 'hexo';
import { hexoSeoSearch } from './search/cli';

/**
 * Initialize CLI utilities
 * @param hexo Hexo instance
 */
export function initCLI(hexo: Hexo) {
  hexo.extend.console.register(
    'seo-search',
    `Index your content and save to ${hexo.config.public_dir} and ${hexo.config.source_dir} directory`,
    {},
    hexoSeoSearch
  );
}
