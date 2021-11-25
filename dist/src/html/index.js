"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPath = void 0;
require("../../packages/js-prototypes/src/String");
require("../../packages/js-prototypes/src/Array");
var fixHyperlinks_static_1 = require("./fixHyperlinks.static");
var config_1 = __importDefault(require("../config"));
var cache_1 = require("../cache");
var hexo_is_1 = __importDefault(require("../hexo/hexo-is"));
var log_1 = __importDefault(require("../log"));
var bluebird_1 = __importDefault(require("bluebird"));
var package_json_1 = __importDefault(require("../../package.json"));
var node_html_parser_1 = require("node-html-parser");
var fixHyperlinks_1 = require("./fixHyperlinks");
var url_parse_1 = __importDefault(require("url-parse"));
var utils_1 = require("../utils");
var __1 = require("../");
function getPath(data) {
    if (data.page) {
        if (data.page.full_source)
            return data.page.full_source;
        if (data.page.path)
            return data.page.path;
    }
    if (data.path)
        return data.path;
}
exports.getPath = getPath;
var cache = new cache_1.CacheFile("index");
function default_1(content, data) {
    var hexo = this;
    var path0;
    var allowCache = true;
    if (getPath(data)) {
        path0 = getPath(data);
    }
    else {
        allowCache = false;
        path0 = content;
    }
    if (__1.isDev) {
        var is = (0, hexo_is_1.default)(data);
        if (is.archive) {
            (0, utils_1.dump)("data-archive.txt", data);
        }
        else if (is.post) {
            (0, utils_1.dump)("data-post.txt", data);
        }
        else if (is.page) {
            (0, utils_1.dump)("data-page.txt", data);
        }
        else if (is.category) {
            (0, utils_1.dump)("data-category.txt", data);
        }
        else if (is.tag) {
            (0, utils_1.dump)("data-tag.txt", data);
        }
    }
    if (cache.isFileChanged((0, cache_1.md5)(path0))) {
        var root = (0, node_html_parser_1.parse)(content);
        var cfg_1 = (0, config_1.default)(this);
        //** fix hyperlink */
        var a = root.querySelectorAll("a[href]");
        a.forEach(function (el) {
            var href = el.getAttribute("href");
            if (/https?:\/\//.test(href)) {
                var rels = el.getAttribute("rel")
                    ? el.getAttribute("rel").split(" ")
                    : [];
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
            log_1.default.log("invalid html found", inv.length, "items");
            inv.forEach(function (el, i) {
                el.remove();
            });
        }
        //** fix images attributes */
        var title_1 = data.page && data.page.title && data.page.title.trim().length > 0
            ? data.page.title
            : data.config.title;
        root.querySelectorAll("img[src]").forEach(function (element) {
            if (!element.getAttribute("title")) {
                log_1.default.log("%s(img[title]) fix %s", package_json_1.default.name, data.title);
                element.setAttribute("title", title_1);
            }
            if (!element.getAttribute("alt")) {
                element.setAttribute("alt", title_1);
            }
            if (!element.getAttribute("itemprop")) {
                element.setAttribute("itemprop", "image");
            }
        });
        content = root.toString();
        if (allowCache)
            cache.set((0, cache_1.md5)(path0), content);
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
        content = cache.getCache((0, cache_1.md5)(path0), content);
    }
    return bluebird_1.default.resolve(content);
}
exports.default = default_1;
