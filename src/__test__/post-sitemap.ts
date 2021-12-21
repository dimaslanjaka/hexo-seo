import Hexo from "hexo";
import moment from "moment";
import { MutableRequired, ReadonlyPartial } from "../utils/types";
import { join } from "path";
import yaml from "yaml";
import { readFileSync } from "fs";
import HexoConfig from "hexo/HexoConfig";
import Bluebird from "bluebird";
const yml = yaml.parse(readFileSync(join(__dirname, "/../../_config.yml")).toString());
import sitemapPost from "../sitemap";
import cli from "hexo-cli";

/**
 * fake hexo instance
 * @returns
 */
function instanciateHexo() {
  const hexo: MutableRequired<Hexo> = new Hexo(join(process.cwd(), "tmp"), { silent: true });
  // setup config
  const config: MutableRequired<typeof hexo.config> = Object.assign(hexo.config, yml);
  config.permalink = ":title";
  config.url = "http://webmanajemen.com";
  // re-append
  hexo.config = config;
  hexo.init();
  hexo.post.create(
    {
      date: randomDate(new Date(2012, 0, 1), new Date()),
      title: "Hello World",
      slug: "hello-world.html"
    },
    true
  );
  return Bluebird.resolve(<Hexo>hexo);
}

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

/**
 * Insert posts to hexo instance
 * @param hexo
 * @returns
 */
const insertPosts = function (hexo) {
  const Post = hexo.model("Post");
  const mockedPosts = [
    { source: "foo", slug: "foo", path: "foo", updated: moment.utc([2015, 0, 1, 8]).toDate() },
    { source: "bar", slug: "bar", path: "bar", updated: moment.utc([2015, 0, 2, 14]).toDate() },
    { source: "baz", slug: "baz", path: "baz", updated: moment.utc([2015, 0, 3, 16]).toDate() },
    { source: "index.md", slug: "index.html", path: "index", updated: randomDate(new Date(2012, 0, 1), new Date()) }
  ];
  return [hexo, Post.insert(mockedPosts)] as [Hexo, any];
};

const setPostTag = function (hexo: Hexo, posts: any) {
  const post = posts[1];
  return [hexo, post.setTags(["Tag1"])] as [Hexo, any];
};

const getHexoLocalsAndConfig = function (hexo: Hexo) {
  return Bluebird.resolve([hexo.locals.toObject(), hexo.config, hexo]) as Bluebird<
    [ReturnType<typeof hexo.locals.toObject>, HexoConfig, Hexo]
  >;
};

const init = instanciateHexo().then(insertPosts).spread(setPostTag).spread(getHexoLocalsAndConfig);
init.then((result) => {
  const config = result[1];
  const objecthexo = result[0];
  const hexo = result[2];
  hexo.extend.filter.register("after_render:html", sitemapPost);
});
