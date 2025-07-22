import ansiColors from 'ansi-colors';
import Hexo from 'hexo';
import { HexoLocalsData } from 'hexo/dist/hexo/locals-d';
import { parse as nodeHtmlParser } from 'node-html-parser';
import parseUrl from 'url-parse';
import { CacheFile } from '../cache';
import getConfig from '../config';
import { isDev } from '../hexo-seo';
import logger from '../log';
import sitemap from '../sitemap';
import { array_remove_empties, array_unique } from '../utils/array';
import { md5 } from '../utils/file-checksum.cjs';
import { identifyRels } from './fixHyperlinks.static';
import fixSchemaStatic from './fixSchema.static';
import { jsConcat } from './jsConcat';
import { HexoSeo } from './schema/article';
import { isExternal } from './types';

/**
 * get page full source
 * @param data
 * @returns
 */
export function getPagePath(data: HexoSeo | HexoLocalsData) {
  if (data.page) {
    if (data.page.full_source) return data.page.full_source;
    if (data.page.path) return data.page.path;
  }
  if (data.path) return data.path;
}

export async function HexoSeoHtml(this: Hexo, content: string, data: HexoSeo) {
  const logname = ansiColors.magentaBright('hexo-seo(html)');
  const logconcatname = ansiColors.magentaBright('hexo-seo(html-concat)');
  const cache = new CacheFile('html');

  const hexo = this;
  const cfg = getConfig(this);
  let path0: string = getPagePath(data);
  let allowCache = true;
  if (!path0) {
    allowCache = false;
    path0 = content;
  }
  // setup page title as default value for missing attributes
  let title = '';
  if (data.page && data.page.title && data.page.title.trim().length > 0) {
    title = data.page.title;
  } else {
    title = data.config.title;
  }

  const isCacheMiss = cache.isFileChanged(md5(path0)) || isDev || !cfg.cache;

  const root = nodeHtmlParser(content);

  // TODO process sitemap
  sitemap.bind(this)(root, cfg, data);

  // TODO process schema
  fixSchemaStatic.bind(this)(root, cfg, data);

  // TODO concatenate javascripts
  await jsConcat.bind(hexo)({
    root,
    logname,
    logconcatname,
    filePath: path0
  });

  if (isCacheMiss && cfg.html.enable) {
    //** fix hyperlink */
    if (cfg.links.enable) {
      const a = root.querySelectorAll('a[href]');
      a.forEach((el) => {
        let href = String(el.getAttribute('href')).trim();
        if (href.startsWith('//')) href = 'http:' + href;
        if (/^https?:\/\//.test(href)) {
          let rels = el.getAttribute('rel') ? el.getAttribute('rel').split(' ') : [];
          //rels = rels.removeEmpties().unique();
          rels = array_unique(array_remove_empties(rels));
          const parseHref = parseUrl(href);
          const external = isExternal(parseHref, hexo);
          rels = identifyRels(el, external, cfg.links);
          el.setAttribute('rel', rels.join(' '));
          // set indicator
          el.setAttribute('hexo-seo', 'true');
          if (!el.hasAttribute('alt')) el.setAttribute('alt', title);
          if (!el.hasAttribute('title')) el.setAttribute('title', title);
        }
      });
    }

    if (cfg.html.fix) {
      //** fix invalid html */
      const inv = root.querySelectorAll('[href="/.css"],[src="/.js"]');
      if (inv.length > 0) {
        logger.log('invalid html found', inv.length, inv.length > 1 ? 'items' : 'item');
        inv.forEach((el) => {
          el.remove();
        });
      }
    }

    // TODO fix images attributes
    if (cfg.img.enable) {
      root.querySelectorAll('img[src]').forEach((element) => {
        const imgAlt = element.getAttribute('alt') || title;
        const imgTitle = element.getAttribute('title') || imgAlt;
        if (!element.hasAttribute('title')) {
          //logger.log("%s(img[title]) fix %s", pkg.name, data.title);
          element.setAttribute('title', imgTitle);
        }
        if (!element.hasAttribute('alt')) {
          element.setAttribute('alt', imgAlt);
        }
        if (!element.getAttribute('itemprop')) {
          element.setAttribute('itemprop', 'image');
        }
        if (cfg.img.broken) {
          if (cfg.img.onerror === 'clientside') {
            element.setAttribute('onerror', "this.src='" + cfg.img.default + "';");
          }
        }
        if (isDev) element.setAttribute('hexo-seo', 'true');
      });
    }

    if (allowCache) cache.set(md5(path0), content);
    hexo.log.debug(logname, 'no-cache content');
  } else {
    hexo.log.debug(logname, 'cached content');
    return cache.getCache(md5(path0), content) as string;
  }

  return root.toString();
}

export default HexoSeoHtml;
