"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const url_1 = require("../../../utils/url");
const model3_json_1 = __importDefault(require("./model3.json"));
class articleSchema {
    constructor(options) {
        this.schema = model3_json_1.default;
        this.options = options;
        this.hexo = options.hexo;
    }
    /**
     * Set custom property and value
     * @param key
     * @param value
     */
    set(key, value) {
        this.schema[key] = value;
    }
    /**
     * get schema property
     */
    get(key) {
        return this.schema[key];
    }
    /**
     * get all schema structure
     */
    getStructure() {
        return this.schema;
    }
    /**
     * Set breadcrumbs by tags and categories
     * @param tags
     */
    setBreadcrumbs(tags) {
        const build = [];
        for (let index = 0; index < tags.length; index++) {
            const template = {
                '@type': 'ListItem',
                position: 0,
                name: 'Books',
                item: 'https://example.com/books'
            };
            const tag = tags[index];
            template.position = index + 1;
            template.name = tag.name;
            template.item = tag.item;
            build.push(template);
        }
        this.schema.mainEntityOfPage.mainEntity.itemListElement = build;
    }
    setUrl(url) {
        if (url)
            this.schema.url = url;
    }
    setDescription(description) {
        this.schema.alternativeHeadline = this.schema.description = description;
    }
    setImage($) {
        if (typeof $ === 'string') {
            this.schema.image = $;
            return;
        }
        const images = $('img');
        for (let index = 0; index < images.length; index++) {
            const image = $(images[index]);
            const img = image.attr('src');
            if (img && img.trim().startsWith('#') && img.trim().length > 0) {
                if (/^\/|https?/gs.test(img)) {
                    this.schema.image = img;
                    return;
                }
            }
        }
        this.schema.image =
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/120px-No_image_available.svg.png';
    }
    /**
     * Set author
     * @description automatically find author
     * @param author Author Options
     */
    setAuthor(author) {
        if (typeof author['author'] == 'object')
            author = author['author'];
        //console.log(author);
        // determine author name
        let authorName = 'Google';
        if (typeof author == 'string') {
            // if author option is string as default hexo
            authorName = author;
        }
        else {
            // try search author names
            authorName = author['name'] || author['nick'] || author['nickname'];
            if (!authorName && typeof this.hexo.config.author != 'undefined') {
                if (typeof this.hexo.config.author == 'string') {
                    authorName = this.hexo.config.author;
                }
                else if (typeof this.hexo.config.author == 'object') {
                    const findAuthorKey = ['name', 'nick', 'nickname'];
                    for (const key in findAuthorKey) {
                        if (Object.prototype.hasOwnProperty.call(findAuthorKey, key)) {
                            if (typeof this.hexo.config.author[key] == 'string')
                                authorName = this.hexo.config.author[key];
                        }
                    }
                }
            }
            //author["config"]
        }
        this.schema.author.name = this.schema.publisher.name = this.schema.editor = authorName;
        // determine author image
        let authorImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png';
        if (author['image']) {
            authorImage = author['image'];
        }
        else if (author['config']) {
            if (author['config']['image']) {
                authorImage = author['config']['image'];
            }
        }
        this.schema.author.image = this.schema.publisher.logo.url = authorImage;
        // determine author url
        let authorUrl = 'https://webmanajemen.com';
        if (author['url']) {
            authorUrl = author['url'];
        }
        else if (author['sameAs']) {
            authorUrl = author['sameAs'];
        }
        else if (typeof this.hexo.config == 'object') {
            if (typeof this.hexo.config.author == 'object') {
                const propertyAuhorSearch = ['link', 'url', 'web', 'website'];
                for (const key in propertyAuhorSearch) {
                    if (Object.prototype.hasOwnProperty.call(propertyAuhorSearch, key)) {
                        if (typeof propertyAuhorSearch[key] == 'string') {
                            authorUrl = propertyAuhorSearch[key];
                            break;
                        }
                        else if (Array.isArray(propertyAuhorSearch[key])) {
                            if (typeof propertyAuhorSearch[key][0] == 'string') {
                                authorUrl = propertyAuhorSearch[key];
                                break;
                            }
                        }
                    }
                }
            }
        }
        if (!(0, url_1.isValidUrlPattern)(authorUrl)) {
            authorUrl = this.hexo.config.url;
        }
        this.schema.author.sameAs = authorUrl;
    }
    /**
     * Set schema article title
     * @param title
     */
    setTitle(title) {
        this.schema.headline = title;
    }
    /**
     * Set schema article body/content
     * @param articleBody
     */
    setArticleBody(articleBody) {
        this.schema.wordcount = articleBody.trim().length.toString();
        this.schema.articleBody = articleBody.trim();
    }
    toString() {
        if (this.options.pretty) {
            return JSON.stringify(this.schema, null, 2);
        }
        return JSON.stringify(this.schema);
    }
}
exports.default = articleSchema;
