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
/**
 * read file nested path
 * @param filePath
 * @param options
 * @returns
 */
export declare function readFile(filePath: string, options?: {
    encoding?: "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "base64url" | "latin1" | "binary" | "hex" | null | undefined;
    flag?: string | undefined;
} | null, autocreate?: boolean | undefined): string | Buffer;
