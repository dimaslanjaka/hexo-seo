export interface Objek extends Object {
    [key: string]: any;
}
/**
 * is ignore pattern matching?
 */
export declare const isIgnore: (path0: string, exclude: string | string[], hexo?: Hexo) => boolean;
/**
 * Simplify object data / delete object key
 * @param data
 */
export declare function extractSimplePageData(data: any, additional?: any[]): any;
/**
 * Dump once
 * @param filename
 * @param obj
 */
export declare function dumpOnce(filename: string, ...obj: any): void;
/**
 * Dump large objects
 * @param filename
 * @param obj
 */
export declare const dump: (filename: string, ...obj: any) => void;
/**
 * get cache folder location
 * @param folderName
 * @returns
 */
export declare function getCacheFolder(folderName?: string): string;
/**
 * get current package folder
 * @returns
 */
export declare function getPackageFolder(): string;
/**
 * Get current package file
 * @param name
 * @returns
 */
export declare function getPackageFile(pathname: string): string;
