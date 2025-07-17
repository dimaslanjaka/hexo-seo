import ansiColors from 'ansi-colors';
import Hexo from 'hexo';

import fs from 'fs-extra';
import { StoreFunctionData } from 'hexo/dist/extend/renderer-d';
import { HexoLocalsData } from 'hexo/dist/hexo/locals-d';
import { parse as nodeHtmlParser } from 'node-html-parser';
import { writefile } from 'sbg-utility';
import path from 'upath';
import parseUrl from 'url-parse';
import { CacheFile } from '../cache';
import getConfig, { cache_key_router, coreCache, getMode } from '../config';
import { buildFolder, tmpFolder } from '../fm';
import { isDev } from '../hexo-seo';
import logger from '../log';
import { minifyJS } from '../minifier/js';
import sitemap from '../sitemap';
import { array_remove_empties, array_unique } from '../utils/array';
import { md5 } from '../utils/md5-file';
import { identifyRels } from './fixHyperlinks.static';
import fixSchemaStatic from './fixSchema.static';
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

export default async function HexoSeoHtml(this: Hexo, content: string, data: HexoSeo) {
  const logname = ansiColors.magentaBright('hexo-seo(html)');
  const logconcatname = ansiColors.magentaBright('hexo-seo(html-concat)');
  const cache = new CacheFile('html');
  const concatRoutes = coreCache.getSync('jslibs', [] as { path: string; absolute: string }[]);

  const hexo = this;
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

    // TODO process schema
    fixSchemaStatic.bind(this)(root, cfg, data);

    // TODO process sitemap
    sitemap.bind(this)(root, cfg, data);

    // START concatenate javascripts
    if (cfg.js.concat === true) {
      //const { dom, window, document } = parseJSDOM(content);
      const scripts = Array.from(root.getElementsByTagName('script')).filter(function (el) {
        return (el.getAttribute('type') || '') !== 'application/ld+json';
      });
      const filename = 'concat-' + md5(path.basename(path0));
      const scriptContents = [];
      hexo.log.debug(logname, 'concatenate', scripts.length + ' javascripts');
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const src = script.getAttribute('src');
        const textContent = script.textContent;

        const srcIsUrl =
          typeof src === 'string' && (src.startsWith('//') || src.startsWith('http:') || src.startsWith('https:'));

        /*
        // download external javascript
        if (srcIsUrl) {
          // exclude download external js from these domains
          const includes = ['-adnow.com/', '.googlesyndication.com/'];
          if (includes.some((str) => src.includes(str))) continue;
          const cachedExternal = cache.getCache('donwload-' + src, null as string | null);
          if (src.startsWith('//')) {
            src = 'http:' + src;
          }
          try {
            let data: string;
            if (cachedExternal === null) {
              data = (await axios.get(src)).data;
            } else {
              data = cachedExternal;
            }
            // replace text content (inner) string with response data
            textContent = data;
            // assign src as null
            src = null;
            // save downloaded js to cache
            cache.setCache('download-' + src, data);
          } catch (error) {
            hexo.log.error(logconcatname, 'download failed', error.message);
          }
        }
        */

        /**
         * indicator
         */
        const separator = `/*--- ${typeof src === 'string' && src.trim().length > 0 ? src : 'inner-' + i} --*/\n\n`;
        /**
         * add to scripts container
         * @param text javascript text
         */
        const addScript = function (text: string) {
          scriptContents.push(separator, text, '\n\n');
          // delete current script tag
          script.parentNode.removeChild(script);
        };
        // parse javascript
        if (typeof src === 'string' && src.trim().length > 0) {
          // skip external js
          if (srcIsUrl) continue;
          /**
           * find js file from theme, source, post directories
           */
          const originalSources = [
            // find from theme source directory
            path.join(cfg.theme_dir, 'source'),
            // find from node_modules directory
            path.join(process.cwd(), 'node_modules'),
            // find from our plugins directory
            path.join(process.cwd(), 'node_modules/hexo-shortcodes'),
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
              const rendered = await hexo.render.render({ path: sources[0], engine: 'js' } as StoreFunctionData);
              // push src
              addScript(rendered);
            } catch (e) {
              hexo.log.error(logconcatname, 'failed', src, e.message);
            }
          } else {
            hexo.log.error(logconcatname, 'failed, not found', src, path0);
            hexo.log.error(
              logconcatname,
              'log',
              writefile(path.join(tmpFolder, 'logs', filename + '.log'), originalSources).file
            );
          }
        } else {
          // push inner
          addScript(textContent);
        }
      }

      const filePathWithoutExt = path.join(tmpFolder, 'html', filename);
      const jsFilePath = path.join(buildFolder, 'hexo-seo-js', filename) + '.js';
      let scriptContent = scriptContents.join('\n');
      // minify only on generate
      if (getMode() === 'g' && cfg.js.enable) {
        scriptContent = await minifyJS(scriptContent, cfg.js.options);
      }
      // write js
      writefile(jsFilePath, scriptContent);
      // show log
      hexo.log.debug(logname, jsFilePath);

      content = root.toString();

      // create new script and append to closing body
      const newsrc = `/hexo-seo-js/${filename}.js`;
      const newScript = `<script src="${newsrc}"></script>`;
      content = content.replace('</body>', newScript + '</body>');

      // cache router
      concatRoutes.push({
        path: newsrc,
        absolute: jsFilePath
      });
      coreCache.setSync(cache_key_router, concatRoutes);
      // write to public directory
      hexo.log.debug(
        logconcatname,
        'written',
        writefile(path.join(process.cwd(), hexo.config.public_dir, newsrc), scriptContent).file
      );

      hexo.log.debug(logname, writefile(filePathWithoutExt + '.html', content).file);
      //window.close();
    }
    // END concatenate javascripts

    // modify html content
    content = root.toString();

    if (allowCache) cache.set(md5(path0), content);
    hexo.log.debug(logname, 'no-cache content');
  } else {
    hexo.log.debug(logname, 'cached content');
    content = cache.getCache(md5(path0), content) as string;
  }

  return content;
}
