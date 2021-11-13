import { load as CheerioLoad, Node } from "cheerio";
import sanitizeFilename from "sanitize-filename";
import logger from "../log";

export default function (str: string | Node | Node[] | Buffer) {
  const $ = CheerioLoad(str);
  const title = $("title").text();
  $("img").map(function (i, img) {
    // fix image alt and title
    const img_alt = $(img).attr("alt");
    const img_title = $(img).attr("title");
    //logger.log("alt", alt);
    if (!img_alt || img_alt.trim().length === 0) {
      $(img).attr("alt", sanitizeFilename(title));
    }
    if (!img_title || img_title.trim().length === 0) {
      $(img).attr("title", sanitizeFilename(title));
    }
    //const src = $(img).attr("src");
  });
  return $.html();
}
