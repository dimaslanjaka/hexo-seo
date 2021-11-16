/// <reference types="node" />
import { CheerioAPI } from "cheerio";
import Hexo from "hexo";
/**
 * Get buffer from source
 * @param src
 * @param hexo
 * @returns
 */
export declare const getBuffer: (src: Buffer | string, hexo: Hexo) => Buffer;
/**
 * Image buffer to base64 encoded
 * @param buffer
 * @returns
 */
export declare const imageBuffer2base64: (buffer: Buffer) => Promise<string>;
export default function ($: CheerioAPI, hexo: Hexo): Promise<CheerioAPI>;
