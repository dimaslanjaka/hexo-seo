/* global hexo */

'use strict';

import fs from 'fs-extra';
import Hexo from 'hexo';
import { minimatch } from 'minimatch';
import { rimrafSync } from 'rimraf';
import sanitizeFilename from 'sanitize-filename';
import path from 'upath';
import utils from 'util';
import pkg from '../package.json';
import { isDev } from './hexo-seo';

/**
 * is ignore pattern matching?
 */
export const isIgnore = (path0: string, exclude: string | string[], hexo?: Hexo) => {
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
};

/**
 * Simplify object data / delete object key
 * @param data
 */
export function extractSimplePageData(data: any, additional = []) {
  if (data) {
    delete data['_raw'];
    delete data['raw'];
    delete data['_model'];
    delete data['_content'];
    delete data['content'];
    delete data['site'];
    delete data['more'];
    delete data['excerpt'];
  }
  if (additional.forEach) {
    additional.forEach((key) => {
      if (typeof key == 'string') delete data[key];
    });
  }
  return data;
}

const dumpKeys = [];

/**
 * Dump once
 * @param filename
 * @param obj
 */
export function dumpOnce(filename: string, ...obj: any) {
  if (!dumpKeys[filename]) {
    dumpKeys[filename] = true;
    dump(filename, obj);
  }
}

/**
 * first initialization indicator
 */
const firstIndicator: Record<string, boolean> = {};

/**
 * Dump large objects
 * @param filename
 * @param obj
 */
export function dump(filename: string, ...obj: any) {
  if (!isDev) return;
  const hash = sanitizeFilename(filename).toString().replace(/\s/g, '-');
  const filePath = path.join(process.cwd(), '/tmp/hexo-seo/dump', hash);

  // truncate directory on first time
  if (!(hash in firstIndicator)) {
    rimrafSync(filePath);
    firstIndicator[hash] = true;
  }

  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  let buildLog = '';
  for (let index = 0; index < obj.length; index++) {
    buildLog += utils.inspect(obj[index], { showHidden: true, depth: null }) + '\n\n';
  }
  fs.writeFileSync(filePath, buildLog);

  console.log(`dump results saved to ${path.resolve(filePath)}`);
}

/**
 * get cache folder location
 * @param folderName
 * @returns
 */
export function getCacheFolder(folderName = '') {
  let root = process.cwd();
  if (typeof hexo != 'undefined') {
    root = hexo.base_dir;
  }
  return path.join(root, 'build/hexo-seo', folderName);
}

/**
 * get current package folder
 * @returns
 */
export function getPackageFolder() {
  return path.join(process.cwd(), 'node_modules', pkg.name);
}

/**
 * Get current package file
 * @param name
 * @returns
 */
export function getPackageFile(pathname: string) {
  return path.join(getPackageFolder(), pathname);
}
