"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.releaseMemory = exports.CacheFile = void 0;
var md5_file_1 = __importStar(require("md5-file"));
var path_1 = __importDefault(require("path"));
var crypto_1 = __importDefault(require("crypto"));
var underscore_1 = require("underscore");
var fm_1 = require("./fm");
/**
 * @summary IN MEMORY CACHE
 * @description cache will be saved in memory/RAM
 */
var Cache = /** @class */ (function () {
    function Cache() {
        /**
         * Storage object for storing
         */
        this.caches = {};
    }
    /**
     * Set cache
     * @param key
     * @param value
     * @returns
     */
    Cache.prototype.set = function (key, value) {
        return this.setCache(key, value);
    };
    Cache.prototype.setCache = function (key, value) {
        this.caches[key] = value;
    };
    Cache.prototype.get = function (key, fallback) {
        return this.getCache(key, fallback);
    };
    /**
     * Get cache for given key
     * @param key
     * @param fallback fallback if key not in cache
     * @returns
     */
    Cache.prototype.getCache = function (key, fallback) {
        if (fallback === void 0) { fallback = null; }
        return this.caches[key] || fallback;
    };
    Cache.prototype.isFileChanged = function (filePath) {
        return (0, md5_file_1.default)(filePath)
            .then(function (hash1) {
            var hash = Cache.md5Cache[filePath];
            Cache.md5Cache[filePath] = hash1;
            if (!hash) {
                return true;
            }
            if (hash === hash1) {
                return false;
            }
            return true;
        })
            .catch(function (err) {
            return true;
        });
    };
    /**
     * Identifier Hash for cache
     */
    Cache.md5Cache = {};
    return Cache;
}());
/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
var CacheFile = /** @class */ (function () {
    function CacheFile(hash) {
        if (hash === void 0) { hash = null; }
        this.md5Cache = {};
        if (!hash) {
            var stack = new Error().stack.split("at")[2];
            hash = CacheFile.md5(stack);
        }
        this.dbFile = path_1.default.join(__dirname, "../tmp/db-" + hash + ".json");
        var db = (0, fm_1.readFile)(this.dbFile, { encoding: "utf8" }, {});
        if (typeof db != "object") {
            db = JSON.parse(db.toString());
        }
        if (typeof db == "object") {
            this.md5Cache = db;
        }
    }
    CacheFile.prototype.setCache = function (key, value) {
        return this.set(key, value);
    };
    CacheFile.prototype.set = function (key, value) {
        this.md5Cache[key] = value;
        (0, fm_1.writeFile)(this.dbFile, JSON.stringify(this.md5Cache));
    };
    CacheFile.prototype.has = function (key) {
        return typeof this.md5Cache[key] !== undefined;
    };
    /**
     * Get cache by key
     * @param key
     * @param fallback
     * @returns
     */
    CacheFile.prototype.get = function (key, fallback) {
        if (fallback === void 0) { fallback = null; }
        var Get = this.md5Cache[key];
        if (Get === undefined)
            return fallback;
        return Get;
    };
    CacheFile.prototype.getCache = function (key, fallback) {
        if (fallback === void 0) { fallback = null; }
        return this.get(key, fallback);
    };
    /**
     * Check file is changed with md5 algorithm
     * @param path0
     * @returns
     */
    CacheFile.prototype.isFileChanged = function (path0) {
        // get md5 hash from path0
        var pathMd5 = (0, md5_file_1.sync)(path0);
        // get index hash
        var savedMd5 = this.md5Cache[path0 + "-hash"];
        var result = savedMd5 != pathMd5;
        if (!result) {
            // set, if file hash is not found
            this.md5Cache[path0 + "-hash"] = pathMd5;
        }
        return result;
    };
    CacheFile.md5 = (0, underscore_1.memoize)(function (data) {
        return crypto_1.default.createHash("md5").update(data).digest("hex");
    });
    return CacheFile;
}());
exports.CacheFile = CacheFile;
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
exports.releaseMemory = releaseMemory;
exports.default = Cache;
