import ansiColors from 'ansi-colors';
import Hexo, { TemplateLocals } from 'hexo';

import axios from 'axios';
import fs from 'fs-extra';
import { parse as nodeHtmlParser } from 'node-html-parser';
import { writefile } from 'sbg-utility';
import path from 'upath';
import parseUrl from 'url-parse';
import { CacheFile } from '../cache';
import getConfig from '../config';
import { tmpFolder } from '../fm';
import { isDev } from '../hexo-seo';
import logger from '../log';
import sitemap from '../sitemap';
import { array_remove_empties, array_unique } from '../utils/array';
import { md5 } from '../utils/md5-file';
import { parseJSDOM } from './dom';
import { identifyRels } from './fixHyperlinks.static';
import fixSchemaStatic from './fixSchema.static';
import { HexoSeo } from './schema/article';
import { isExternal } from './types';

const logname = ansiColors.magentaBright('hexo-seo(html)');
const logconcatname = ansiColors.magentaBright('hexo-seo(html-concat)');

/**
 * get page full source
 * @param data
 * @returns
 */
export function getPagePath(data: HexoSeo | TemplateLocals) {
  if (data.page) {
    if (data.page.full_source) return data.page.full_source;
    if (data.page.path) return data.page.path;
  }
  if (data.path) return data.path;
}

const cache = new CacheFile('index');
export default async function HexoSeoHtml(this: Hexo, content: string, data: HexoSeo) {
  //console.log("filtering html", data.page.title);
  const hexo = this;
  let path0: string = getPagePath(data);
  let allowCache = true;
  if (!path0) {
    allowCache = false;
    path0 = content;
  }
  let title = '';
  if (data.page && data.page.title && data.page.title.trim().length > 0) {
    title = data.page.title;
  } else {
    title = data.config.title;
  }

  if (cache.isFileChanged(md5(path0)) || isDev) {
    const root = nodeHtmlParser(content);
    const cfg = getConfig(this);
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
          if (isDev) el.setAttribute('hexo-seo', 'true');
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

    //** fix images attributes */
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

    fixSchemaStatic(root, cfg, data);
    sitemap(root, cfg, data);

    content = root.toString();

    // START concatenate javascripts
    if (cfg.js.concat === true) {
      const { dom, window, document } = parseJSDOM(content);
      const scripts = Array.from(document.getElementsByTagName('script')).filter(function (el) {
        return (el.getAttribute('type') || '') !== 'application/ld+json';
      });
      const filename = md5(path.basename(path0));
      const scriptContents = [];
      hexo.log.info(logname, 'concatenate', scripts.length + ' javascripts');
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        let { textContent, src } = script;
        // download external javascript
        if (typeof src === 'string' && (src.startsWith('//') || src.startsWith('http:') || src.startsWith('https:'))) {
          if (src.startsWith('//')) {
            src = 'http:' + src;
          }
          const { data } = await axios.get(src);
          // replace text content (inner) string with response data
          textContent = data;
          // assign src as null
          src = null;
        }
        /**
         * indicator
         */
        const separator = `\n\n/*--- ${typeof src === 'string' && src.trim().length > 0 ? src : 'inner-' + i} --*/\n\n`;
        if (typeof src === 'string' && src.trim().length > 0) {
          /**
           * find js file from theme, source, post directories
           */
          const originalSources = [
            // find from theme source directory
            path.join(cfg.theme_dir, 'source'),
            // find from source directory
            cfg.source_dir,
            // find from post directory
            cfg.post_dir,
            // find from asset post folder
            path.join(cfg.post_dir, path.basename(path0))
          ].map((dir) => path.join(dir, src));
          const sources = originalSources.filter(fs.existsSync);
          if (sources.length > 0) {
            try {
              const rendered = await hexo.render.render({ path: sources[0], engine: 'js' });
              scriptContents.push(separator, rendered);
            } catch (e) {
              hexo.log.error(logconcatname, 'failed', src, e.message);
            }
          } else {
            hexo.log.error(logconcatname, 'failed, cannot find file', src, originalSources);
          }
        } else {
          // push inner
          scriptContents.push(separator, textContent);
        }
      }

      const filePath = path.join(tmpFolder, 'html', filename);
      hexo.log.info(logname, writefile(filePath + '.js', scriptContents.join('\n')).file);
      hexo.log.info(logname, writefile(filePath + '.html', dom.toString()).file);
      window.close();
    }
    // END concatenate javascripts

    if (allowCache) cache.set(md5(path0), content);
  } else {
    content = cache.getCache(md5(path0), content) as string;
  }
  return content;
}
