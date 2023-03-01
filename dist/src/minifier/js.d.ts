import Hexo from 'hexo';
import { MinifyOptions } from 'terser';
export interface jsMinifyOptions {
    /**
     * exclude js patterns from minifying
     */
    exclude?: string[];
    options?: MinifyOptions;
}
/**
 * minify js
 * @param this
 * @param str
 * @param data
 * @returns
 */
export default function HexoSeoJs(this: Hexo, str: string, data: Hexo.View | {
    path: string;
}): Promise<string>;
/**
 * minify js
 * @param str
 * @param options
 * @returns
 */
export declare function minifyJS(str: string, options: MinifyOptions): Promise<string>;
