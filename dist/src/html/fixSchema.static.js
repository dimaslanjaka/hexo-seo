"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var string_1 = require("../utils/string");
var article_1 = __importDefault(require("./schema/article"));
var __1 = require("..");
var dom_1 = require("./dom");
require("js-prototypes");
var underscore_1 = __importDefault(require("underscore"));
var utils_1 = require("../utils");
var hexo_is_1 = __importDefault(require("../hexo/hexo-is"));
var homepage_1 = __importDefault(require("./schema/homepage"));
var log_1 = __importDefault(require("../log"));
function default_1(dom, HSconfig, data) {
    if (typeof HSconfig.schema === "boolean" && !HSconfig.schema)
        return;
    var is = (0, hexo_is_1.default)(data);
    var schemahtml;
    if (is.home) {
        (0, utils_1.dumpOnce)("data-home.txt", (0, utils_1.extractSimplePageData)(data));
        var homepage = new homepage_1.default({ pretty: __1.isDev, hexo: data });
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
        var Schema = new article_1.default({ pretty: __1.isDev, hexo: data });
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
            body = underscore_1.default.escape(body
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
        var schemaBreadcrumbs_1 = [];
        if (data.page) {
            if (data.page.tags && data.page.tags.length > 0) {
                data.page.tags.forEach(function (tag) {
                    keywords_1.push(tag["name"]);
                    var o = { item: tag["permalink"], name: tag["name"] };
                    schemaBreadcrumbs_1.push(o);
                });
            }
            if (data.page.categories && data.page.categories.length > 0) {
                data.page.categories.forEach(function (category) {
                    keywords_1.push(category["name"]);
                    var o = { item: category["permalink"], name: category["name"] };
                    schemaBreadcrumbs_1.push(o);
                });
            }
        }
        if (schemaBreadcrumbs_1.length > 0) {
            Schema.setBreadcrumbs(schemaBreadcrumbs_1);
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
        Schema.set("genre", keywords_1.unique().removeEmpties().map(string_1.trimText).join(","));
        Schema.set("keywords", keywords_1.unique().removeEmpties().map(string_1.trimText).join(","));
        Schema.set("award", keywords_1.unique().removeEmpties().map(string_1.trimText).join(","));
        schemahtml = "<script type=\"application/ld+json\">".concat(Schema, "</script>");
        log_1.default.log("schema created", title, url);
    }
    if (schemahtml) {
        var head = dom.getElementsByTagName("head")[0];
        head.insertAdjacentHTML("beforeend", schemahtml);
    }
}
exports.default = default_1;
