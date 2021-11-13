import { CheerioAPI } from "cheerio";
import { existsSync } from "fs";
import Hexo from "hexo";
import path from "path";
import sanitizeFilename from "sanitize-filename";
import { memoize } from "underscore";
import getConfig from "../config";
import logger from "../log";
import * as fileType from "file-type";

/**
 * Get buffer from source
 * @param src
 * @param hexo
 * @returns
 */
export const getBuffer = memoize(function (src: Buffer | string, hexo: Hexo) {
  if (typeof src == "string") {
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
});

/**
 * Image buffer to base64 encoded
 * @param buffer
 * @returns
 */
export const imageBuffer2base64 = async (buffer: Buffer) => {
  const type = await fileType.fromBuffer(buffer);

  return "data:" + type.mime + ";base64," + buffer.toString("base64");
};

export default function ($: CheerioAPI, hexo: Hexo) {
  const title = $("title").text();
  const config = getConfig(hexo).img;
  $("img").map(function (i, img) {
    // fix image alt and title
    const img_alt = $(img).attr("alt");
    const img_title = $(img).attr("title");
    const img_rel = $(img).attr("rel");
    const img_onerror = $(img).attr("onerror");
    //logger.log("alt", alt);
    if (!img_alt || img_alt.trim().length === 0) {
      $(img).attr("alt", sanitizeFilename(title));
    }
    if (!img_title || img_title.trim().length === 0) {
      $(img).attr("title", sanitizeFilename(title));
    }
    if (!img_rel || img_rel.trim().length === 0) {
      $(img).attr("rel", "image");
    }
    if (!img_onerror || img_onerror.trim().length === 0) {
      // to avoid image error, and fix endless loop onerror images
      //const imgBuf = getBuffer(config.default, hexo);
      //const base64 = await imageBuffer2base64(imgBuf);
      $(img).attr("onerror", `this.onerror=null;this.src='${config.default}';`);
    }
    //const src = $(img).attr("src");
  });
  return $;
}
