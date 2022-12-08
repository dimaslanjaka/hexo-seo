import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from "fs";
import Hexo, { PageData, TemplateLocals } from "hexo";
import hexoIs from "hexo-is";
import moment from "moment";
import { HTMLElement } from "node-html-parser";
import { dirname, join } from "path";
import { create as createXML } from "xmlbuilder2";
import { BaseConfig } from "../config";
import { writeFile } from "../fm";
import log from "../log";
import scheduler from "../scheduler";
import getCategoryTags, { getLatestFromArrayDates } from "./archive";
//import "js-prototypes";

interface sitemapItem {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}
interface sitemapObj {
  urlset: {
    url: sitemapItem[];
  };
}
interface sitemapGroup {
  post: sitemapObj;
  page: sitemapObj;
  tag: sitemapObj;
  category: sitemapObj;
}
const sitemapGroup: sitemapGroup = {
  post: undefined,
  page: undefined,
  tag: undefined,
  category: undefined
};
interface SitemapIndex {
  sitemapindex: {
    sitemap: SitemapIndexItem[];
  };
}
interface SitemapIndexItem {
  loc: string;
  lastmod: string;
}

function initSitemap(type: string | "post" | "page" | "category" | "tag") {
  if (!sitemapGroup[type]) {
    const sourceXML = join(__dirname, "views/" + type + "-sitemap.xml");
    if (!existsSync(sourceXML)) throw "Source " + sourceXML + " Not Found";
    const doc = createXML(readFileSync(sourceXML).toString());
    sitemapGroup[type] = <sitemapObj>new Object(doc.end({ format: "object" }));
    sitemapGroup[type].urlset.url = [];
  }
}

export interface returnPageData extends PageData {
  [key: string]: any;
  is: ReturnType<typeof hexoIs>;
}

/**
 * Extract Page Data
 * @param data
 * @returns
 */
export function getPageData(data: TemplateLocals) {
  const is = hexoIs(data);
  if (data["page"]) {
    const page = <returnPageData>data["page"];
    page.is = is;
    return page;
  }
}

// init each sitemap
const groups = ["post", "page", "category", "tag"];
groups.forEach((group) => {
  if (!sitemapGroup[group]) initSitemap(group);
  if (sitemapGroup[group].urlset.url.length === 0) {
    sitemapGroup[group].urlset.url.push({
      loc: hexo.config.url,
      lastmod: moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ"),
      priority: "1",
      changefreq: "daily"
    });
  }
});

let categoryTagsInfo: ReturnType<typeof getCategoryTags>;
const postUpdateDates: string[] = [];
const pageUpdateDates: string[] = [];
// const cache = new CacheFile("sitemap");
let turnError = false;
export function sitemap(dom: HTMLElement, HSconfig: BaseConfig, data: TemplateLocals) {
  if (!HSconfig.sitemap) {
    if (!turnError) {
      turnError = true;
      log.error("[hexo-seo][sitemap] config sitemap not set");
    }
    return;
  }
  // set category and tag information of posts
  if (!categoryTagsInfo) {
    categoryTagsInfo = getCategoryTags(hexo);
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
  } else {
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
        const stats = statSync(post.full_source);
        post.updated = moment(stats.mtime);
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
    } else if (post.is.page) {
      pageUpdateDates.push(post.updated.format("YYYY-MM-DDTHH:mm:ssZ"));
      sitemapGroup["page"].urlset.url.push({
        loc: post.permalink,
        lastmod: post.updated.format("YYYY-MM-DDTHH:mm:ssZ"),
        changefreq: "weekly",
        priority: "0.8"
      });
    }

    if (isPagePost) {
      scheduler.add("writeSitemap", () => {
        // copy xsl
        const destXSL = join(hexo.public_dir, "sitemap.xsl");
        if (!existsSync(dirname(destXSL))) mkdirSync(dirname(destXSL), { recursive: true });
        const sourceXSL = join(__dirname, "views/sitemap.xsl");
        if (existsSync(sourceXSL)) {
          copyFileSync(sourceXSL, destXSL);
          log.log("XSL sitemap copied to " + destXSL);
        } else {
          log.error("XSL sitemap not found");
        }

        const destPostSitemap = join(hexo.public_dir, "post-sitemap.xml");
        writeFile(destPostSitemap, createXML(sitemapGroup["post"]).end({ prettyPrint: true }));
        log.log("post sitemap saved", destPostSitemap);

        const destPageSitemap = join(hexo.public_dir, "page-sitemap.xml");
        writeFile(destPageSitemap, createXML(sitemapGroup["page"]).end({ prettyPrint: true }));
        log.log("page sitemap saved", destPageSitemap);

        sitemapIndex(hexo);
      });
    }
  }
}
export default sitemap;

export function sitemapIndex(hexoinstance: Hexo = null) {
  const sourceIndexXML = join(__dirname, "views/sitemap.xml");
  const sitemapIndexDoc = createXML(readFileSync(sourceIndexXML).toString());
  const sitemapIndex = <SitemapIndex>new Object(sitemapIndexDoc.end({ format: "object" }));
  sitemapIndex.sitemapindex.sitemap = [];
  if (!hexoinstance && typeof hexo != "undefined") {
    hexoinstance = hexo;
  }

  // push post-sitemap.xml to sitemapindex
  const latestPostDate = getLatestFromArrayDates(postUpdateDates);
  log.log("latest updated post", latestPostDate);
  sitemapIndex.sitemapindex.sitemap.push({
    loc: hexo.config.url.toString() + "/post-sitemap.xml",
    lastmod: moment(latestPostDate).format("YYYY-MM-DDTHH:mm:ssZ")
  });

  // push page-sitemap.xml to sitemapindex
  const latestPageDate = getLatestFromArrayDates(pageUpdateDates);
  log.log("latest updated page", latestPageDate);
  if (moment(latestPageDate).isValid())
    sitemapIndex.sitemapindex.sitemap.push({
      loc: hexo.config.url.toString() + "/page-sitemap.xml",
      lastmod: moment(latestPageDate).format("YYYY-MM-DDTHH:mm:ssZ")
    });

  // build tag-sitemap.xml
  const tags = categoryTagsInfo.tags;
  tags.map((tag) => {
    sitemapGroup["tag"].urlset.url.push({
      loc: tag.permalink.toString(),
      // set latest post updated from this tag
      lastmod: moment(tag.latest).format("YYYY-MM-DDTHH:mm:ssZ"),
      changefreq: "weekly",
      priority: "0.2"
    });
  });
  const destTagSitemap = join(hexo.public_dir, "tag-sitemap.xml");
  writeFile(destTagSitemap, createXML(sitemapGroup["tag"]).end({ prettyPrint: true }));
  log.log("tag sitemap saved", destTagSitemap);

  // push tag-sitemap.xml to sitemapindex
  const latestTagDate = getLatestFromArrayDates(
    tags.map((tag) => {
      return tag.latest;
    })
  );
  log.log("latest updated tag", latestTagDate);
  sitemapIndex.sitemapindex.sitemap.push({
    loc: hexo.config.url.toString() + "/tag-sitemap.xml",
    lastmod: moment(latestTagDate).format("YYYY-MM-DDTHH:mm:ssZ")
  });

  // build category-sitemap.xml
  const categories = categoryTagsInfo.categories;
  categories.map((category) => {
    sitemapGroup["category"].urlset.url.push({
      loc: category.permalink.toString(),
      // set latest post updated from this tag
      lastmod: moment(category.latest).format("YYYY-MM-DDTHH:mm:ssZ"),
      changefreq: "weekly",
      priority: "0.2"
    });
  });
  const destCategorySitemap = join(hexo.public_dir, "category-sitemap.xml");
  writeFile(destCategorySitemap, createXML(sitemapGroup["category"]).end({ prettyPrint: true }));
  log.log("category sitemap saved", destCategorySitemap);

  // push category-sitemap.xml to sitemapindex
  const latestCategoryDate = getLatestFromArrayDates(
    categories.map((category) => {
      return category.latest;
    })
  );
  log.log("latest updated category", latestCategoryDate);
  sitemapIndex.sitemapindex.sitemap.push({
    loc: hexo.config.url.toString() + "/category-sitemap.xml",
    lastmod: moment(latestCategoryDate).format("YYYY-MM-DDTHH:mm:ssZ")
  });

  const destIndexSitemap = join(hexo.public_dir, "sitemap.xml");
  writeFile(destIndexSitemap, createXML(sitemapIndex).end({ prettyPrint: true }));
  log.log("index sitemap saved", destIndexSitemap);
}
