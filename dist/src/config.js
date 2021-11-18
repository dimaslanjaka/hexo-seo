"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var object_assign_1 = __importDefault(require("object-assign"));
var cache_1 = __importDefault(require("./cache"));
var cache = new cache_1.default();
var getConfig = function (hexo, key) {
    if (key === void 0) { key = "config-hexo-seo"; }
    if (!cache.getCache(key)) {
        var defaultOpt = {
            js: {
                exclude: ["*.min.js"]
            },
            css: {
                exclude: ["*.min.css"]
            },
            html: {
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
            //img: { default: source.img.fallback.public, onerror: "serverside" },
            img: {
                default: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png",
                onerror: "serverside"
            },
            host: ["webmanajemen.com"],
            links: {
                allow: ["webmanajemen.com"]
            },
            schema: true
        };
        /*if (!/^http?s/gs.test(source.img.fallback.public)) {
          hexo.route.set(source.img.fallback.public, source.img.fallback.buffer);
        }*/
        var config = hexo.config;
        var seo = config.seo;
        if (typeof seo === "undefined")
            return defaultOpt;
        if (typeof seo.css === "boolean")
            delete seo.css;
        if (typeof seo.js === "boolean")
            delete seo.js;
        if (typeof seo.html === "boolean")
            delete seo.html;
        seo = (0, object_assign_1.default)(defaultOpt, seo);
        cache.setCache(key, seo);
        return seo;
    }
    else {
        return cache.getCache(key);
    }
};
exports.default = getConfig;
