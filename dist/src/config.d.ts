import Hexo from 'hexo';
import { persistentCache } from 'sbg-utility';
import { hyperlinkOptions } from './html/types';
import { imgOptions } from './img/index.old';
import { cssMinifyOptions } from './minifier/css';
import { MinifyOptions as htmlMinifyOptions } from './minifier/html';
import { jsMinifyOptions } from './minifier/js';
import configData from './_config_data.json';
export interface Switcher {
    enable: boolean;
    searchUrl?: string;
}
/**
 * auto config produced by first parsing config
 *
 * flexible auto documented typescript schema
 */
export type AutoConfig = typeof configData;
export interface BaseConfig {
    /**
     * use cache
     */
    cache: boolean;
    /**
     * generate YoastSEO Sitemap
     */
    sitemap: boolean | {
        /** yoast seo */
        yoast: boolean;
        /** google news */
        gnews: boolean;
    };
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
        sitelink: Required<Switcher> & AutoConfig['schema']['sitelink'];
        article: Switcher & AutoConfig['schema']['article'];
        breadcrumb: Switcher & AutoConfig['schema']['breadcrumb'];
        homepage: Switcher & AutoConfig['schema']['homepage'];
    };
    /** theme directory */
    readonly theme_dir: string;
    /** source assets directory */
    readonly source_dir: string;
    /** original source post directory */
    readonly post_dir: string;
}
declare const getConfig: (hexo: Hexo, _key?: string) => BaseConfig;
/**
 * number to milliseconds
 * @param hrs
 * @param min
 * @param sec
 * @returns
 */
export declare const toMilliseconds: (hrs: number, min?: number, sec?: number) => number;
export declare const coreCache: persistentCache;
export declare const cache_key_router = "jslib";
export default getConfig;
/**
 * set mode hexo argument
 * - s = server
 * - c = clean
 * - g = generate
 * @param m
 */
export declare function setMode(m: 's' | 'g' | 'c'): void;
/**
 * get mode hexo argument
 * - s = server
 * - c = clean
 * - g = generate
 * @returns
 */
export declare const getMode: () => "c" | "g" | "s";
