/// <reference types="node" />
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
export declare type anyOf = string | object | Array<any> | number | boolean | Buffer | ObjectConstructor | Record<string, object> | Record<string, string>;
/**
 * read file nested path
 * @param filePath
 * @param options
 * @returns
 */
export declare function readFile<T extends anyOf>(filePath: string, options?: {
    encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "base64url" | "latin1" | "binary" | "hex" | null | undefined;
    flag?: string | undefined;
} | null, autocreate?: T): string | Buffer | T;
export declare function md5FileSync(path: any): string;
export declare function md5File(path: any): Promise<unknown>;
