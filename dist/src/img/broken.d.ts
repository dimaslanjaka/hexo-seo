import { HexoSeo } from "../html/schema/article";
import Hexo from "packages/@types/hexo";
import Promise from "bluebird";
/**
 * is local image
 */
export declare const isLocalImage: (url: string) => boolean;
/**
 * Broken image fix
 * @param img
 */
export default function (this: Hexo, content: string, data: HexoSeo): Promise<string>;
