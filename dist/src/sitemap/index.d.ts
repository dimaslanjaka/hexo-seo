import Hexo from 'hexo';
import hexoIs from 'hexo-is';
import { HexoLocalsData } from 'hexo/dist/hexo/locals-d';
import { HTMLElement } from 'node-html-parser';
import { BaseConfig } from '../config';
export interface returnPageData extends HexoLocalsData {
    [key: string]: any;
    is: ReturnType<typeof hexoIs>;
}
/**
 * Extract Page Data
 * @param data
 * @returns
 */
export declare function getPageData(data: HexoLocalsData): returnPageData;
export declare function sitemap(dom: HTMLElement, HSconfig: BaseConfig, data: HexoLocalsData): void;
export default sitemap;
export declare function sitemapIndex(hexoinstance?: Hexo): void;
