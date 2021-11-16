"use strict";
import { minify, Options as htmlMinifyOptions } from "html-minifier-terser";
import Hexo from "hexo";
import { isIgnore } from "../utils";
import getConfig from "../config";
import { HexoSeo } from "../html/schema/article";

export interface MinifyOptions extends htmlMinifyOptions {
  /**
   * Array of exclude patterns to exclude from minifying
   */
  exclude: string[];
}

const minHtml = async function (this: Hexo, str: string, data: HexoSeo) {
  const hexo = this;
  const options: MinifyOptions = getConfig(hexo).html;
  // if option html is false, return original content
  if (typeof options == "boolean" && !options) return str;
  const path = data.path;
  const exclude = options.exclude;

  if (path && exclude && exclude.length) {
    if (isIgnore(path, exclude)) return str;
  }

  try {
    str = await minify(str, options);
  } catch (err) {
    throw new Error(`Path: ${path}\n${err}`);
  }
  return str;
};

export default minHtml;
