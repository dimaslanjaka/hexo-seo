import cheerio, { Cheerio, Element } from "cheerio";
import Hexo from "hexo";
import getConfig from "../config";
import parseUrl from "url-parse";
import sanitizeFilename from "sanitize-filename";

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

const fixHyperlinks = function (
  this: Hexo,
  content: string,
  data: Hexo.Locals.Page
) {
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
  return $.html();
};

export default fixHyperlinks;
