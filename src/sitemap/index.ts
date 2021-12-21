import Hexo, { TemplateLocals } from "hexo";
import moment from "moment";
import { getCacheFolder } from "../utils";
import { create as createXML } from "xmlbuilder2";
import { copyFile, copyFileSync, existsSync, readFileSync, statSync } from "fs";
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
}
const sitemapGroup: sitemapGroup = {
  post: undefined,
  page: undefined
};

function initSitemap(type: string | "post" | "page") {
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
  const groups = ["post", "page"];
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
      copyFile(sourceXSL, destXSL, (err) => {
        if (!err) log.log("XSL sitemap copied to " + destXSL);
      });
    });

    if (post.is.post || post.is.page) {
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

      scheduler.add("writeSitemapPost", () => {
        const destPostSitemap = join(hexo.public_dir, "post-sitemap.xml");
        log.log("post sitemap saved", destPostSitemap);
        writeFile(destPostSitemap, createXML(sitemapGroup["post"]).end({ prettyPrint: true }));
      });
    }
  }
}
export default sitemap;
