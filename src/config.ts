import Hexo from "hexo";
import HexoConfig from "hexo/HexoConfig";
import assign from "object-assign";
import { MinifyOptions } from "terser";

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
        options?: MinifyOptions;
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
}

export default function (hexo: Hexo) {
  const defaultOpt: defaultSeoOptions = {
    js: {
      exclude: ["*.min.js"]
    },
    css: {
      exclude: ["*.min.css"]
    }
  };
  const config: seoOptions = hexo.config;
  const seo: defaultSeoOptions = config.seo;
  if (typeof seo !== "object") return defaultOpt;
  return assign(defaultOpt, seo);
}
