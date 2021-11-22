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

const cache = new CacheFile("index");
export default function (this: Hexo, content: string, data: HexoSeo) {
  if (cache.isFileChanged(md5(content))) {
    const dom = new _JSDOM(content);
    const cfg = getConfig(this);
    fixHyperlinksStatic(dom, cfg.links, data);
    fixInvalidStatic(dom, cfg, data);
    fixAttributes(dom, cfg.img, data);
    fixSchemaStatic(dom, cfg, data);
    if (cfg.html.fix) {
      content = dom.serialize();
    } else {
      content = dom.toString();
    }
    cache.set(md5(content), content);
  }

  //content = fixAttributes.bind(this)(content, data);
  //content = fixHyperlinks.bind(this)(content, data);
  //content = fixSchema.bind(this)(content, data);
  //content = fixInvalid.bind(this)(content, data);

  return content;
}
