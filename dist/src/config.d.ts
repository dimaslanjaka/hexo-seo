import Hexo from 'hexo';
import { hyperlinkOptions } from './html/types';
import { imgOptions } from './img/index.old';
import { cssMinifyOptions } from './minifier/css';
import { MinifyOptions as htmlMinifyOptions } from './minifier/html';
import { jsMinifyOptions } from './minifier/js';
import configData from './_config_data.json';
export interface Switcher {
    enable: boolean;
}
export type AutoConfig = typeof configData;
export interface BaseConfig {
    /**
     * use cache
     */
    cache: boolean;
    /**
     * generate YoastSEO Sitemap
     */
    sitemap: boolean;
    /**
     * Optimize js
     */
    js: jsMinifyOptions & Switcher & AutoConfig['js'] & {
        /**
         * concatenate js files
         */
        concat?: boolean;
    };
    /**
     * Optimize css
     */
    css: cssMinifyOptions & Switcher & AutoConfig['css'];
    /**
     * Optimize image
     */
    img: imgOptions & Switcher & AutoConfig['img'];
    /**
     * Minimize html
     */
    html: htmlMinifyOptions & Switcher & AutoConfig['html'];
    /**
     * Nofollow links
     */
    links: hyperlinkOptions & Switcher & AutoConfig['links'];
    /**
     * Blog hostname
     */
    host: string;
    /**
     * Generate schema article
     */
    schema: {
        sitelink: Switcher & AutoConfig['schema']['sitelink'];
        article: Switcher & AutoConfig['schema']['article'];
        breadcrumb: Switcher & AutoConfig['schema']['breadcrumb'];
    };
}
declare const getConfig: (hexo: Hexo, _key?: string) => BaseConfig;
export default getConfig;
