import { Objek } from "./utils";
/**
 * IN MEMORY CACHE PROCESSOR, Save any values in RAM as caches.
 * - Reduce CPU Usage
 * - Reduce Resource Usage
 */
export default class {
    /**
     * Storage object for storing
     */
    caches: Objek;
    /**
     * Identifier Hash for cache
     */
    md5Cache: Objek;
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
