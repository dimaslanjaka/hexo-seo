import CleanCSS from "clean-css";
import Hexo from "hexo";
export declare type cssMinifyOptions = CleanCSS.Options & {
    exclude?: string[];
};
export default function (this: Hexo, str: string, data: Hexo.View): Promise<string>;
