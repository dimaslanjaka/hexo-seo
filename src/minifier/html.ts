"use strict";
import { minify } from "html-minifier-terser";
import micromatch from "micromatch";
import Hexo from "hexo";

export default async function (str: string, data: Hexo.View) {
  const options = this.config.html;
  const path = data.path;
  const exclude = options.exclude;

  if (path && exclude && exclude.length) {
    if (micromatch.isMatch(path, exclude)) return str;
  }

  try {
    return await minify(str, options);
  } catch (err) {
    throw new Error(`Path: ${path}\n${err}`);
  }
}
