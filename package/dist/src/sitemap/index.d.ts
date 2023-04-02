import Hexo, { PageData, TemplateLocals } from 'hexo';
import hexoIs from 'hexo-is';
import { HTMLElement } from 'node-html-parser';
import { BaseConfig } from '../config';
export interface returnPageData extends PageData {
    [key: string]: any;
    is: ReturnType<typeof hexoIs>;
}
/**
 * Extract Page Data
 * @param data
 * @returns
 */
export declare function getPageData(data: TemplateLocals): returnPageData;
export declare function sitemap(dom: HTMLElement, HSconfig: BaseConfig, data: TemplateLocals): void;
export default sitemap;
export declare function sitemapIndex(hexoinstance?: Hexo): void;
