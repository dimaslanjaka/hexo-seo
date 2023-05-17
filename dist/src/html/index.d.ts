import Hexo from 'hexo';
import { HexoLocalsData } from 'hexo/dist/hexo/locals-d';
import { HexoSeo } from './schema/article';
/**
 * get page full source
 * @param data
 * @returns
 */
export declare function getPagePath(data: HexoSeo | HexoLocalsData): any;
export default function HexoSeoHtml(this: Hexo, content: string, data: HexoSeo): Promise<string>;
