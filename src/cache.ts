import { existsSync } from 'fs-extra';
import NodeCache from 'node-cache';
import { bindProcessExit, writefile } from 'sbg-utility';
import path from 'upath';
import { buildFolder, readFile, tmpFolder } from './fm';
import logger from './log';
import md5File, { md5, sync as md5FileSync } from './utils/md5-file';

const myCache = new NodeCache({ stdTTL: 500, checkperiod: 520 });

/**
 * @summary IN MEMORY CACHE
 * @description cache will be saved in memory/RAM
 */
class Cache {
  /**
   * Identifier Hash for cache
   */
  static md5Cache: Record<string, any> = {};

  /**
   * Set cache
   * @param key
   * @param value
   * @returns
   */
  set(key: string, value: any) {
    return this.setCache(key, value);
  }

  setCache(key: string, value: any) {
    if (!key || !value) return;
    if (!key) key = md5(value);
    return myCache.set(key, value);
  }

  get(key: string, fallback?: any) {
    return this.getCache(key, fallback);
  }

  /**
   * Get cache for given key
   * @param key
   * @param fallback fallback if key not in cache
   * @returns
   */
  getCache(key: string, fallback = null) {
    return myCache.get(key) || fallback;
  }

  isFileChanged(filePath: string) {
    return md5File(filePath)
      .then((hash1) => {
        const hash = Cache.md5Cache[filePath];
        Cache.md5Cache[filePath] = hash1;
        if (!hash) {
          return true;
        }
        if (hash === hash1) {
          return false;
        }
        return true;
      })
      .catch((_err) => {
        return true;
      });
  }
}

/**
 * Transform any variable to string
 * @param variable
 * @returns
 */
export function resolveString(variable: any, _encode = false) {
  if (typeof variable === 'number') variable = variable.toString();
  if (Buffer.isBuffer(variable)) variable = variable.toString();
}

/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
export class CacheFile {
  md5Cache: Record<string, any> = {};
  dbFile: string;
  constructor(hash = null) {
    if (!hash) {
      const stack = new Error().stack.split('at')[2];
      hash = md5(stack);
    }
    this.dbFile = path.join(tmpFolder, 'db-' + hash + '.json');
    let db = readFile(this.dbFile, { encoding: 'utf8' }, {});
    if (typeof db != 'object') {
      try {
        db = JSON.parse(db.toString());
      } catch (e) {
        logger.error('cache database lost');
        logger.error(e);
      }
    }
    if (typeof db == 'object') {
      this.md5Cache = db;
    }
  }
  setCache(key: string, value: any) {
    return this.set(key, value);
  }
  set(key: string, value: any) {
    this.md5Cache[key] = value;
    // save cache on process exit
    bindProcessExit('writeCacheFile', () => {
      logger.log('saved cache', this.dbFile);
      writefile(this.dbFile, JSON.stringify(this.md5Cache));
    });
  }
  has(key: string): boolean {
    return typeof this.md5Cache[key] !== 'undefined';
  }
  /**
   * Get cache by key
   * @param key
   * @param fallback
   * @returns
   */
  get<T>(key: string, fallback: T = null): T {
    const Get = this.md5Cache[key];
    if (Get === undefined) return fallback;
    return Get;
  }
  /**
   * alias {get}
   * @param key
   * @param fallback
   * @returns
   */
  getCache<T>(key: string, fallback: T = null): T {
    return this.get(key, fallback);
  }
  /**
   * Check file is changed with md5 algorithm
   * @param path0
   * @returns
   */
  isFileChanged(path0: string): boolean {
    if (typeof path0 != 'string') {
      //console.log("", typeof path0, path0);
      return true;
    }
    try {
      // get md5 hash from path0
      const pathMd5 = md5FileSync(path0);
      // get index hash
      const savedMd5 = this.md5Cache[path0 + '-hash'];
      const result = savedMd5 != pathMd5;
      if (result) {
        // set, if file hash is not found
        this.md5Cache[path0 + '-hash'] = pathMd5;
      }
      return result;
    } catch (e) {
      return true;
    }
  }
}

/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
export class CacheFile2 {
  md5Cache: Record<string, any> = {};
  /**
   * temporary cache
   */
  dbTemp: Record<string, any> = {};
  /**
   * database file
   */
  dbFile: string;
  /**
   * database folder
   */
  dbFolder: string;
  /**
   * Unique cache id
   */
  cacheHash = '';
  constructor(hash = null) {
    const stack = new Error().stack.split('at')[2];
    hash = hash + '-' + md5(stack);
    this.cacheHash = hash;
    this.dbFile = path.join(buildFolder, 'db-' + hash + '.json');
    this.dbFolder = path.join(buildFolder, hash);
    let db = readFile(this.dbFile, { encoding: 'utf8' }, {});
    if (typeof db != 'object') {
      try {
        db = JSON.parse(db.toString());
      } catch (e) {
        logger.error('cache database lost');
        logger.error(e);
      }
    }
    if (typeof db == 'object') {
      this.md5Cache = db;
    }
  }
  getKeyLocation(key: string) {
    if (key.startsWith('/')) {
      key = path.join(md5(path.dirname(key)), path.basename(key));
    }
    return path.join(this.dbFolder, key);
  }
  set(key: string, value: any) {
    if (!key && !value) {
      return;
    } else if (!key) {
      key = md5(value);
    }
    const saveLocation = this.getKeyLocation(key);
    this.md5Cache[key] = saveLocation;
    const dbLocation = path.join(this.dbFile);
    const db = this.md5Cache;
    //dump("cache-" + this.cacheHash, db);
    bindProcessExit('save-' + this.cacheHash, function () {
      logger.log('saving caches...', saveLocation, dbLocation);
      writefile(saveLocation, value);
      writefile(dbLocation, JSON.stringify(db, null, 2));
    });
    this.dbTemp[key] = value;
  }
  /**
   * Get cache by key
   * @param key
   * @param fallback
   * @returns
   */
  get(key: string, fallback = null) {
    if (typeof this.dbTemp[key] == 'undefined') {
      const saveLocation = this.getKeyLocation(key);
      if (existsSync(saveLocation)) {
        const readCache = readFile(saveLocation).toString();
        this.dbTemp[key] = readCache;
        return readCache;
      }
      if (typeof fallback === 'function') return fallback();
      return fallback;
    }
    return this.dbTemp[key];
  }
  has(key: string): boolean {
    return typeof this.md5Cache[key] !== 'undefined';
  }
  getCache(key: string, fallback = null) {
    return this.get(key, fallback);
  }
  setCache(key: string, value: any) {
    return this.set(key, value);
  }
  /**
   * Check file is changed with md5 algorithm
   * @param path0
   * @returns
   */
  isFileChanged(path0: string): boolean {
    if (typeof path0 != 'string') {
      //console.log("", typeof path0, path0);
      return true;
    }
    // get md5 hash from path0
    const pathMd5 = md5FileSync(path0);
    // get index hash
    const savedMd5 = this.md5Cache[path0 + '-hash'];
    const isChanged = savedMd5 !== pathMd5;
    //console.log(savedMd5, pathMd5, result);
    if (isChanged) {
      // set, if file hash is not found
      this.md5Cache[path0 + '-hash'] = pathMd5;
    }
    return isChanged;
  }
}

/**
 * Release memories
 */
export function releaseMemory() {
  if (!global.gc) {
    //console.log("Garbage collection is not exposed");
    return;
  }
  if (process.memoryUsage().heapUsed > 200000000) {
    // memory use is above 200MB
    global.gc();
  }
}

export default Cache;
