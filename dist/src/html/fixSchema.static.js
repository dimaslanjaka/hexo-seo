"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var hexo_is_1 = __importDefault(require("hexo-is"));
var moment_timezone_1 = __importDefault(require("moment-timezone"));
var log_1 = __importDefault(require("../log"));
var model4_json_1 = __importDefault(require("./schema/article/model4.json"));
/**
 * Fix Schema Model 4
 * @param dom
 * @param HSconfig
 * @param data
 */
function fixSchemaStatic(dom, HSconfig, data) {
    if (!HSconfig.schema) {
        return;
    }
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
    // resolve description
    var description = title;
    if (data.page.description) {
        description = data.page.description;
    }
    else if (data.page.subtitle) {
        description = data.page.subtitle;
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
    // resolve thumbnail
    var thumbnail = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png";
    if (data.page) {
        var photos = Array.isArray(data.page.photos) ? data.page.photos[0] : null;
        var cover = data.page.cover || data.page.thumbnail;
        if (cover) {
            thumbnail = cover;
        }
        else if (photos) {
            thumbnail = photos;
        }
    }
    // resolve author
    var author = data.config.author;
    if (data.page) {
        if (data.page.author) {
            author = data.page.author;
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
        if (HSconfig.schema.breadcrumb && HSconfig.schema.breadcrumb.enable) {
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
        if (HSconfig.schema.article && HSconfig.schema.article.enable) {
            article.mainEntityOfPage["@id"] = url;
            article.headline = title;
            article.description = description;
            article.image.url = thumbnail;
            article.author.name = author;
            article.publisher.name = author;
            article.dateModified = (0, moment_timezone_1["default"])(new Date(String(data.page.updated)))
                .tz(data.config.timezone || "UTC")
                .format();
            article.datePublished = (0, moment_timezone_1["default"])(new Date(String(data.page.date)))
                .tz(data.config.timezone || "UTC")
                .format();
            schema.push(article);
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
