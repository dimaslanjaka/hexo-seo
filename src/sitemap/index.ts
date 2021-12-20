import Hexo from "hexo";
import _ from "lodash";
import { dump } from "../utils";

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

  posts.forEach((post) => {
    dump("posts", post);
  });
}
