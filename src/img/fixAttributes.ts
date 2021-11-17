import logger from "../log";
import { HexoSeo } from "../html/schema/article";
import cheerio, { Cheerio, Element } from "cheerio";
import Hexo from "hexo";
import getConfig from "../config";
import checkUrl from "../curl/check";
//import Promise from "bluebird";
import InMemoryCache from "../cache";

const cache = new InMemoryCache();

export default async function (
  this: Hexo,
  content: string,
  data: HexoSeo
): globalThis.Promise<string> {
  const path0 = data.path;
  const isChanged = await cache.isFileChanged(path0);
  const config = this.config;
  console.log("changed", isChanged, path0);
  if (isChanged) {
    const $ = cheerio.load(content);
    //const config = getConfig(this).img;
    const title = data.title || config.title;
    $("img").each((i, el) => {
      const img = $(el);
      const img_alt = img.attr("alt");
      const img_title = img.attr("title");
      const img_itemprop = img.attr("itemprop");
      //const img_src = img.attr("src");
      if (!img_alt || img_alt.trim().length === 0) {
        img.attr("alt", title);
      }
      if (!img_title || img_title.trim().length === 0) {
        img.attr("title", title);
      }
      if (!img_itemprop || img_itemprop.trim().length === 0) {
        img.attr("itemprop", "image");
      }
    });

    cache.set(path0, $.html());
    return $.html();
  } else {
    return cache.get(path0);
  }
}
