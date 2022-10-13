"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var hexo_seo_1 = require("../hexo-seo");
var string_1 = require("../utils/string");
var dom_1 = require("./dom");
var article_1 = __importDefault(require("./schema/article"));
var hexo_is_1 = __importDefault(require("hexo-is"));
var underscore_1 = __importDefault(require("underscore"));
var log_1 = __importDefault(require("../log"));
var utils_1 = require("../utils");
var array_1 = require("../utils/array");
var model4_json_1 = __importDefault(require("./schema/article/model4.json"));
var homepage_1 = __importDefault(require("./schema/homepage"));
function fixSchemaStatic(dom, HSconfig, data) {
    var is = (0, hexo_is_1["default"])(data);
    var breadcrumbs = model4_json_1["default"][0];
    var article = model4_json_1["default"][1];
    var sitelink = model4_json_1["default"][2];
    // resolve title
    var title = "";
    if (data.page && data.page.title && data.page.title.trim().length > 0) {
        title = data.page.title;
    }
    else {
        title = data.config.title;
    }
    // resolve url
    var url = data.config.url;
    if (data.page) {
        if (data.page.permalink) {
            url = data.page.permalink;
        }
        else if (data.page.url) {
            url = data.page.url;
        }
    }
    var schema = [];
    // setup schema sitelink
    if (HSconfig.schema.sitelink && HSconfig.schema.sitelink.searchUrl) {
        sitelink.url = data.config.url;
        sitelink.potentialAction.target = HSconfig.schema.sitelink.searchUrl;
        schema.push(sitelink);
    }
    if (is.post) {
        // setup breadcrumb on post
        if (HSconfig.schema.breadcrumb.enable) {
            var schemaBreadcrumbs_1 = [];
            if (data.page) {
                if (data.page.tags && data.page.tags.length > 0) {
                    data.page.tags.forEach(function (tag) {
                        var o = {
                            "@type": "ListItem",
                            position: schemaBreadcrumbs_1.length + 1,
                            item: tag["permalink"],
                            name: tag["name"]
                        };
                        schemaBreadcrumbs_1.push(o);
                    });
                }
                if (data.page.categories && data.page.categories.length > 0) {
                    data.page.categories.forEach(function (category) {
                        var o = {
                            "@type": "ListItem",
                            position: schemaBreadcrumbs_1.length + 1,
                            item: category["permalink"],
                            name: category["name"]
                        };
                        schemaBreadcrumbs_1.push(o);
                    });
                }
                schemaBreadcrumbs_1.push({
                    "@type": "ListItem",
                    position: schemaBreadcrumbs_1.length + 1,
                    item: url,
                    name: title
                });
            }
            if (schemaBreadcrumbs_1.length > 0) {
                breadcrumbs.itemListElement = schemaBreadcrumbs_1;
                schema.push(breadcrumbs);
            }
        }
    }
    if (schema.length > 0) {
        var JSONschema = JSON.stringify(schema, null, 2);
        var schemahtml = "\n\n<script type=\"application/ld+json\" id=\"hexo-seo-schema\">".concat(JSONschema, "</script>\n\n");
        log_1["default"].log("schema created", title, url);
        if (schemahtml) {
            var head = dom.getElementsByTagName("head")[0];
            head.insertAdjacentHTML("beforeend", schemahtml);
        }
    }
}
exports["default"] = fixSchemaStatic;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function _model3(dom, HSconfig, data) {
    if (typeof HSconfig.schema === "boolean" && !HSconfig.schema)
        return;
    var is = (0, hexo_is_1["default"])(data);
    var schemahtml;
    if (is.home) {
        (0, utils_1.dumpOnce)("data-home.txt", (0, utils_1.extractSimplePageData)(data));
        var homepage = new homepage_1["default"]({ pretty: hexo_seo_1.isDev, hexo: data });
    }
    else if (is.archive) {
        (0, utils_1.dumpOnce)("data-archive.txt", (0, utils_1.extractSimplePageData)(data));
    }
    else if (is.category) {
        (0, utils_1.dumpOnce)("data-category.txt", (0, utils_1.extractSimplePageData)(data));
    }
    else if (is.tag) {
        (0, utils_1.dumpOnce)("data-tag.txt", (0, utils_1.extractSimplePageData)(data));
    }
    else {
        var Schema = new article_1["default"]({ pretty: hexo_seo_1.isDev, hexo: data });
        // set url
        var url = data.config.url;
        if (data.page) {
            if (data.page.permalink) {
                url = data.page.permalink;
            }
            else if (data.page.url) {
                url = data.page.url;
            }
        }
        if (url)
            Schema.setUrl(url);
        // sitelinks
        Schema.schema.mainEntityOfPage.potentialAction[0].target.urlTemplate =
            Schema.schema.mainEntityOfPage.potentialAction[0].target.urlTemplate.replace("https://www.webmanajemen.com", data.config.url);
        var keywords_1 = [];
        if (data.config.keywords) {
            keywords_1 = keywords_1.concat(data.config.keywords.split(",").map(string_1.trimText));
        }
        // set title
        var title = data.page.title || data.title || data.config.title;
        if (title) {
            keywords_1.push(title);
            Schema.setTitle(title);
        }
        // set schema author
        var author = void 0;
        if (data.page) {
            if (data.page["author"]) {
                author = data.page["author"];
            }
        }
        else if (data["author"]) {
            author = data["author"];
        }
        if (author)
            Schema.setAuthor(author);
        // set schema date
        if (data.page) {
            if (data.page.date) {
                Schema.set("dateCreated", data.page.date);
                Schema.set("datePublished", data.page.date);
            }
            if (data.page.modified) {
                Schema.set("dateModified", data.page.modified);
            }
            else if (data.page.updated) {
                Schema.set("dateModified", data.page.updated);
            }
        }
        // set schema body
        var body = void 0;
        if (data.page) {
            if (data.page.content) {
                var getText = (0, dom_1.getTextPartialHtml)(data.page.content);
                body = getText;
                if (!body || body.trim().length === 0) {
                    console.log("getText failed");
                    body = data.page.content.replace(/[\W_-]+/gm, " ");
                }
            }
        }
        else if (data.content) {
            body = data.content;
        }
        if (body) {
            body = underscore_1["default"].escape(body
                .trim()
                //.replace(/['“"{}\\”]+/gm, "")
                .replace(/https?:\/\//gm, "//"));
            Schema.setArticleBody(body);
            // set schema description
            Schema.setDescription(body.trim().substring(0, 150));
        }
        // set schema description
        /*let description = title;
      if (data.page) {
        if (data.page.description) {
          description = data.page.description;
        } else if (data.page.desc) {
          description = data.page.desc;
        } else if (data.page.subtitle) {
          description = data.page.subtitle;
        } else if (data.page.excerpt) {
          description = data.page.excerpt;
        }
      }
      if (description)
        Schema.setDescription(description.replace(/[\W_-]+/gm, " ").trim());*/
        // prepare breadcrumbs
        var schemaBreadcrumbs_2 = [];
        if (data.page) {
            if (data.page.tags && data.page.tags.length > 0) {
                data.page.tags.forEach(function (tag) {
                    keywords_1.push(tag["name"]);
                    var o = { item: tag["permalink"], name: tag["name"] };
                    schemaBreadcrumbs_2.push(o);
                });
            }
            if (data.page.categories && data.page.categories.length > 0) {
                data.page.categories.forEach(function (category) {
                    keywords_1.push(category["name"]);
                    var o = { item: category["permalink"], name: category["name"] };
                    schemaBreadcrumbs_2.push(o);
                });
            }
        }
        if (schemaBreadcrumbs_2.length > 0) {
            Schema.setBreadcrumbs(schemaBreadcrumbs_2);
        }
        // set schema image
        var img = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png";
        if (data.photos && Array.isArray(data.photos) && data.photos.length > 0) {
            img = data.photos[0];
        }
        else if (data.cover) {
            img = data.cover;
        }
        Schema.setImage(img);
        // set schema genres
        var kwUnique = (0, array_1.array_remove_empties)((0, array_1.array_unique)(keywords_1));
        Schema.set("genre", kwUnique.map(string_1.trimText).join(","));
        Schema.set("keywords", kwUnique.map(string_1.trimText).join(","));
        Schema.set("award", kwUnique.map(string_1.trimText).join(","));
        schemahtml = "\n\n<script type=\"application/ld+json\" id=\"hexo-seo-schema\">".concat(Schema, "</script>\n\n");
        log_1["default"].log("schema created", title, url);
    }
    if (schemahtml) {
        var head = dom.getElementsByTagName("head")[0];
        head.insertAdjacentHTML("beforeend", schemahtml);
    }
}
