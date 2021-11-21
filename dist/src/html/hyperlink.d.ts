import Hexo from "hexo";
import { HexoSeo } from "./schema/article";
export interface hyperlinkOptions {
    /**
     * Allow external link to be dofollowed
     * insert hostname or full url
     */
    allow?: string[];
}
declare const fixHyperlinks: (this: Hexo, content: string, data: HexoSeo) => string;
export default fixHyperlinks;
