import { Objek } from "./utils";
import "../packages/js-prototypes/src/Any";
/**
 * @summary IN MEMORY CACHE
 * @description cache will be saved in memory/RAM
 */
declare class Cache {
    /**
     * Storage object for storing
     */
    caches: Objek;
    /**
     * Identifier Hash for cache
     */
    static md5Cache: Objek;
    /**
     * Set cache
     * @param key
     * @param value
     * @returns
     */
    set(key: string, value: any): void;
    setCache(key: string, value: any): void;
    get(key: string, fallback?: any): any;
    /**
     * Get cache for given key
     * @param key
     * @param fallback fallback if key not in cache
     * @returns
     */
    getCache(key: string, fallback?: any): any;
    isFileChanged(filePath: string): Promise<boolean>;
}
/**
 * Transform any variable to string
 * @param variable
 * @returns
 */
export declare function resolveString(variable: any, encode?: boolean): void;
/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
export declare class CacheFile {
    md5Cache: Objek;
    /**
     * temporary cache
     */
    dbTemp: Objek;
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
    cacheHash: string;
    constructor(hash?: any);
    set(key: string, value: any): void;
    /**
     * Get cache by key
     * @param key
     * @param fallback
     * @returns
     */
    get(key: string, fallback?: any): any;
    has(key: string): boolean;
    getCache(key: string, fallback?: any): any;
    static md5: (data: string) => string;
    setCache(key: string, value: any): void;
    /**
     * Check file is changed with md5 algorithm
     * @param path0
     * @returns
     */
    isFileChanged(path0: string): boolean;
}
/**
 * Release memories
 */
export declare function releaseMemory(): void;
export default Cache;
