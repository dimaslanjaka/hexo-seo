import Hexo from 'hexo';
import hexoIs from 'hexo-is';
import { HexoLocalsData } from 'hexo/dist/hexo/locals-d';
import moment from 'moment';
import { HTMLElement } from 'node-html-parser';
import { BaseConfig } from '../config';
export interface returnPageData extends HexoLocalsData {
    [key: string]: any;
    is: ReturnType<typeof hexoIs>;
    title?: string;
    date?: moment.Moment;
    updated?: moment.Moment;
    published?: boolean;
    canonical_path?: string;
    lang?: string;
    language?: string;
}
/**
 * Extract Page Data
 * @param data
 * @returns
 */
export declare function getPageData(data: HexoLocalsData): returnPageData;
/**
 * process sitemap of page
 */
export declare function sitemap(dom: HTMLElement, hexoSeoConfig: BaseConfig, data: HexoLocalsData): void;
export default sitemap;
/** generate YoastSeo index sitemap */
export declare function generateSitemapIndex(hexoinstance?: Hexo): void;
