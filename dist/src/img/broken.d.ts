import { HexoSeo } from "../html/schema/article";
import Hexo from "hexo";
/**
 * is local image
 */
export declare const isLocalImage: (url: string) => boolean;
/**
 * Broken image fix
 * @param img
 */
export default function (this: Hexo, content: string, data: HexoSeo): void;
