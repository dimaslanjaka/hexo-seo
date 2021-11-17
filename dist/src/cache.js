"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheFile = void 0;
var md5_file_1 = __importDefault(require("md5-file"));
var path_1 = __importDefault(require("path"));
var crypto_1 = __importDefault(require("crypto"));
var underscore_1 = require("underscore");
var fm_1 = require("./fm");
/**
 * IN MEMORY CACHE PROCESSOR, Save any values in RAM as caches.
 * - Reduce CPU Usage
 * - Reduce Resource Usage
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
 * Save cache to file, cache will be restored on next process restart
 */
var CacheFile = /** @class */ (function () {
    function CacheFile(hash) {
        if (hash === void 0) { hash = null; }
        this.md5Cache = {};
        if (!hash) {
            var stack = new Error().stack.split("at")[2];
            hash = CacheFile.md5(stack);
        }
        var dbf = path_1.default.join(__dirname, "../tmp/db-" + hash + ".json");
        var db = (0, fm_1.readFile)(dbf, { encoding: "utf8" }, {});
        if (typeof db != "object") {
            db = JSON.parse(db.toString());
        }
        if (typeof db == "object") {
            this.md5Cache = db;
        }
    }
    CacheFile.prototype.set = function (key, value) {
        this[key] = value;
    };
    CacheFile.prototype.has = function (key) {
        return typeof this[key] !== undefined;
    };
    CacheFile.prototype.get = function (key) {
        return this[key];
    };
    CacheFile.md5 = (0, underscore_1.memoize)(function (data) {
        return crypto_1.default.createHash("md5").update(data).digest("hex");
    });
    return CacheFile;
}());
exports.CacheFile = CacheFile;
exports.default = Cache;
