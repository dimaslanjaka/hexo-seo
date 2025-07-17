import axios from 'axios';
import fs from 'fs-extra';
import Hexo from 'hexo';
import { minimatch } from 'minimatch';
import { parse as nodeHtmlParser } from 'node-html-parser';
import { writefile } from 'sbg-utility';
import path from 'upath';
import { CacheFile } from '../cache';
import getConfig, { cache_key_router, coreCache, getMode } from '../config';
import { buildFolder, tmpFolder } from '../fm';
import { minifyJS } from '../minifier/js';
import { md5 } from '../utils/md5-file';

export interface JsConcatOptions {
  root: ReturnType<typeof nodeHtmlParser>;
  logname: string;
  logconcatname: string;
  filePath: string;
}

export async function jsConcat(this: Hexo, { root, logname, logconcatname, filePath }: JsConcatOptions) {
  const hexo = this;
  const cfg = getConfig(this);
  // Check if js concatenation is enabled (support boolean or object)
  let jsConcatEnabled = false;
  const jsConcatExclude = cfg.js.exclude || [];
  let jsConcatDownloadExternal = false;
  if (typeof cfg.js.concat === 'boolean') {
    jsConcatEnabled = cfg.js.concat;
  } else if (typeof cfg.js.concat === 'object') {
    jsConcatEnabled = cfg.js.concat.enable == true;
    jsConcatDownloadExternal = cfg.js.concat.download_external == true;
  } else if (cfg.js.concat) {
    jsConcatEnabled = true;
  }
  if (!jsConcatEnabled) {
    hexo.log.debug(logname, 'js concatenation is disabled');
    return root.toString();
  }
  const cache = new CacheFile('jsConcat');
  const concatRoutes = coreCache.getSync('jslibs', [] as { path: string; absolute: string }[]);
  const scripts = Array.from(root.getElementsByTagName('script')).filter(function (el: any) {
    return el.getAttribute && (el.getAttribute('type') || '') !== 'application/ld+json';
  });
  const filename = 'concat-' + md5(path.basename(filePath));
  const scriptContents: string[] = [];
  hexo.log.debug(logname, 'concatenate', scripts.length + ' javascripts');
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i] as any;
    let src = script.getAttribute ? script.getAttribute('src') : undefined;
    let textContent = script.textContent ?? '';
    const srcIsUrl =
      typeof src === 'string' && (src.startsWith('//') || src.startsWith('http:') || src.startsWith('https:'));
    // skip external js
    if (typeof src === 'string' && src.trim().length > 0 && srcIsUrl) continue;

    // download external javascript
    if (srcIsUrl && jsConcatDownloadExternal) {
      // exclude download external js from these domains (supports glob patterns)
      const excludes = ['-adnow.com/', '.googlesyndication.com/'].concat(jsConcatExclude);
      if (excludes.some((pattern) => minimatch(src, pattern))) continue;
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
        // remove src attribute
        if (script.removeAttribute) {
          script.removeAttribute('src');
        }
        // save downloaded js to cache
        cache.setCache('download-' + src, data);
      } catch (error) {
        hexo.log.error(logconcatname, 'download failed', error.message);
      }
    }

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
      if (script.parentNode && typeof script.parentNode.removeChild === 'function') {
        script.parentNode.removeChild(script);
      }
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
        path.join(cfg.post_dir, path.basename(filePath))
      ].map((dir: string) => path.join(dir, src));
      const sources = originalSources.filter(fs.existsSync);
      if (sources.length > 0) {
        try {
          const rendered = await hexo.render.render({ path: sources[0], engine: 'js' });
          // push src
          addScript(rendered);
        } catch (e: any) {
          hexo.log.error(logconcatname, 'failed', src, e.message);
        }
      } else {
        hexo.log.error(logconcatname, 'failed, not found', src, filePath);
        hexo.log.error(
          logconcatname,
          'log',
          writefile(path.join(tmpFolder, 'logs', filename + '.log'), originalSources).file
        );
        // Remove script tag if not found
        if (script.parentNode && typeof script.parentNode.removeChild === 'function') {
          script.parentNode.removeChild(script);
        }
      }
    } else {
      // push inner
      addScript(textContent);
    }
  }
  const filePathWithoutExt = path.join(tmpFolder, 'html', filename);
  const jsFilePath = path.join(buildFolder, 'hexo-seo-js', filename) + '.js';
  let scriptContent = scriptContents.join('\n');
  if (getMode() === 'g' && cfg.js.enable) {
    scriptContent = await minifyJS(scriptContent, cfg.js.options);
  }
  writefile(jsFilePath, scriptContent);
  hexo.log.debug(logname, jsFilePath);
  let content = root.toString();
  const newsrc = `/hexo-seo-js/${filename}.js`;
  const newScript = `<script src="${newsrc}"></script>`;
  content = content.replace('</body>', newScript + '</body>');
  concatRoutes.push({
    path: newsrc,
    absolute: jsFilePath
  });
  coreCache.setSync(cache_key_router, concatRoutes);
  hexo.log.debug(
    logconcatname,
    'written',
    writefile(path.join(process.cwd(), hexo.config.public_dir, newsrc), scriptContent).file
  );
  hexo.log.debug(logname, writefile(filePathWithoutExt + '.html', content).file);
  return content;
}
