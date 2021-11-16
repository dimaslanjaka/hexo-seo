import Hexo from "hexo";
export interface hyperlinkOptions {
    /**
     * Allow external link to be dofollowed
     * insert hostname or full url
     */
    allow?: string[];
}
declare const fixHyperlinks: (this: Hexo, content: string, data: Hexo.Locals.Page) => string;
export default fixHyperlinks;
