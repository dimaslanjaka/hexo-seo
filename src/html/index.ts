import Hexo from "hexo";
import { HexoSeo } from "./schema/article";
import "../../packages/js-prototypes/src/String";
import "../../packages/js-prototypes/src/Array";
import fixSchemaStatic from "./fixSchema.static";
import fixInvalidStatic from "./fixInvalid.static";
import fixAttributes from "./fixImageAttributes";
import { _JSDOM } from "./dom";
import fixHyperlinksStatic from "./fixHyperlinks.static";
import getConfig from "../config";
import { CacheFile, md5 } from "../cache";
import fixBrokenImg from "../img/broken.static";
import logger from "../log";
import bluebird from "bluebird";

export function getPath(data: HexoSeo) {
  if (data.page) {
    if (data.page.full_source) return data.page.full_source;
    if (data.page.path) return data.page.path;
  }
  if (data.path) return data.path;
}

const cache = new CacheFile("index");
export default async function (this: Hexo, content: string, data: HexoSeo) {
  const path0 = getPath(data) ? getPath(data) : content;
  if (cache.isFileChanged(md5(path0))) {
    const dom = new _JSDOM(content);
    const cfg = getConfig(this);

    await fixBrokenImg(dom, cfg.img, data);
    fixHyperlinksStatic(dom, cfg.links, data);
    fixInvalidStatic(dom, cfg, data);
    fixAttributes(dom, cfg.img, data);
    fixSchemaStatic(dom, cfg, data);
    if (cfg.html.fix) {
      content = dom.serialize();
    } else {
      content = dom.toString();
    }
    cache.set(md5(path0), content);
    return content;
  } else {
    content = cache.getCache(md5(path0));
  }

  //content = fixAttributes.bind(this)(content, data);
  //content = fixHyperlinks.bind(this)(content, data);
  //content = fixSchema.bind(this)(content, data);
  //content = fixInvalid.bind(this)(content, data);

  return content;
}
