import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fileType from 'file-type';
import { existsSync } from 'fs-extra';
import Hexo from 'hexo';
import sanitizeFilename from 'sanitize-filename';
import path from 'upath';
import getConfig from '../config';
import logger from '../log';

/**
 * Get buffer from source
 * @param src
 * @param hexo
 * @returns
 */
export const getBuffer = function (src: Buffer | string, hexo: Hexo) {
  if (typeof src == 'string') {
    const base_dir = hexo.base_dir;
    const source_dir = hexo.source_dir;
    let find = src;
    if (!existsSync(src)) {
      if (existsSync(path.join(source_dir, src))) {
        find = path.join(source_dir, src);
      } else if (existsSync(path.join(base_dir, src))) {
        find = path.join(base_dir, src);
      }
    }

    return Buffer.from(find);
  }
  if (Buffer.isBuffer(src)) return src;
};

/**
 * Image buffer to base64 encoded
 * @param buffer
 * @returns
 */
export const imageBuffer2base64 = async (buffer: Buffer) => {
  const type = await fileType.fileTypeFromBuffer(buffer);

  return 'data:' + type.mime + ';base64,' + buffer.toString('base64');
};

const seoImage = async function (/*$: CheerioAPI*/ content: string, hexo: Hexo) {
  const $ = cheerio.load(content);
  const title = $('title').text();
  const config = getConfig(hexo).img;
  //await Promise.all($("img").map(processImg));
  const imgs = $('img');

  if (imgs.length)
    for (let index = 0; index < imgs.length; index++) {
      const img = $(imgs[index]);
      // fix image alt and title
      const img_alt = img.attr('alt');
      const img_title = img.attr('title');
      const img_itemprop = img.attr('itemprop');

      //logger.log("alt", alt);
      if (!img_alt || img_alt.trim().length === 0) {
        img.attr('alt', sanitizeFilename(title));
      }
      if (!img_title || img_title.trim().length === 0) {
        img.attr('title', sanitizeFilename(title));
      }
      if (!img_itemprop || img_itemprop.trim().length === 0) {
        img.attr('itemprop', 'image');
      }

      const img_src = img.attr('src');
      if (img_src) {
        // check if image is external
        const isExternal = /^https?:\/\//gs.test(img_src);
        if (isExternal) {
          if (config.onerror == 'clientside') {
            const img_onerror = img.attr('onerror');
            if (!img_onerror /*|| img_onerror.trim().length === 0*/) {
              // to avoid image error, and fix endless loop onerror images
              //const imgBuf = getBuffer(config.default, hexo);
              //const base64 = await imageBuffer2base64(imgBuf);
              img.attr('onerror', "this.onerror=null;this.src='" + config.default + "';");
            }
          } else {
            //logger.log("original image", img_src);
            if (img_src.length > 0) {
              const check = await axios.get(img_src, { maxRedirects: 10 }).catch(() => null);
              if (!check || check.status !== 200) {
                const new_img_src = config.default.toString();
                //logger.log("default img", img_src);
                logger.debug('%s is broken, replaced with %s', img_src, new_img_src);
                img.attr('src', new_img_src);
              }
            }
            img.attr('src-original', img_src);
          }
        }
      }
      //const src = img.attr("src");

      //return $;
    }

  return $.html();
};

export default seoImage;
