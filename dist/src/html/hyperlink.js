"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var config_1 = __importDefault(require("../config"));
var url_parse_1 = __importDefault(require("url-parse"));
var cache_1 = require("../cache");
var utils_1 = require("../utils");
require("../../packages/js-prototypes/src/Array");
var package_json_1 = __importDefault(require("../../package.json"));
var dom_1 = require("./dom");
var cache = new cache_1.CacheFile("hyperlink");
var fixHyperlinks = function (content, data) {
    var path0 = data.page ? data.page.full_source : data.path;
    var hexo = this;
    function dumper() {
        (0, utils_1.dump)("dump-path0.txt", path0);
        (0, utils_1.dump)("dump-data.txt", (0, utils_1.extractSimplePageData)(data));
        (0, utils_1.dump)("dump-page.txt", (0, utils_1.extractSimplePageData)(data.page));
        (0, utils_1.dump)("dump-this.txt", (0, utils_1.extractSimplePageData)(hexo));
    }
    if (!cache.isFileChanged(path0)) {
        return cache.getCache(path0, null);
    }
    var hexoConfig = this.config;
    var siteHost = (0, url_parse_1.default)(hexoConfig.url).hostname;
    var $ = cheerio_1.default.load(content);
    var hyperlinks = $("a");
    if (siteHost && typeof siteHost == "string" && siteHost.trim().length > 0) {
        siteHost = siteHost.trim();
        var _loop_1 = function (index) {
            var hyperlink = $(hyperlinks[index]);
            var href = (0, url_parse_1.default)(hyperlink.attr("href"));
            // external links rel
            if (typeof href.hostname == "string") {
                var hyperlinkHost = href.hostname.trim();
                if (hyperlinkHost.length > 0) {
                    /**
                     * filter by global hexo site url host
                     */
                    var isInternal = !isExternal(href, this_1);
                    var externalArr_1 = [
                        "nofollow",
                        "noopener",
                        "noreferer",
                        "noreferrer"
                    ];
                    var attr_1 = extractRel(hyperlink);
                    var internalArr_1 = ["internal", "follow", "bookmark"];
                    //console.log(hyperlinkHost, "is internal", isInternal);
                    if (isInternal) {
                        // internal link, remove external rel
                        attr_1 = attr_1.concat(internalArr_1).filter(function (el) {
                            return !externalArr_1.includes(el);
                        });
                    }
                    else {
                        attr_1 = attr_1.concat(externalArr_1).filter(function (el) {
                            return !internalArr_1.includes(el);
                        });
                    }
                    // filter attributes
                    attr_1 = attr_1
                        // trim
                        .map(function (str) {
                        return str.trim();
                    })
                        // remove duplicates
                        .filter(function (val, ind) {
                        return attr_1.indexOf(val) == ind;
                    });
                    //logger.log(hyperlinkHost, siteHost, isInternal, config.links);
                    //logger.log(href.hostname, isInternal, attr);
                    hyperlink.attr("rel", attr_1.join(" ").trim());
                }
            }
            // fix anchor title
            var a_title = hyperlink.attr("title");
            if (!a_title || a_title.trim().length < 1) {
                var a_text = hyperlink.text().replace(/['"]/gm, "");
                hyperlink.attr("title", a_text);
            }
        };
        var this_1 = this;
        for (var index = 0; index < hyperlinks.length; index++) {
            _loop_1(index);
        }
    }
    content = $.html();
    cache.setCache(path0, content);
    return content;
};
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
                }
                else {
                    rels = rels
                        .concat(internalArr)
                        .unique()
                        .hapusItemDariArrayLain(externalArr);
                }
                el.setAttribute("rel", rels.join(" "));
            }
        });
    }
    if (typeof HSconfig.html.fix == "boolean" && HSconfig.html.fix) {
        content = dom.serialize();
    }
    else {
        content = document.documentElement.outerHTML;
    }
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
/**
 * Extract rels from anchor
 * @param anchor
 * @returns
 */
var extractRel = function (anchor) {
    var original = anchor.attr("rel");
    if (original && original.length > 0) {
        return original.split(/\s/).filter(function (el) {
            return el != null || el.trim().length > 0;
        });
    }
    return [];
};
exports.default = usingJSDOM;
