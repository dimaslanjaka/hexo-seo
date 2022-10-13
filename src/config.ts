import { deepmerge } from "deepmerge-ts";
import { writeFileSync } from "fs";
import Hexo from "hexo";
import { join } from "path";
import { hyperlinkOptions } from "./html/types";
import { imgOptions } from "./img/index.old";
import { cssMinifyOptions } from "./minifier/css";
import { MinifyOptions as htmlMinifyOptions } from "./minifier/html";
import { jsMinifyOptions } from "./minifier/js";
import configData from "./_config_data.json";

export interface Switcher {
  enable: boolean;
}
export type AutoConfig = typeof configData;
export interface BaseConfig {
  sitemap: boolean;
  /**
   * Optimize js
   */
  js: jsMinifyOptions & Switcher & AutoConfig["js"];
  /**
   * Optimize css
   */
  css: cssMinifyOptions & Switcher & AutoConfig["css"];
  /**
   * Optimize image
   */
  img: imgOptions & Switcher & AutoConfig["img"];
  /**
   * Minimize html
   */
  html: htmlMinifyOptions & Switcher & AutoConfig["html"];
  /**
   * Nofollow links
   */
  links: hyperlinkOptions & Switcher & AutoConfig["links"];
  /**
   * Blog hostname
   */
  host: string;
  /**
   * Generate schema article
   */
  schema: {
    sitelink: Switcher & AutoConfig["schema"]["sitelink"];
    article: Switcher & AutoConfig["schema"]["article"];
    breadcrumb: Switcher & AutoConfig["schema"]["breadcrumb"];
  };
}

//const cache = persistentCache({ persist: true, name: "hexo-seo", base: join(process.cwd(), "tmp") });

const getConfig = function (hexo: Hexo, _key = "config-hexo-seo") {
  const defaultOpt: BaseConfig = {
    js: { enable: false, exclude: ["*.min.js"] } as any,
    css: { enable: false, exclude: ["*.min.css"] } as any,
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
    } as any,
    host: new URL(hexo.config.url).host,
    links: {
      blank: true,
      enable: true,
      allow: ["webmanajemen.com"]
    } as any,
    schema: {
      sitelink: {
        enable: false
      },
      article: { enable: false },
      breadcrumb: { enable: false }
    } as any,
    sitemap: false
  };
  const seo: BaseConfig = hexo.config.seo;
  writeFileSync(join(__dirname, "_config_data.json"), JSON.stringify(seo, null, 2));
  if (typeof seo === "undefined") return <BaseConfig>defaultOpt;
  return deepmerge(defaultOpt, seo) as BaseConfig;
};

export default getConfig;
