"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var url_1 = require("../../../utils/url");
var mainSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Extra! Extra! Read alla bout it",
    alternativeHeadline: "This article is also about robots and stuff",
    image: "http://example.com/image.jpg",
    author: {
        "@type": "Person",
        image: "/examples/jvanzweden_s.jpg",
        name: "Jaap van Zweden",
        sameAs: "http://www.jaapvanzweden.com/"
    },
    award: "Best article ever written",
    editor: "Craig Mount",
    genre: "search engine optimization",
    keywords: "seo sales b2b",
    wordcount: "1120",
    publisher: {
        "@type": "Organization",
        name: "Google",
        logo: {
            "@type": "ImageObject",
            url: "https://google.com/logo.jpg"
        }
    },
    url: "http://www.example.com",
    mainEntityOfPage: {
        "@type": "WebPage",
        "@id": "https://google.com/article",
        mainEntity: {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "@id": "https://developers.google.com/search/docs/advanced/structured-data/breadcrumb",
            name: "breadcrumb",
            itemListElement: [
                {
                    "@type": "ListItem",
                    position: 1,
                    name: "Books",
                    item: "https://example.com/books"
                },
                {
                    "@type": "ListItem",
                    position: 2,
                    name: "Authors",
                    item: "https://example.com/books/authors"
                },
                {
                    "@type": "ListItem",
                    position: 3,
                    name: "Ann Leckie",
                    item: "https://example.com/books/authors/annleckie"
                }
            ]
        }
    },
    datePublished: "2015-09-20",
    dateCreated: "2015-09-20",
    dateModified: "2015-09-20",
    description: "We love to do stuff to help people and stuff",
    articleBody: "You can paste your entire post in here, and yes it can get really really long."
};
var articleSchema = /** @class */ (function () {
    function articleSchema(options) {
        this.schema = mainSchema;
        this.options = options;
        this.hexo = options.hexo;
    }
    /**
     * Set custom property and value
     * @param key
     * @param value
     */
    articleSchema.prototype.set = function (key, value) {
        this.schema[key] = value;
    };
    /**
     * get schema property
     */
    articleSchema.prototype.get = function (key) {
        return this.schema[key];
    };
    /**
     * get all schema structure
     */
    articleSchema.prototype.getStructure = function () {
        return this.schema;
    };
    /**
     * Set breadcrumbs by tags and categories
     * @param tags
     */
    articleSchema.prototype.setBreadcrumbs = function (tags) {
        var build = [];
        for (var index = 0; index < tags.length; index++) {
            var template = {
                "@type": "ListItem",
                position: 0,
                name: "Books",
                item: "https://example.com/books"
            };
            var tag = tags[index];
            template.position = index + 1;
            template.name = tag.name;
            template.item = tag.item;
            build.push(template);
        }
        this.schema.mainEntityOfPage.mainEntity.itemListElement = build;
    };
    articleSchema.prototype.setUrl = function (url) {
        if (url)
            this.schema.url = url;
    };
    articleSchema.prototype.setDescription = function (description) {
        this.schema.alternativeHeadline = this.schema.description = description;
    };
    articleSchema.prototype.setImage = function ($) {
        if (typeof $ === "string") {
            this.schema.image = $;
            return;
        }
        var images = $("img");
        for (var index = 0; index < images.length; index++) {
            var image = $(images[index]);
            var img = image.attr("src");
            if (img && img.trim().startsWith("#") && img.trim().length > 0) {
                if (/^\/|https?/gs.test(img)) {
                    this.schema.image = img;
                    return;
                }
            }
        }
        this.schema.image =
            "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/120px-No_image_available.svg.png";
    };
    /**
     * Set author
     * @description automatically find author
     * @param author Author Options
     */
    articleSchema.prototype.setAuthor = function (author) {
        if (typeof author["author"] == "object")
            author = author["author"];
        //console.log(author);
        // determine author name
        var authorName = "Google";
        if (typeof author == "string") {
            // if author option is string as default hexo
            authorName = author;
        }
        else {
            // try search author names
            authorName = author["name"] || author["nick"] || author["nickname"];
            if (!authorName && typeof this.hexo.config.author != "undefined") {
                if (typeof this.hexo.config.author == "string") {
                    authorName = this.hexo.config.author;
                }
                else if (typeof this.hexo.config.author == "object") {
                    var findAuthorKey = ["name", "nick", "nickname"];
                    for (var key in findAuthorKey) {
                        if (Object.prototype.hasOwnProperty.call(findAuthorKey, key)) {
                            if (typeof this.hexo.config.author[key] == "string")
                                authorName = this.hexo.config.author[key];
                        }
                    }
                }
            }
            //author["config"]
        }
        this.schema.author.name =
            this.schema.publisher.name =
                this.schema.editor =
                    authorName;
        // determine author image
        var authorImage = "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png";
        if (author["image"]) {
            authorImage = author["image"];
        }
        else if (author["config"]) {
            if (author["config"]["image"]) {
                authorImage = author["config"]["image"];
            }
        }
        this.schema.author.image = this.schema.publisher.logo.url = authorImage;
        // determine author url
        var authorUrl = "https://webmanajemen.com";
        if (author["url"]) {
            authorUrl = author["url"];
        }
        else if (author["sameAs"]) {
            authorUrl = author["sameAs"];
        }
        else if (typeof this.hexo.config == "object") {
            if (typeof this.hexo.config.author == "object") {
                var propertyAuhorSearch = ["link", "url", "web", "website"];
                for (var key in propertyAuhorSearch) {
                    if (Object.prototype.hasOwnProperty.call(propertyAuhorSearch, key)) {
                        if (typeof propertyAuhorSearch[key] == "string") {
                            authorUrl = propertyAuhorSearch[key];
                            break;
                        }
                        else if (Array.isArray(propertyAuhorSearch[key])) {
                            if (typeof propertyAuhorSearch[key][0] == "string") {
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
    };
    /**
     * Set schema article title
     * @param title
     */
    articleSchema.prototype.setTitle = function (title) {
        this.schema.headline = title;
    };
    /**
     * Set schema article body/content
     * @param articleBody
     */
    articleSchema.prototype.setArticleBody = function (articleBody) {
        this.schema.wordcount = articleBody.trim().length.toString();
        this.schema.articleBody = articleBody.trim();
    };
    articleSchema.prototype.toString = function () {
        if (this.options.pretty) {
            return JSON.stringify(this.schema, null, 2);
        }
        return JSON.stringify(this.schema);
    };
    return articleSchema;
}());
exports.default = articleSchema;
