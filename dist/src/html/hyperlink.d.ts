import { CheerioAPI } from "cheerio";
import Hexo from "hexo";
export interface hyperlinkOptions {
    /**
     * Allow external link to be dofollowed
     * insert hostname or full url
     */
    allow?: string[];
}
declare const fixHyperlinks: ($: CheerioAPI, hexo: Hexo) => CheerioAPI;
export default fixHyperlinks;
