import cheerio, { Cheerio, Element } from "cheerio";
import Hexo from "hexo";
import getConfig from "../config";
import parseUrl from "url-parse";
import { CacheFile } from "../cache";
import { dump, extractSimplePageData } from "../utils";
import { HexoSeo } from "./schema/article";
import "../../packages/js-prototypes/src/Array";
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

const fixHyperlinks = function (this: Hexo, content: string, data: HexoSeo) {
  const path0 = data.page ? data.page.full_source : data.path;
  const hexo = this;
  function dumper() {
    dump("dump-path0.txt", path0);
    dump("dump-data.txt", extractSimplePageData(data));
    dump("dump-page.txt", extractSimplePageData(data.page));
    dump("dump-this.txt", extractSimplePageData(hexo));
  }

  if (!cache.isFileChanged(path0)) {
    return cache.getCache(path0, null) as string;
  }
  const hexoConfig = this.config;
  let siteHost = parseUrl(hexoConfig.url).hostname;
  const $ = cheerio.load(content);
  const hyperlinks = $("a");
  if (siteHost && typeof siteHost == "string" && siteHost.trim().length > 0) {
    siteHost = siteHost.trim();
    for (let index = 0; index < hyperlinks.length; index++) {
      const hyperlink = $(hyperlinks[index]);
      const href = parseUrl(hyperlink.attr("href"));
      // external links rel
      if (typeof href.hostname == "string") {
        const hyperlinkHost = href.hostname.trim();
        if (hyperlinkHost.length > 0) {
          /**
           * filter by global hexo site url host
           */
          const isInternal = !isExternal(href, this);
          const externalArr = [
            "nofollow",
            "noopener",
            "noreferer",
            "noreferrer"
          ];
          let attr = extractRel(hyperlink);
          const internalArr = ["internal", "follow", "bookmark"];

          //console.log(hyperlinkHost, "is internal", isInternal);
          if (isInternal) {
            // internal link, remove external rel
            attr = attr.concat(internalArr).filter(function (el) {
              return !externalArr.includes(el);
            });
          } else {
            attr = attr.concat(externalArr).filter(function (el) {
              return !internalArr.includes(el);
            });
          }

          // filter attributes
          attr = attr
            // trim
            .map((str) => {
              return str.trim();
            })
            // remove duplicates
            .filter(function (val, ind) {
              return attr.indexOf(val) == ind;
            });

          //logger.log(hyperlinkHost, siteHost, isInternal, config.links);
          //logger.log(href.hostname, isInternal, attr);
          hyperlink.attr("rel", attr.join(" ").trim());
        }
      }

      // fix anchor title
      const a_title = hyperlink.attr("title");
      if (!a_title || a_title.trim().length < 1) {
        const a_text = hyperlink.text().replace(/['"]/gm, "");
        hyperlink.attr("title", a_text);
      }
    }
  }
  content = $.html();
  cache.setCache(path0, content);

  return content;
};

const usingJSDOM = function (this: Hexo, content: string, data: HexoSeo) {
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
    this.log.error(
      "%s(Anchor) failure to start, config {hexo.config.url} not set",
      pkg.name
    );
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
        let rels = el.getAttribute("rel")
          ? el.getAttribute("rel").split(" ")
          : [];
        const externalArr = ["nofollow", "noopener", "noreferer", "noreferrer"];
        const internalArr = ["internal", "follow", "bookmark"];
        const external = isExternal(parseHref, hexo);
        // if external link, assign external rel attributes and remove items from internal attributes if exists, and will do the opposite if the internal link
        if (external) {
          rels = rels
            .concat(externalArr)
            .unique()
            .hapusItemDariArrayLain(internalArr);
        } else {
          rels = rels
            .concat(internalArr)
            .unique()
            .hapusItemDariArrayLain(externalArr);
        }
        el.setAttribute("rel", rels.join(" "));
      }
    });
  }

  if (typeof HSconfig.html.fix == "boolean" && HSconfig.html.fix) {
    content = dom.serialize();
  } else {
    content = document.documentElement.outerHTML;
  }
  return content;
};

/**
 * is url external link
 * @param url
 * @param hexo
 * @returns
 */
function isExternal(url: ReturnType<typeof parseUrl>, hexo: Hexo): boolean {
  const site =
    typeof parseUrl(hexo.config.url).hostname == "string"
      ? parseUrl(hexo.config.url).hostname
      : null;
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

/**
 * Extract rels from anchor
 * @param anchor
 * @returns
 */
const extractRel = function (anchor: Cheerio<Element>) {
  const original = anchor.attr("rel");
  if (original && original.length > 0) {
    return original.split(/\s/).filter(function (el) {
      return el != null || el.trim().length > 0;
    });
  }
  return [];
};

export default usingJSDOM;
