"use strict";
import { minify, Options as htmlMinifyOptions } from "html-minifier-terser";
import Hexo from "hexo";
import { memoize } from "underscore";
import { isIgnore } from "../utils";
import getConfig from "../config";
import seoImage from "../img";
import cheerio from "cheerio";
import fixMeta from "../html/meta";
import fixHyperlinks from "../html/hyperlink";
import { HexoSeo } from "../html/schema/article";

export interface MinifyOptions extends htmlMinifyOptions {
  /**
   * Array of exclude patterns to exclude from minifying
   */
  exclude: string[];
}

const minHtml = memoize(async function (
  this: Hexo,
  str: string,
  data: HexoSeo
) {
  const hexo = this;
  const options: MinifyOptions = getConfig(hexo).html;
  const path = data.path;
  const exclude = options.exclude;

  if (path && exclude && exclude.length) {
    if (isIgnore(path, exclude)) return str;
  }

  const processHtml = async (str: string) => {
    // parse html start
    let $ = cheerio.load(str);
    // check image start
    $ = await seoImage.bind(this)($, hexo);
    // filter external links and optimize seo
    $ = fixHyperlinks.bind(this)($, hexo);
    // fix meta
    $ = fixMeta.bind(this)($, data);
    // set modified html
    str = $.html();
    // minifying html start
    str = await minify(str, options);
    return str;
  };

  /*try {
    str = await processHtml(str);
  } catch (err) {
    throw new Error(`Path: ${path}\n${err}`);
  }*/
  str = await processHtml(str);
  return str;
});

export default minHtml;
