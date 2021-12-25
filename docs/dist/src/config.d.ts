import Hexo from "hexo";
import HexoConfig from "hexo/HexoConfig";
import { jsMinifyOptions } from "./minifier/js";
import { MinifyOptions as htmlMinifyOptions } from "./minifier/html";
import { cssMinifyOptions } from "./minifier/css";
import { imgOptions } from "./img/index.old";
import { hyperlinkOptions } from "./html/types";
export interface seoOptions extends HexoConfig {
    seo?: defaultSeoOptions;
}
export interface defaultSeoOptions {
    /**
     * Optimize js
     */
    js?: boolean | jsMinifyOptions;
    /**
     * Optimize css
     */
    css?: boolean | cssMinifyOptions;
    /**
     * Optimize image
     */
    img?: boolean | imgOptions;
    /**
     * Minimize html
     */
    html?: boolean | htmlMinifyOptions;
    /**
     * Blog hostname
     */
    host?: string[];
    /**
     * Nofollow links
     */
    links?: hyperlinkOptions;
    /**
     * Generate schema article
     */
    schema?: boolean;
    sitemap?: boolean;
}
export interface ReturnConfig {
    sitemap: boolean;
    js: jsMinifyOptions;
    css: cssMinifyOptions;
    img: imgOptions;
    html: htmlMinifyOptions;
    links: hyperlinkOptions;
    host: defaultSeoOptions["host"];
    schema: boolean;
}
declare const getConfig: (hexo: Hexo, key?: string) => ReturnConfig;
export default getConfig;
