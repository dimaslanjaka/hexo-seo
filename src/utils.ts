/* eslint-disable import/no-import-module-exports */
/* global hexo */

"use strict";

import minimatch from "minimatch";
import underscore from "underscore";
import path from "path";
import Hexo from "hexo";

export interface Objek extends Object {
  [key: string]: any;
}

const md5Cache: Objek = {};
const fileCache: Objek = {};

/**
 * is ignore pattern matching?
 */
export const isIgnore = underscore.memoize(
  (path0: string, exclude: string | string[], hexo?: Hexo) => {
    if (exclude && !Array.isArray(exclude)) exclude = [exclude];

    if (path0 && exclude && exclude.length) {
      for (let i = 0, len = exclude.length; i < len; i++) {
        const excludePattern = exclude[i];
        if (hexo) {
          const fromBase = path.join(hexo.base_dir, excludePattern);
          const fromSource = path.join(hexo.source_dir, excludePattern);
          //log.log([path0, fromBase, fromSource, excludePattern]);
          if (minimatch(path0, fromSource)) return true;
          if (minimatch(path0, fromBase)) return true;
        }
        if (minimatch(path0, excludePattern)) return true;
      }
    }
    return false;
  }
);
