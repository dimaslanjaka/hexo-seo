"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = __importDefault(require("../config"));
var hexo_is_1 = __importDefault(require("../hexo/hexo-is"));
var article_1 = __importDefault(require("./schema/article"));
var hexo_seo_1 = require("../hexo-seo");
var fixMeta = function ($, data) {
    var hexo = this;
    var config = config_1.default(hexo).schema;
    if (!config)
        return $;
    var buildSchema = new article_1.default({ pretty: hexo_seo_1.isDev, hexo: data });
    var whereHexo = hexo_is_1.default(data);
    var writeSchema = false;
    if (whereHexo.post) {
        writeSchema = true;
        var schemaData = data;
        if (data["page"])
            schemaData = data["page"];
        if (typeof schemaData.path == "string") {
            var buildUrl = data["url"] || schemaData["path"];
            buildSchema.setUrl(buildUrl);
        }
        // set schema title
        if (typeof schemaData.title == "string")
            buildSchema.setTitle(schemaData.title);
        // set schema description
        var description = void 0;
        if (schemaData["subtitle"]) {
            description = schemaData["subtitle"];
        }
        else if (schemaData["description"]) {
            description = schemaData["description"];
        }
        else if (schemaData["desc"]) {
            description = schemaData["desc"];
        }
        else if (schemaData.title) {
            description = schemaData.title;
        }
        if (description)
            buildSchema.setDescription(description);
        // set schema author
        var author = void 0;
        if (schemaData["author"]) {
            author = schemaData["author"];
        }
        if (author)
            buildSchema.setAuthor(author);
        // prepare keywords
        var keywords_1 = [];
        if (schemaData.title) {
            keywords_1.push(schemaData.title);
        }
        // prepare breadcrumbs
        var schemaBreadcrumbs_1 = [];
        // build breadcrumb
        if (schemaData.tags && schemaData.tags.length > 0) {
            schemaData.tags.forEach(function (tag, index, tags) {
                keywords_1.push(tag["name"]);
                var o = { item: tag["permalink"], name: tag["name"] };
                schemaBreadcrumbs_1.push(o);
            });
        }
        if (schemaData.categories && schemaData.categories.length > 0) {
            schemaData.categories.forEach(function (category) {
                keywords_1.push(category["name"]);
                var o = { item: category["permalink"], name: category["name"] };
                schemaBreadcrumbs_1.push(o);
            });
        }
        buildSchema.set("genre", keywords_1.join(", "));
        buildSchema.set("keywords", keywords_1.join(", "));
        if (data["url"]) {
            schemaBreadcrumbs_1.push({
                item: data["url"] || schemaData["path"],
                name: schemaData["title"] || data["title"] || hexo.config.url
            });
        }
        if (schemaBreadcrumbs_1.length > 0) {
            buildSchema.setBreadcrumbs(schemaBreadcrumbs_1);
        }
        //dump(schemaData.title + "data.txt", extractSimplePageData(schemaData));
    }
    if (writeSchema) {
        var bodyArticle = void 0;
        if ($("article").text().length > 0) {
            bodyArticle = $("article").text();
        }
        else {
            bodyArticle = $("body").text();
        }
        buildSchema.setArticleBody(bodyArticle);
        buildSchema.setImage($);
        $("head").append("<script type=\"application/ld+json\">" + buildSchema + "</script>");
    }
    return $;
};
exports.default = fixMeta;
