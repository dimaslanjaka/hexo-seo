import Hexo = require("hexo");
import { minify } from "terser";
import log from "../log";
import pkg from "../../package.json";

export default async function (str: any, data: Hexo.View) {
  const hexo: Hexo = this;
  const options = hexo.config.seo;
  const path0 = data.path;

  const result = await minify(str, { sourceMap: true });
  if (result.code.length > 0) {
    const saved = (
      ((str.length - result.code.length) / str.length) *
      100
    ).toFixed(2);
    log.log("%s(JS): %s [ %s saved]", pkg.name, path0, `${saved}%`);
    return result.code;
  }

  return str;
}
