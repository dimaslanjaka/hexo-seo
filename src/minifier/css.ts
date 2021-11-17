"use strict";

import CleanCSS from "clean-css";
import getConfig from "../config";
import Hexo from "hexo";
import { isIgnore } from "../utils";
import log from "../log";
import pkg from "../../package.json";
import { CacheFile } from "../cache";
import chalk from "chalk";

export type cssMinifyOptions = CleanCSS.Options & {
  enable?: boolean;
  exclude?: string[];
};

const cache = new CacheFile();

export default async function (this: Hexo, str: string, data: Hexo.View) {
  const path0 = data.path;
  const isChanged = cache.isFileChanged(path0);

  if (isChanged) {
    // if original file is changed, re-minify js
    const hexo: Hexo = this;
    const options = getConfig(hexo).css;
    // if option css is false, return original content
    if (typeof options == "boolean" && !options) return str;
    const exclude = typeof options.exclude == "object" ? options.exclude : [];

    if (path0 && exclude && exclude.length > 0) {
      log.debug("[exclude]", isIgnore(path0, exclude), path0, exclude);
      if (isIgnore(path0, exclude)) return str;
    }

    if (typeof options == "object") {
      try {
        const { styles } = await new CleanCSS(<any>options).minify(str);
        const saved = (
          ((str.length - styles.length) / str.length) *
          100
        ).toFixed(2);
        log.log("%s(CSS): %s [%s saved]", pkg.name, path0, saved + "%");
        str = styles;
        cache.set(path0, str);
      } catch (err) {
        log.log("%d(CSS) %s %s", pkg.name, path0 + chalk.redBright("failed"));
        log.error(err);
      }
    }
  } else {
    log.log("%s(CSS) cached [%s]", pkg.name, path0.replace(this.base_dir, ""));
    str = cache.get(path0, "");
  }

  return str;
}
