import CleanCSS from 'clean-css';
import Hexo from 'hexo';
export type cssMinifyOptions = CleanCSS.Options & {
    enable?: boolean;
    exclude?: string[];
};
export default function HexoSeoCss(this: Hexo, str: string, data: Hexo.View): Promise<string>;
