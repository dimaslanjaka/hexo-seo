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
  for (const [i, script] of scripts.entries()) {
    const src = script.getAttribute?.('src');
    let textContent = script.textContent ?? '';
    const srcIsUrl =
      typeof src === 'string' && (src.startsWith('//') || src.startsWith('http:') || src.startsWith('https:'));

    // Helper to remove script tag
    const removeScriptTag = () => {
      script.parentNode?.removeChild?.(script);
    };

    // Helper to add script content
    const separator = `/*--- ${typeof src === 'string' && src.trim().length > 0 ? src : 'inner-' + i} --*/\n\n`;
    const addScript = (text: string) => {
      scriptContents.push(separator, text, '\n\n');
      removeScriptTag();
    };

    // External JS logic
    if (typeof src === 'string' && src.trim().length > 0 && srcIsUrl) {
      if (!jsConcatDownloadExternal) continue;
      // Exclude patterns
      const excludes = ['-adnow.com/', '.googlesyndication.com/'].concat(jsConcatExclude);
      if (excludes.some((pattern) => minimatch(src, pattern))) continue;
      const cachedExternal = cache.getCache('donwload-' + src, null as string | null);
      const fetchSrc = src.startsWith('//') ? 'http:' + src : src;
      try {
        const data = cachedExternal === null ? (await axios.get(fetchSrc)).data : cachedExternal;
        textContent = data;
        script.removeAttribute?.('src');
        cache.setCache('download-' + src, data);
      } catch (error) {
        hexo.log.error(logconcatname, 'download failed', (error as Error).message);
      }
      addScript(textContent);
      continue;
    }

    // Local JS logic
    if (typeof src === 'string' && src.trim().length > 0) {
      const originalSources = [
        path.join(cfg.theme_dir, 'source'),
        path.join(process.cwd(), 'node_modules'),
        path.join(process.cwd(), 'node_modules/hexo-shortcodes'),
        cfg.source_dir,
        cfg.post_dir,
        path.join(cfg.post_dir, path.basename(filePath))
      ].map((dir: string) => path.join(dir, src));
      const sources = originalSources.filter(fs.existsSync);
      if (sources.length > 0) {
        try {
          const rendered = await hexo.render.render({ path: sources[0], engine: 'js' });
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
        removeScriptTag();
      }
      continue;
    }

    // Inline JS
    addScript(textContent);
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
