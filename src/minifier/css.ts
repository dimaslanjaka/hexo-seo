"use strict";

import CleanCSS from "clean-css";
import getConfig, { defaultSeoOptions } from "../config";
import Hexo from "hexo";
import { isIgnore } from "../utils";
import log from "../log";
import pkg from "../../package.json";
import Cache from "../cache";
import * as chalk from "chalk";

export type cssMinifyOptions = CleanCSS.Options & {
  exclude?: string[];
};

const cache = new Cache();

export default async function (this: Hexo, str: string, data: Hexo.View) {
  const path0 = data.path;
  const isChanged = await cache.isFileChanged(path0);

  if (isChanged) {
    // if original file is changed, re-minify js
    const hexo: Hexo = this;
    const options = getConfig(hexo).css;
    const exclude = typeof options == "object" ? options.exclude : [];

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
    str = cache.get(path0);
  }

  return str;
}
