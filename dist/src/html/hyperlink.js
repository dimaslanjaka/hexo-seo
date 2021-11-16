"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../config"));
var url_parse_1 = __importDefault(require("url-parse"));
var sanitize_filename_1 = __importDefault(require("sanitize-filename"));
/**
 * Remove item from array
 * @param arr
 * @param value
 * @returns
 */
function removeItem(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
/**
 * is url external link
 * @param url
 * @param hexo
 * @returns
 */
function isExternal(url, hexo) {
    var site = typeof url_parse_1.default(hexo.config.url).hostname == "string"
        ? url_parse_1.default(hexo.config.url).hostname
        : null;
    var cases = typeof url.hostname == "string" ? url.hostname.trim() : null;
    var config = config_1.default(hexo);
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
var fixHyperlinks = function ($, hexo) {
    var config = config_1.default(hexo);
    var hexoConfig = hexo.config;
    var siteHost = url_parse_1.default(hexoConfig.url).hostname;
    var hyperlinks = $("a");
    if (siteHost && typeof siteHost == "string" && siteHost.trim().length > 0) {
        siteHost = siteHost.trim();
        var _loop_1 = function (index) {
            var hyperlink = $(hyperlinks[index]);
            var href = url_parse_1.default(hyperlink.attr("href"));
            // external links rel
            if (typeof href.hostname == "string") {
                var attr_1 = extractRel(hyperlink);
                var hyperlinkHost = href.hostname.trim();
                /**
                 * filter by global hexo site url host
                 */
                var isInternal = !isExternal(href, hexo);
                var externalArr_1 = ["nofollow", "noopener", "noreferer", "noreferrer"];
                var internalArr_1 = ["internal", "follow", "bookmark"];
                if (hyperlinkHost.length > 0) {
                    if (isInternal) {
                        // internal link
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
            if (a_title && a_title.trim().length < 1) {
                var a_text = sanitize_filename_1.default(hyperlink.text());
                hyperlink.attr("title", a_text);
            }
        };
        for (var index = 0; index < hyperlinks.length; index++) {
            _loop_1(index);
        }
    }
    return $;
};
exports.default = fixHyperlinks;
