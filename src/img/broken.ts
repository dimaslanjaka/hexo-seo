import logger from "../log";
import { HexoSeo } from "../html/schema/article";
import cheerio, { Cheerio, Element } from "cheerio";
import Hexo from "hexo";
import getConfig from "../config";
import checkUrl from "../curl/check";
import Promise from "bluebird";
import InMemoryCache from "../cache";

const cache = new InMemoryCache();

/**
 * is local image
 */
export const isLocalImage = (url: string) => {
  if (!url) return false;
  const regex = /^http?s/gs;
  return regex.test(url);
};

/**
 * Broken image fix
 * @param img
 */
export default function (this: Hexo, content: string, data: HexoSeo) {
  const path0 = data.path;
  cache.isFileChanged(path0).then((isChanged) => {
    if (isChanged) {
      const $ = cheerio.load(content);
      const config = getConfig(this).img;
      const title = data.title;
      const images: Cheerio<Element>[] = [];
      $("img").each((i, el) => {
        const img = $(el);
        const img_alt = img.attr("alt");
        const img_title = img.attr("title");
        const img_itemprop = img.attr("itemprop");
        if (!img_alt || img_alt.trim().length === 0) {
          img.attr("alt", title);
        }
        if (!img_title || img_title.trim().length === 0) {
          img.attr("title", title);
        }
        if (!img_itemprop || img_itemprop.trim().length === 0) {
          img.attr("itemprop", "image");
        }
        const img_src = img.attr("src");
        if (
          img_src &&
          img_src.trim().length > 0 &&
          /^https?:\/\//gs.test(img_src)
        ) {
          images.push(img);
        }
      });

      /**
       * check broken image with caching strategy
       */
      const checkBrokenImg = function (src: string) {
        const new_src = {
          original: src,
          resolved: src,
          cached: false
        };
        const cached: typeof new_src | null = cache.getCache(src, null);
        if (!cached) {
          return checkUrl(src).then((isWorking) => {
            if (!isWorking) {
              // image is broken, replace with default broken image fallback
              new_src.resolved = config.default.toString();
            }
            cache.setCache(src, new_src);
            return new_src;
          });
        }
        new_src.cached = true;
        return Promise.any([cached]).then((srcx) => {
          return srcx;
        });
      };

      const fixBrokenImg = function (img: Cheerio<Element>) {
        const img_src = img.attr("src");
        const img_check = checkBrokenImg(img_src);
        return img_check.then((chk) => {
          img.attr("src", chk.resolved);
          img.attr("src-original", chk.original);
          if (!chk.cached)
            logger.log(
              "%s is broken, replaced with %s",
              chk.resolved,
              chk.original
            );
          return img;
        });
      };

      return Promise.all(images)
        .map(fixBrokenImg)
        .catch(() => {})
        .then(() => {
          content = $.html();
          cache.setCache(path0, content);
          return content;
        });
    } else {
      const gCache: string = cache.getCache(path0);
      return Promise.any(gCache).then((content) => {
        return content;
      });
    }
  });
}
