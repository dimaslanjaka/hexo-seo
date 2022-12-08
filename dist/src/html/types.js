"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.isExternal = exports.formatAnchorText = void 0;
var url_parse_1 = __importDefault(require("url-parse"));
var config_1 = __importDefault(require("../config"));
function formatAnchorText(text) {
    return text.replace(/['"]/gm, "");
}
exports.formatAnchorText = formatAnchorText;
/**
 * is url external link
 * @param url
 * @param hexo
 * @returns
 */
function isExternal(url, hexo) {
    var site = typeof (0, url_parse_1["default"])(hexo.config.url).hostname == "string" ? (0, url_parse_1["default"])(hexo.config.url).hostname : null;
    var cases = typeof url.hostname == "string" ? url.hostname.trim() : null;
    var config = (0, config_1["default"])(hexo);
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
exports.isExternal = isExternal;
