import { CheerioAPI } from "cheerio";
import Hexo from "hexo";
import { dump } from "../utils";
import logger from "../log";
import getConfig from "../config";
import hexoIs from "../hexo/hexo-is";
import hexoIs2 from "../hexo/hexo-is/is";
import schemaArticles from "./schema/article";

const fixMeta = function ($: CheerioAPI, hexo: Hexo, data: Hexo.View) {
  const config = getConfig(hexo);
  const whereHexo = hexoIs(data);
  if (!whereHexo.archive && !whereHexo.category && !whereHexo.tag) {
    console.log(hexoIs2(data));
  }

  /*const buildSchema = new schemaArticles({ pretty: true, hexo: data });
  buildSchema.setTitle($("title").text());
  buildSchema.setArticleBody($("body").text());
  buildSchema.setAuthor(null);
  buildSchema.setImage($);
  $("head").append(
    `<script type="application/ld+json">${buildSchema}</script>`
  );
  /*
  const metas = $("meta");
  const properties = [
    "description",
    "article:author",
    "article:title",
    "article:tag",
    "og:image",
    "og:title",
    "og:description"
  ];
  metas.each((i, el) => {
    const meta = $(el);
    const property = meta.attr("property");
    const content = meta.attr("content");
    if (property) {
      //logger.log(property, data.path, hexoIs(data).archive);
      if (property == "article:author") {
        if (content.toLowerCase().includes("object")) {
          logger.log("invalid meta", property, content);
          //dump("meta.txt", hexo);
        }
      }
    }
  });*/
  return $;
};

export default fixMeta;
