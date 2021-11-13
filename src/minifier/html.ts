"use strict";
import { minify, Options as htmlMinifyOptions } from "html-minifier-terser";
import Hexo from "hexo";
import { memoize } from "underscore";
import { isIgnore } from "../utils";

export interface MinifyOptions extends htmlMinifyOptions {
  /**
   * Array of exclude patterns to exclude from minifying
   */
  exclude: string[];
}

const minHtml = memoize(async function (str: string, data: Hexo.View) {
  const options: MinifyOptions = this.config.html;
  const path = data.path;
  const exclude = options.exclude;

  if (path && exclude && exclude.length) {
    if (isIgnore(path, exclude)) return str;
  }

  try {
    return await minify(str, options);
  } catch (err) {
    throw new Error(`Path: ${path}\n${err}`);
  }
});

export default minHtml;
