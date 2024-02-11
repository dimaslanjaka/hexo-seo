"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sitemapIndex = exports.sitemap = exports.getPageData = void 0;
var fs_extra_1 = require("fs-extra");
var google_news_sitemap_1 = __importDefault(require("google-news-sitemap"));
var hexo_is_1 = __importDefault(require("hexo-is"));
var moment_1 = __importDefault(require("moment"));
var sbg_utility_1 = require("sbg-utility");
var upath_1 = require("upath");
var xmlbuilder2_1 = require("xmlbuilder2");
var log_1 = __importDefault(require("../log"));
var scheduler_1 = __importDefault(require("../scheduler"));
var getAuthor_1 = __importDefault(require("../utils/getAuthor"));
var archive_1 = __importStar(require("./archive"));
var hexo_util_1 = require("hexo-util");
var sitemapGroup = {
    post: undefined,
    page: undefined,
    tag: undefined,
    category: undefined
};
var googleNewsSitemap = new google_news_sitemap_1.default();
function initSitemap(type) {
    if (!sitemapGroup[type]) {
        var sourceXML = (0, upath_1.join)(__dirname, 'views/' + type + '-sitemap.xml');
        if (!(0, fs_extra_1.existsSync)(sourceXML))
            throw 'Source ' + sourceXML + ' Not Found';
        var doc = (0, xmlbuilder2_1.create)((0, fs_extra_1.readFileSync)(sourceXML).toString());
        sitemapGroup[type] = new Object(doc.end({ format: 'object' }));
        sitemapGroup[type].urlset.url = [];
    }
}
/**
 * Extract Page Data
 * @param data
 * @returns
 */
function getPageData(data) {
    var is = (0, hexo_is_1.default)(data);
    if (data['page']) {
        var page = data['page'];
        page.is = is;
        return page;
    }
}
exports.getPageData = getPageData;
// init each sitemap
var groups = ['post', 'page', 'category', 'tag'];
groups.forEach(function (group) {
    if (!sitemapGroup[group])
        initSitemap(group);
    if (sitemapGroup[group].urlset.url.length === 0) {
        sitemapGroup[group].urlset.url.push({
            loc: hexo.config.url,
            lastmod: (0, moment_1.default)(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
            priority: '1',
            changefreq: 'daily'
        });
    }
});
var categoryTagsInfo;
var postUpdateDates = [];
var pageUpdateDates = [];
// const cache = new CacheFile("sitemap");
var turnError = false;
/**
 * process sitemap of page
 */
function sitemap(dom, HSconfig, data) {
    if (!HSconfig.sitemap) {
        if (!turnError) {
            turnError = true;
            log_1.default.error('[hexo-seo][sitemap] config sitemap not set');
        }
        return;
    }
    // set category and tag information of posts
    if (!categoryTagsInfo) {
        categoryTagsInfo = (0, archive_1.default)(hexo);
    }
    // cast locals
    var locals = hexo.locals;
    // return if posts and pages empty
    if (['posts', 'pages'].every(function (info) { return locals.get(info).length === 0; })) {
        return;
    }
    // TODO modify or add sitemap href in html
    var linksitemap = dom.querySelector('link[rel="sitemap"]');
    if (linksitemap) {
        linksitemap.setAttribute('href', '/sitemap.xml');
        linksitemap.setAttribute('type', 'application/xml');
        linksitemap.setAttribute('rel', 'sitemap');
        linksitemap.setAttribute('title', 'Sitemap');
    }
    else {
        // add the sitemap when not exist
        var head = dom.getElementsByTagName('head');
        if (head.length)
            head[0].innerHTML += '<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />';
    }
    var post = getPageData(data);
    if (post) {
        var isPagePost = post.is.post || post.is.page;
        if (isPagePost) {
            // if post updated not found, get source file last modified time
            if (!post.updated) {
                var stats = (0, fs_extra_1.statSync)(post.full_source);
                post.updated = (0, moment_1.default)(stats.mtime);
            }
        }
        if (post.is.post) {
            // YoastSeo Sitemap
            postUpdateDates.push(post.updated.format('YYYY-MM-DDTHH:mm:ssZ'));
            sitemapGroup['post'].urlset.url.push({
                loc: post.permalink,
                lastmod: post.updated.format('YYYY-MM-DDTHH:mm:ssZ'),
                changefreq: 'weekly',
                priority: '0.6'
            });
            // Google News Sitemap
            googleNewsSitemap.add({
                publication_name: (0, getAuthor_1.default)(post.author),
                publication_language: post.lang || post.language || 'en',
                publication_date: post.date.format('YYYY-MM-DDTHH:mm:ssZ'),
                title: post.title || 'no title',
                location: (0, hexo_util_1.url_for)(post.permalink)
            });
        }
        else if (post.is.page) {
            pageUpdateDates.push(post.updated.format('YYYY-MM-DDTHH:mm:ssZ'));
            sitemapGroup['page'].urlset.url.push({
                loc: post.permalink,
                lastmod: post.updated.format('YYYY-MM-DDTHH:mm:ssZ'),
                changefreq: 'weekly',
                priority: '0.8'
            });
        }
        if (isPagePost) {
            // write sitemap at Node process ends
            scheduler_1.default.add('writeSitemap', function () {
                // copy xsl
                var destXSL = (0, upath_1.join)(hexo.public_dir, 'sitemap.xsl');
                if (!(0, fs_extra_1.existsSync)((0, upath_1.dirname)(destXSL)))
                    (0, fs_extra_1.mkdirSync)((0, upath_1.dirname)(destXSL), { recursive: true });
                var sourceXSL = (0, upath_1.join)(__dirname, 'views/sitemap.xsl');
                if ((0, fs_extra_1.existsSync)(sourceXSL)) {
                    (0, fs_extra_1.copyFileSync)(sourceXSL, destXSL);
                    log_1.default.log('XSL sitemap copied to ' + destXSL);
                }
                else {
                    log_1.default.error('XSL sitemap not found');
                }
                // TODO write post-sitemap.xml
                var destPostSitemap = (0, upath_1.join)(hexo.public_dir, 'post-sitemap.xml');
                (0, sbg_utility_1.writefile)(destPostSitemap, (0, xmlbuilder2_1.create)(sitemapGroup['post']).end({ prettyPrint: true }));
                log_1.default.log('post sitemap saved', destPostSitemap);
                // TODO write page-sitemap.xml
                var destPageSitemap = (0, upath_1.join)(hexo.public_dir, 'page-sitemap.xml');
                (0, sbg_utility_1.writefile)(destPageSitemap, (0, xmlbuilder2_1.create)(sitemapGroup['page']).end({ prettyPrint: true }));
                log_1.default.log('page sitemap saved', destPageSitemap);
                // TODO write google-news-sitemap.xml
                var gnewsPageSitemap = (0, upath_1.join)(hexo.public_dir, 'google-news-sitemap.xml');
                (0, sbg_utility_1.writefile)(gnewsPageSitemap, googleNewsSitemap.toString());
                log_1.default.log('google news sitemap saved', gnewsPageSitemap);
                sitemapIndex(hexo);
            });
        }
    }
}
exports.sitemap = sitemap;
exports.default = sitemap;
function sitemapIndex(hexoinstance) {
    if (hexoinstance === void 0) { hexoinstance = null; }
    var sourceIndexXML = (0, upath_1.join)(__dirname, 'views/sitemap.xml');
    var sitemapIndexDoc = (0, xmlbuilder2_1.create)((0, fs_extra_1.readFileSync)(sourceIndexXML).toString());
    var sitemapIndex = new Object(sitemapIndexDoc.end({ format: 'object' }));
    sitemapIndex.sitemapindex.sitemap = [];
    if (!hexoinstance && typeof hexo != 'undefined') {
        hexoinstance = hexo;
    }
    // push post-sitemap.xml to sitemapindex
    var latestPostDate = (0, archive_1.getLatestFromArrayDates)(postUpdateDates);
    log_1.default.log('latest updated post', latestPostDate);
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + '/post-sitemap.xml',
        lastmod: (0, moment_1.default)(latestPostDate).format('YYYY-MM-DDTHH:mm:ssZ')
    });
    // push page-sitemap.xml to sitemapindex
    var latestPageDate = (0, archive_1.getLatestFromArrayDates)(pageUpdateDates);
    log_1.default.log('latest updated page', latestPageDate);
    if ((0, moment_1.default)(latestPageDate).isValid())
        sitemapIndex.sitemapindex.sitemap.push({
            loc: hexo.config.url.toString() + '/page-sitemap.xml',
            lastmod: (0, moment_1.default)(latestPageDate).format('YYYY-MM-DDTHH:mm:ssZ')
        });
    // build tag-sitemap.xml
    var tags = categoryTagsInfo.tags;
    tags.map(function (tag) {
        sitemapGroup['tag'].urlset.url.push({
            loc: tag.permalink.toString(),
            // set latest post updated from this tag
            lastmod: (0, moment_1.default)(tag.latest).format('YYYY-MM-DDTHH:mm:ssZ'),
            changefreq: 'weekly',
            priority: '0.2'
        });
    });
    var destTagSitemap = (0, upath_1.join)(hexo.public_dir, 'tag-sitemap.xml');
    (0, sbg_utility_1.writefile)(destTagSitemap, (0, xmlbuilder2_1.create)(sitemapGroup['tag']).end({ prettyPrint: true }));
    log_1.default.log('tag sitemap saved', destTagSitemap);
    // push tag-sitemap.xml to sitemapindex
    var latestTagDate = (0, archive_1.getLatestFromArrayDates)(tags.map(function (tag) {
        return tag.latest;
    }));
    log_1.default.log('latest updated tag', latestTagDate);
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + '/tag-sitemap.xml',
        lastmod: (0, moment_1.default)(latestTagDate).format('YYYY-MM-DDTHH:mm:ssZ')
    });
    // build category-sitemap.xml
    var categories = categoryTagsInfo.categories;
    categories.map(function (category) {
        sitemapGroup['category'].urlset.url.push({
            loc: category.permalink.toString(),
            // set latest post updated from this tag
            lastmod: (0, moment_1.default)(category.latest).format('YYYY-MM-DDTHH:mm:ssZ'),
            changefreq: 'weekly',
            priority: '0.2'
        });
    });
    var destCategorySitemap = (0, upath_1.join)(hexo.public_dir, 'category-sitemap.xml');
    (0, sbg_utility_1.writefile)(destCategorySitemap, (0, xmlbuilder2_1.create)(sitemapGroup['category']).end({ prettyPrint: true }));
    log_1.default.log('category sitemap saved', destCategorySitemap);
    // push category-sitemap.xml to sitemapindex
    var latestCategoryDate = (0, archive_1.getLatestFromArrayDates)(categories.map(function (category) {
        return category.latest;
    }));
    log_1.default.log('latest updated category', latestCategoryDate);
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + '/category-sitemap.xml',
        lastmod: (0, moment_1.default)(latestCategoryDate).format('YYYY-MM-DDTHH:mm:ssZ')
    });
    var destIndexSitemap = (0, upath_1.join)(hexo.public_dir, 'sitemap.xml');
    (0, sbg_utility_1.writefile)(destIndexSitemap, (0, xmlbuilder2_1.create)(sitemapIndex).end({ prettyPrint: true }));
    log_1.default.log('index sitemap saved', destIndexSitemap);
}
exports.sitemapIndex = sitemapIndex;
