import md5File, { sync as md5FileSync } from "md5-file";
import path from "path";
import crypto from "crypto";
import { Objek } from "./utils";
import { memoize } from "underscore";
import { readFile, writeFile } from "./fm";

/**
 * IN MEMORY CACHE PROCESSOR, Save any values in RAM as caches.
 * - Reduce CPU Usage
 * - Reduce Resource Usage
 */
class Cache {
  /**
   * Storage object for storing
   */
  caches: Objek = {};

  /**
   * Identifier Hash for cache
   */
  static md5Cache: Objek = {};

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
    this.caches[key] = value;
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
    return this.caches[key] || fallback;
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
      .catch((err) => {
        return true;
      });
  }
}

/**
 * Save cache to file, cache will be restored on next process restart
 */
export class CacheFile {
  md5Cache: Objek = {};
  dbFile: string;
  constructor(hash = null) {
    if (!hash) {
      const stack = new Error().stack.split("at")[2];
      hash = CacheFile.md5(stack);
    }
    this.dbFile = path.join(__dirname, "../tmp/db-" + hash + ".json");
    let db = readFile(this.dbFile, { encoding: "utf8" }, {});
    if (typeof db != "object") {
      db = JSON.parse(db.toString());
    }
    if (typeof db == "object") {
      this.md5Cache = db;
    }
  }
  static md5 = memoize((data: string): string => {
    return crypto.createHash("md5").update(data).digest("hex");
  });
  set(key: string, value: any): void {
    this.md5Cache[key] = value;
    writeFile(this.dbFile, JSON.stringify(this.md5Cache));
  }
  has(key: string): boolean {
    return typeof this.md5Cache[key] !== undefined;
  }

  /**
   * Get cache by key
   * @param key
   * @param fallback
   * @returns
   */
  get<T extends keyof any>(key: string, fallback: T = null) {
    const Get = this.md5Cache[key];
    if (Get === undefined) return fallback;
    return Get;
  }

  /**
   * Check file is changed with md5 algorithm
   * @param path0
   * @returns
   */
  isFileChanged(path0: string) {
    // get md5 hash from path0
    const pathMd5 = md5FileSync(path0);
    // get index hash
    const savedMd5 = this.md5Cache[path0 + "-hash"];
    const result = savedMd5 == pathMd5;
    if (!result) {
      // set, if file hash is not found
      this.md5Cache[path0 + "-hash"] = pathMd5;
    }
    return result;
  }
}

/**
 * Release memories
 */
export function releaseMemory() {
  if (process.memoryUsage().heapUsed > 200000000) {
    // memory use is above 200MB
    global.gc();
  }
}

export default Cache;
