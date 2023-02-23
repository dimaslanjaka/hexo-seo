import Promise from 'bluebird';
import cheerio, { Cheerio, Element } from 'cheerio';
import Hexo from 'hexo';
import { CacheFile } from '../cache';
import getConfig from '../config';
import checkUrl from '../curl/check';
import { HexoSeo } from '../html/schema/article';

const cache = new CacheFile('img-broken');

/**
 * is local image
 */
export const isLocalImage = (url: string) => {
  if (!url) return false;
  const regex = /^https?/gs;
  return regex.test(url);
};

const new_src = {
  original: null,
  resolved: null,
  success: false
};

/**
 * check broken image with caching strategy
 * @param src
 * @param defaultImg
 * @returns
 */
export const checkBrokenImg = function (
  src: string,
  defaultImg = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Wikipedia_Hello_World_Graphic.svg/2560px-Wikipedia_Hello_World_Graphic.svg.png'
): Promise<typeof new_src> {
  new_src.original = src;
  new_src.resolved = src;
  const cached: typeof new_src = cache.getCache(src, null);
  if (!cached) {
    return Promise.resolve(checkUrl(src)).then((isWorking) => {
      // fix image redirect
      if (
        (isWorking.statusCode == 302 || isWorking.statusCode == 301) &&
        isWorking.headers[0] &&
        isWorking.headers[0].location
      ) {
        return checkBrokenImg(isWorking.headers[0].location, defaultImg);
      }

      new_src.success = isWorking.result;

      if (!isWorking) {
        // image is broken, replace with default broken image fallback
        new_src.resolved = defaultImg; //config.default.toString();
      }

      cache.setCache(src, new_src);
      return new_src;
    });
  }

  return Promise.any([cached]).then((srcx) => {
    return srcx;
  });
};

/**
 * Broken image fix
 * @param img
 */
export default function (this: Hexo, content: string, data: HexoSeo) {
  const path0 = data.path;
  const isChanged = cache.isFileChanged(path0);
  if (isChanged) {
    const $ = cheerio.load(content);
    const config = getConfig(this).img;
    const title = data.title;
    const images: Cheerio<Element>[] = [];
    $('img').each((i, el) => {
      const img = $(el);
      const img_src = img.attr('src');
      if (img_src && img_src.trim().length > 0 && /^https?:\/\//gs.test(img_src)) {
        images.push(img);
      }
    });

    const fixBrokenImg = function (img: Cheerio<Element>) {
      const img_src = img.attr('src');
      const img_check = checkBrokenImg(img_src, config.default.toString());
      return img_check.then((chk) => {
        img.attr('src', chk.resolved);
        img.attr('src-original', chk.original);
        return img;
      });
    };

    return (
      Promise.all(images)
        .map(fixBrokenImg)
        //.catch(() => { })
        .then(() => {
          content = $.html();
          cache.setCache(path0, content);
          return content;
        })
    );
  } else {
    const gCache: string = cache.getCache(path0);
    return Promise.any(gCache).then((content) => {
      return content;
    });
  }
}
