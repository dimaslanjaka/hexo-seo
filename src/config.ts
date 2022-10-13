import { deepmerge } from "deepmerge-ts";
import Hexo from "hexo";
import { hyperlinkOptions } from "./html/types";
import { imgOptions } from "./img/index.old";
import { cssMinifyOptions } from "./minifier/css";
import { MinifyOptions as htmlMinifyOptions } from "./minifier/html";
import { jsMinifyOptions } from "./minifier/js";

export interface Switcher {
  enable: boolean;
}

export interface ReturnConfig {
  sitemap: boolean;
  /**
   * Optimize js
   */
  js: jsMinifyOptions & Switcher;
  /**
   * Optimize css
   */
  css: cssMinifyOptions & Switcher;
  /**
   * Optimize image
   */
  img: imgOptions & Switcher;
  /**
   * Minimize html
   */
  html: htmlMinifyOptions & Switcher;
  /**
   * Nofollow links
   */
  links: hyperlinkOptions & Switcher;
  /**
   * Blog hostname
   */
  host: string;
  /**
   * Generate schema article
   */
  schema: {
    sitelink: Switcher;
    article: Switcher;
    breadcrumb: Switcher;
  };
}

//const cache = persistentCache({ persist: true, name: "hexo-seo", base: join(process.cwd(), "tmp") });

const getConfig = function (hexo: Hexo, _key = "config-hexo-seo") {
  const defaultOpt: ReturnConfig = {
    js: { enable: false, exclude: ["*.min.js"] },
    css: { enable: false, exclude: ["*.min.css"] },
    html: {
      enable: false,
      fix: false,
      exclude: [],
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      // Ignore '<!-- more -->' https://hexo.io/docs/tag-plugins#Post-Excerpt
      ignoreCustomComments: [/^\s*more/],
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true
    } as any,
    //img: { default: source.img.fallback.public, onerror: "serverside" },
    img: {
      enable: false,
      default:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png",
      onerror: "serverside"
    },
    host: new URL(hexo.config.url).host,
    links: {
      blank: true,
      enable: true,
      allow: ["webmanajemen.com"]
    },
    schema: {
      sitelink: {
        enable: false
      },
      article: { enable: false },
      breadcrumb: { enable: false }
    },
    sitemap: false
  };
  const seo: ReturnConfig = hexo.config.seo;
  if (typeof seo === "undefined") return <ReturnConfig>defaultOpt;
  return deepmerge(defaultOpt, seo) as ReturnConfig;
};

export default getConfig;
