import Hexo from "hexo";
import { MinifyOptions } from "terser";
export interface jsMinifyOptions extends MinifyOptions {
    /**
     * exclude js patterns from minifying
     */
    exclude: string[];
}
export default function (this: Hexo, str: string, data: Hexo.View): Promise<string>;
