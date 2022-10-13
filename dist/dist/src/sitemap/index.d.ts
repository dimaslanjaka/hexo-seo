import Hexo, { PageData, TemplateLocals } from "hexo";
import { HTMLElement } from "node-html-parser";
import { ReturnConfig } from "../config";
import { HexoIs } from "packages/hexo-is/dist/is";
export interface returnPageData extends PageData {
    [key: string]: any;
    is: HexoIs;
}
/**
 * Extract Page Data
 * @param data
 * @returns
 */
export declare function getPageData(data: TemplateLocals): returnPageData;
export declare function sitemap(dom: HTMLElement, HSconfig: ReturnConfig, data: TemplateLocals): void;
export default sitemap;
export declare function sitemapIndex(hexoinstance?: Hexo): void;
