import Hexo from "hexo";
import HexoConfig from "hexo/HexoConfig";
import assign from "object-assign";
import { jsMinifyOptions } from "./minifier/js";
import { MinifyOptions as htmlMinifyOptions } from "./minifier/html";
import { cssMinifyOptions } from "./minifier/css";
import { imgOptions } from "./img/index.old";
import source from "../source";
import { hyperlinkOptions } from "./html/hyperlink";

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
}

const getConfig = function (hexo: Hexo): {
  js: jsMinifyOptions;
  css: cssMinifyOptions;
  img: imgOptions;
  html: htmlMinifyOptions;
  links: hyperlinkOptions;
  host: defaultSeoOptions["host"];
  schema: boolean;
} {
  const defaultOpt: defaultSeoOptions = {
    js: {
      exclude: ["*.min.js"]
    },
    css: {
      exclude: ["*.min.css"]
    },
    html: {
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
    img: { default: source.img.fallback.public, onerror: "serverside" },
    host: ["webmanajemen.com"],
    links: {
      allow: ["webmanajemen.com"]
    },
    schema: true
  };

  hexo.route.set(source.img.fallback.public, source.img.fallback.buffer);

  const config: seoOptions = hexo.config;
  let seo: defaultSeoOptions = config.seo;
  if (typeof seo === "undefined") return <any>defaultOpt;
  if (typeof seo.css === "boolean") delete seo.css;
  if (typeof seo.js === "boolean") delete seo.js;
  if (typeof seo.html === "boolean") delete seo.html;
  seo = assign(defaultOpt, seo);
  //console.log(seo);
  return <any>seo;
};

export default getConfig;
