import Promise from "bluebird";
import Hexo, { TemplateLocals } from "hexo";
import { HexoSeo } from "./schema/article";
/**
 * get page full source
 * @param data
 * @returns
 */
export declare function getPagePath(data: HexoSeo | TemplateLocals): string;
export default function HexoSeoHtml(this: Hexo, content: string, data: HexoSeo): Promise<unknown>;
