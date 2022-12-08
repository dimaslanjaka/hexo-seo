/* eslint-disable @typescript-eslint/no-this-alias */
// source of https://github.com/hexojs/hexo/blob/master/lib/plugins/helper/is.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tag = exports.category = exports.month = exports.year = exports.archive = exports.page = exports.post = exports.home = exports.current = void 0;
function isCurrentHelper(path, strict) {
    if (path === void 0) { path = "/"; }
    var currentPath = this.path.replace(/^[^/].*/, "/$&");
    if (strict) {
        if (path.endsWith("/"))
            path += "index.html";
        path = path.replace(/^[^/].*/, "/$&");
        return currentPath === path;
    }
    path = path.replace(/\/index\.html$/, "/");
    if (path === "/")
        return currentPath === "/index.html";
    path = path.replace(/^[^/].*/, "/$&");
    return currentPath.startsWith(path);
}
function isHomeHelper() {
    return Boolean(this.page.__index);
}
function isPostHelper() {
    return Boolean(this.page.__post);
}
function isPageHelper() {
    return Boolean(this.page.__page);
}
function isArchiveHelper() {
    return Boolean(this.page.archive);
}
function isYearHelper(year) {
    var page = this.page;
    if (!page.archive)
        return false;
    if (year) {
        return page.year === year;
    }
    return Boolean(page.year);
}
function isMonthHelper(year, month) {
    var page = this.page;
    if (!page.archive)
        return false;
    if (year) {
        if (month) {
            return page.year === year && page.month === month;
        }
        return page.month === year;
    }
    return Boolean(page.year && page.month);
}
function isCategoryHelper(category) {
    if (category) {
        return this.page.category === category;
    }
    return Boolean(this.page.category);
}
function isTagHelper(tag) {
    if (tag) {
        return this.page.tag === tag;
    }
    return Boolean(this.page.tag);
}
exports.current = isCurrentHelper;
exports.home = isHomeHelper;
exports.post = isPostHelper;
exports.page = isPageHelper;
exports.archive = isArchiveHelper;
exports.year = isYearHelper;
exports.month = isMonthHelper;
exports.category = isCategoryHelper;
exports.tag = isTagHelper;
/**
 * Custom function
 * @param hexo
 * @returns
 */
function default_1(hexo) {
    var obj = {
        current: false,
        home: false,
        post: false,
        page: false,
        archive: false,
        year: false,
        month: false,
        category: false,
        tag: false,
        message: "try using second argument"
    };
    if (typeof hexo["page"] == "undefined")
        return obj;
    return {
        current: exports.current.bind(hexo)(),
        home: exports.home.bind(hexo)(),
        post: exports.post.bind(hexo)(),
        page: exports.page.bind(hexo)(),
        archive: exports.archive.bind(hexo)(),
        year: exports.year.bind(hexo)(),
        month: exports.month.bind(hexo)(),
        category: exports.category.bind(hexo)(),
        tag: exports.tag.bind(hexo)()
    };
}
exports.default = default_1;
