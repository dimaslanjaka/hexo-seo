import Hexo from "hexo";
import _ from "lodash";
import moment from "moment";
import { dump, extractSimplePageData } from "../utils";
import { convert as convertXML, create as createXML } from "xmlbuilder2";
import { readFileSync } from "fs";
import { join } from "path";

const xml = createXML(readFileSync(join(__dirname, "views/post-sitemap.xml")));

const postInSitemap = function (post: Hexo.Locals.Post) {
  return post.sitemap !== false && post.published;
};

export default function sitemap_post(this: Hexo) {
  const locals = this.locals;
  if (locals.get("posts").length === 0) {
    return;
  }
  const posts = _(locals.get("posts").toArray()).filter(postInSitemap).orderBy("updated", "desc").value();
  const chunk = _.chunk(posts, 1000);
  _.map(chunk, (chunkPosts, index) => {
    const chainFirst: _.CollectionChain<any> = _.chain(chunkPosts).first();
    const updatedDate: moment.Moment = chainFirst.get(<any>"updated").value();
    const creationDate: moment.Moment = chainFirst.get(<any>"date").value();
  });
}
