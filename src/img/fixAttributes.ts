import logger from "../log";
import { HexoSeo } from "../html/schema/article";
import cheerio, { Cheerio, Element } from "cheerio";
import Hexo from "hexo";
import getConfig from "../config";
import hexoIs from "../hexo/hexo-is";
import { dump, extractSimplePageData } from "../utils";
import InMemoryCache, { CacheFile, releaseMemory } from "../cache";
import pkg from "../../package.json";
import parse5 from "parse5";
import { JSDOM } from "jsdom";
import jQuery from "jquery";

const cache = new InMemoryCache();

const usingCheerio = async function (
  this: Hexo,
  content: string,
  data: HexoSeo
): globalThis.Promise<string> {
  const page = data.page ? data.page.full_source : null;
  //dump("data.txt", extractSimplePageData(data.page));
  //return content;
  const path0 = page ? page : data.path;
  const isChanged = await cache.isFileChanged(path0);
  const config = this.config;
  //console.log("changed", isChanged, path0);
  if (isChanged) {
    const $ = cheerio.load(content);
    //const config = getConfig(this).img;
    const title = data.title || config.title;
    $("img").each((i, el) => {
      const img = $(el);
      const img_alt = img.attr("alt");
      const img_title = img.attr("title");
      const img_itemprop = img.attr("itemprop");
      const img_src = img.attr("src");
      if (!img_alt || img_alt.trim().length === 0) {
        img.attr("alt", title);
        logger.log("%s(IMG:alt): %s [%s]", pkg.name, path0, img_src);
      }
      if (!img_title || img_title.trim().length === 0) {
        img.attr("title", title);
        logger.log("%s(IMG:title): %s [%s]", pkg.name, path0, img_src);
      }
      if (!img_itemprop || img_itemprop.trim().length === 0) {
        img.attr("itemprop", "image");
        logger.log("%s(IMG:itemprop): %s [%s]", pkg.name, path0, img_src);
      }
    });

    cache.set(path0, $.html());
    return $.html();
  } else {
    return cache.get(path0);
  }
};

const cF = new CacheFile();

export const usingJSDOM = function (
  this: Hexo,
  content: string,
  data: HexoSeo
) {
  releaseMemory();
  const is = hexoIs(data);
  if (is.home || is.category || is.tag) return content;
  const path0 = data.page ? data.page.full_source : data.path;
  if (!path0) {
    console.log(is);
    dump("dump-path0.txt", path0);
    dump("dump.txt", extractSimplePageData(data));
    dump("dump-page.txt", extractSimplePageData(data.page));
    dump("dump-this.txt", extractSimplePageData(this));
    return content;
  }
  const title =
    data.page && data.page.title && data.page.title.trim().length > 0
      ? data.page.title
      : this.config.title;
  const isChanged = cF.isFileChanged(path0);

  if (isChanged) {
    const dom = new JSDOM(content);
    const document = dom.window.document;
    logger.log("%s(IMG:attr) parsing start [%s]", pkg.name, path0);
    document.querySelectorAll("img[src]").forEach((element) => {
      if (!element.getAttribute("title")) {
        element.setAttribute("title", title);
      }
      if (!element.getAttribute("alt")) {
        element.setAttribute("alt", title);
      }
      if (!element.getAttribute("itemprop")) {
        element.setAttribute("itemprop", "image");
      }
    });

    //dom.serialize() === "<!DOCTYPE html><html><head></head><body>hello</body></html>";
    //document.documentElement.outerHTML === "<html><head></head><body>hello</body></html>";
    content = document.documentElement.outerHTML;
    dom.window.close();
    cF.set(path0, content);
    return content;
  }
  logger.log(
    "%s(IMG:attr) cached [%s]",
    pkg.name,
    path0.replace(this.base_dir, "")
  );
  content = cF.get(path0, "");
  return content;
};

export const usingJQuery = function (
  this: Hexo,
  content: string,
  data: HexoSeo
) {
  const htmlDOM = new JSDOM(content);
  const $ = jQuery(htmlDOM.window);
  const page = data.page ? data.page.full_source : null;
  const path0 = page ? page : data.path;
  console.log($.html());

  return content;
};

export default usingCheerio;
