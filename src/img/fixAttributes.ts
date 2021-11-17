import logger from "../log";
import { HexoSeo } from "../html/schema/article";
import cheerio, { Cheerio, Element } from "cheerio";
import Hexo from "hexo";
import getConfig from "../config";
import checkUrl from "../curl/check";
import { dump, extractSimplePageData } from "../utils";
import InMemoryCache from "../cache";
import pkg from "../../package.json";

const cache = new InMemoryCache();

export default async function (
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
}
