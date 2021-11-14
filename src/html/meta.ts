import { CheerioAPI } from "cheerio";
import Hexo from "hexo";
import { dump } from "../utils";
import getConfig from "../config";
import hexoIs2 from "../hexo/hexo-is";
import schemaArticles, { HexoSeo, SchemaAuthor } from "./schema/article";

const fixMeta = function ($: CheerioAPI, hexo: Hexo, data: HexoSeo) {
  const config = getConfig(hexo);
  const buildSchema = new schemaArticles({ pretty: true, hexo: data });
  const whereHexo = hexoIs2(data);
  let writeSchema = false;
  if (whereHexo.post) {
    writeSchema = true;

    let schemaData = data;
    if (data["page"]) schemaData = data["page"];

    // set schema title
    if (schemaData.title) buildSchema.setTitle(schemaData.title);
    // set schema description
    let description: string;
    if (schemaData["subtitle"]) {
      description = schemaData["subtitle"];
    } else if (schemaData["description"]) {
      description = schemaData["description"];
    } else if (schemaData["desc"]) {
      description = schemaData["desc"];
    } else if (schemaData.title) {
      description = schemaData.title;
    }
    if (description) buildSchema.setDescription(description);
    // set schema author
    let author: SchemaAuthor;
    if (schemaData["author"]) {
      author = schemaData["author"];
    }
    if (author) buildSchema.setAuthor(author);
    //dump("data-post.txt", data);
  }

  if (writeSchema) {
    buildSchema.setArticleBody($("body").text());
    buildSchema.setImage($);
    $("head").append(
      `<script type="application/ld+json">${buildSchema}</script>`
    );
  }
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
