import { HexoSeo } from "../html/schema/article";
import Hexo from "hexo";
import Promise from "bluebird";
/**
 * is local image
 */
export declare const isLocalImage: (url: string) => boolean;
declare const new_src: {
    original: any;
    resolved: any;
    success: boolean;
};
/**
 * check broken image with caching strategy
 * @param src
 * @param defaultImg
 * @returns
 */
export declare const checkBrokenImg: (src: string, defaultImg?: string) => Promise<typeof new_src>;
/**
 * Broken image fix
 * @param img
 */
export default function (this: Hexo, content: string, data: HexoSeo): Promise<string>;
export {};
