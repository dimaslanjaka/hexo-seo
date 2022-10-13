import { Options as htmlMinifyOptions } from "html-minifier-terser";
import Hexo from "hexo";
import bluebird from "bluebird";
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
