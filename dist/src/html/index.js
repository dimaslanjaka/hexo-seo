"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagePath = void 0;
require("js-prototypes/src/String");
require("js-prototypes/src/Array");
var fixHyperlinks_static_1 = require("./fixHyperlinks.static");
var config_1 = __importDefault(require("../config"));
var cache_1 = require("../cache");
var md5_file_1 = require("../utils/md5-file");
var log_1 = __importDefault(require("../log"));
var bluebird_1 = __importDefault(require("bluebird"));
var node_html_parser_1 = require("node-html-parser");
var fixHyperlinks_1 = require("./fixHyperlinks");
var url_parse_1 = __importDefault(require("url-parse"));
var __1 = require("..");
var fixSchema_static_1 = __importDefault(require("./fixSchema.static"));
var sitemap_1 = __importDefault(require("../sitemap"));
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
var cache = new cache_1.CacheFile("index");
function default_1(content, data) {
    var hexo = this;
    var path0;
    var allowCache = true;
    if (getPagePath(data)) {
        path0 = getPagePath(data);
    }
    else {
        allowCache = false;
        path0 = content;
    }
    if (cache.isFileChanged((0, md5_file_1.md5)(path0)) || __1.isDev) {
        var root = (0, node_html_parser_1.parse)(content);
        var cfg_1 = (0, config_1.default)(this);
        //** fix hyperlink */
        var a = root.querySelectorAll("a[href]");
        a.forEach(function (el) {
            var href = el.getAttribute("href");
            if (/https?:\/\//.test(href)) {
                var rels = el.getAttribute("rel") ? el.getAttribute("rel").split(" ") : [];
                rels = rels.removeEmpties().unique();
                var parseHref = (0, url_parse_1.default)(href);
                var external_1 = (0, fixHyperlinks_1.isExternal)(parseHref, hexo);
                rels = (0, fixHyperlinks_static_1.identifyRels)(el, external_1, cfg_1.links);
                el.setAttribute("rel", rels.join(" "));
            }
        });
        if (cfg_1.html.fix) {
            //** fix invalid html */
            var inv = root.querySelectorAll('[href="/.css"],[src="/.js"]');
            if (inv.length)
                log_1.default.log("invalid html found", inv.length, inv.length > 1 ? "items" : "item");
            inv.forEach(function (el) {
                el.remove();
            });
        }
        //** fix images attributes */
        var title_1 = data.page && data.page.title && data.page.title.trim().length > 0 ? data.page.title : data.config.title;
        root.querySelectorAll("img[src]").forEach(function (element) {
            if (!element.getAttribute("title")) {
                //logger.log("%s(img[title]) fix %s", pkg.name, data.title);
                element.setAttribute("title", title_1);
            }
            if (!element.getAttribute("alt")) {
                element.setAttribute("alt", title_1);
            }
            if (!element.getAttribute("itemprop")) {
                element.setAttribute("itemprop", "image");
            }
        });
        (0, fixSchema_static_1.default)(root, cfg_1, data);
        (0, sitemap_1.default)(root, cfg_1, data);
        content = root.toString();
        if (allowCache)
            cache.set((0, md5_file_1.md5)(path0), content);
        /*
        dom = new _JSDOM(content);
        fixHyperlinksStatic(dom, cfg.links, data);
        fixInvalidStatic(dom, cfg, data);
        fixAttributes(dom, cfg.img, data);
        fixSchemaStatic(dom, cfg, data);
        if (cfg.html.fix) {
          content = dom.serialize();
        } else {
          content = dom.toString();
        }
    
        return fixBrokenImg(dom, cfg.img, data).then(() => {
          return content;
        });*/
    }
    else {
        content = cache.getCache((0, md5_file_1.md5)(path0), content);
    }
    return bluebird_1.default.resolve(content);
}
exports.default = default_1;
