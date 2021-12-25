import Hexo, { PageData, TemplateLocals } from "hexo";
import { HexoIs } from "../hexo/hexo-is/is";
import { HTMLElement } from "node-html-parser";
import { ReturnConfig } from "../config";
import "js-prototypes";
export interface returnPageData extends PageData {
    [key: string]: any;
    is: HexoIs;
}
/**
 * Extract Page Data
 * @param data
 * @returns
 */
export declare function getPageData(data: TemplateLocals): returnPageData | undefined;
export declare function sitemap(dom: HTMLElement, HSconfig: ReturnConfig, data: TemplateLocals): void;
export default sitemap;
export declare function sitemapIndex(hexoinstance?: Hexo): void;
