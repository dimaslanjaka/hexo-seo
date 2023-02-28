"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getPagePath = void 0;
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var axios_1 = __importDefault(require("axios"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var node_html_parser_1 = require("node-html-parser");
var sbg_utility_1 = require("sbg-utility");
var upath_1 = __importDefault(require("upath"));
var url_parse_1 = __importDefault(require("url-parse"));
var cache_1 = require("../cache");
var config_1 = __importDefault(require("../config"));
var fm_1 = require("../fm");
var hexo_seo_1 = require("../hexo-seo");
var log_1 = __importDefault(require("../log"));
var sitemap_1 = __importDefault(require("../sitemap"));
var array_1 = require("../utils/array");
var md5_file_1 = require("../utils/md5-file");
var dom_1 = require("./dom");
var fixHyperlinks_static_1 = require("./fixHyperlinks.static");
var fixSchema_static_1 = __importDefault(require("./fixSchema.static"));
var types_1 = require("./types");
var logname = ansi_colors_1["default"].magentaBright('hexo-seo(html)');
var logconcatname = ansi_colors_1["default"].magentaBright('hexo-seo(html-concat)');
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
exports.getPagePath = getPagePath;
var cache = new cache_1.CacheFile('index');
function HexoSeoHtml(content, data) {
    return __awaiter(this, void 0, void 0, function () {
        var hexo, path0, allowCache, title, root, cfg_1, a, inv, _a, dom, window_1, document_1, scripts, filename, scriptContents, _loop_1, i, filePath;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    hexo = this;
                    path0 = getPagePath(data);
                    allowCache = true;
                    if (!path0) {
                        allowCache = false;
                        path0 = content;
                    }
                    title = '';
                    if (data.page && data.page.title && data.page.title.trim().length > 0) {
                        title = data.page.title;
                    }
                    else {
                        title = data.config.title;
                    }
                    if (!(cache.isFileChanged((0, md5_file_1.md5)(path0)) || hexo_seo_1.isDev)) return [3 /*break*/, 6];
                    root = (0, node_html_parser_1.parse)(content);
                    cfg_1 = (0, config_1["default"])(this);
                    //** fix hyperlink */
                    if (cfg_1.links.enable) {
                        a = root.querySelectorAll('a[href]');
                        a.forEach(function (el) {
                            var href = String(el.getAttribute('href')).trim();
                            if (href.startsWith('//'))
                                href = 'http:' + href;
                            if (/^https?:\/\//.test(href)) {
                                var rels = el.getAttribute('rel') ? el.getAttribute('rel').split(' ') : [];
                                //rels = rels.removeEmpties().unique();
                                rels = (0, array_1.array_unique)((0, array_1.array_remove_empties)(rels));
                                var parseHref = (0, url_parse_1["default"])(href);
                                var external_1 = (0, types_1.isExternal)(parseHref, hexo);
                                rels = (0, fixHyperlinks_static_1.identifyRels)(el, external_1, cfg_1.links);
                                el.setAttribute('rel', rels.join(' '));
                                if (hexo_seo_1.isDev)
                                    el.setAttribute('hexo-seo', 'true');
                                if (!el.hasAttribute('alt'))
                                    el.setAttribute('alt', title);
                                if (!el.hasAttribute('title'))
                                    el.setAttribute('title', title);
                            }
                        });
                    }
                    if (cfg_1.html.fix) {
                        inv = root.querySelectorAll('[href="/.css"],[src="/.js"]');
                        if (inv.length > 0) {
                            log_1["default"].log('invalid html found', inv.length, inv.length > 1 ? 'items' : 'item');
                            inv.forEach(function (el) {
                                el.remove();
                            });
                        }
                    }
                    //** fix images attributes */
                    if (cfg_1.img.enable) {
                        root.querySelectorAll('img[src]').forEach(function (element) {
                            var imgAlt = element.getAttribute('alt') || title;
                            var imgTitle = element.getAttribute('title') || imgAlt;
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
                            if (cfg_1.img.broken) {
                                if (cfg_1.img.onerror === 'clientside') {
                                    element.setAttribute('onerror', "this.src='" + cfg_1.img["default"] + "';");
                                }
                            }
                            if (hexo_seo_1.isDev)
                                element.setAttribute('hexo-seo', 'true');
                        });
                    }
                    (0, fixSchema_static_1["default"])(root, cfg_1, data);
                    (0, sitemap_1["default"])(root, cfg_1, data);
                    content = root.toString();
                    if (!(cfg_1.js.concat === true)) return [3 /*break*/, 5];
                    _a = (0, dom_1.parseJSDOM)(content), dom = _a.dom, window_1 = _a.window, document_1 = _a.document;
                    scripts = Array.from(document_1.getElementsByTagName('script')).filter(function (el) {
                        return (el.getAttribute('type') || '') !== 'application/ld+json';
                    });
                    filename = (0, md5_file_1.md5)(upath_1["default"].basename(path0));
                    scriptContents = [];
                    hexo.log.info(logname, 'concatenate', scripts.length + ' javascripts');
                    _loop_1 = function (i) {
                        var script, textContent, src, data_1, separator, originalSources, sources, rendered, e_1;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    script = scripts[i];
                                    textContent = script.textContent, src = script.src;
                                    if (!(typeof src === 'string' && (src.startsWith('//') || src.startsWith('http:') || src.startsWith('https:')))) return [3 /*break*/, 2];
                                    if (src.startsWith('//')) {
                                        src = 'http:' + src;
                                    }
                                    return [4 /*yield*/, axios_1["default"].get(src)];
                                case 1:
                                    data_1 = (_c.sent()).data;
                                    // replace text content (inner) string with response data
                                    textContent = data_1;
                                    // assign src as null
                                    src = null;
                                    _c.label = 2;
                                case 2:
                                    separator = "\n\n/*--- ".concat(typeof src === 'string' && src.trim().length > 0 ? src : 'inner-' + i, " --*/\n\n");
                                    if (!(typeof src === 'string' && src.trim().length > 0)) return [3 /*break*/, 9];
                                    originalSources = [
                                        // find from theme source directory
                                        upath_1["default"].join(cfg_1.theme_dir, 'source'),
                                        // find from source directory
                                        cfg_1.source_dir,
                                        // find from post directory
                                        cfg_1.post_dir,
                                        // find from asset post folder
                                        upath_1["default"].join(cfg_1.post_dir, upath_1["default"].basename(path0))
                                    ].map(function (dir) { return upath_1["default"].join(dir, src); });
                                    sources = originalSources.filter(fs_extra_1["default"].existsSync);
                                    if (!(sources.length > 0)) return [3 /*break*/, 7];
                                    _c.label = 3;
                                case 3:
                                    _c.trys.push([3, 5, , 6]);
                                    return [4 /*yield*/, hexo.render.render({ path: sources[0], engine: 'js' })];
                                case 4:
                                    rendered = _c.sent();
                                    scriptContents.push(separator, rendered);
                                    return [3 /*break*/, 6];
                                case 5:
                                    e_1 = _c.sent();
                                    hexo.log.error(logconcatname, 'failed', src, e_1.message);
                                    return [3 /*break*/, 6];
                                case 6: return [3 /*break*/, 8];
                                case 7:
                                    hexo.log.error(logconcatname, 'failed, cannot find file', src, originalSources);
                                    _c.label = 8;
                                case 8: return [3 /*break*/, 10];
                                case 9:
                                    // push inner
                                    scriptContents.push(separator, textContent);
                                    _c.label = 10;
                                case 10: return [2 /*return*/];
                            }
                        });
                    };
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < scripts.length)) return [3 /*break*/, 4];
                    return [5 /*yield**/, _loop_1(i)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4:
                    filePath = upath_1["default"].join(fm_1.tmpFolder, 'html', filename);
                    hexo.log.info(logname, (0, sbg_utility_1.writefile)(filePath + '.js', scriptContents.join('\n')).file);
                    hexo.log.info(logname, (0, sbg_utility_1.writefile)(filePath + '.html', dom.toString()).file);
                    window_1.close();
                    _b.label = 5;
                case 5:
                    // END concatenate javascripts
                    if (allowCache)
                        cache.set((0, md5_file_1.md5)(path0), content);
                    return [3 /*break*/, 7];
                case 6:
                    content = cache.getCache((0, md5_file_1.md5)(path0), content);
                    _b.label = 7;
                case 7: return [2 /*return*/, content];
            }
        });
    });
}
exports["default"] = HexoSeoHtml;
