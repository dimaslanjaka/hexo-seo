import Hexo, { TemplateLocals } from "hexo";
import moment from "moment";
import { create as createXML } from "xmlbuilder2";
import { copyFileSync, existsSync, readFileSync, statSync } from "fs";
import { join } from "path";
import hexoIs from "../hexo/hexo-is";
import { HexoIs } from "../hexo/hexo-is/is";
import "js-prototypes/src/globals";
import { writeFile } from "../fm";
import log from "../log";
import scheduler from "../scheduler";

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

export function sitemap(this: Hexo, _content: string, data: TemplateLocals) {
  const hexo = this;
  const locals = hexo.locals;
  if (locals.get("posts").length === 0) {
    return;
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
    scheduler.add("copySitemapXSL", () => {
      // copy xsl
      const destXSL = join(hexo.public_dir, "sitemap.xsl");
      const sourceXSL = join(__dirname, "views/sitemap.xsl");
      copyFileSync(sourceXSL, destXSL);
      log.log("XSL sitemap copied to " + destXSL);
    });

    if (post.is.post || post.is.page) {
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
    } else if (post.is.category) {
      sitemapGroup["category"].urlset.url.push({
        loc: post.permalink,
        lastmod: moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ"),
        changefreq: "weekly",
        priority: "0.2"
      });
    } else if (post.is.tag) {
      sitemapGroup["tag"].urlset.url.push({
        loc: post.permalink,
        lastmod: moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ"),
        changefreq: "weekly",
        priority: "0.2"
      });
    }

    scheduler.add("writeSitemap", () => {
      const destPostSitemap = join(hexo.public_dir, "post-sitemap.xml");
      writeFile(destPostSitemap, createXML(sitemapGroup["post"]).end({ prettyPrint: true }));
      log.log("post sitemap saved", destPostSitemap);

      const destPageSitemap = join(hexo.public_dir, "page-sitemap.xml");
      writeFile(destPageSitemap, createXML(sitemapGroup["page"]).end({ prettyPrint: true }));
      log.log("page sitemap saved", destPageSitemap);

      const destTagSitemap = join(hexo.public_dir, "tag-sitemap.xml");
      writeFile(destTagSitemap, createXML(sitemapGroup["tag"]).end({ prettyPrint: true }));
      log.log("tag sitemap saved", destTagSitemap);

      const destCategorySitemap = join(hexo.public_dir, "category-sitemap.xml");
      writeFile(destCategorySitemap, createXML(sitemapGroup["category"]).end({ prettyPrint: true }));
      log.log("category sitemap saved", destCategorySitemap);

      sitemapIndex(hexo);
    });
  }
}
export default sitemap;

export function sitemapIndex(hexoinstance: Hexo = null) {
  const sourceXML = join(__dirname, "views/sitemap.xml");
  if (!existsSync(sourceXML)) throw "Source " + sourceXML + " Not Found";
  const doc = createXML(readFileSync(sourceXML).toString());
  const sitemapIndex = <SitemapIndex>new Object(doc.end({ format: "object" }));
  /*sitemapIndex.sitemapindex["sitemap"] = [
    { loc: "xx", lastmod: "xx" },
    { loc: "xx", lastmod: "xx" }
  ];*/
  sitemapIndex.sitemapindex.sitemap = [];
  if (!hexoinstance && typeof hexo != "undefined") {
    hexoinstance = hexo;
  }
  const locals = hexo.locals;
  const lastModifiedArchives = locals.get("categories").map((items) => {
    const lastModifiedPosts = items.posts.map((post) => {
      return post.updated.toDate();
    });
    const latest = new Date(
      Math.max.apply(
        null,
        lastModifiedPosts.map(function (e) {
          return e;
        })
      )
    );
    return moment(latest).format("YYYY-MM-DDTHH:mm:ssZ");
  });
  console.log(lastModifiedArchives);

  sitemapIndex.sitemapindex.sitemap.push({
    loc: hexo.config.url.toString() + "/post-sitemap.xml",
    lastmod: moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ")
  });
  const destIndexSitemap = join(hexo.public_dir, "sitemap.xml");
  writeFile(destIndexSitemap, createXML(sitemapIndex).end({ prettyPrint: true }));
  log.log("index sitemap saved", destIndexSitemap);
}
