"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMode = exports.setMode = exports.cache_key_router = exports.coreCache = exports.toMilliseconds = void 0;
var deepmerge_ts_1 = require("deepmerge-ts");
var fs_extra_1 = require("fs-extra");
var sbg_utility_1 = require("sbg-utility");
var upath_1 = __importDefault(require("upath"));
var fm_1 = require("./fm");
var hexo_seo_1 = require("./hexo-seo");
//const cache = persistentCache({ persist: true, name: "hexo-seo", base: join(process.cwd(), "tmp") });
var getConfig = function (hexo, _key) {
    if (_key === void 0) { _key = 'config-hexo-seo'; }
    var defaultOpt = {
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
    var seo = hexo.config.seo;
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
var toMilliseconds = function (hrs, min, sec) {
    if (min === void 0) { min = 0; }
    if (sec === void 0) { sec = 0; }
    return (hrs * 60 * 60 + min * 60 + sec) * 1000;
};
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
var mode;
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
exports.setMode = setMode;
/**
 * get mode hexo argument
 * - s = server
 * - c = clean
 * - g = generate
 * @returns
 */
var getMode = function () { return mode; };
exports.getMode = getMode;
