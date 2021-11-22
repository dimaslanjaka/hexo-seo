import Hexo from "hexo";
import { HexoSeo } from "./schema/article";
import "../../packages/js-prototypes/src/Array";
export interface hyperlinkOptions {
    enable: boolean;
    blank: boolean;
    /**
     * Allow external link to be dofollowed
     * insert hostname or full url
     */
    allow?: string[];
}
declare function fixHyperlinks(this: Hexo, content: string, data: HexoSeo): string;
export default fixHyperlinks;
