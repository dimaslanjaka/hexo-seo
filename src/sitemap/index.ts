import Hexo from "hexo";
import _ from "lodash";
import { dump, extractSimplePageData } from "../utils";

const postInSitemap = function (post: Hexo.Locals.Post) {
  return post.sitemap !== false && post.published;
};

export default function sitemap(this: Hexo) {
  const locals = this.locals;
  if (locals.get("posts").length === 0) {
    return;
  }
  const posts = _(locals.get("posts").toArray()).filter(postInSitemap).orderBy("updated", "desc").value();
  //const chunk = _.chunk(posts, 1000);
  let dx = false;
  posts.forEach((post) => {
    if (!post.keywords) {
      if (dx) return;
      dx = true;
      //dump("posts", extractSimplePageData(<any>post));
      dump("posts", post.tags);
    }
  });
}
