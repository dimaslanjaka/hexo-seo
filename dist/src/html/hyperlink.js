"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../config"));
var url_parse_1 = __importDefault(require("url-parse"));
var cache_1 = require("../cache");
require("../../packages/js-prototypes/src/Array");
var package_json_1 = __importDefault(require("../../package.json"));
var dom_1 = require("./dom");
var cache = new cache_1.CacheFile("hyperlink");
function formatAnchorText(text) {
    return text.replace(/['"]/gm, "");
}
var usingJSDOM = function (content, data) {
    var path0 = data.page ? data.page.full_source : data.path;
    var hexo = this;
    var HSconfig = (0, config_1.default)(this);
    // if config external link disabled, return original contents
    if (!HSconfig.links.enable) {
        return content;
    }
    if (!cache.isFileChanged(path0)) {
        return cache.getCache(path0, null);
    }
    var siteHost = (0, url_parse_1.default)(this.config.url).hostname;
    if (!siteHost || siteHost.length < 1) {
        this.log.error("%s(Anchor) failure to start, config {hexo.config.url} not set", package_json_1.default.name);
        return content;
    }
    var dom = (0, dom_1.parseJSDOM)(content);
    var a = dom.document.querySelectorAll("a[href]");
    if (a.length) {
        a.forEach(function (el) {
            var href = el.href;
            // only process anchor start with https?, otherwise abadoned
            if (/https?/gs.test(href)) {
                var parseHref = (0, url_parse_1.default)(href);
                var rels = el.getAttribute("rel")
                    ? el.getAttribute("rel").split(" ")
                    : [];
                var externalArr = ["nofollow", "noopener", "noreferer", "noreferrer"];
                var internalArr = ["internal", "follow", "bookmark"];
                var external_1 = isExternal(parseHref, hexo);
                // if external link, assign external rel attributes and remove items from internal attributes if exists, and will do the opposite if the internal link
                if (external_1) {
                    rels = rels
                        .concat(externalArr)
                        .unique()
                        .hapusItemDariArrayLain(internalArr);
                    if (typeof HSconfig.links.blank == "boolean" &&
                        HSconfig.links.blank) {
                        el.setAttribute("target", "_blank");
                    }
                }
                else {
                    rels = rels
                        .concat(internalArr)
                        .unique()
                        .hapusItemDariArrayLain(externalArr);
                }
                el.setAttribute("rel", rels.join(" "));
            }
            // set anchor title
            var aTitle = el.getAttribute("title");
            if (!aTitle || aTitle.length < 1) {
                var textContent = void 0;
                if (!el.textContent || el.textContent.length < 1) {
                    textContent = hexo.config.title;
                }
                else {
                    textContent = el.textContent;
                }
                el.setAttribute("title", formatAnchorText(textContent));
            }
        });
    }
    if (typeof HSconfig.html.fix == "boolean" && HSconfig.html.fix) {
        content = dom.serialize();
    }
    else {
        content = document.documentElement.outerHTML;
    }
    cache.set(path0, content);
    return content;
};
/**
 * is url external link
 * @param url
 * @param hexo
 * @returns
 */
function isExternal(url, hexo) {
    var site = typeof (0, url_parse_1.default)(hexo.config.url).hostname == "string"
        ? (0, url_parse_1.default)(hexo.config.url).hostname
        : null;
    var cases = typeof url.hostname == "string" ? url.hostname.trim() : null;
    var config = (0, config_1.default)(hexo);
    var allowed = Array.isArray(config.links.allow) ? config.links.allow : [];
    var hosts = config.host;
    // if url hostname empty, its internal
    if (!cases)
        return false;
    // if url hostname same with site hostname, its internal
    if (cases == site)
        return false;
    // if arrays contains url hostname, its internal and allowed to follow
    if (hosts.includes(cases) || allowed.includes(cases))
        return false;
    /*if (cases.includes("manajemen")) {
      logger.log({ site: site, cases: cases, allowed: allowed, hosts: hosts });
    }*/
    return true;
}
exports.default = usingJSDOM;
