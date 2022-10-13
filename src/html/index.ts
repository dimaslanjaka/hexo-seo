import Promise from "bluebird";
import Hexo, { TemplateLocals } from "hexo";
//import "js-prototypes";
import { parse as nodeHtmlParser } from "node-html-parser";
import { array_remove_empties, array_unique } from "src/utils/array";
import parseUrl from "url-parse";
import { CacheFile } from "../cache";
import getConfig from "../config";
import { isDev } from "../hexo-seo";
import logger from "../log";
import sitemap from "../sitemap";
import { md5 } from "../utils/md5-file";
import { identifyRels } from "./fixHyperlinks.static";
import fixSchemaStatic from "./fixSchema.static";
import { HexoSeo } from "./schema/article";
import { isExternal } from "./types";

export function getPagePath(data: HexoSeo | TemplateLocals) {
  if (data.page) {
    if (data.page.full_source) return data.page.full_source;
    if (data.page.path) return data.page.path;
  }
  if (data.path) return data.path;
}

const cache = new CacheFile("index");
export default function (this: Hexo, content: string, data: HexoSeo) {
  const hexo = this;
  let path0: string;
  let allowCache = true;
  if (getPagePath(data)) {
    path0 = getPagePath(data);
  } else {
    allowCache = false;
    path0 = content;
  }

  if (cache.isFileChanged(md5(path0)) || isDev) {
    const root = nodeHtmlParser(content);
    const cfg = getConfig(this);
    //** fix hyperlink */
    const a = root.querySelectorAll("a[href]");
    a.forEach((el) => {
      const href = el.getAttribute("href");
      if (/https?:\/\//.test(href)) {
        let rels = el.getAttribute("rel") ? el.getAttribute("rel").split(" ") : [];
        //rels = rels.removeEmpties().unique();
        rels = array_unique(array_remove_empties(rels));
        const parseHref = parseUrl(href);
        const external = isExternal(parseHref, hexo);
        rels = identifyRels(el, external, cfg.links);
        el.setAttribute("rel", rels.join(" "));
      }
    });

    if (cfg.html.fix) {
      //** fix invalid html */
      const inv = root.querySelectorAll('[href="/.css"],[src="/.js"]');
      if (inv.length) logger.log("invalid html found", inv.length, inv.length > 1 ? "items" : "item");
      inv.forEach((el) => {
        el.remove();
      });
    }

    //** fix images attributes */
    const title =
      data.page && data.page.title && data.page.title.trim().length > 0 ? data.page.title : data.config.title;
    root.querySelectorAll("img[src]").forEach((element) => {
      if (!element.getAttribute("title")) {
        //logger.log("%s(img[title]) fix %s", pkg.name, data.title);
        element.setAttribute("title", title);
      }
      if (!element.getAttribute("alt")) {
        element.setAttribute("alt", title);
      }
      if (!element.getAttribute("itemprop")) {
        element.setAttribute("itemprop", "image");
      }
    });

    fixSchemaStatic(root, cfg, data);
    sitemap(root, cfg, data);

    content = root.toString();
    if (allowCache) cache.set(md5(path0), content);
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

    return fixBrokenImg(dom, cfg.img, data).then(() => {
      return content;
    });*/
  } else {
    content = cache.getCache(md5(path0), content) as string;
  }

  return Promise.resolve(content);
}
