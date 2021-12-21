import Hexo, { TemplateLocals } from "hexo";
import moment from "moment";
import { getCacheFolder } from "../utils";
import { create as createXML } from "xmlbuilder2";
import { readFileSync, statSync } from "fs";
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
const doc = createXML(readFileSync(join(__dirname, "views/post-sitemap.xml")).toString());
const obj = <sitemapObj>new Object(doc.end({ format: "object" }));
obj.urlset.url = [];

interface returnPage extends Hexo.PageData {
  [key: string]: any;
  is: HexoIs;
}
export function getPageData(data: TemplateLocals) {
  const is = hexoIs(data);
  if (data["page"]) {
    const page = <returnPage>data["page"];
    page.is = is;
    return page;
  }
}

export function sitemap_post(this: Hexo, content: string, data: TemplateLocals) {
  const hexo = this;
  const locals = hexo.locals;
  if (locals.get("posts").length === 0) {
    return;
  }
  if (obj.urlset.url.length === 0)
    obj.urlset.url.push({
      loc: hexo.config.url,
      lastmod: moment(Date.now()).format("YYYY-MM-DDTHH:mm:ssZ"),
      priority: "1",
      changefreq: "daily"
    });
  const post = getPageData(data);
  if (post) {
    if (post.is.post) {
      if (!post.updated) {
        const stats = statSync(post.full_source);
        post.updated = moment(stats.mtime);
      }
      obj.urlset.url.push({
        loc: post.permalink,
        lastmod: post.updated.format("YYYY-MM-DDTHH:mm:ssZ"),
        changefreq: "weekly",
        priority: "0.6"
      });
    }

    const temp = join(hexo.public_dir, "post-sitemap.xml");

    scheduler.add("writeCacheFile", () => {
      log.log("sitemap saved", temp);
      writeFile(temp, createXML(obj).end({ prettyPrint: true }));
    });
  }

  /*
  const posts = _(locals.get("posts").toArray())
    .filter((post) => {
      if ([post.sitemap, post.indexing].some((b) => b === false)) return false;
      return post.published;
    })
    .orderBy("updated", "desc")
    .value();
  const post = posts.find((post) =>
    post.title && page.title ? post.title.toLowerCase() === page.title.toLowerCase() : false
  );
  if (post) {
    const build = {
      url: {
        loc: post.permalink,
        lastmod: post.updated
      }
    };
    console.log(build);
  }*/
}
export default sitemap_post;
