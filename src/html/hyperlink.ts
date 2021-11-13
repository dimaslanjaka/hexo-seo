import { CheerioAPI } from "cheerio";
import Hexo from "hexo";
import getConfig from "../config";
import { JSDOM } from "jsdom";
import logger from "../log";

const dom = new JSDOM("<!doctype html><html><body></body></html>");
const document = dom.window.document;

const parseUrl = (url: string) => {
  const parsedUrl: URL = {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    password: "",
    pathname: "",
    port: "",
    protocol: "",
    search: "",
    searchParams: undefined,
    username: "",
    toJSON: function (): string {
      throw new Error("Function not implemented.");
    }
  };
  try {
    return new URL(url);
  } catch (e) {
    const a = document.createElement("a");
    a.href = url;
    return a;
  }
};

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
function isExternal(
  url: string | URL | HTMLAnchorElement,
  hexo: Hexo
): boolean {
  const site = parseUrl(hexo.config.url);
  const cases = parseUrl(url.toString());
  return true;
}

/**
 * Extract rels from anchor
 * @param anchor
 * @returns
 */
function extractRel(anchor) {
  const original = $(anchor).attr("rel");
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
      const hyperlink = hyperlinks[index];
      const href = parseUrl($(hyperlink).attr("href"));
      if (typeof href.hostname == "string") {
        //logger.log({ [href.hostname]: $(hyperlink).attr("href") }, siteHost);
        const hyperlinkHost = href.hostname.trim();
        let attr = extractRel(hyperlink),
          isInternal: boolean;

        if (hyperlinkHost.length > 0) {
          /**
           * filter by global hexo site url host
           */
          isInternal = isExternal(href, hexo);
          if (isInternal) {
            // internal link
            attr = attr.concat(["internal", "follow", "bookmark"]);
          } else {
            attr = attr.concat([
              "nofollow",
              "noopener",
              "noreferer",
              "noreferrer"
            ]);
          }
        } else {
          attr = attr.concat(["internal", "follow", "bookmark"]);
        }
        logger.log(hyperlinkHost, siteHost, isInternal, config.links);
        $(hyperlink).attr(
          "rel",
          attr
            // trim
            .map((str) => {
              return str.trim();
            })
            // remove duplicates
            .filter(function (val, ind) {
              return attr.indexOf(val) == ind;
            })
            .join(" ")
        );
      }
    }
  }
  return $;
};

export default fixHyperlinks;
