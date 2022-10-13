/* eslint-disable @typescript-eslint/no-this-alias */
// source of https://github.com/hexojs/hexo/blob/master/lib/plugins/helper/is.js

"use strict";

function isCurrentHelper(path = "/", strict: any) {
  const currentPath = this.path.replace(/^[^/].*/, "/$&");

  if (strict) {
    if (path.endsWith("/")) path += "index.html";
    path = path.replace(/^[^/].*/, "/$&");

    return currentPath === path;
  }

  path = path.replace(/\/index\.html$/, "/");

  if (path === "/") return currentPath === "/index.html";

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
  const { page } = this;
  if (!page.archive) return false;

  if (year) {
    return page.year === year;
  }

  return Boolean(page.year);
}

function isMonthHelper(year, month) {
  const { page } = this;
  if (!page.archive) return false;

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

function isTagHelper(this: any, tag) {
  if (tag) {
    return this.page.tag === tag;
  }

  return Boolean(this.page.tag);
}

export const current = isCurrentHelper;
export const home = isHomeHelper;
export const post = isPostHelper;
export const page = isPageHelper;
export const archive = isArchiveHelper;
export const year = isYearHelper;
export const month = isMonthHelper;
export const category = isCategoryHelper;
export const tag = isTagHelper;

/**
 * Custom function
 * @param hexo
 * @returns
 */
export default function (hexo: any): HexoIs {
  const obj = {
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
  if (typeof hexo["page"] == "undefined") return obj;
  return {
    current: current.bind(hexo)(),
    home: home.bind(hexo)(),
    post: post.bind(hexo)(),
    page: page.bind(hexo)(),
    archive: archive.bind(hexo)(),
    year: year.bind(hexo)(),
    month: month.bind(hexo)(),
    category: category.bind(hexo)(),
    tag: tag.bind(hexo)()
  };
}

export interface HexoIs {
  current: boolean;
  home: boolean;
  post: boolean;
  page: boolean;
  archive: boolean;
  year: boolean;
  month: boolean;
  category: boolean;
  tag: boolean;
  message?: string;
}
