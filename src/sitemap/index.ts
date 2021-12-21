import Hexo from "hexo";
import _ from "lodash";
import moment from "moment";
import { dump, extractSimplePageData } from "../utils";
import { convert as convertXML, create as createXML } from "xmlbuilder2";
import { readFileSync } from "fs";
import { join } from "path";

const xml = createXML(readFileSync(join(__dirname, "views/post-sitemap.xml")).toString());

export function sitemap_post(this: Hexo, content: string, data: Hexo.Locals.Post) {
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
  const post = posts.find((post) => post.title.toLowerCase() === data.title.toLowerCase());
  if (!post) {
    const build = {
      url: {
        loc: post.permalink,
        lastmod: post.updated
      }
    };
    console.log(build);
  }
}
export default sitemap_post;
