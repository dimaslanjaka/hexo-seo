import Hexo from "hexo";
import getConfig from "../config";
import parseUrl from "url-parse";
import { CacheFile } from "../cache";
import { HexoSeo } from "./schema/article";
import "js-prototypes/src/Array";
import pkg from "../../package.json";
import { parseJSDOM } from "./dom";

export interface hyperlinkOptions {
  enable: boolean;
  blank: boolean;
  /**
   * Allow external link to be dofollowed
   * insert hostname or full url
   */
  allow?: string[];
}

const cache = new CacheFile("hyperlink");

export function formatAnchorText(text: string) {
  return text.replace(/['"]/gm, "");
}

function fixHyperlinks(this: Hexo, content: string, data: HexoSeo) {
  const path0 = data.page ? data.page.full_source : data.path;
  const hexo = this;
  const HSconfig = getConfig(this);
  // if config external link disabled, return original contents
  if (!HSconfig.links.enable) {
    return content;
  }
  if (!cache.isFileChanged(path0)) {
    return cache.getCache(path0, null) as string;
  }

  const siteHost = parseUrl(this.config.url).hostname;
  if (!siteHost || siteHost.length < 1) {
    this.log.error("%s(Anchor) failure to start, config {hexo.config.url} not set", pkg.name);
    return content;
  }

  const dom = parseJSDOM(content);
  const a = dom.document.querySelectorAll("a[href]");
  if (a.length) {
    a.forEach((el: HTMLAnchorElement) => {
      const href = el.href;
      // only process anchor start with https?, otherwise abadoned
      if (/https?/gs.test(href)) {
        const parseHref = parseUrl(href);
        let rels = el.getAttribute("rel") ? el.getAttribute("rel").split(" ") : [];
        const externalArr = ["nofollow", "noopener", "noreferer", "noreferrer"];
        const internalArr = ["internal", "follow", "bookmark"];
        const external = isExternal(parseHref, hexo);
        // if external link, assign external rel attributes and remove items from internal attributes if exists, and will do the opposite if the internal link
        if (external) {
          rels = rels.concat(externalArr).unique().hapusItemDariArrayLain(internalArr);
          if (typeof HSconfig.links.blank == "boolean" && HSconfig.links.blank) {
            el.setAttribute("target", "_blank");
          }
        } else {
          rels = rels.concat(internalArr).unique().hapusItemDariArrayLain(externalArr);
        }
        el.setAttribute("rel", rels.join(" "));
      }
      // set anchor title
      const aTitle = el.getAttribute("title");
      if (!aTitle || aTitle.length < 1) {
        let textContent: string;
        if (!el.textContent || el.textContent.length < 1) {
          textContent = hexo.config.title;
        } else {
          textContent = el.textContent;
        }
        el.setAttribute("title", formatAnchorText(textContent));
      }
    });
  }

  if (typeof HSconfig.html.fix == "boolean" && HSconfig.html.fix) {
    content = dom.serialize();
  } else {
    content = document.documentElement.outerHTML;
  }
  cache.set(path0, content);
  return content;
}

/**
 * is url external link
 * @param url
 * @param hexo
 * @returns
 */
export function isExternal(url: ReturnType<typeof parseUrl>, hexo: Hexo): boolean {
  const site = typeof parseUrl(hexo.config.url).hostname == "string" ? parseUrl(hexo.config.url).hostname : null;
  const cases = typeof url.hostname == "string" ? url.hostname.trim() : null;
  const config = getConfig(hexo);
  const allowed = Array.isArray(config.links.allow) ? config.links.allow : [];
  const hosts = config.host;

  // if url hostname empty, its internal
  if (!cases) return false;
  // if url hostname same with site hostname, its internal
  if (cases == site) return false;
  // if arrays contains url hostname, its internal and allowed to follow
  if (hosts.includes(cases) || allowed.includes(cases)) return false;

  /*if (cases.includes("manajemen")) {
    logger.log({ site: site, cases: cases, allowed: allowed, hosts: hosts });
  }*/

  return true;
}

export default fixHyperlinks;
