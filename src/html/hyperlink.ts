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

const fixHyperlinks = function ($: CheerioAPI, hexo: Hexo) {
  const config = getConfig(hexo);
  const hexoConfig = hexo.config;
  const siteHost = parseUrl(hexoConfig.url).hostname;
  const hyperlinks = $("a");
  for (let index = 0; index < hyperlinks.length; index++) {
    const hyperlink = hyperlinks[index];
    const href = parseUrl($(hyperlink).attr("href"));
    if (typeof href.hostname == "string") {
      logger.log(href.hostname, siteHost);
    }
  }
  return $;
};

export = fixHyperlinks;
