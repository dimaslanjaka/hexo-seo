"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagePath = getPagePath;
exports.default = HexoSeoHtml;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const node_html_parser_1 = require("node-html-parser");
const sbg_utility_1 = require("sbg-utility");
const upath_1 = __importDefault(require("upath"));
const url_parse_1 = __importDefault(require("url-parse"));
const cache_1 = require("../cache");
const config_1 = __importStar(require("../config"));
const fm_1 = require("../fm");
const hexo_seo_1 = require("../hexo-seo");
const log_1 = __importDefault(require("../log"));
const js_1 = require("../minifier/js");
const sitemap_1 = __importDefault(require("../sitemap"));
const array_1 = require("../utils/array");
const md5_file_1 = require("../utils/md5-file");
const fixHyperlinks_static_1 = require("./fixHyperlinks.static");
const fixSchema_static_1 = __importDefault(require("./fixSchema.static"));
const types_1 = require("./types");
/**
 * get page full source
 * @param data
 * @returns
 */
function getPagePath(data) {
    if (data.page) {
        if (data.page.full_source)
            return data.page.full_source;
        if (data.page.path)
            return data.page.path;
    }
    if (data.path)
        return data.path;
}
async function HexoSeoHtml(content, data) {
    const logname = ansi_colors_1.default.magentaBright('hexo-seo(html)');
    const logconcatname = ansi_colors_1.default.magentaBright('hexo-seo(html-concat)');
    const cache = new cache_1.CacheFile('html');
    const concatRoutes = config_1.coreCache.getSync('jslibs', []);
    const hexo = this;
    let path0 = getPagePath(data);
    let allowCache = true;
    if (!path0) {
        allowCache = false;
        path0 = content;
    }
    // setup page title as default value for missing attributes
    let title = '';
    if (data.page && data.page.title && data.page.title.trim().length > 0) {
        title = data.page.title;
    }
    else {
        title = data.config.title;
    }
    if (cache.isFileChanged((0, md5_file_1.md5)(path0)) || hexo_seo_1.isDev) {
        const root = (0, node_html_parser_1.parse)(content);
        const cfg = (0, config_1.default)(this);
        //** fix hyperlink */
        if (cfg.links.enable) {
            const a = root.querySelectorAll('a[href]');
            a.forEach((el) => {
                let href = String(el.getAttribute('href')).trim();
                if (href.startsWith('//'))
                    href = 'http:' + href;
                if (/^https?:\/\//.test(href)) {
                    let rels = el.getAttribute('rel') ? el.getAttribute('rel').split(' ') : [];
                    //rels = rels.removeEmpties().unique();
                    rels = (0, array_1.array_unique)((0, array_1.array_remove_empties)(rels));
                    const parseHref = (0, url_parse_1.default)(href);
                    const external = (0, types_1.isExternal)(parseHref, hexo);
                    rels = (0, fixHyperlinks_static_1.identifyRels)(el, external, cfg.links);
                    el.setAttribute('rel', rels.join(' '));
                    // set indicator
                    el.setAttribute('hexo-seo', 'true');
                    if (!el.hasAttribute('alt'))
                        el.setAttribute('alt', title);
                    if (!el.hasAttribute('title'))
                        el.setAttribute('title', title);
                }
            });
        }
        if (cfg.html.fix) {
            //** fix invalid html */
            const inv = root.querySelectorAll('[href="/.css"],[src="/.js"]');
            if (inv.length > 0) {
                log_1.default.log('invalid html found', inv.length, inv.length > 1 ? 'items' : 'item');
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
                if (hexo_seo_1.isDev)
                    element.setAttribute('hexo-seo', 'true');
            });
        }
        // TODO process schema
        (0, fixSchema_static_1.default)(root, cfg, data);
        // TODO process sitemap
        (0, sitemap_1.default)(root, cfg, data);
        // START concatenate javascripts
        if (cfg.js.concat === true) {
            //const { dom, window, document } = parseJSDOM(content);
            const scripts = Array.from(root.getElementsByTagName('script')).filter(function (el) {
                return (el.getAttribute('type') || '') !== 'application/ld+json';
            });
            const filename = 'concat-' + (0, md5_file_1.md5)(upath_1.default.basename(path0));
            const scriptContents = [];
            hexo.log.debug(logname, 'concatenate', scripts.length + ' javascripts');
            for (let i = 0; i < scripts.length; i++) {
                const script = scripts[i];
                const src = script.getAttribute('src');
                const textContent = script.textContent;
                const srcIsUrl = typeof src === 'string' && (src.startsWith('//') || src.startsWith('http:') || src.startsWith('https:'));
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
                const addScript = function (text) {
                    scriptContents.push(separator, text, '\n\n');
                    // delete current script tag
                    script.parentNode.removeChild(script);
                };
                // parse javascript
                if (typeof src === 'string' && src.trim().length > 0) {
                    // skip external js
                    if (srcIsUrl)
                        continue;
                    /**
                     * find js file from theme, source, post directories
                     */
                    const originalSources = [
                        // find from theme source directory
                        upath_1.default.join(cfg.theme_dir, 'source'),
                        // find from node_modules directory
                        upath_1.default.join(process.cwd(), 'node_modules'),
                        // find from our plugins directory
                        upath_1.default.join(process.cwd(), 'node_modules/hexo-shortcodes'),
                        // find from source directory
                        cfg.source_dir,
                        // find from post directory
                        cfg.post_dir,
                        // find from asset post folder
                        upath_1.default.join(cfg.post_dir, upath_1.default.basename(path0))
                    ].map((dir) => upath_1.default.join(dir, src));
                    const sources = originalSources.filter(fs_extra_1.default.existsSync);
                    if (sources.length > 0) {
                        try {
                            const rendered = await hexo.render.render({ path: sources[0], engine: 'js' });
                            // push src
                            addScript(rendered);
                        }
                        catch (e) {
                            hexo.log.error(logconcatname, 'failed', src, e.message);
                        }
                    }
                    else {
                        hexo.log.error(logconcatname, 'failed, not found', src, path0);
                        hexo.log.error(logconcatname, 'log', (0, sbg_utility_1.writefile)(upath_1.default.join(fm_1.tmpFolder, 'logs', filename + '.log'), originalSources).file);
                    }
                }
                else {
                    // push inner
                    addScript(textContent);
                }
            }
            const filePathWithoutExt = upath_1.default.join(fm_1.tmpFolder, 'html', filename);
            const jsFilePath = upath_1.default.join(fm_1.buildFolder, 'hexo-seo-js', filename) + '.js';
            let scriptContent = scriptContents.join('\n');
            // minify only on generate
            if ((0, config_1.getMode)() === 'g' && cfg.js.enable) {
                scriptContent = await (0, js_1.minifyJS)(scriptContent, cfg.js.options);
            }
            // write js
            (0, sbg_utility_1.writefile)(jsFilePath, scriptContent).file;
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
            config_1.coreCache.setSync(config_1.cache_key_router, concatRoutes);
            // write to public directory
            hexo.log.debug(logconcatname, 'written', (0, sbg_utility_1.writefile)(upath_1.default.join(process.cwd(), hexo.config.public_dir, newsrc), scriptContent).file);
            hexo.log.debug(logname, (0, sbg_utility_1.writefile)(filePathWithoutExt + '.html', content).file);
            //window.close();
        }
        // END concatenate javascripts
        // modify html content
        content = root.toString();
        if (allowCache)
            cache.set((0, md5_file_1.md5)(path0), content);
        hexo.log.debug(logname, 'no-cache content');
    }
    else {
        hexo.log.debug(logname, 'cached content');
        content = cache.getCache((0, md5_file_1.md5)(path0), content);
    }
    return content;
}
