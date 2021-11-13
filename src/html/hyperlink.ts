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

export interface hyperlinkOptions {
  /**
   * Allow external link to be dofollowed
   * insert hostname or full url
   */
  allow?: string[];
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
        logger.log({ [href.hostname]: $(hyperlink).attr("href") }, siteHost);
        const hyperlinkHost = href.hostname.trim();
        let attr = [];
        if (hyperlinkHost.length > 0) {
          if (hyperlinkHost == siteHost || hyperlinkHost.includes(siteHost)) {
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
        const original = $(hyperlink).attr("rel");
        if (original && original.length > 0) {
          attr = attr.concat(original.split(" "));
        }
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
