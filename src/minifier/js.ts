import Hexo from "hexo";
import { minify, MinifyOptions } from "terser";
import log from "../log";
import pkg from "../../package.json";
import Cache from "../cache";
import assign from "object-assign";
import getConfig, { defaultSeoOptions } from "../config";
import { isIgnore } from "../utils";

export interface jsMinifyOptions {
  /**
   * exclude js patterns from minifying
   */
  exclude?: string[];
  options?: MinifyOptions;
}

const cache = new Cache();

export default async function (this: Hexo, str: string, data: Hexo.View) {
  const path0 = data.path;
  if (!path0) {
    log.error("%s(CSS) invalid path", pkg.name);
    return;
  }
  const HSConfig = getConfig(this).js;
  // if option js is false, return original content
  if (typeof HSConfig == "boolean" && !HSConfig) return str;
  const isChanged = await cache.isFileChanged(path0);
  if (isChanged) {
    // if original file is changed, re-minify js
    const hexo: Hexo = this;
    let options: jsMinifyOptions = {
      exclude: ["*.min.js"]
    };

    if (typeof HSConfig === "boolean") {
      if (!HSConfig) return str;
    } else if (typeof HSConfig == "object") {
      options = assign(options, HSConfig);
      if (isIgnore(path0, options.exclude)) return str;
    }

    let minifyOptions: MinifyOptions = {
      mangle: {
        toplevel: true, // to mangle names declared in the top level scope.
        properties: false, // disable mangle object and array properties
        safari10: true, // to work around the Safari 10 loop iterator
        keep_fnames: true, // keep function names
        keep_classnames: true // keep class name
      },
      compress: {
        dead_code: true //remove unreachable code
      }
    };
    if (typeof options.options == "object") {
      minifyOptions = assign(minifyOptions, options.options);
    }

    try {
      const result = await minify(str, minifyOptions);
      if (result.code && result.code.length > 0) {
        const saved = (
          ((str.length - result.code.length) / str.length) *
          100
        ).toFixed(2);
        log.log("%s(JS): %s [%s saved]", pkg.name, path0, `${saved}%`);
        str = result.code;

        // set new minified js cache
        cache.setCache(path0, str);
      }
    } catch (e) {
      log.error(`Minifying ${path0} error`, e);
      // minify error, return original js
      return str;
    }
  } else {
    // get cached minified js
    str = await cache.getCache(path0, str);
  }

  return str;
}
