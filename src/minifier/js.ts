import Hexo = require("hexo");
import { minify, MinifyOptions } from "terser";
import { readFile, resolveFile } from "../fm";
import log from "../log";
import pkg from "../../package.json";
import { parse as JSONparse } from "../json";
import Cache from "../cache";

const cache = new Cache();

export default async function (str: any, data: Hexo.View) {
  const hexo: Hexo = this;
  //const options = hexo.config.seo;
  const path0 = data.path;
  //console.log(`minifying ${path0}`);

  const isChanged = await cache.isFileChanged(path0);
  if (isChanged) {
    // if original file is changed, re-minify js
    const minifyOptions: MinifyOptions = {
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

    try {
      const result = await minify(str, minifyOptions);
      if (result.code.length > 0) {
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
      // minify error, return original js
      return str;
    }
  } else {
    // get cached minified js
    str = await cache.getCache(path0, str);
  }

  return str;
}
