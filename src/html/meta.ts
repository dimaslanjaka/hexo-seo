import { CheerioAPI } from "cheerio";
import Hexo from "hexo";
import { dump } from "../utils";
import logger from "../log";
import getConfig from "../config";
import hexoIs from "../hexo/hexo-is";

const fixMeta = function ($: CheerioAPI, hexo: Hexo, data: Hexo.View) {
  const config = getConfig(hexo);
  const metas = $("meta");
  const properties = [
    "article:author",
    "og:title",
    "og:description",
    "article:title",
    "article:tag",
    "og:image"
  ];
  metas.each((i, el) => {
    const meta = $(el);
    const property = meta.attr("property");
    const content = meta.attr("content");
    if (property) {
      logger.log(property, data.path, hexoIs(data));
      if (property == "article:author") {
        if (content.toLowerCase().includes("object")) {
          logger.log("invalid meta", property, content);
          //dump("meta.txt", hexo);
        }
      }
    }
  });
  return $;
};

export default fixMeta;
