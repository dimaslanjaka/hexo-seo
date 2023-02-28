"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.getPagePath = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
var node_html_parser_1 = require("node-html-parser");
var url_parse_1 = __importDefault(require("url-parse"));
var cache_1 = require("../cache");
var config_1 = __importDefault(require("../config"));
var hexo_seo_1 = require("../hexo-seo");
var log_1 = __importDefault(require("../log"));
var sitemap_1 = __importDefault(require("../sitemap"));
var array_1 = require("../utils/array");
var md5_file_1 = require("../utils/md5-file");
var fixHyperlinks_static_1 = require("./fixHyperlinks.static");
var fixSchema_static_1 = __importDefault(require("./fixSchema.static"));
var types_1 = require("./types");
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
    var _this = this;
    //console.log("filtering html", data.page.title);
    var hexo = this;
    var path0 = getPagePath(data);
    var allowCache = true;
    if (!path0) {
        allowCache = false;
        path0 = content;
    }
    var title = '';
    if (data.page && data.page.title && data.page.title.trim().length > 0) {
        title = data.page.title;
    }
    else {
        title = data.config.title;
    }
    return new bluebird_1["default"](function (resolveHtml) {
        if (cache.isFileChanged((0, md5_file_1.md5)(path0)) || hexo_seo_1.isDev) {
            var root = (0, node_html_parser_1.parse)(content);
            var cfg_1 = (0, config_1["default"])(_this);
            //** fix hyperlink */
            if (cfg_1.links.enable) {
                var a = root.querySelectorAll('a[href]');
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
                //** fix invalid html */
                var inv = root.querySelectorAll('[href="/.css"],[src="/.js"]');
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
            if (allowCache)
                cache.set((0, md5_file_1.md5)(path0), content);
        }
        else {
            content = cache.getCache((0, md5_file_1.md5)(path0), content);
        }
        resolveHtml(content);
    });
}
exports["default"] = HexoSeoHtml;
