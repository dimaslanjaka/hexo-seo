import Hexo from "hexo";
import moment from "moment";
import { MutableRequired, ReadonlyPartial } from "../utils/types";
import { join } from "path";
import yaml from "yaml";
import { readFileSync } from "fs";
import HexoConfig from "hexo/HexoConfig";
import Bluebird from "bluebird";
const yml = yaml.parse(readFileSync(join(__dirname, "/../../_config.yml")).toString());

/**
 * fake hexo instance
 * @returns
 */
function instanciateHexo() {
  const hexo: MutableRequired<Hexo> = new Hexo(__dirname, { silent: true });
  // setup config
  const config: MutableRequired<typeof hexo.config> = Object.assign(hexo.config, yml);
  config.permalink = ":title";
  config.url = "http://webmanajemen.com";
  // re-append
  hexo.config = config;
  hexo.init();
  return Bluebird.resolve(<Hexo>hexo);
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
    { source: "baz", slug: "baz", path: "baz", updated: moment.utc([2015, 0, 3, 16]).toDate() }
  ];
  return [hexo, Post.insert(mockedPosts)];
};

const setPostTag = function (hexo: Hexo, posts) {
  const post = posts[1];
  return [hexo, post.setTags(["Tag1"])];
};

const getHexoLocalsAndConfig = function (hexo: Hexo) {
  return Bluebird.resolve([hexo.locals.toObject(), hexo.config]) as Bluebird<
    [ReturnType<typeof hexo.locals.toObject>, HexoConfig]
  >;
};

const init = instanciateHexo().then(insertPosts).spread(setPostTag).spread(getHexoLocalsAndConfig);
init.then((result) => {
  const config = result[1];
  const hexo = result[0];
});
