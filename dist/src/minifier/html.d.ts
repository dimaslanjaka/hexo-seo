import bluebird from "bluebird";
import Hexo from "hexo";
import { Options as htmlMinifyOptions } from "html-minifier-terser";
export interface MinifyOptions extends htmlMinifyOptions {
    /**
     * Fix html
     */
    fix?: boolean;
    /**
     * Array of exclude patterns to exclude from minifying
     */
    exclude: string[];
}
declare const minHtml: (this: Hexo) => bluebird<any[]>;
export default minHtml;
