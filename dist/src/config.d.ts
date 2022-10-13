import Hexo from "hexo";
import { hyperlinkOptions } from "./html/types";
import { imgOptions } from "./img/index.old";
import { cssMinifyOptions } from "./minifier/css";
import { MinifyOptions as htmlMinifyOptions } from "./minifier/html";
import { jsMinifyOptions } from "./minifier/js";
export interface Switcher {
    enable: boolean;
}
export interface ReturnConfig {
    sitemap: boolean;
    /**
     * Optimize js
     */
    js: jsMinifyOptions & Switcher;
    /**
     * Optimize css
     */
    css: cssMinifyOptions & Switcher;
    /**
     * Optimize image
     */
    img: imgOptions & Switcher;
    /**
     * Minimize html
     */
    html: htmlMinifyOptions & Switcher;
    /**
     * Nofollow links
     */
    links: hyperlinkOptions & Switcher;
    /**
     * Blog hostname
     */
    host: string;
    /**
     * Generate schema article
     */
    schema: {
        sitelink: Switcher;
        article: Switcher;
        breadcrumb: Switcher;
    };
}
declare const getConfig: (hexo: Hexo, _key?: string) => ReturnConfig;
export default getConfig;
