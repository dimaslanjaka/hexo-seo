"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var md5_file_1 = __importDefault(require("md5-file"));
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
exports.default = Cache;
