import Hexo, { Model, TemplateLocals } from "hexo";
import moment from "moment";
import { create as createXML } from "xmlbuilder2";
import { copyFileSync, existsSync, readFileSync, statSync } from "fs";
import { join } from "path";
import hexoIs from "../hexo/hexo-is";
import { HexoIs } from "../hexo/hexo-is/is";
import { writeFile } from "../fm";
import log from "../log";
import scheduler from "../scheduler";
import { HTMLElement } from "node-html-parser";
import { ReturnConfig } from "../config";
import "js-prototypes/src/globals";

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

export interface returnPageData extends Hexo.PageData {
  [key: string]: any;
  is: HexoIs;
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

let categoryTagsInfo: ReturnType<typeof getCategoryTags>;
export function sitemap(dom: HTMLElement, HSconfig: ReturnConfig, data: TemplateLocals) {
  const hexo = this;
  if (HSconfig.sitemap === false) {
    log.error("hexo-seo config sitemap not set");
    return;
  }
  // set category and tag information of posts
  if (!categoryTagsInfo) {
    categoryTagsInfo = getCategoryTags(hexo);
  }
  // cast locals
  const locals = hexo.locals;
  // return if posts/pages empty
  if (["posts", "pages"].some((info) => locals.get(info).length === 0)) {
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
    dom.querySelector("head").innerHTML +=
      '<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />';
  }

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
      sitemapGroup["post"].urlset.url.push({
        loc: post.permalink,
        lastmod: post.updated.format("YYYY-MM-DDTHH:mm:ssZ"),
        changefreq: "weekly",
        priority: "0.6"
      });
    } else if (post.is.page) {
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
        const sourceXSL = join(__dirname, "views/sitemap.xsl");
        copyFileSync(sourceXSL, destXSL);
        log.log("XSL sitemap copied to " + destXSL);

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

interface objectCategoryTags {
  permalink: string;
  name: string;
  latest: string;
}
interface returnCategoryTags {
  tags: objectCategoryTags[];
  categories: objectCategoryTags[];
}
function getCategoryTags(hexo: Hexo) {
  const groups = ["categories", "tags"];
  const locals = hexo.locals;
  const groupfilter: returnCategoryTags = {
    tags: [],
    categories: []
  };
  groups.map((group) => {
    const lastModifiedObject = (<Model<Hexo.Locals.Category | Hexo.Locals.Tag>>locals.get(group)).map((items) => {
      if (items.posts) {
        const archives = <Hexo.Locals.Category | Hexo.Locals.Tag>items;
        const posts = archives.posts;
        const latest = getLatestFromArrayDates(
          posts.map((post) => {
            return post.updated.toDate();
          })
        );
        const permalink = new URL(hexo.config.url);
        permalink.pathname = archives.path;

        return <objectCategoryTags>{
          permalink: permalink.toString(),
          name: archives.name,
          latest: moment(latest).format("YYYY-MM-DDTHH:mm:ssZ")
        };
      }
    });
    groupfilter[group] = lastModifiedObject;
  });
  return groupfilter;
}

export function sitemapIndex(hexoinstance: Hexo = null) {
  const sourceXML = join(__dirname, "views/sitemap.xml");
  if (!existsSync(sourceXML)) throw "Source " + sourceXML + " Not Found";
  const sitemapIndexDoc = createXML(readFileSync(sourceXML).toString());
  const sitemapIndex = <SitemapIndex>new Object(sitemapIndexDoc.end({ format: "object" }));
  sitemapIndex.sitemapindex.sitemap = [];
  if (!hexoinstance && typeof hexo != "undefined") {
    hexoinstance = hexo;
  }

  sitemapIndex.sitemapindex.sitemap.push({
    loc: hexo.config.url.toString() + "/post-sitemap.xml",
    lastmod: moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ")
  });
  const destIndexSitemap = join(hexo.public_dir, "sitemap.xml");
  writeFile(destIndexSitemap, createXML(sitemapIndex).end({ prettyPrint: true }));
  log.log("index sitemap saved", destIndexSitemap);

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
}

function getLatestFromArrayDates(arr) {
  return new Date(
    Math.max.apply(
      null,
      arr.map(function (e) {
        return e;
      })
    )
  );
}
