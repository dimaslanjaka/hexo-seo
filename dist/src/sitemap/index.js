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
exports.getPageData = getPageData;
exports.sitemap = sitemap;
exports.generateSitemapIndex = generateSitemapIndex;
const fs_extra_1 = require("fs-extra");
const google_news_sitemap_1 = __importDefault(require("google-news-sitemap"));
const hexo_is_1 = __importDefault(require("hexo-is"));
const hexo_util_1 = require("hexo-util");
const moment_1 = __importDefault(require("moment"));
const sbg_utility_1 = require("sbg-utility");
const upath_1 = require("upath");
const xmlbuilder2_1 = require("xmlbuilder2");
const log_1 = __importDefault(require("../log"));
const getAuthor_1 = require("../utils/getAuthor");
const archive_1 = __importStar(require("./archive"));
const sitemapGroup = {
    post: undefined,
    page: undefined,
    tag: undefined,
    category: undefined
};
const googleNewsSitemap = new google_news_sitemap_1.default();
function initSitemap(type) {
    if (!sitemapGroup[type]) {
        const sourceXML = (0, upath_1.join)(__dirname, 'views/' + type + '-sitemap.xml');
        if (!(0, fs_extra_1.existsSync)(sourceXML))
            throw 'Source ' + sourceXML + ' Not Found';
        const doc = (0, xmlbuilder2_1.create)((0, fs_extra_1.readFileSync)(sourceXML).toString());
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
    const is = (0, hexo_is_1.default)(data);
    if (data['page']) {
        const page = data['page'];
        page.is = is;
        return page;
    }
}
// init each sitemap
const groups = ['post', 'page', 'category', 'tag'];
groups.forEach((group) => {
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
let categoryTagsInfo;
const postUpdateDates = [];
const pageUpdateDates = [];
// const cache = new CacheFile("sitemap");
let turnError = false;
/**
 * process sitemap of page
 */
function sitemap(dom, hexoSeoConfig, data) {
    if (!hexoSeoConfig.sitemap) {
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
    const locals = hexo.locals;
    // return if posts and pages empty
    if (['posts', 'pages'].every((info) => locals.get(info).length === 0)) {
        return;
    }
    // resolve configs
    let isYoastActive = false;
    let isGnewsActive = false;
    const sitemapConfig = hexoSeoConfig.sitemap;
    if (sitemapConfig) {
        if (typeof sitemapConfig == 'boolean' && sitemapConfig === true) {
            isYoastActive = isGnewsActive = true;
        }
        else {
            isYoastActive = sitemapConfig.yoast;
            isGnewsActive = sitemapConfig.gnews;
        }
    }
    // TODO modify or add sitemap href in html
    const linksitemap = dom.querySelector('link[rel="sitemap"]');
    if (linksitemap) {
        linksitemap.setAttribute('href', '/sitemap.xml');
        linksitemap.setAttribute('type', 'application/xml');
        linksitemap.setAttribute('rel', 'sitemap');
        linksitemap.setAttribute('title', 'Sitemap');
    }
    else {
        // add the sitemap when not exist
        const head = dom.getElementsByTagName('head');
        if (head.length)
            head[0].innerHTML += '<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />';
    }
    const post = getPageData(data);
    if (post) {
        const isPagePost = post.is.post || post.is.page;
        if (isPagePost) {
            // if post updated not found, get source file last modified time
            if (!post.updated) {
                const stats = (0, fs_extra_1.statSync)(post.full_source);
                post.updated = (0, moment_1.default)(stats.mtime);
            }
        }
        if (post.is.post) {
            // YoastSeo Sitemap
            if (isYoastActive) {
                postUpdateDates.push(post.updated.format('YYYY-MM-DDTHH:mm:ssZ'));
                sitemapGroup['post'].urlset.url.push({
                    loc: post.permalink,
                    lastmod: post.updated.format('YYYY-MM-DDTHH:mm:ssZ'),
                    changefreq: 'weekly',
                    priority: '0.6'
                });
            }
            // Google News Sitemap
            if (isGnewsActive) {
                googleNewsSitemap.add({
                    publication_name: (0, getAuthor_1.getAuthorName)(post.author),
                    publication_language: post.lang || post.language || 'en',
                    publication_date: post.date.format('YYYY-MM-DDTHH:mm:ssZ'),
                    title: post.title || 'no title',
                    location: (0, hexo_util_1.url_for)(post.permalink)
                });
            }
        }
        else if (post.is.page) {
            // YoastSeo Sitemap
            if (isYoastActive) {
                pageUpdateDates.push(post.updated.format('YYYY-MM-DDTHH:mm:ssZ'));
                sitemapGroup['page'].urlset.url.push({
                    loc: post.permalink,
                    lastmod: post.updated.format('YYYY-MM-DDTHH:mm:ssZ'),
                    changefreq: 'weekly',
                    priority: '0.8'
                });
            }
        }
        if (isPagePost) {
            // write sitemap at Node process ends
            (0, sbg_utility_1.bindProcessExit)('writeSitemap', () => {
                if (isYoastActive) {
                    // copy xsl
                    const destXSL = (0, upath_1.join)(hexo.public_dir, 'sitemap.xsl');
                    if (!(0, fs_extra_1.existsSync)((0, upath_1.dirname)(destXSL)))
                        (0, fs_extra_1.mkdirSync)((0, upath_1.dirname)(destXSL), { recursive: true });
                    const sourceXSL = (0, upath_1.join)(__dirname, 'views/sitemap.xsl');
                    if ((0, fs_extra_1.existsSync)(sourceXSL)) {
                        (0, fs_extra_1.copyFileSync)(sourceXSL, destXSL);
                        log_1.default.log('XSL sitemap copied to ' + destXSL);
                    }
                    else {
                        log_1.default.error('XSL sitemap not found');
                    }
                    // TODO write post-sitemap.xml
                    const destPostSitemap = (0, upath_1.join)(hexo.public_dir, 'post-sitemap.xml');
                    (0, sbg_utility_1.writefile)(destPostSitemap, (0, xmlbuilder2_1.create)(sitemapGroup['post']).end({ prettyPrint: true }));
                    log_1.default.log('post sitemap saved', destPostSitemap);
                    // TODO write page-sitemap.xml
                    const destPageSitemap = (0, upath_1.join)(hexo.public_dir, 'page-sitemap.xml');
                    (0, sbg_utility_1.writefile)(destPageSitemap, (0, xmlbuilder2_1.create)(sitemapGroup['page']).end({ prettyPrint: true }));
                    log_1.default.log('page sitemap saved', destPageSitemap);
                    generateSitemapIndex(hexo);
                }
                if (isGnewsActive) {
                    // TODO write google-news-sitemap.xml
                    const gnewsPageSitemap = (0, upath_1.join)(hexo.public_dir, 'google-news-sitemap.xml');
                    (0, sbg_utility_1.writefile)(gnewsPageSitemap, googleNewsSitemap.toString());
                    log_1.default.log('google news sitemap saved', gnewsPageSitemap);
                }
            });
        }
    }
}
exports.default = sitemap;
/** generate YoastSeo index sitemap */
function generateSitemapIndex(hexoinstance = null) {
    const sourceIndexXML = (0, upath_1.join)(__dirname, 'views/sitemap.xml');
    const sitemapIndexDoc = (0, xmlbuilder2_1.create)((0, fs_extra_1.readFileSync)(sourceIndexXML).toString());
    const sitemapIndex = new Object(sitemapIndexDoc.end({ format: 'object' }));
    sitemapIndex.sitemapindex.sitemap = [];
    if (!hexoinstance && typeof hexo != 'undefined') {
        hexoinstance = hexo;
    }
    // push post-sitemap.xml to sitemapindex
    const latestPostDate = (0, archive_1.getLatestFromArrayDates)(postUpdateDates);
    log_1.default.log('latest updated post', latestPostDate);
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + '/post-sitemap.xml',
        lastmod: (0, moment_1.default)(latestPostDate).format('YYYY-MM-DDTHH:mm:ssZ')
    });
    // push page-sitemap.xml to sitemapindex
    const latestPageDate = (0, archive_1.getLatestFromArrayDates)(pageUpdateDates);
    log_1.default.log('latest updated page', latestPageDate);
    if ((0, moment_1.default)(latestPageDate).isValid())
        sitemapIndex.sitemapindex.sitemap.push({
            loc: hexo.config.url.toString() + '/page-sitemap.xml',
            lastmod: (0, moment_1.default)(latestPageDate).format('YYYY-MM-DDTHH:mm:ssZ')
        });
    // build tag-sitemap.xml
    const tags = categoryTagsInfo.tags;
    tags.map((tag) => {
        sitemapGroup['tag'].urlset.url.push({
            loc: tag.permalink.toString(),
            // set latest post updated from this tag
            lastmod: (0, moment_1.default)(tag.latest).format('YYYY-MM-DDTHH:mm:ssZ'),
            changefreq: 'weekly',
            priority: '0.2'
        });
    });
    const destTagSitemap = (0, upath_1.join)(hexo.public_dir, 'tag-sitemap.xml');
    (0, sbg_utility_1.writefile)(destTagSitemap, (0, xmlbuilder2_1.create)(sitemapGroup['tag']).end({ prettyPrint: true }));
    log_1.default.log('tag sitemap saved', destTagSitemap);
    // push tag-sitemap.xml to sitemapindex
    const latestTagDate = (0, archive_1.getLatestFromArrayDates)(tags.map((tag) => {
        return tag.latest;
    }));
    log_1.default.log('latest updated tag', latestTagDate);
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + '/tag-sitemap.xml',
        lastmod: (0, moment_1.default)(latestTagDate).format('YYYY-MM-DDTHH:mm:ssZ')
    });
    // build category-sitemap.xml
    const categories = categoryTagsInfo.categories;
    categories.map((category) => {
        sitemapGroup['category'].urlset.url.push({
            loc: category.permalink.toString(),
            // set latest post updated from this tag
            lastmod: (0, moment_1.default)(category.latest).format('YYYY-MM-DDTHH:mm:ssZ'),
            changefreq: 'weekly',
            priority: '0.2'
        });
    });
    const destCategorySitemap = (0, upath_1.join)(hexo.public_dir, 'category-sitemap.xml');
    (0, sbg_utility_1.writefile)(destCategorySitemap, (0, xmlbuilder2_1.create)(sitemapGroup['category']).end({ prettyPrint: true }));
    log_1.default.log('category sitemap saved', destCategorySitemap);
    // push category-sitemap.xml to sitemapindex
    const latestCategoryDate = (0, archive_1.getLatestFromArrayDates)(categories.map((category) => {
        return category.latest;
    }));
    log_1.default.log('latest updated category', latestCategoryDate);
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + '/category-sitemap.xml',
        lastmod: (0, moment_1.default)(latestCategoryDate).format('YYYY-MM-DDTHH:mm:ssZ')
    });
    const destIndexSitemap = (0, upath_1.join)(hexo.public_dir, 'sitemap.xml');
    (0, sbg_utility_1.writefile)(destIndexSitemap, (0, xmlbuilder2_1.create)(sitemapIndex).end({ prettyPrint: true }));
    log_1.default.log('index sitemap saved', destIndexSitemap);
}
