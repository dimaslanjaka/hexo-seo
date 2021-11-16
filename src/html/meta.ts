import cheerio from "cheerio";
import Hexo from "hexo";
import getConfig from "../config";
import hexoIs2 from "../hexo/hexo-is";
import schemaArticles, { HexoSeo, SchemaAuthor } from "./schema/article";
import { isDev } from "..";

const fixMeta = function (content: string, data: HexoSeo) {
  const hexo: Hexo = this;
  const config = getConfig(hexo).schema;
  if (!config) return content;
  const $ = cheerio.load(content);
  const buildSchema = new schemaArticles({ pretty: isDev, hexo: data });
  const whereHexo = hexoIs2(data);
  let writeSchema = false;
  if (whereHexo.post) {
    writeSchema = true;

    let schemaData = data;
    if (data["page"]) schemaData = data["page"];

    if (typeof schemaData.path == "string") {
      const buildUrl = data["url"] || schemaData["path"];
      buildSchema.setUrl(buildUrl);
    }

    // set schema title
    if (typeof schemaData.title == "string")
      buildSchema.setTitle(schemaData.title);
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

    // prepare keywords
    const keywords = [];
    if (schemaData.title) {
      keywords.push(schemaData.title);
    }
    // prepare breadcrumbs
    const schemaBreadcrumbs = [];

    // build breadcrumb
    if (schemaData.tags && schemaData.tags.length > 0) {
      schemaData.tags.forEach((tag, index, tags) => {
        keywords.push(tag["name"]);
        const o = { item: tag["permalink"], name: tag["name"] };
        schemaBreadcrumbs.push(<any>o);
      });
    }

    if (schemaData.categories && schemaData.categories.length > 0) {
      schemaData.categories.forEach((category) => {
        keywords.push(category["name"]);
        const o = { item: category["permalink"], name: category["name"] };
        schemaBreadcrumbs.push(<any>o);
      });
    }

    buildSchema.set("genre", keywords.join(", "));
    buildSchema.set("keywords", keywords.join(", "));

    if (data["url"]) {
      schemaBreadcrumbs.push({
        item: data["url"] || schemaData["path"],
        name: schemaData["title"] || data["title"] || hexo.config.url
      });
    }

    if (schemaBreadcrumbs.length > 0) {
      buildSchema.setBreadcrumbs(schemaBreadcrumbs);
    }

    //dump(schemaData.title + "data.txt", extractSimplePageData(schemaData));
  }

  if (writeSchema) {
    let bodyArticle: string;
    const article = $("article");
    if (article.text().length > 0) {
      bodyArticle = article.text();
    } else {
      bodyArticle = $("body").text();
    }
    buildSchema.setArticleBody(bodyArticle);
    buildSchema.setImage($);
    $("head").append(
      `<script type="application/ld+json">${buildSchema}</script>`
    );
  }
  return $.html();
};

export default fixMeta;
