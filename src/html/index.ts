import Hexo from "hexo";
import { HexoSeo } from "./schema/article";
import "../../packages/js-prototypes/src/String";
import "../../packages/js-prototypes/src/Array";
import fixSchemaStatic from "./fixSchema.static";
import fixInvalidStatic from "./fixInvalid.static";
import fixAttributes from "./fixImageAttributes";
import { _JSDOM } from "./dom";
import fixHyperlinksStatic, { identifyRels } from "./fixHyperlinks.static";
import getConfig from "../config";
import { CacheFile, md5 } from "../cache";
import fixBrokenImg from "../img/broken.static";
import logger from "../log";
import Promise from "bluebird";
import { JSDOM } from "jsdom";
import { HTMLElement, parse as nodeHtmlParser } from "node-html-parser";
import { isExternal } from "./fixHyperlinks";
import parseUrl from "url-parse";

export function getPath(data: HexoSeo) {
  if (data.page) {
    if (data.page.full_source) return data.page.full_source;
    if (data.page.path) return data.page.path;
  }
  if (data.path) return data.path;
}

let dom: _JSDOM;
const cache = new CacheFile("index");
export default function (this: Hexo, content: string, data: HexoSeo) {
  const hexo = this;
  const path0 = getPath(data) ? getPath(data) : content;
  if (cache.isFileChanged(md5(path0))) {
    const root = nodeHtmlParser(content);
    const cfg = getConfig(this);
    //** fix hyperlink */
    const a = root.querySelectorAll("a[href]");
    a.forEach((el) => {
      const href = el.getAttribute("href");
      if (/https?:\/\//.test(href)) {
        let rels = el.getAttribute("rel")
          ? el.getAttribute("rel").split(" ")
          : [];
        rels = rels.removeEmpties().unique();
        const parseHref = parseUrl(href);
        const external = isExternal(parseHref, hexo);
        rels = identifyRels(el, external, cfg.links);
        el.setAttribute("rel", rels.join(" "));
      }
    });

    //** fix invalid html */
    root.querySelectorAll('*[href="/.css"],*[src="/.js"]').forEach((i) => {
      i.set_content(`<!-- invalid ${i.outerHTML} -->`);
    });
    content = root.toString();
    /*
    dom = new _JSDOM(content);
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
    return fixBrokenImg(dom, cfg.img, data).then(() => {
      return content;
    });*/
  } else {
    content = cache.getCache(md5(path0), content) as string;
  }

  return Promise.resolve(content);
}
