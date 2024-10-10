"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMode = exports.cache_key_router = exports.coreCache = exports.toMilliseconds = void 0;
exports.setMode = setMode;
const deepmerge_ts_1 = require("deepmerge-ts");
const fs_extra_1 = require("fs-extra");
const sbg_utility_1 = require("sbg-utility");
const upath_1 = __importDefault(require("upath"));
const fm_1 = require("./fm");
const hexo_seo_1 = require("./hexo-seo");
//const cache = persistentCache({ persist: true, name: "hexo-seo", base: join(process.cwd(), "tmp") });
const getConfig = function (hexo, _key = 'config-hexo-seo') {
    const defaultOpt = {
        cache: true,
        js: { enable: false, concat: false, exclude: ['*.min.js'] },
        css: { enable: false, exclude: ['*.min.css'] },
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
        },
        img: {
            enable: false,
            default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png',
            onerror: 'clientside'
        },
        host: new URL(hexo.config.url).host,
        links: {
            blank: true,
            enable: true,
            allow: ['webmanajemen.com']
        },
        schema: {
            sitelink: {
                enable: false
            },
            article: { enable: false },
            breadcrumb: { enable: false }
        },
        sitemap: false,
        theme_dir: upath_1.default.join(process.cwd(), 'themes', String(hexo.config.theme || 'landscape')),
        source_dir: upath_1.default.join(process.cwd(), String(hexo.config.source_dir || 'source')),
        post_dir: upath_1.default.join(process.cwd(), String(hexo.config.source_dir || 'source'), '_posts')
    };
    const seo = hexo.config.seo;
    (0, fs_extra_1.writeFileSync)(upath_1.default.join(__dirname, '_config_data.json'), JSON.stringify(seo, null, 2));
    if (typeof seo === 'undefined')
        return defaultOpt;
    return (0, deepmerge_ts_1.deepmerge)(defaultOpt, seo, {
        // disable cache on dev
        cache: hexo_seo_1.isDev ? false : seo.cache || defaultOpt.cache
    });
};
/**
 * number to milliseconds
 * @param hrs
 * @param min
 * @param sec
 * @returns
 */
const toMilliseconds = (hrs, min = 0, sec = 0) => (hrs * 60 * 60 + min * 60 + sec) * 1000;
exports.toMilliseconds = toMilliseconds;
exports.coreCache = new sbg_utility_1.persistentCache({
    base: fm_1.tmpFolder,
    persist: true,
    memory: false,
    duration: (0, exports.toMilliseconds)(1)
});
exports.cache_key_router = 'jslib';
exports.default = getConfig;
/**
 * hexo argument
 * - s = server
 * - c = clean
 * - g = generate
 */
let mode;
/**
 * set mode hexo argument
 * - s = server
 * - c = clean
 * - g = generate
 * @param m
 */
function setMode(m) {
    mode = m;
}
/**
 * get mode hexo argument
 * - s = server
 * - c = clean
 * - g = generate
 * @returns
 */
const getMode = () => mode;
exports.getMode = getMode;
