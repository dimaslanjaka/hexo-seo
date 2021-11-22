import md5File, { sync as md5FileSync } from "md5-file";
import path from "path";
import crypto from "crypto";
import { Objek } from "./utils";
import { memoize } from "underscore";
import { readFile, tmpFolder, writeFile } from "./fm";
import logger from "./log";
import scheduler from "./scheduler";
import { existsSync } from "fs";
import NodeCache from "node-cache";

/**
 * @summary IN MEMORY CACHE
 * @description cache will be saved in memory/RAM
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
 * Transform any variable to string
 * @param variable
 * @returns
 */
export function resolveString(variable: any, encode = false) {
  if (typeof variable === "number") variable = variable.toString();
  if (Buffer.isBuffer(variable)) variable = variable.toString();
}

const myCache = new NodeCache({ stdTTL: 500, checkperiod: 520 });

/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
export class CacheFile {
  md5Cache: Objek = {};
  dbFile: string;
  cacheHash = "";
  constructor(hash = null) {
    const stack = new Error().stack.split("at")[2];
    hash = hash + CacheFile.md5(stack);
    this.cacheHash = hash;
    this.dbFile = path.join(__dirname, "../tmp/db-" + hash + ".json");
    let db = readFile(this.dbFile, { encoding: "utf8" }, {});
    if (typeof db != "object") {
      try {
        db = JSON.parse(db.toString());
      } catch (e) {
        logger.error("cache database lost");
        logger.error(e);
      }
    }
    if (typeof db == "object") {
      this.md5Cache = db;
    }
  }

  set(key: string, value: any) {
    return myCache.set(key, value);
    /*// if value is string, save to static file
    if (typeof value === "string") {
      // usually tags, archives, categories don't have paths for keys
      // generate based on value
      if (!key) {
        key = CacheFile.md5(value);
      }
      let saveLocation;
      if (key.startsWith("/")) {
        saveLocation = path.join(
          tmpFolder,
          // pick the dirname to make sure all files in one group
          CacheFile.md5(path.dirname(key)),
          path.basename(key)
        );
      } else {
        saveLocation = path.join(
          tmpFolder,
          CacheFile.md5(key),
          path.basename(key)
        );
      }
      this.md5Cache[key + "-fileCache"] = value;
      this.md5Cache[key] = "file://" + saveLocation;
      // save cache on process exit
      scheduler.add("writeStaticCacheFile" + this.cacheHash, () => {
        console.log(this.cacheHash, "Saving cache to disk...");
        writeFile(this.dbFile, JSON.stringify(this.md5Cache));
        writeFile(saveLocation, value);
      });
      return;
    }
    this.md5Cache[key] = value;
    // save cache on process exit
    scheduler.add(
      "writeCacheFile" + CacheFile.md5(this.cacheHash + key),
      () => {
        // clone md5 caches
        const md5Cache = this.md5Cache;
        // delete keys with suffix -fileCache
        for (const k in md5Cache) {
          if (k.endsWith("-fileCache")) {
            console.log("delete file cache", k.replace("-fileCache", ""));
            delete md5Cache[k];
          }
        }
        console.log(this.cacheHash, "Saving cache to disk...");
        writeFile(this.dbFile, JSON.stringify(md5Cache));
      }
    );*/
  }
  /**
   * Get cache by key
   * @param key
   * @param fallback
   * @returns
   */
  get<T extends keyof any>(key: string, fallback: T = null): T {
    const Get = myCache.get(key);
    if (!Get) return fallback;
    /*const Get = this.md5Cache[key];
    if (Get === undefined) return fallback;
    if (typeof Get == "string") {
      if (Get.startsWith("file://")) {
        const loadLocation = Get.replace("file://", "");
        // if cache content exists, return it. Otherwise, read, bind and return it
        if (typeof this.md5Cache[key + "-fileCache"] != "undefined") {
          return this.md5Cache[key + "-fileCache"];
        }
        if (existsSync(loadLocation)) {
          const loadContent = readFile(loadLocation).toString();
          this.md5Cache[key + "-fileCache"] = loadContent;
          return loadContent;
        } else {
          throw new Error("cache " + loadLocation + " not found");
        }
      }
    }
    return Get;*/
  }
  has(key: string): boolean {
    return typeof this.md5Cache[key] !== undefined;
  }
  getCache<T extends keyof any>(key: string, fallback: T = null): T {
    return this.get(key, fallback);
  }
  static md5 = memoize((data: string): string => {
    return crypto.createHash("md5").update(data).digest("hex");
  });
  setCache(key: string, value: any) {
    return this.set(key, value);
  }
  /**
   * Check file is changed with md5 algorithm
   * @param path0
   * @returns
   */
  isFileChanged(path0: string): boolean {
    if (typeof path0 != "string") {
      //console.log("", typeof path0, path0);
      return true;
    }
    // get md5 hash from path0
    const pathMd5 = md5FileSync(path0);
    // get index hash
    const savedMd5 = this.md5Cache[path0 + "-hash"];
    const result = savedMd5 != pathMd5;
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
