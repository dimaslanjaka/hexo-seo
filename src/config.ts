import Hexo from "hexo";
import HexoConfig from "hexo/HexoConfig";
import assign from "object-assign";
import { jsMinifyOptions } from "./minifier/js";
import { MinifyOptions as htmlMinifyOptions } from "./minifier/html";
import { cssMinifyOptions } from "./minifier/css";
import { imgOptions } from "./img/index.old";
import { hyperlinkOptions } from "./html/types";
import InMemory from "./cache";

export interface seoOptions extends HexoConfig {
  seo?: defaultSeoOptions;
}

export interface defaultSeoOptions {
  /**
   * Optimize js
   */
  js?: boolean | jsMinifyOptions;
  /**
   * Optimize css
   */
  css?: boolean | cssMinifyOptions;
  /**
   * Optimize image
   */
  img?: boolean | imgOptions;
  /**
   * Minimize html
   */
  html?: boolean | htmlMinifyOptions;
  /**
   * Blog hostname
   */
  host?: string[];
  /**
   * Nofollow links
   */
  links?: hyperlinkOptions;
  /**
   * Generate schema article
   */
  schema?: boolean;
  sitemap?: boolean;
}

export interface ReturnConfig {
  sitemap: boolean;
  js: jsMinifyOptions;
  css: cssMinifyOptions;
  img: imgOptions;
  html: htmlMinifyOptions;
  links: hyperlinkOptions;
  host: defaultSeoOptions["host"];
  schema: boolean;
}

const cache = new InMemory();

const getConfig = function (hexo: Hexo, key = "config-hexo-seo"): ReturnConfig {
  if (!cache.getCache(key)) {
    const defaultOpt: defaultSeoOptions = {
      js: {
        exclude: ["*.min.js"]
      },
      css: {
        exclude: ["*.min.css"]
      },
      html: {
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
      },
      //img: { default: source.img.fallback.public, onerror: "serverside" },
      img: {
        default:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png",
        onerror: "serverside"
      },
      host: ["webmanajemen.com"],
      links: {
        blank: true,
        enable: true,
        allow: ["webmanajemen.com"]
      },
      schema: true
    };

    /*if (!/^https?/gs.test(source.img.fallback.public)) {
    hexo.route.set(source.img.fallback.public, source.img.fallback.buffer);
  }*/

    const config: seoOptions = hexo.config;
    let seo: defaultSeoOptions = config.seo;
    if (typeof seo === "undefined") return <any>defaultOpt;
    if (typeof seo.css === "boolean") delete seo.css;
    if (typeof seo.js === "boolean") delete seo.js;
    if (typeof seo.html === "boolean") delete seo.html;
    seo = assign(defaultOpt, seo);
    cache.setCache(key, seo);
    return seo as ReturnConfig;
  }
  return cache.getCache(key) as ReturnConfig;
};

export default getConfig;
