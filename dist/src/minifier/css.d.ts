import CleanCSS from 'clean-css';
import Hexo from 'hexo';
import { HexoLocalsData } from 'hexo/dist/hexo/locals-d';
export type cssMinifyOptions = CleanCSS.Options & {
    enable?: boolean;
    exclude?: string[];
};
export default function HexoSeoCss(this: Hexo, str: string, data: HexoLocalsData): Promise<string>;
