import Hexo from 'hexo';
import { hexoIs } from 'hexo-is';
import { JSDOM } from 'jsdom';
import pkg from '../../package.json';
import { CacheFile, releaseMemory } from '../cache';
import getConfig from '../config';
import { HexoSeo } from '../html/schema/article';
import logger from '../log';
import { dump, extractSimplePageData } from '../utils';

function fixAttributes(this: Hexo, content: string, data: HexoSeo) {
  const cF = new CacheFile('img-attr');
  releaseMemory();
  const is = hexoIs(data);
  const path0 = data.page ? data.page.full_source : data.path;

  if ((!path0 || !is.post) && !is.page) {
    if (!is.tag && !is.archive && !is.home && !is.category && !is.year) {
      console.log(path0, is);
      dump('dump-path0.txt', path0);
      dump('dump-data.txt', extractSimplePageData(data));
      dump('dump-page.txt', extractSimplePageData(data.page));
      dump('dump-this.txt', extractSimplePageData(this));
    }
    return content;
  }

  const HSconfig = getConfig(this);
  const title = data.page && data.page.title && data.page.title.trim().length > 0 ? data.page.title : this.config.title;
  const isChanged = cF.isFileChanged(path0);

  if (isChanged) {
    const dom = new JSDOM(content);
    const document = dom.window.document;
    logger.log('%s(IMG:attr) parsing start [%s]', pkg.name, path0);
    document.querySelectorAll('img[src]').forEach((element) => {
      if (!element.getAttribute('title')) {
        element.setAttribute('title', title);
      }
      if (!element.getAttribute('alt')) {
        element.setAttribute('alt', title);
      }
      if (!element.getAttribute('itemprop')) {
        element.setAttribute('itemprop', 'image');
      }
    });

    //dom.serialize() === "<!DOCTYPE html><html><head></head><body>hello</body></html>";
    //document.documentElement.outerHTML === "<html><head></head><body>hello</body></html>";
    if (HSconfig.html.fix) {
      content = dom.serialize();
    } else {
      content = document.documentElement.outerHTML;
    }
    dom.window.close();
    cF.set(path0, content);
    return content;
  }
  logger.log('%s(IMG:attr) cached [%s]', pkg.name, path0.replace(this.base_dir, ''));
  content = cF.get(path0, '');
  return content;
}
export default fixAttributes;
