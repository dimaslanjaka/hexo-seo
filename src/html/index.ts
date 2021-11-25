import Hexo from "hexo";
import { HexoSeo } from "./schema/article";
import "../../packages/js-prototypes/src/String";
import "../../packages/js-prototypes/src/Array";
import { identifyRels } from "./fixHyperlinks.static";
import getConfig from "../config";
import { CacheFile, md5 } from "../cache";
import hexoIs from "../hexo/hexo-is";
import logger from "../log";
import Promise from "bluebird";
import pkg from "../../package.json";
import { parse as nodeHtmlParser } from "node-html-parser";
import { isExternal } from "./fixHyperlinks";
import parseUrl from "url-parse";
import { dump } from "../utils";
import { isDev } from "../";
import fixSchemaStatic from "./fixSchema.static";

export function getPath(data: HexoSeo) {
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
  if (getPath(data)) {
    path0 = getPath(data);
  } else {
    allowCache = false;
    path0 = content;
  }
  if (isDev) {
    const is = hexoIs(data);
    if (is.archive) {
      dump("data-archive.txt", data);
    } else if (is.post) {
      dump("data-post.txt", data);
    } else if (is.page) {
      dump("data-page.txt", data);
    } else if (is.category) {
      dump("data-category.txt", data);
    } else if (is.tag) {
      dump("data-tag.txt", data);
    }
  }
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

    if (cfg.html.fix) {
      //** fix invalid html */
      const inv = root.querySelectorAll('[href="/.css"],[src="/.js"]');
      logger.log("invalid html found", inv.length, "items");
      inv.forEach((el, i) => {
        el.remove();
      });
    }

    //** fix images attributes */
    const title =
      data.page && data.page.title && data.page.title.trim().length > 0
        ? data.page.title
        : data.config.title;
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
