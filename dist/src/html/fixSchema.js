"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cache_1 = require("../cache");
var utils_1 = require("../utils");
var config_1 = __importDefault(require("../config"));
var hexo_is_1 = __importDefault(require("../hexo/hexo-is"));
var article_1 = __importDefault(require("./schema/article"));
var __1 = require("..");
var dom_1 = require("./dom");
var string_1 = require("../utils/string");
require("../../packages/js-prototypes/src/String");
require("../../packages/js-prototypes/src/Array");
function default_1(content, data) {
    (0, cache_1.releaseMemory)();
    var is = (0, hexo_is_1.default)(data);
    var path0 = data.page ? data.page.full_source : data.path;
    var config = (0, config_1.default)(this).schema;
    // return if config is boolean and false
    if ((config && typeof config == "boolean" && !config) || !config) {
        return content;
    }
    if ((!path0 || !is.post) && !is.page) {
        if (!is.tag && !is.archive && !is.home && !is.category && !is.year) {
            console.log(path0, is);
            dumper();
        }
        return content;
    }
    function dumper() {
        (0, utils_1.dump)("dump-path0.txt", path0);
        (0, utils_1.dump)("dump-data.txt", (0, utils_1.extractSimplePageData)(data));
        (0, utils_1.dump)("dump-page.txt", (0, utils_1.extractSimplePageData)(data.page));
        (0, utils_1.dump)("dump-this.txt", (0, utils_1.extractSimplePageData)(this));
    }
    var parseDom;
    var Schema = new article_1.default({ pretty: __1.isDev, hexo: data });
    // set url
    var url = this.config.url;
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
    var keywords = [];
    if (this.config.keywords) {
        keywords = keywords.concat(this.config.keywords.split(",").map(string_1.trimText));
    }
    // set title
    var title = data.page.title || data.title || this.config.title;
    if (title) {
        keywords.push(title);
        Schema.setTitle(title);
    }
    else {
        dumper();
    }
    // set schema description
    var description = title;
    if (data.page) {
        if (data.page.description) {
            description = data.page.description;
        }
        else if (data.page.desc) {
            description = data.page.desc;
        }
        else if (data.page.subtitle) {
            description = data.page.subtitle;
        }
        else if (data.page.excerpt) {
            description = data.page.excerpt;
        }
    }
    if (description)
        Schema.setDescription(description.replace(/[\W_-]+/gm, " ").trim());
    // set schema author
    var author;
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
    var body;
    if (data.page) {
        if (data.page.content) {
            var getText = (0, dom_1.getTextPartialHtml)(data.page.content);
            body = getText;
            if (!body || body.trim().length === 0) {
                body = data.page.content.replace(/[\W_-]+/gm, " ");
            }
        }
    }
    else if (data.content) {
        body = data.content;
    }
    if (body)
        Schema.setArticleBody(body.trim().replace(/['"{}\\]+/gm, ""));
    // prepare breadcrumbs
    var schemaBreadcrumbs = [];
    if (data.page) {
        if (data.page.tags && data.page.tags.length > 0) {
            data.page.tags.forEach(function (tag, index, tags) {
                keywords.push(tag["name"]);
                var o = { item: tag["permalink"], name: tag["name"] };
                schemaBreadcrumbs.push(o);
            });
        }
        if (data.page.categories && data.page.categories.length > 0) {
            data.page.categories.forEach(function (category) {
                keywords.push(category["name"]);
                var o = { item: category["permalink"], name: category["name"] };
                schemaBreadcrumbs.push(o);
            });
        }
    }
    if (schemaBreadcrumbs.length > 0) {
        Schema.setBreadcrumbs(schemaBreadcrumbs);
    }
    // set schema genres
    Schema.set("genre", keywords.unique().map(string_1.trimText).join(","));
    Schema.set("keywords", keywords.unique().map(string_1.trimText).join(","));
    return content.replace("</head>", "<script type=\"application/ld+json\">" + Schema + "</script></head>");
}
exports.default = default_1;
