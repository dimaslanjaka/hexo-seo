import Hexo from 'hexo';
import { MinifyOptions } from 'terser';
export interface jsMinifyOptions {
    /**
     * exclude js patterns from minifying
     */
    exclude?: string[];
    options?: MinifyOptions;
}
export default function HexoSeoJs(this: Hexo, str: string, data: Hexo.View): Promise<string>;
