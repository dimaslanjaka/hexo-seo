import { Cheerio, CheerioAPI, Element } from "cheerio";
import Hexo from "hexo";
import getConfig from "../config";
import parseUrl from "url-parse";
import logger from "../log";

/**
 * Remove item from array
 * @param arr
 * @param value
 * @returns
 */
function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

export interface hyperlinkOptions {
  /**
   * Allow external link to be dofollowed
   * insert hostname or full url
   */
  allow?: string[];
}

/**
 * is url external link
 * @param url
 * @param hexo
 * @returns
 */
function isExternal(url: parseUrl, hexo: Hexo): boolean {
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
function extractRel(anchor: Cheerio<Element>) {
  const original = anchor.attr("rel");
  if (original && original.length > 0) {
    return original.split(/\s/).filter(function (el) {
      return el != null || el.trim().length > 0;
    });
  }
  return [];
}

const fixHyperlinks = function ($: CheerioAPI, hexo: Hexo) {
  const config = getConfig(hexo);
  const hexoConfig = hexo.config;
  let siteHost = parseUrl(hexoConfig.url).hostname;
  const hyperlinks = $("a");
  if (siteHost && typeof siteHost == "string" && siteHost.trim().length > 0) {
    siteHost = siteHost.trim();
    for (let index = 0; index < hyperlinks.length; index++) {
      const hyperlink = $(hyperlinks[index]);
      const href = parseUrl(hyperlink.attr("href"));
      let attr = extractRel(hyperlink);
      if (typeof href.hostname == "string") {
        //logger.log({ [href.hostname]: $(hyperlink).attr("href") }, siteHost);
        const hyperlinkHost = href.hostname.trim();
        /**
         * filter by global hexo site url host
         */
        const isInternal = !isExternal(href, hexo);
        const externalArr = ["nofollow", "noopener", "noreferer", "noreferrer"];
        const internalArr = ["internal", "follow", "bookmark"];

        if (hyperlinkHost.length > 0) {
          if (isInternal) {
            // internal link
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
    }
  }
  return $;
};

export default fixHyperlinks;
