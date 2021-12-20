/// <reference types="node" />
import "../packages/js-prototypes/src/String";
import "../packages/js-prototypes/src/Array";
import "../packages/js-prototypes/src/Object";
/**
 * Temp folder
 */
export declare const tmpFolder: string;
export declare const buildFolder: string;
/**
 * resolve dirname of file
 * @param filePath
 * @returns
 */
export declare function resolveFile(filePath: string): string;
/**
 * write file nested path
 * @param filePath
 */
export declare function writeFile(filePath: string, content: string): void;
/**
 * read file nested path
 * @param filePath
 * @param options
 * @returns
 */
export declare function readFile(filePath: string, options?: {
    encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "base64url" | "latin1" | "binary" | "hex" | null | undefined;
    flag?: string | undefined;
} | null, autocreate?: any): Buffer | string;
export declare function md5FileSync(path: any): string;
export declare function md5File(path: any): Promise<unknown>;
/**
 * Read Dir
 * @param folder
 * @returns
 */
export declare function readDir(folder: any): string[];
