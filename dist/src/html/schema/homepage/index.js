"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var data_index_json_1 = __importDefault(require("./data-index.json"));
var schemaHomepage = /** @class */ (function () {
    function schemaHomepage(options) {
        this.schema = data_index_json_1.default;
        this.options = options;
        this.hexo = options.hexo;
        // remove default articles
        this.schema.mainEntity.itemListElement = [];
    }
    schemaHomepage.prototype.addArticle = function (article) {
        // get sample data
        var item = data_index_json_1.default.mainEntity.itemListElement[0];
        // set metadata
        item.headline = article.title;
        if (typeof article.image == "string")
            item.image = article.image;
        item.position = this.schema.mainEntity.itemListElement.length.toString();
        // set author data
        if (typeof article.author == "object") {
            if (typeof article.author.image == "string") {
                item.author.image = article.author.image;
            }
            if (typeof article.author.name == "string") {
                item.author.name = article.author.name;
            }
            if (typeof article.author.url == "string" ||
                Array.isArray(article.author.url)) {
                item.author.sameAs = article.author.url;
            }
        }
    };
    /**
     * Set custom property and value
     * @param key
     * @param value
     */
    schemaHomepage.prototype.set = function (key, value) {
        this.schema[key] = value;
    };
    /**
     * get schema property
     */
    schemaHomepage.prototype.get = function (key) {
        return this.schema[key];
    };
    schemaHomepage.prototype.toString = function () {
        if (this.options.pretty) {
            return JSON.stringify(this.schema, null, 2);
        }
        return JSON.stringify(this.schema);
    };
    return schemaHomepage;
}());
exports.default = schemaHomepage;
