import md5File from "md5-file";
import path from "path";
import crypto from "crypto";
import { Objek } from "./utils";
import { memoize } from "underscore";
import { readFile } from "./fm";

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
  constructor(hash = null) {
    if (!hash) {
      const stack = new Error().stack.split("at")[2];
      hash = CacheFile.md5(stack);
    }
    const dbf = path.join(__dirname, "../tmp/db-" + hash + ".json");
    let db = readFile(dbf, { encoding: "utf8" }, {});
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
    this[key] = value;
  }
  has(key: string): boolean {
    return typeof this[key] !== undefined;
  }
  get(key: string) {
    return this[key];
  }
}

export default Cache;
