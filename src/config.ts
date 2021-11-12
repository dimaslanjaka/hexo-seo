import Hexo from "hexo";
import assign from "object-assign";
import { MinifyOptions } from "terser";

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
  if (typeof hexo.config.seo !== "object") return defaultOpt;
  return assign(defaultOpt, hexo.config.seo);
}
