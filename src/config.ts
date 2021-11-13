import Hexo from "hexo";
import HexoConfig from "hexo/HexoConfig";
import assign from "object-assign";
import { jsMinifyOptions } from "./minifier/js";
import { MinifyOptions as htmlMinifyOptions } from "./minifier/html";
import { cssMinifyOptions } from "./minifier/css";
import { imgOptions } from "./img/index.old";
import { memoize } from "underscore";
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
  html?: boolean | htmlMinifyOptions;
  host?: string[];
  links?: hyperlinkOptions;
}

const getConfig = memoize(function (hexo: Hexo): {
  js: jsMinifyOptions;
  css: cssMinifyOptions;
  img: imgOptions;
  html: htmlMinifyOptions;
  links: hyperlinkOptions;
  host: string[];
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
    host: ["webmanajemen.com", "web-manajemen.blogspot.com"],
    links: {
      allow: ["webmanajemen.com", "web-manajemen.blogspot.com"]
    }
  };
  const config: seoOptions = hexo.config;
  const seo: defaultSeoOptions = config.seo;
  if (typeof seo !== "object") return <any>defaultOpt;
  return <any>assign(defaultOpt, seo);
});

export default getConfig;
