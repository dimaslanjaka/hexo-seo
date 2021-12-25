"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
const moment_1 = __importDefault(require("moment"));
const xmlbuilder2_1 = require("xmlbuilder2");
const fs_1 = require("fs");
const path_1 = require("path");
const hexo_is_1 = __importDefault(require("../hexo/hexo-is"));
const fm_1 = require("../fm");
const log_1 = __importDefault(require("../log"));
const scheduler_1 = __importDefault(require("../scheduler"));
const archive_1 = __importStar(require("./archive"));
require("js-prototypes");
const cache_1 = require("../cache");
const sitemapGroup = {
    post: undefined,
    page: undefined,
    tag: undefined,
    category: undefined
};
function initSitemap(type) {
    if (!sitemapGroup[type]) {
        const sourceXML = (0, path_1.join)(__dirname, "views/" + type + "-sitemap.xml");
        if (!(0, fs_1.existsSync)(sourceXML))
            throw "Source " + sourceXML + " Not Found";
        const doc = (0, xmlbuilder2_1.create)((0, fs_1.readFileSync)(sourceXML).toString());
        sitemapGroup[type] = new Object(doc.end({ format: "object" }));
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
    if (data["page"]) {
        const page = data["page"];
        page.is = is;
        return page;
    }
}
exports.getPageData = getPageData;
// init each sitemap
const groups = ["post", "page", "category", "tag"];
groups.forEach((group) => {
    if (!sitemapGroup[group])
        initSitemap(group);
    if (sitemapGroup[group].urlset.url.length === 0) {
        sitemapGroup[group].urlset.url.push({
            loc: hexo.config.url,
            lastmod: (0, moment_1.default)(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ"),
            priority: "1",
            changefreq: "daily"
        });
    }
});
let categoryTagsInfo;
const postUpdateDates = [];
const pageUpdateDates = [];
const cache = new cache_1.CacheFile("sitemap");
let turnError = false;
function sitemap(dom, HSconfig, data) {
    if (!HSconfig.sitemap) {
        if (!turnError) {
            turnError = true;
            log_1.default.error("[hexo-seo][sitemap] config sitemap not set");
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
    if (["posts", "pages"].every((info) => locals.get(info).length === 0)) {
        return;
    }
    // parse html
    const linksitemap = dom.querySelector('link[rel="sitemap"]');
    if (linksitemap) {
        linksitemap.setAttribute("href", "/sitemap.xml");
        linksitemap.setAttribute("type", "application/xml");
        linksitemap.setAttribute("rel", "sitemap");
        linksitemap.setAttribute("title", "Sitemap");
    }
    else {
        const head = dom.getElementsByTagName("head");
        if (head.length)
            head[0].innerHTML += '<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />';
    }
    const post = getPageData(data);
    if (post) {
        const isPagePost = post.is.post || post.is.page;
        if (isPagePost) {
            // if post updated not found, get source file last modified time
            if (!post.updated) {
                const stats = (0, fs_1.statSync)(post.full_source);
                post.updated = (0, moment_1.default)(stats.mtime);
            }
        }
        if (post.is.post) {
            postUpdateDates.push(post.updated.format("YYYY-MM-DDTHH:mm:ssZ"));
            sitemapGroup["post"].urlset.url.push({
                loc: post.permalink,
                lastmod: post.updated.format("YYYY-MM-DDTHH:mm:ssZ"),
                changefreq: "weekly",
                priority: "0.6"
            });
        }
        else if (post.is.page) {
            pageUpdateDates.push(post.updated.format("YYYY-MM-DDTHH:mm:ssZ"));
            sitemapGroup["page"].urlset.url.push({
                loc: post.permalink,
                lastmod: post.updated.format("YYYY-MM-DDTHH:mm:ssZ"),
                changefreq: "weekly",
                priority: "0.8"
            });
        }
        if (isPagePost) {
            scheduler_1.default.add("writeSitemap", () => {
                // copy xsl
                const destXSL = (0, path_1.join)(hexo.public_dir, "sitemap.xsl");
                const sourceXSL = (0, path_1.join)(__dirname, "views/sitemap.xsl");
                (0, fs_1.copyFileSync)(sourceXSL, destXSL);
                log_1.default.log("XSL sitemap copied to " + destXSL);
                const destPostSitemap = (0, path_1.join)(hexo.public_dir, "post-sitemap.xml");
                (0, fm_1.writeFile)(destPostSitemap, (0, xmlbuilder2_1.create)(sitemapGroup["post"]).end({ prettyPrint: true }));
                log_1.default.log("post sitemap saved", destPostSitemap);
                const destPageSitemap = (0, path_1.join)(hexo.public_dir, "page-sitemap.xml");
                (0, fm_1.writeFile)(destPageSitemap, (0, xmlbuilder2_1.create)(sitemapGroup["page"]).end({ prettyPrint: true }));
                log_1.default.log("page sitemap saved", destPageSitemap);
                sitemapIndex(hexo);
            });
        }
    }
}
exports.sitemap = sitemap;
exports.default = sitemap;
function sitemapIndex(hexoinstance = null) {
    const sourceIndexXML = (0, path_1.join)(__dirname, "views/sitemap.xml");
    const sitemapIndexDoc = (0, xmlbuilder2_1.create)((0, fs_1.readFileSync)(sourceIndexXML).toString());
    const sitemapIndex = new Object(sitemapIndexDoc.end({ format: "object" }));
    sitemapIndex.sitemapindex.sitemap = [];
    if (!hexoinstance && typeof hexo != "undefined") {
        hexoinstance = hexo;
    }
    // push post-sitemap.xml to sitemapindex
    const latestPostDate = (0, archive_1.getLatestFromArrayDates)(postUpdateDates);
    log_1.default.log("latest updated post", latestPostDate);
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + "/post-sitemap.xml",
        lastmod: (0, moment_1.default)(latestPostDate).format("YYYY-MM-DDTHH:mm:ssZ")
    });
    // push page-sitemap.xml to sitemapindex
    const latestPageDate = (0, archive_1.getLatestFromArrayDates)(pageUpdateDates);
    log_1.default.log("latest updated page", latestPageDate);
    if ((0, moment_1.default)(latestPageDate).isValid())
        sitemapIndex.sitemapindex.sitemap.push({
            loc: hexo.config.url.toString() + "/page-sitemap.xml",
            lastmod: (0, moment_1.default)(latestPageDate).format("YYYY-MM-DDTHH:mm:ssZ")
        });
    // build tag-sitemap.xml
    const tags = categoryTagsInfo.tags;
    tags.map((tag) => {
        sitemapGroup["tag"].urlset.url.push({
            loc: tag.permalink.toString(),
            // set latest post updated from this tag
            lastmod: (0, moment_1.default)(tag.latest).format("YYYY-MM-DDTHH:mm:ssZ"),
            changefreq: "weekly",
            priority: "0.2"
        });
    });
    const destTagSitemap = (0, path_1.join)(hexo.public_dir, "tag-sitemap.xml");
    (0, fm_1.writeFile)(destTagSitemap, (0, xmlbuilder2_1.create)(sitemapGroup["tag"]).end({ prettyPrint: true }));
    log_1.default.log("tag sitemap saved", destTagSitemap);
    // push tag-sitemap.xml to sitemapindex
    const latestTagDate = (0, archive_1.getLatestFromArrayDates)(tags.map((tag) => {
        return tag.latest;
    }));
    log_1.default.log("latest updated tag", latestTagDate);
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + "/tag-sitemap.xml",
        lastmod: (0, moment_1.default)(latestTagDate).format("YYYY-MM-DDTHH:mm:ssZ")
    });
    // build category-sitemap.xml
    const categories = categoryTagsInfo.categories;
    categories.map((category) => {
        sitemapGroup["category"].urlset.url.push({
            loc: category.permalink.toString(),
            // set latest post updated from this tag
            lastmod: (0, moment_1.default)(category.latest).format("YYYY-MM-DDTHH:mm:ssZ"),
            changefreq: "weekly",
            priority: "0.2"
        });
    });
    const destCategorySitemap = (0, path_1.join)(hexo.public_dir, "category-sitemap.xml");
    (0, fm_1.writeFile)(destCategorySitemap, (0, xmlbuilder2_1.create)(sitemapGroup["category"]).end({ prettyPrint: true }));
    log_1.default.log("category sitemap saved", destCategorySitemap);
    // push category-sitemap.xml to sitemapindex
    const latestCategoryDate = (0, archive_1.getLatestFromArrayDates)(categories.map((category) => {
        return category.latest;
    }));
    log_1.default.log("latest updated category", latestCategoryDate);
    sitemapIndex.sitemapindex.sitemap.push({
        loc: hexo.config.url.toString() + "/category-sitemap.xml",
        lastmod: (0, moment_1.default)(latestCategoryDate).format("YYYY-MM-DDTHH:mm:ssZ")
    });
    const destIndexSitemap = (0, path_1.join)(hexo.public_dir, "sitemap.xml");
    (0, fm_1.writeFile)(destIndexSitemap, (0, xmlbuilder2_1.create)(sitemapIndex).end({ prettyPrint: true }));
    log_1.default.log("index sitemap saved", destIndexSitemap);
}
exports.sitemapIndex = sitemapIndex;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInNyYy9zaXRlbWFwL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSxvREFBNEI7QUFDNUIsNkNBQWtEO0FBQ2xELDJCQUFzRTtBQUN0RSwrQkFBNEI7QUFDNUIsOERBQXFDO0FBRXJDLDhCQUFrQztBQUNsQyxpREFBeUI7QUFDekIsNkRBQXFDO0FBR3JDLHFEQUFxRTtBQUNyRSx5QkFBdUI7QUFDdkIsb0NBQXFDO0FBcUJyQyxNQUFNLFlBQVksR0FBaUI7SUFDakMsSUFBSSxFQUFFLFNBQVM7SUFDZixJQUFJLEVBQUUsU0FBUztJQUNmLEdBQUcsRUFBRSxTQUFTO0lBQ2QsUUFBUSxFQUFFLFNBQVM7Q0FDcEIsQ0FBQztBQVdGLFNBQVMsV0FBVyxDQUFDLElBQW1EO0lBQ3RFLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDdkIsTUFBTSxTQUFTLEdBQUcsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLFFBQVEsR0FBRyxJQUFJLEdBQUcsY0FBYyxDQUFDLENBQUM7UUFDcEUsSUFBSSxDQUFDLElBQUEsZUFBVSxFQUFDLFNBQVMsQ0FBQztZQUFFLE1BQU0sU0FBUyxHQUFHLFNBQVMsR0FBRyxZQUFZLENBQUM7UUFDdkUsTUFBTSxHQUFHLEdBQUcsSUFBQSxvQkFBUyxFQUFDLElBQUEsaUJBQVksRUFBQyxTQUFTLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO1FBQzFELFlBQVksQ0FBQyxJQUFJLENBQUMsR0FBZSxJQUFJLE1BQU0sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMzRSxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUM7S0FDcEM7QUFDSCxDQUFDO0FBT0Q7Ozs7R0FJ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RUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoRixhQUFHLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFDbkQsQ0FBQztBQW5GRCxvQ0FtRkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSGV4bywgeyBQYWdlRGF0YSwgVGVtcGxhdGVMb2NhbHMgfSBmcm9tIFwiaGV4b1wiO1xuaW1wb3J0IG1vbWVudCBmcm9tIFwibW9tZW50XCI7XG5pbXBvcnQgeyBjcmVhdGUgYXMgY3JlYXRlWE1MIH0gZnJvbSBcInhtbGJ1aWxkZXIyXCI7XG5pbXBvcnQgeyBjb3B5RmlsZVN5bmMsIGV4aXN0c1N5bmMsIHJlYWRGaWxlU3luYywgc3RhdFN5bmMgfSBmcm9tIFwiZnNcIjtcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IGhleG9JcyBmcm9tIFwiLi4vaGV4by9oZXhvLWlzXCI7XG5pbXBvcnQgeyBIZXhvSXMgfSBmcm9tIFwiLi4vaGV4by9oZXhvLWlzL2lzXCI7XG5pbXBvcnQgeyB3cml0ZUZpbGUgfSBmcm9tIFwiLi4vZm1cIjtcbmltcG9ydCBsb2cgZnJvbSBcIi4uL2xvZ1wiO1xuaW1wb3J0IHNjaGVkdWxlciBmcm9tIFwiLi4vc2NoZWR1bGVyXCI7XG5pbXBvcnQgeyBIVE1MRWxlbWVudCB9IGZyb20gXCJub2RlLWh0bWwtcGFyc2VyXCI7XG5pbXBvcnQgeyBSZXR1cm5Db25maWcgfSBmcm9tIFwiLi4vY29uZmlnXCI7XG5pbXBvcnQgZ2V0Q2F0ZWdvcnlUYWdzLCB7IGdldExhdGVzdEZyb21BcnJheURhdGVzIH0gZnJvbSBcIi4vYXJjaGl2ZVwiO1xuaW1wb3J0IFwianMtcHJvdG90eXBlc1wiO1xuaW1wb3J0IHsgQ2FjaGVGaWxlIH0gZnJvbSBcIi4uL2NhY2hlXCI7XG5pbXBvcnQgeyBtZDUgfSBmcm9tIFwiLi4vdXRpbHMvbWQ1LWZpbGVcIjtcbmltcG9ydCB7IGdldFBhZ2VQYXRoIH0gZnJvbSBcIi4uL2h0bWxcIjtcblxuaW50ZXJmYWNlIHNpdGVtYXBJdGVtIHtcbiAgbG9jOiBzdHJpbmc7XG4gIGxhc3Rtb2Q6IHN0cmluZztcbiAgY2hhbmdlZnJlcTogc3RyaW5nO1xuICBwcmlvcml0eTogc3RyaW5nO1xufVxuaW50ZXJmYWNlIHNpdGVtYXBPYmoge1xuICB1cmxzZXQ6IHtcbiAgICB1cmw6IHNpdGVtYXBJdGVtW107XG4gIH07XG59XG5pbnRlcmZhY2Ugc2l0ZW1hcEdyb3VwIHtcbiAgcG9zdDogc2l0ZW1hcE9iajtcbiAgcGFnZTogc2l0ZW1hcE9iajtcbiAgdGFnOiBzaXRlbWFwT2JqO1xuICBjYXRlZ29yeTogc2l0ZW1hcE9iajtcbn1cbmNvbnN0IHNpdGVtYXBHcm91cDogc2l0ZW1hcEdyb3VwID0ge1xuICBwb3N0OiB1bmRlZmluZWQsXG4gIHBhZ2U6IHVuZGVmaW5lZCxcbiAgdGFnOiB1bmRlZmluZWQsXG4gIGNhdGVnb3J5OiB1bmRlZmluZWRcbn07XG5pbnRlcmZhY2UgU2l0ZW1hcEluZGV4IHtcbiAgc2l0ZW1hcGluZGV4OiB7XG4gICAgc2l0ZW1hcDogU2l0ZW1hcEluZGV4SXRlbVtdO1xuICB9O1xufVxuaW50ZXJmYWNlIFNpdGVtYXBJbmRleEl0ZW0ge1xuICBsb2M6IHN0cmluZztcbiAgbGFzdG1vZDogc3RyaW5nO1xufVxuXG5mdW5jdGlvbiBpbml0U2l0ZW1hcCh0eXBlOiBzdHJpbmcgfCBcInBvc3RcIiB8IFwicGFnZVwiIHwgXCJjYXRlZ29yeVwiIHwgXCJ0YWdcIikge1xuICBpZiAoIXNpdGVtYXBHcm91cFt0eXBlXSkge1xuICAgIGNvbnN0IHNvdXJjZVhNTCA9IGpvaW4oX19kaXJuYW1lLCBcInZpZXdzL1wiICsgdHlwZSArIFwiLXNpdGVtYXAueG1sXCIpO1xuICAgIGlmICghZXhpc3RzU3luYyhzb3VyY2VYTUwpKSB0aHJvdyBcIlNvdXJjZSBcIiArIHNvdXJjZVhNTCArIFwiIE5vdCBGb3VuZFwiO1xuICAgIGNvbnN0IGRvYyA9IGNyZWF0ZVhNTChyZWFkRmlsZVN5bmMoc291cmNlWE1MKS50b1N0cmluZygpKTtcbiAgICBzaXRlbWFwR3JvdXBbdHlwZV0gPSA8c2l0ZW1hcE9iaj5uZXcgT2JqZWN0KGRvYy5lbmQoeyBmb3JtYXQ6IFwib2JqZWN0XCIgfSkpO1xuICAgIHNpdGVtYXBHcm91cFt0eXBlXS51cmxzZXQudXJsID0gW107XG4gIH1cbn1cblxuZXhwb3J0IGludGVyZmFjZSByZXR1cm5QYWdlRGF0YSBleHRlbmRzIFBhZ2VEYXRhIHtcbiAgW2tleTogc3RyaW5nXTogYW55O1xuICBpczogSGV4b0lzO1xufVxuXG4vKipcbiAqIEV4dHJhY3QgUGFnZSBEYXRhXG4gKiBAcGFyYW0gZGF0YVxuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFBhZ2VEYXRhKGRhdGE6IFRlbXBsYXRlTG9jYWxzKSB7XG4gIGNvbnN0IGlzID0gaGV4b0lzKGRhdGEpO1xuICBpZiAoZGF0YVtcInBhZ2VcIl0pIHtcbiAgICBjb25zdCBwYWdlID0gPHJldHVyblBhZ2VEYXRhPmRhdGFbXCJwYWdlXCJdO1xuICAgIHBhZ2UuaXMgPSBpcztcbiAgICByZXR1cm4gcGFnZTtcbiAgfVxufVxuXG4vLyBpbml0IGVhY2ggc2l0ZW1hcFxuY29uc3QgZ3JvdXBzID0gW1wicG9zdFwiLCBcInBhZ2VcIiwgXCJjYXRlZ29yeVwiLCBcInRhZ1wiXTtcbmdyb3Vwcy5mb3JFYWNoKChncm91cCkgPT4ge1xuICBpZiAoIXNpdGVtYXBHcm91cFtncm91cF0pIGluaXRTaXRlbWFwKGdyb3VwKTtcbiAgaWYgKHNpdGVtYXBHcm91cFtncm91cF0udXJsc2V0LnVybC5sZW5ndGggPT09IDApIHtcbiAgICBzaXRlbWFwR3JvdXBbZ3JvdXBdLnVybHNldC51cmwucHVzaCh7XG4gICAgICBsb2M6IGhleG8uY29uZmlnLnVybCxcbiAgICAgIGxhc3Rtb2Q6IG1vbWVudChEYXRlLm5vdygpKS5mb3JtYXQoXCJZWVlZLU1NLUREVEhIOm1tOnNzWlwiKSxcbiAgICAgIHByaW9yaXR5OiBcIjFcIixcbiAgICAgIGNoYW5nZWZyZXE6IFwiZGFpbHlcIlxuICAgIH0pO1xuICB9XG59KTtcblxubGV0IGNhdGVnb3J5VGFnc0luZm86IFJldHVyblR5cGU8dHlwZW9mIGdldENhdGVnb3J5VGFncz47XG5jb25zdCBwb3N0VXBkYXRlRGF0ZXM6IHN0cmluZ1tdID0gW107XG5jb25zdCBwYWdlVXBkYXRlRGF0ZXM6IHN0cmluZ1tdID0gW107XG5jb25zdCBjYWNoZSA9IG5ldyBDYWNoZUZpbGUoXCJzaXRlbWFwXCIpO1xubGV0IHR1cm5FcnJvciA9IGZhbHNlO1xuZXhwb3J0IGZ1bmN0aW9uIHNpdGVtYXAoZG9tOiBIVE1MRWxlbWVudCwgSFNjb25maWc6IFJldHVybkNvbmZpZywgZGF0YTogVGVtcGxhdGVMb2NhbHMpIHtcbiAgaWYgKCFIU2NvbmZpZy5zaXRlbWFwKSB7XG4gICAgaWYgKCF0dXJuRXJyb3IpIHtcbiAgICAgIHR1cm5FcnJvciA9IHRydWU7XG4gICAgICBsb2cuZXJyb3IoXCJbaGV4by1zZW9dW3NpdGVtYXBdIGNvbmZpZyBzaXRlbWFwIG5vdCBzZXRcIik7XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICAvLyBzZXQgY2F0ZWdvcnkgYW5kIHRhZyBpbmZvcm1hdGlvbiBvZiBwb3N0c1xuICBpZiAoIWNhdGVnb3J5VGFnc0luZm8pIHtcbiAgICBjYXRlZ29yeVRhZ3NJbmZvID0gZ2V0Q2F0ZWdvcnlUYWdzKGhleG8pO1xuICB9XG4gIC8vIGNhc3QgbG9jYWxzXG4gIGNvbnN0IGxvY2FscyA9IGhleG8ubG9jYWxzO1xuICAvLyByZXR1cm4gaWYgcG9zdHMgYW5kIHBhZ2VzIGVtcHR5XG4gIGlmIChbXCJwb3N0c1wiLCBcInBhZ2VzXCJdLmV2ZXJ5KChpbmZvKSA9PiBsb2NhbHMuZ2V0KGluZm8pLmxlbmd0aCA9PT0gMCkpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvLyBwYXJzZSBodG1sXG4gIGNvbnN0IGxpbmtzaXRlbWFwID0gZG9tLnF1ZXJ5U2VsZWN0b3IoJ2xpbmtbcmVsPVwic2l0ZW1hcFwiXScpO1xuICBpZiAobGlua3NpdGVtYXApIHtcbiAgICBsaW5rc2l0ZW1hcC5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsIFwiL3NpdGVtYXAueG1sXCIpO1xuICAgIGxpbmtzaXRlbWFwLnNldEF0dHJpYnV0ZShcInR5cGVcIiwgXCJhcHBsaWNhdGlvbi94bWxcIik7XG4gICAgbGlua3NpdGVtYXAuc2V0QXR0cmlidXRlKFwicmVsXCIsIFwic2l0ZW1hcFwiKTtcbiAgICBsaW5rc2l0ZW1hcC5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBcIlNpdGVtYXBcIik7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgaGVhZCA9IGRvbS5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIik7XG4gICAgaWYgKGhlYWQubGVuZ3RoKVxuICAgICAgaGVhZFswXS5pbm5lckhUTUwgKz0gJzxsaW5rIHJlbD1cInNpdGVtYXBcIiB0eXBlPVwiYXBwbGljYXRpb24veG1sXCIgdGl0bGU9XCJTaXRlbWFwXCIgaHJlZj1cIi9zaXRlbWFwLnhtbFwiIC8+JztcbiAgfVxuXG4gIGNvbnN0IHBvc3QgPSBnZXRQYWdlRGF0YShkYXRhKTtcbiAgaWYgKHBvc3QpIHtcbiAgICBjb25zdCBpc1BhZ2VQb3N0ID0gcG9zdC5pcy5wb3N0IHx8IHBvc3QuaXMucGFnZTtcbiAgICBpZiAoaXNQYWdlUG9zdCkge1xuICAgICAgLy8gaWYgcG9zdCB1cGRhdGVkIG5vdCBmb3VuZCwgZ2V0IHNvdXJjZSBmaWxlIGxhc3QgbW9kaWZpZWQgdGltZVxuICAgICAgaWYgKCFwb3N0LnVwZGF0ZWQpIHtcbiAgICAgICAgY29uc3Qgc3RhdHMgPSBzdGF0U3luYyhwb3N0LmZ1bGxfc291cmNlKTtcbiAgICAgICAgcG9zdC51cGRhdGVkID0gbW9tZW50KHN0YXRzLm10aW1lKTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBvc3QuaXMucG9zdCkge1xuICAgICAgcG9zdFVwZGF0ZURhdGVzLnB1c2gocG9zdC51cGRhdGVkLmZvcm1hdChcIllZWVktTU0tRERUSEg6bW06c3NaXCIpKTtcbiAgICAgIHNpdGVtYXBHcm91cFtcInBvc3RcIl0udXJsc2V0LnVybC5wdXNoKHtcbiAgICAgICAgbG9jOiBwb3N0LnBlcm1hbGluayxcbiAgICAgICAgbGFzdG1vZDogcG9zdC51cGRhdGVkLmZvcm1hdChcIllZWVktTU0tRERUSEg6bW06c3NaXCIpLFxuICAgICAgICBjaGFuZ2VmcmVxOiBcIndlZWtseVwiLFxuICAgICAgICBwcmlvcml0eTogXCIwLjZcIlxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmIChwb3N0LmlzLnBhZ2UpIHtcbiAgICAgIHBhZ2VVcGRhdGVEYXRlcy5wdXNoKHBvc3QudXBkYXRlZC5mb3JtYXQoXCJZWVlZLU1NLUREVEhIOm1tOnNzWlwiKSk7XG4gICAgICBzaXRlbWFwR3JvdXBbXCJwYWdlXCJdLnVybHNldC51cmwucHVzaCh7XG4gICAgICAgIGxvYzogcG9zdC5wZXJtYWxpbmssXG4gICAgICAgIGxhc3Rtb2Q6IHBvc3QudXBkYXRlZC5mb3JtYXQoXCJZWVlZLU1NLUREVEhIOm1tOnNzWlwiKSxcbiAgICAgICAgY2hhbmdlZnJlcTogXCJ3ZWVrbHlcIixcbiAgICAgICAgcHJpb3JpdHk6IFwiMC44XCJcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlmIChpc1BhZ2VQb3N0KSB7XG4gICAgICBzY2hlZHVsZXIuYWRkKFwid3JpdGVTaXRlbWFwXCIsICgpID0+IHtcbiAgICAgICAgLy8gY29weSB4c2xcbiAgICAgICAgY29uc3QgZGVzdFhTTCA9IGpvaW4oaGV4by5wdWJsaWNfZGlyLCBcInNpdGVtYXAueHNsXCIpO1xuICAgICAgICBjb25zdCBzb3VyY2VYU0wgPSBqb2luKF9fZGlybmFtZSwgXCJ2aWV3cy9zaXRlbWFwLnhzbFwiKTtcbiAgICAgICAgY29weUZpbGVTeW5jKHNvdXJjZVhTTCwgZGVzdFhTTCk7XG4gICAgICAgIGxvZy5sb2coXCJYU0wgc2l0ZW1hcCBjb3BpZWQgdG8gXCIgKyBkZXN0WFNMKTtcblxuICAgICAgICBjb25zdCBkZXN0UG9zdFNpdGVtYXAgPSBqb2luKGhleG8ucHVibGljX2RpciwgXCJwb3N0LXNpdGVtYXAueG1sXCIpO1xuICAgICAgICB3cml0ZUZpbGUoZGVzdFBvc3RTaXRlbWFwLCBjcmVhdGVYTUwoc2l0ZW1hcEdyb3VwW1wicG9zdFwiXSkuZW5kKHsgcHJldHR5UHJpbnQ6IHRydWUgfSkpO1xuICAgICAgICBsb2cubG9nKFwicG9zdCBzaXRlbWFwIHNhdmVkXCIsIGRlc3RQb3N0U2l0ZW1hcCk7XG5cbiAgICAgICAgY29uc3QgZGVzdFBhZ2VTaXRlbWFwID0gam9pbihoZXhvLnB1YmxpY19kaXIsIFwicGFnZS1zaXRlbWFwLnhtbFwiKTtcbiAgICAgICAgd3JpdGVGaWxlKGRlc3RQYWdlU2l0ZW1hcCwgY3JlYXRlWE1MKHNpdGVtYXBHcm91cFtcInBhZ2VcIl0pLmVuZCh7IHByZXR0eVByaW50OiB0cnVlIH0pKTtcbiAgICAgICAgbG9nLmxvZyhcInBhZ2Ugc2l0ZW1hcCBzYXZlZFwiLCBkZXN0UGFnZVNpdGVtYXApO1xuXG4gICAgICAgIHNpdGVtYXBJbmRleChoZXhvKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufVxuZXhwb3J0IGRlZmF1bHQgc2l0ZW1hcDtcblxuZXhwb3J0IGZ1bmN0aW9uIHNpdGVtYXBJbmRleChoZXhvaW5zdGFuY2U6IEhleG8gPSBudWxsKSB7XG4gIGNvbnN0IHNvdXJjZUluZGV4WE1MID0gam9pbihfX2Rpcm5hbWUsIFwidmlld3Mvc2l0ZW1hcC54bWxcIik7XG4gIGNvbnN0IHNpdGVtYXBJbmRleERvYyA9IGNyZWF0ZVhNTChyZWFkRmlsZVN5bmMoc291cmNlSW5kZXhYTUwpLnRvU3RyaW5nKCkpO1xuICBjb25zdCBzaXRlbWFwSW5kZXggPSA8U2l0ZW1hcEluZGV4Pm5ldyBPYmplY3Qoc2l0ZW1hcEluZGV4RG9jLmVuZCh7IGZvcm1hdDogXCJvYmplY3RcIiB9KSk7XG4gIHNpdGVtYXBJbmRleC5zaXRlbWFwaW5kZXguc2l0ZW1hcCA9IFtdO1xuICBpZiAoIWhleG9pbnN0YW5jZSAmJiB0eXBlb2YgaGV4byAhPSBcInVuZGVmaW5lZFwiKSB7XG4gICAgaGV4b2luc3RhbmNlID0gaGV4bztcbiAgfVxuXG4gIC8vIHB1c2ggcG9zdC1zaXRlbWFwLnhtbCB0byBzaXRlbWFwaW5kZXhcbiAgY29uc3QgbGF0ZXN0UG9zdERhdGUgPSBnZXRMYXRlc3RGcm9tQXJyYXlEYXRlcyhwb3N0VXBkYXRlRGF0ZXMpO1xuICBsb2cubG9nKFwibGF0ZXN0IHVwZGF0ZWQgcG9zdFwiLCBsYXRlc3RQb3N0RGF0ZSk7XG4gIHNpdGVtYXBJbmRleC5zaXRlbWFwaW5kZXguc2l0ZW1hcC5wdXNoKHtcbiAgICBsb2M6IGhleG8uY29uZmlnLnVybC50b1N0cmluZygpICsgXCIvcG9zdC1zaXRlbWFwLnhtbFwiLFxuICAgIGxhc3Rtb2Q6IG1vbWVudChsYXRlc3RQb3N0RGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFRISDptbTpzc1pcIilcbiAgfSk7XG5cbiAgLy8gcHVzaCBwYWdlLXNpdGVtYXAueG1sIHRvIHNpdGVtYXBpbmRleFxuICBjb25zdCBsYXRlc3RQYWdlRGF0ZSA9IGdldExhdGVzdEZyb21BcnJheURhdGVzKHBhZ2VVcGRhdGVEYXRlcyk7XG4gIGxvZy5sb2coXCJsYXRlc3QgdXBkYXRlZCBwYWdlXCIsIGxhdGVzdFBhZ2VEYXRlKTtcbiAgaWYgKG1vbWVudChsYXRlc3RQYWdlRGF0ZSkuaXNWYWxpZCgpKVxuICAgIHNpdGVtYXBJbmRleC5zaXRlbWFwaW5kZXguc2l0ZW1hcC5wdXNoKHtcbiAgICAgIGxvYzogaGV4by5jb25maWcudXJsLnRvU3RyaW5nKCkgKyBcIi9wYWdlLXNpdGVtYXAueG1sXCIsXG4gICAgICBsYXN0bW9kOiBtb21lbnQobGF0ZXN0UGFnZURhdGUpLmZvcm1hdChcIllZWVktTU0tRERUSEg6bW06c3NaXCIpXG4gICAgfSk7XG5cbiAgLy8gYnVpbGQgdGFnLXNpdGVtYXAueG1sXG4gIGNvbnN0IHRhZ3MgPSBjYXRlZ29yeVRhZ3NJbmZvLnRhZ3M7XG4gIHRhZ3MubWFwKCh0YWcpID0+IHtcbiAgICBzaXRlbWFwR3JvdXBbXCJ0YWdcIl0udXJsc2V0LnVybC5wdXNoKHtcbiAgICAgIGxvYzogdGFnLnBlcm1hbGluay50b1N0cmluZygpLFxuICAgICAgLy8gc2V0IGxhdGVzdCBwb3N0IHVwZGF0ZWQgZnJvbSB0aGlzIHRhZ1xuICAgICAgbGFzdG1vZDogbW9tZW50KHRhZy5sYXRlc3QpLmZvcm1hdChcIllZWVktTU0tRERUSEg6bW06c3NaXCIpLFxuICAgICAgY2hhbmdlZnJlcTogXCJ3ZWVrbHlcIixcbiAgICAgIHByaW9yaXR5OiBcIjAuMlwiXG4gICAgfSk7XG4gIH0pO1xuICBjb25zdCBkZXN0VGFnU2l0ZW1hcCA9IGpvaW4oaGV4by5wdWJsaWNfZGlyLCBcInRhZy1zaXRlbWFwLnhtbFwiKTtcbiAgd3JpdGVGaWxlKGRlc3RUYWdTaXRlbWFwLCBjcmVhdGVYTUwoc2l0ZW1hcEdyb3VwW1widGFnXCJdKS5lbmQoeyBwcmV0dHlQcmludDogdHJ1ZSB9KSk7XG4gIGxvZy5sb2coXCJ0YWcgc2l0ZW1hcCBzYXZlZFwiLCBkZXN0VGFnU2l0ZW1hcCk7XG5cbiAgLy8gcHVzaCB0YWctc2l0ZW1hcC54bWwgdG8gc2l0ZW1hcGluZGV4XG4gIGNvbnN0IGxhdGVzdFRhZ0RhdGUgPSBnZXRMYXRlc3RGcm9tQXJyYXlEYXRlcyhcbiAgICB0YWdzLm1hcCgodGFnKSA9PiB7XG4gICAgICByZXR1cm4gdGFnLmxhdGVzdDtcbiAgICB9KVxuICApO1xuICBsb2cubG9nKFwibGF0ZXN0IHVwZGF0ZWQgdGFnXCIsIGxhdGVzdFRhZ0RhdGUpO1xuICBzaXRlbWFwSW5kZXguc2l0ZW1hcGluZGV4LnNpdGVtYXAucHVzaCh7XG4gICAgbG9jOiBoZXhvLmNvbmZpZy51cmwudG9TdHJpbmcoKSArIFwiL3RhZy1zaXRlbWFwLnhtbFwiLFxuICAgIGxhc3Rtb2Q6IG1vbWVudChsYXRlc3RUYWdEYXRlKS5mb3JtYXQoXCJZWVlZLU1NLUREVEhIOm1tOnNzWlwiKVxuICB9KTtcblxuICAvLyBidWlsZCBjYXRlZ29yeS1zaXRlbWFwLnhtbFxuICBjb25zdCBjYXRlZ29yaWVzID0gY2F0ZWdvcnlUYWdzSW5mby5jYXRlZ29yaWVzO1xuICBjYXRlZ29yaWVzLm1hcCgoY2F0ZWdvcnkpID0+IHtcbiAgICBzaXRlbWFwR3JvdXBbXCJjYXRlZ29yeVwiXS51cmxzZXQudXJsLnB1c2goe1xuICAgICAgbG9jOiBjYXRlZ29yeS5wZXJtYWxpbmsudG9TdHJpbmcoKSxcbiAgICAgIC8vIHNldCBsYXRlc3QgcG9zdCB1cGRhdGVkIGZyb20gdGhpcyB0YWdcbiAgICAgIGxhc3Rtb2Q6IG1vbWVudChjYXRlZ29yeS5sYXRlc3QpLmZvcm1hdChcIllZWVktTU0tRERUSEg6bW06c3NaXCIpLFxuICAgICAgY2hhbmdlZnJlcTogXCJ3ZWVrbHlcIixcbiAgICAgIHByaW9yaXR5OiBcIjAuMlwiXG4gICAgfSk7XG4gIH0pO1xuICBjb25zdCBkZXN0Q2F0ZWdvcnlTaXRlbWFwID0gam9pbihoZXhvLnB1YmxpY19kaXIsIFwiY2F0ZWdvcnktc2l0ZW1hcC54bWxcIik7XG4gIHdyaXRlRmlsZShkZXN0Q2F0ZWdvcnlTaXRlbWFwLCBjcmVhdGVYTUwoc2l0ZW1hcEdyb3VwW1wiY2F0ZWdvcnlcIl0pLmVuZCh7IHByZXR0eVByaW50OiB0cnVlIH0pKTtcbiAgbG9nLmxvZyhcImNhdGVnb3J5IHNpdGVtYXAgc2F2ZWRcIiwgZGVzdENhdGVnb3J5U2l0ZW1hcCk7XG5cbiAgLy8gcHVzaCBjYXRlZ29yeS1zaXRlbWFwLnhtbCB0byBzaXRlbWFwaW5kZXhcbiAgY29uc3QgbGF0ZXN0Q2F0ZWdvcnlEYXRlID0gZ2V0TGF0ZXN0RnJvbUFycmF5RGF0ZXMoXG4gICAgY2F0ZWdvcmllcy5tYXAoKGNhdGVnb3J5KSA9PiB7XG4gICAgICByZXR1cm4gY2F0ZWdvcnkubGF0ZXN0O1xuICAgIH0pXG4gICk7XG4gIGxvZy5sb2coXCJsYXRlc3QgdXBkYXRlZCBjYXRlZ29yeVwiLCBsYXRlc3RDYXRlZ29yeURhdGUpO1xuICBzaXRlbWFwSW5kZXguc2l0ZW1hcGluZGV4LnNpdGVtYXAucHVzaCh7XG4gICAgbG9jOiBoZXhvLmNvbmZpZy51cmwudG9TdHJpbmcoKSArIFwiL2NhdGVnb3J5LXNpdGVtYXAueG1sXCIsXG4gICAgbGFzdG1vZDogbW9tZW50KGxhdGVzdENhdGVnb3J5RGF0ZSkuZm9ybWF0KFwiWVlZWS1NTS1ERFRISDptbTpzc1pcIilcbiAgfSk7XG5cbiAgY29uc3QgZGVzdEluZGV4U2l0ZW1hcCA9IGpvaW4oaGV4by5wdWJsaWNfZGlyLCBcInNpdGVtYXAueG1sXCIpO1xuICB3cml0ZUZpbGUoZGVzdEluZGV4U2l0ZW1hcCwgY3JlYXRlWE1MKHNpdGVtYXBJbmRleCkuZW5kKHsgcHJldHR5UHJpbnQ6IHRydWUgfSkpO1xuICBsb2cubG9nKFwiaW5kZXggc2l0ZW1hcCBzYXZlZFwiLCBkZXN0SW5kZXhTaXRlbWFwKTtcbn1cbiJdfQ==