import { Options as htmlMinifyOptions } from "html-minifier-terser";
import Hexo from "hexo";
import bluebird from "bluebird";
export interface MinifyOptions extends htmlMinifyOptions {
    /**
     * Array of exclude patterns to exclude from minifying
     */
    exclude: string[];
}
declare const minHtml: (this: Hexo) => bluebird<string[]>;
export default minHtml;
