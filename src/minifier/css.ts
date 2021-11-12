"use strict";

import CleanCSS from "clean-css";
import { defaultSeoOptions } from "../config";
import Hexo from "hexo";
import { isIgnore } from "../utils";
import log from "../log";
import pkg from "../../package.json";

export default async function (this: Hexo, str: string, data: Hexo.View) {
  const hexo: Hexo = this;
  const options: defaultSeoOptions["css"] = hexo.config.css;
  const path0 = data.path;
  const exclude = typeof options == "object" ? options.exclude : [];

  log.log(`start minifying ${path0.replace(hexo.base_dir, "")}`, exclude);

  if (path0 && exclude && exclude.length > 0) {
    log.log("[exclude]", isIgnore(path0, exclude), path0, exclude);
    if (isIgnore(path0, exclude)) return str;
  }

  if (typeof options == "object") {
    try {
      const { styles } = await new CleanCSS(<any>options).minify(str);
      const saved = (((str.length - styles.length) / str.length) * 100).toFixed(
        2
      );
      log.log("%s(CSS): %s [%s saved]", pkg.name, path0, saved + "%");
      return styles;
    } catch (err) {
      throw new Error(err);
    }
  }
}
