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
declare const seoImage: (content: string, hexo: Hexo) => Promise<string>;
export default seoImage;
