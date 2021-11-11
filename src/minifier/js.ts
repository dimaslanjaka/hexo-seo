import Hexo = require("hexo");
import { minify } from "terser";
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
    const cacheFileName = resolveFile("build/hexo-seo/cache/js.json");
    const minifyOptions = {
      mangle: {
        properties: true
      },
      nameCache: JSONparse(
        readFile(cacheFileName, { encoding: "utf8" }, true).toString(),
        {}
      )
    };

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
  } else {
    // get cached minified js
    str = await cache.getCache(path0, str);
  }

  return str;
}
