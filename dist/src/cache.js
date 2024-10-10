"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheFile2 = exports.CacheFile = void 0;
exports.resolveString = resolveString;
exports.releaseMemory = releaseMemory;
const fs_extra_1 = require("fs-extra");
const node_cache_1 = __importDefault(require("node-cache"));
const sbg_utility_1 = require("sbg-utility");
const upath_1 = __importDefault(require("upath"));
const fm_1 = require("./fm");
const log_1 = __importDefault(require("./log"));
const md5_file_1 = __importStar(require("./utils/md5-file"));
const myCache = new node_cache_1.default({ stdTTL: 500, checkperiod: 520 });
/**
 * @summary IN MEMORY CACHE
 * @description cache will be saved in memory/RAM
 */
class Cache {
    /**
     * Set cache
     * @param key
     * @param value
     * @returns
     */
    set(key, value) {
        return this.setCache(key, value);
    }
    setCache(key, value) {
        if (!key || !value)
            return;
        if (!key)
            key = (0, md5_file_1.md5)(value);
        return myCache.set(key, value);
    }
    get(key, fallback) {
        return this.getCache(key, fallback);
    }
    /**
     * Get cache for given key
     * @param key
     * @param fallback fallback if key not in cache
     * @returns
     */
    getCache(key, fallback = null) {
        return myCache.get(key) || fallback;
    }
    isFileChanged(filePath) {
        return (0, md5_file_1.default)(filePath)
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
 * Identifier Hash for cache
 */
Cache.md5Cache = {};
/**
 * Transform any variable to string
 * @param variable
 * @returns
 */
function resolveString(variable, _encode = false) {
    if (typeof variable === 'number')
        variable = variable.toString();
    if (Buffer.isBuffer(variable))
        variable = variable.toString();
}
/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
class CacheFile {
    constructor(hash = null) {
        this.md5Cache = {};
        if (!hash) {
            const stack = new Error().stack.split('at')[2];
            hash = (0, md5_file_1.md5)(stack);
        }
        this.dbFile = upath_1.default.join(fm_1.tmpFolder, 'db-' + hash + '.json');
        let db = (0, fm_1.readFile)(this.dbFile, { encoding: 'utf8' }, {});
        if (typeof db != 'object') {
            try {
                db = JSON.parse(db.toString());
            }
            catch (e) {
                log_1.default.error('cache database lost');
                log_1.default.error(e);
            }
        }
        if (typeof db == 'object') {
            this.md5Cache = db;
        }
    }
    setCache(key, value) {
        return this.set(key, value);
    }
    set(key, value) {
        this.md5Cache[key] = value;
        // save cache on process exit
        (0, sbg_utility_1.bindProcessExit)('writeCacheFile', () => {
            log_1.default.log('saved cache', this.dbFile);
            (0, sbg_utility_1.writefile)(this.dbFile, JSON.stringify(this.md5Cache));
        });
    }
    has(key) {
        return typeof this.md5Cache[key] !== 'undefined';
    }
    /**
     * Get cache by key
     * @param key
     * @param fallback
     * @returns
     */
    get(key, fallback = null) {
        const Get = this.md5Cache[key];
        if (Get === undefined)
            return fallback;
        return Get;
    }
    /**
     * alias {get}
     * @param key
     * @param fallback
     * @returns
     */
    getCache(key, fallback = null) {
        return this.get(key, fallback);
    }
    /**
     * Check file is changed with md5 algorithm
     * @param path0
     * @returns
     */
    isFileChanged(path0) {
        if (typeof path0 != 'string') {
            //console.log("", typeof path0, path0);
            return true;
        }
        try {
            // get md5 hash from path0
            const pathMd5 = (0, md5_file_1.sync)(path0);
            // get index hash
            const savedMd5 = this.md5Cache[path0 + '-hash'];
            const result = savedMd5 != pathMd5;
            if (result) {
                // set, if file hash is not found
                this.md5Cache[path0 + '-hash'] = pathMd5;
            }
            return result;
        }
        catch (e) {
            return true;
        }
    }
}
exports.CacheFile = CacheFile;
/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
class CacheFile2 {
    constructor(hash = null) {
        this.md5Cache = {};
        /**
         * temporary cache
         */
        this.dbTemp = {};
        /**
         * Unique cache id
         */
        this.cacheHash = '';
        const stack = new Error().stack.split('at')[2];
        hash = hash + '-' + (0, md5_file_1.md5)(stack);
        this.cacheHash = hash;
        this.dbFile = upath_1.default.join(fm_1.buildFolder, 'db-' + hash + '.json');
        this.dbFolder = upath_1.default.join(fm_1.buildFolder, hash);
        let db = (0, fm_1.readFile)(this.dbFile, { encoding: 'utf8' }, {});
        if (typeof db != 'object') {
            try {
                db = JSON.parse(db.toString());
            }
            catch (e) {
                log_1.default.error('cache database lost');
                log_1.default.error(e);
            }
        }
        if (typeof db == 'object') {
            this.md5Cache = db;
        }
    }
    getKeyLocation(key) {
        if (key.startsWith('/')) {
            key = upath_1.default.join((0, md5_file_1.md5)(upath_1.default.dirname(key)), upath_1.default.basename(key));
        }
        return upath_1.default.join(this.dbFolder, key);
    }
    set(key, value) {
        if (!key && !value) {
            return;
        }
        else if (!key) {
            key = (0, md5_file_1.md5)(value);
        }
        const saveLocation = this.getKeyLocation(key);
        this.md5Cache[key] = saveLocation;
        const dbLocation = upath_1.default.join(this.dbFile);
        const db = this.md5Cache;
        //dump("cache-" + this.cacheHash, db);
        (0, sbg_utility_1.bindProcessExit)('save-' + this.cacheHash, function () {
            log_1.default.log('saving caches...', saveLocation, dbLocation);
            (0, sbg_utility_1.writefile)(saveLocation, value);
            (0, sbg_utility_1.writefile)(dbLocation, JSON.stringify(db, null, 2));
        });
        this.dbTemp[key] = value;
    }
    /**
     * Get cache by key
     * @param key
     * @param fallback
     * @returns
     */
    get(key, fallback = null) {
        if (typeof this.dbTemp[key] == 'undefined') {
            const saveLocation = this.getKeyLocation(key);
            if ((0, fs_extra_1.existsSync)(saveLocation)) {
                const readCache = (0, fm_1.readFile)(saveLocation).toString();
                this.dbTemp[key] = readCache;
                return readCache;
            }
            if (typeof fallback === 'function')
                return fallback();
            return fallback;
        }
        return this.dbTemp[key];
    }
    has(key) {
        return typeof this.md5Cache[key] !== 'undefined';
    }
    getCache(key, fallback = null) {
        return this.get(key, fallback);
    }
    setCache(key, value) {
        return this.set(key, value);
    }
    /**
     * Check file is changed with md5 algorithm
     * @param path0
     * @returns
     */
    isFileChanged(path0) {
        if (typeof path0 != 'string') {
            //console.log("", typeof path0, path0);
            return true;
        }
        // get md5 hash from path0
        const pathMd5 = (0, md5_file_1.sync)(path0);
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
exports.CacheFile2 = CacheFile2;
/**
 * Release memories
 */
function releaseMemory() {
    if (!global.gc) {
        //console.log("Garbage collection is not exposed");
        return;
    }
    if (process.memoryUsage().heapUsed > 200000000) {
        // memory use is above 200MB
        global.gc();
    }
}
exports.default = Cache;
