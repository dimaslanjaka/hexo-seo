import Hexo from "hexo";
import parseUrl from "url-parse";
import { HexoSeo } from "./schema/article";
import "js-prototypes/src/Array";
export interface hyperlinkOptions {
    enable: boolean;
    blank: boolean;
    /**
     * Allow external link to be dofollowed
     * insert hostname or full url
     */
    allow?: string[];
}
export declare function formatAnchorText(text: string): string;
declare function fixHyperlinks(this: Hexo, content: string, data: HexoSeo): string;
/**
 * is url external link
 * @param url
 * @param hexo
 * @returns
 */
export declare function isExternal(url: ReturnType<typeof parseUrl>, hexo: Hexo): boolean;
export default fixHyperlinks;
