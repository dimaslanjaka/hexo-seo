/* eslint-disable import/no-import-module-exports */
/* global hexo */

"use strict";

import minimatch from "minimatch";
import BPromise from "bluebird";
import md5File from "md5-file";
import { Stream } from "stream";
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

export function streamToString(stream: Stream) {
  return new BPromise((resolve, _reject) => {
    const chunks: Objek = [];
    stream.on("data", (chunk) => {
      chunks.push(chunk.toString());
    });
    stream.on("end", () => {
      resolve(chunks.join(""));
    });
  });
}

export async function isFileChanged(filePath: string) {
  try {
    const hash1 = await md5File(filePath);
    const hash = md5Cache[filePath];
    md5Cache[filePath] = hash1;
    if (!hash) {
      return true;
    }
    if (hash === hash1) {
      return false;
    }
    return true;
  } catch (err) {
    return true;
  }
}

export function getFileCache(filePath: string, defaultData: any) {
  const cache = fileCache[filePath] || defaultData;
  return cache;
}

export function setFileCache(filePath: string, newData: any) {
  fileCache[filePath] = newData;
}
