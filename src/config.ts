import Hexo from "hexo";
import HexoConfig from "hexo/HexoConfig";
import assign from "object-assign";
import { MinifyOptions as jsMinifyOptions } from "terser";
import { MinifyOptions as htmlMinifyOptions } from "./minifier/html";

export interface seoOptions extends HexoConfig {
  seo?: defaultSeoOptions;
}

export interface defaultSeoOptions {
  /**
   * Optimize js
   */
  js?:
    | boolean
    | {
        /**
         * exclude js patterns from minifying
         */
        exclude?: string[];
        /**
         * Minify options by terser
         */
        options?: jsMinifyOptions;
      };
  /**
   * Optimize css
   */
  css?:
    | boolean
    | {
        /**
         * exclude css patterns from minifying
         */
        exclude?: string[];
      };
  /**
   * Optimize image
   */
  img?:
    | boolean
    | {
        /**
         * exclude image patterns from optimization
         */
        exclude?: string[];
        /**
         * replace broken images with default ones
         */
        broken?: boolean | { string: string }[];
        /**
         * default image fallback
         */
        default?: string;
      };
  html?: boolean | htmlMinifyOptions;
}

export default function (hexo: Hexo) {
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
    }
  };
  const config: seoOptions = hexo.config;
  const seo: defaultSeoOptions = config.seo;
  if (typeof seo !== "object") return defaultOpt;
  return assign(defaultOpt, seo);
}
