/* eslint-disable import/no-import-module-exports */
/* global hexo */

"use strict";

import minimatch from "minimatch";
import underscore from "underscore";
import path from "path";
import Hexo from "hexo";
import * as fs from "fs";
import rimraf from "rimraf";
import utils from "util";
import { MD5 } from "crypto-js";
import logger from "./log";
import sanitizeFilename from "sanitize-filename";
import { HexoSeo } from "./html/schema/article";
import { isDev } from "./hexo-seo";

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

/**
 * Simplify object data / delete object key
 * @param data
 */
export function extractSimplePageData(data: HexoSeo, additional = []) {
  delete data._raw;
  delete data.raw;
  delete data._content;
  delete data.content;
  delete data.site;
  delete data.more;
  delete data.excerpt;
  return data;
}

let isFirst = true;

/**
 * Dump large objects
 * @param filename
 * @param obj
 */
export const dump = function (filename: string, ...obj: any) {
  if (!isDev) return;
  const hash = sanitizeFilename(filename).toString().replace(/\s/g, "-");
  const loc = path.join(__dirname, "../tmp", hash);

  if (isFirst) {
    rimraf.sync(loc);
    isFirst = false;
  }

  if (!fs.existsSync(path.dirname(loc))) {
    fs.mkdirSync(path.dirname(loc), { recursive: true });
  }

  let buildLog = "";
  for (let index = 0; index < obj.length; index++) {
    buildLog +=
      utils.inspect(obj[index], { showHidden: true, depth: null }) + "\n\n";
  }
  fs.writeFileSync(loc, buildLog);

  console.log(`dump results saved to ${path.resolve(loc)}`);
};
