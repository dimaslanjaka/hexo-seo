import fs from 'fs-extra';
import Hexo from 'hexo';
import assign from 'object-assign';
import { minify, MinifyOptions } from 'terser';
import pkg from '../../package.json';
import Cache from '../cache';
import getConfig from '../config';
import log from '../log';
import { isIgnore } from '../utils';

export interface jsMinifyOptions {
  /**
   * exclude js patterns from minifying
   */
  exclude?: string[];
  options?: MinifyOptions;
}

const cache = new Cache();

/**
 * minify js
 * @param this
 * @param str
 * @param data
 * @returns
 */
export default async function HexoSeoJs(this: Hexo, str: string, data: { [key: string]: any; path: string }) {
  const path0 = data.path;
  if (!path0) {
    log.error('%s(CSS) invalid path', pkg.name);
    return;
  }
  const hexoCfg = getConfig(this);
  const jsCfg = hexoCfg.js;
  // if option js is false, return original content
  if (typeof jsCfg == 'boolean' && !jsCfg) return str;
  // keep original js file when concatenate JS enabled
  if (jsCfg.concat) return str;
  const isChanged = await cache.isFileChanged(path0);
  const useCache = hexoCfg.cache;

  if (isChanged || !useCache) {
    // if original file is changed, re-minify js
    //const hexo: Hexo = this;
    let options: jsMinifyOptions = {
      exclude: ['*.min.js']
    };

    if (typeof jsCfg === 'boolean') {
      if (!jsCfg) return str;
    } else if (typeof jsCfg == 'object') {
      options = assign(options, jsCfg);
      if (isIgnore(path0, options.exclude)) return str;
    }

    let minifyOptions: MinifyOptions = {
      mangle: {
        toplevel: true, // to mangle names declared in the top level scope.
        properties: false, // disable mangle object and array properties
        safari10: true, // to work around the Safari 10 loop iterator
        keep_fnames: true, // keep function names
        keep_classnames: true // keep class name
      },
      compress: {
        dead_code: true //remove unreachable code
      }
    };
    if (typeof options.options == 'object') {
      minifyOptions = assign(minifyOptions, options.options);
    }

    try {
      const result = await minify(str, minifyOptions);
      if (result.code && result.code.length > 0) {
        const saved = (((str.length - result.code.length) / str.length) * 100).toFixed(2);
        log.log('%s(JS): %s [%s saved]', pkg.name, path0, `${saved}%`);
        str = result.code;

        // set new minified js cache
        cache.setCache(path0, str);
      }
    } catch (e) {
      log.error(`Minifying ${path0} error`, e);
      // minify error, return original js
      return str;
    }
  } else {
    // get cached minified js
    str = await cache.getCache(path0, str);
    log.log('%s(JS) cached [%s]', pkg.name, path0.replace(this.base_dir, ''));
  }

  return str;
}

/**
 * minify js
 * @param str
 * @param options
 * @returns
 */
export async function minifyJS(str: string, options: MinifyOptions) {
  let minifyOptions: MinifyOptions = {
    mangle: {
      toplevel: true, // to mangle names declared in the top level scope.
      properties: false, // disable mangle object and array properties
      safari10: true, // to work around the Safari 10 loop iterator
      keep_fnames: true, // keep function names
      keep_classnames: true // keep class name
    },
    compress: {
      dead_code: true //remove unreachable code
    }
  };
  if (typeof options == 'object') {
    minifyOptions = assign(minifyOptions, options);
  }
  const path0 = fs.existsSync(str) ? str : 'inline';
  if (path0 !== 'inline') {
    str = fs.readFileSync(path0).toString();
  }
  try {
    const result = await minify(str, minifyOptions);
    if (result.code && result.code.length > 0) {
      const saved = (((str.length - result.code.length) / str.length) * 100).toFixed(2);
      log.log('%s(JS): %s [%s saved]', pkg.name, path0, `${saved}%`);
      str = result.code;

      // set new minified js cache
      if (path0 !== 'inline') cache.setCache(path0, str);
    }
  } catch (e) {
    log.error(`Minifying ${path0} error`, e);
    // minify error, return original js
    return str;
  }
}
