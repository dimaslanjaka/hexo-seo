import parseUrl from "url-parse";
import Hexo from "hexo";
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
/**
 * is url external link
 * @param url
 * @param hexo
 * @returns
 */
export declare function isExternal(url: ReturnType<typeof parseUrl>, hexo: Hexo): boolean;
