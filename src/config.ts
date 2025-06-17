import { deepmerge } from 'deepmerge-ts';
import Hexo from 'hexo';
import { persistentCache, writefile } from 'sbg-utility';
import path from 'upath';
import configData from './_config_data.json';
import { tmpFolder } from './fm';
import { isDev } from './hexo-seo';
import { hyperlinkOptions } from './html/types';
import { imgOptions } from './img/index.old';
import { cssMinifyOptions } from './minifier/css';
import { MinifyOptions as htmlMinifyOptions } from './minifier/html';
import { jsMinifyOptions } from './minifier/js';

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
  sitemap:
    | boolean
    | {
        /** yoast seo */
        yoast: boolean;
        /** google news */
        gnews: boolean;
      };
  /**
   * Optimize js
   */
  js: jsMinifyOptions &
    Switcher &
    AutoConfig['js'] & {
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
  /** generated public directory */
  readonly public_dir: string;
  /** original source post directory */
  readonly post_dir: string;
  /** hexo seo cli search options */
  search: {
    type: string[];
  };
  /** hexo seo cli feed options */
  feed: {
    type: string[];
    icon: string;
  };
}

//const cache = persistentCache({ persist: true, name: "hexo-seo", base: join(process.cwd(), "tmp") });

const getConfig = function (hexo: Hexo, _key = 'config-hexo-seo') {
  const defaultOpt: BaseConfig = {
    cache: true,
    js: { enable: false, concat: false, exclude: ['*.min.js'] } as any,
    css: { enable: false, exclude: ['*.min.css'] } as any,
    html: {
      enable: false,
      fix: false,
      exclude: [],
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      // Ignore '<!-- more -->' https://hexo.io/docs/tag-plugins#Post-Excerpt
      ignoreCustomComments: [/^\s*more/],
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true
    } as any,
    img: {
      enable: false,
      default:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png',
      onerror: 'clientside'
    } as any,
    host: new URL(hexo.config.url).host,
    links: {
      blank: true,
      enable: true,
      allow: ['webmanajemen.com']
    } as any,
    schema: {
      sitelink: {
        enable: false
      },
      article: { enable: false },
      breadcrumb: { enable: false }
    } as any,
    sitemap: false,
    theme_dir: path.join(process.cwd(), 'themes', String(hexo.config.theme || 'landscape')),
    source_dir: path.join(process.cwd(), String(hexo.config.source_dir || 'source')),
    public_dir: path.join(process.cwd(), String(hexo.config.public_dir || 'public')),
    post_dir: path.join(process.cwd(), String(hexo.config.source_dir || 'source'), '_posts'),
    search: {
      type: ['post', 'page']
    },
    feed: {
      type: ['post', 'page'],
      icon: 'https://w7.pngwing.com/pngs/745/306/png-transparent-gallery-image-images-photo-picture-pictures-set-app-incredibles-icon-thumbnail.png'
    }
  };
  const seo: BaseConfig = hexo.config.seo;
  writefile(path.join(__dirname, '_config_data.json'), JSON.stringify(seo, null, 2));
  if (typeof seo === 'undefined') return <BaseConfig>defaultOpt;
  return deepmerge(defaultOpt, seo, {
    // disable cache on dev
    cache: isDev ? false : seo.cache || defaultOpt.cache
  }) as BaseConfig;
};

/**
 * number to milliseconds
 * @param hrs
 * @param min
 * @param sec
 * @returns
 */
export const toMilliseconds = (hrs: number, min = 0, sec = 0) => (hrs * 60 * 60 + min * 60 + sec) * 1000;
export const coreCache = new persistentCache({
  base: tmpFolder,
  persist: true,
  memory: false,
  duration: toMilliseconds(1)
});

export const cache_key_router = 'jslib';

export default getConfig;

/**
 * hexo argument
 * - s = server
 * - c = clean
 * - g = generate
 */
let mode: 's' | 'g' | 'c';

/**
 * set mode hexo argument
 * - s = server
 * - c = clean
 * - g = generate
 * @param m
 */
export function setMode(m: 's' | 'g' | 'c') {
  mode = m;
}

/**
 * get mode hexo argument
 * - s = server
 * - c = clean
 * - g = generate
 * @returns
 */
export const getMode = () => mode;
