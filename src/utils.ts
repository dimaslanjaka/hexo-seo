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

const isFirst = [];
/**
 * Dump large objects
 * @param filename
 * @param obj
 */
export const dump = function (filename: string, ...obj: any) {
  const hash = sanitizeFilename(filename).toString();
  const loc = path.join(__dirname, "../tmp", hash, filename);
  if (!fs.existsSync(path.dirname(loc))) {
    fs.mkdirSync(path.dirname(loc));
  }

  if (isFirst.length === 0) {
    rimraf(loc, function (err) {
      logger.log(loc, "deleted", err ? "fail" : "success");
    });
    return dump(filename, obj);
  }

  if (typeof isFirst[hash] == "undefined") {
    isFirst[hash] = true;
    //fs.writeFileSync(loc, utils.inspect(obj));
    let buildLog = "";
    for (let index = 0; index < obj.length; index++) {
      buildLog += utils.inspect(obj[index]) + "\n\n";
    }
    fs.writeFileSync(loc, buildLog);

    console.log(`dump results saved to ${loc}`);
  }
};
