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
var bluebird_1 = __importDefault(require("bluebird"));
var node_html_parser_1 = require("node-html-parser");
var fixHyperlinks_1 = require("./fixHyperlinks");
var url_parse_1 = __importDefault(require("url-parse"));
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
var dom;
var cache = new cache_1.CacheFile("index");
function default_1(content, data) {
    var hexo = this;
    var path0 = getPath(data) ? getPath(data) : content;
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
        //** fix invalid html */
        root.querySelectorAll('*[href="/.css"],*[src="/.js"]').forEach(function (i) {
            i.set_content("<!-- invalid " + i.outerHTML + " -->");
        });
        content = root.toString();
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
        cache.set(md5(path0), content);
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
