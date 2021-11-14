import { Options as htmlMinifyOptions } from "html-minifier-terser";
import Hexo from "hexo";
import { HexoSeo } from "../html/schema/article";
export interface MinifyOptions extends htmlMinifyOptions {
    /**
     * Array of exclude patterns to exclude from minifying
     */
    exclude: string[];
}
declare const minHtml: (this: Hexo, str: string, data: HexoSeo) => Promise<string>;
export default minHtml;
