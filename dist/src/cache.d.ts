import { Objek } from "./utils";
/**
 * IN MEMORY CACHE PROCESSOR, Save any values in RAM as caches.
 * - Reduce CPU Usage
 * - Reduce Resource Usage
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
 * Save cache to file, cache will be restored on next process restart
 */
export declare class CacheFile {
    md5Cache: Objek;
    constructor(hash?: any);
    static md5: (data: string) => string;
    set(key: string, value: any): void;
    has(key: string): boolean;
    get(key: string): any;
}
export default Cache;
