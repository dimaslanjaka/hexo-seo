/// <reference types="bluebird" />
/**
 * @summary IN MEMORY CACHE
 * @description cache will be saved in memory/RAM
 */
declare class Cache {
    /**
     * Identifier Hash for cache
     */
    static md5Cache: Record<string, any>;
    /**
     * Set cache
     * @param key
     * @param value
     * @returns
     */
    set(key: string, value: any): boolean;
    setCache(key: string, value: any): boolean;
    get(key: string, fallback?: any): any;
    /**
     * Get cache for given key
     * @param key
     * @param fallback fallback if key not in cache
     * @returns
     */
    getCache(key: string, fallback?: any): any;
    isFileChanged(filePath: string): import("bluebird")<boolean>;
}
/**
 * Transform any variable to string
 * @param variable
 * @returns
 */
export declare function resolveString(variable: any, _encode?: boolean): void;
/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
export declare class CacheFile {
    md5Cache: Record<string, any>;
    dbFile: string;
    constructor(hash?: any);
    setCache(key: string, value: any): void;
    set(key: string, value: any): void;
    has(key: string): boolean;
    /**
     * Get cache by key
     * @param key
     * @param fallback
     * @returns
     */
    get<T>(key: string, fallback?: T): T;
    /**
     * alias {get}
     * @param key
     * @param fallback
     * @returns
     */
    getCache<T>(key: string, fallback?: T): T;
    /**
     * Check file is changed with md5 algorithm
     * @param path0
     * @returns
     */
    isFileChanged(path0: string): boolean;
}
/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
export declare class CacheFile2 {
    md5Cache: Record<string, any>;
    /**
     * temporary cache
     */
    dbTemp: Record<string, any>;
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
    getKeyLocation(key: string): string;
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
