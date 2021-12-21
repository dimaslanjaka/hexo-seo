import Hexo, { TemplateLocals } from "hexo";
import _ from "lodash";
import moment from "moment";
import { dump, extractSimplePageData } from "../utils";
import { convert as convertXML, create as createXML } from "xmlbuilder2";
import { readFileSync } from "fs";
import { join } from "path";
import { HexoSeo } from "../html/schema/article";
import hexoIs from "../hexo/hexo-is";

const xml = createXML(readFileSync(join(__dirname, "views/post-sitemap.xml")).toString());

export function getPage(data: TemplateLocals) {
  const is = hexoIs(data);
  console.log(Object.keys(data["page"]));
  return data["page"];
}

export function sitemap_post(this: Hexo, content: string, data: TemplateLocals) {
  const locals = this.locals;
  if (locals.get("posts").length === 0) {
    return;
  }
  const posts = _(locals.get("posts").toArray())
    .filter((post) => {
      if ([post.sitemap, post.indexing].some((b) => b === false)) return false;
      return post.published;
    })
    .orderBy("updated", "desc")
    .value();
  const page = getPage(data);
  console.log(page.title);
  /*const post = posts.find((post) =>
    post.title && data.get("title") ? post.title.toLowerCase() === data.title.toLowerCase() : false
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
