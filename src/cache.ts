import md5File from "md5-file";
import { memoize } from "underscore";
import { Objek } from "./utils";

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

export default Cache;
