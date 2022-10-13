"use strict";
exports.__esModule = true;
var deepmerge_ts_1 = require("deepmerge-ts");
var path_1 = require("path");
var persistent_cache_1 = require("persistent-cache");
var cache = (0, persistent_cache_1.persistentCache)({ persist: true, name: "hexo-seo", base: (0, path_1.join)(process.cwd(), "tmp") });
var getConfig = function (hexo, key) {
    if (key === void 0) { key = "config-hexo-seo"; }
    if (!cache.getSync(key, null)) {
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
                "default": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png",
                onerror: "serverside"
            },
            host: ["webmanajemen.com"],
            links: {
                blank: true,
                enable: true,
                allow: ["webmanajemen.com"]
            },
            schema: true
        };
        /*if (!/^https?/gs.test(source.img.fallback.public)) {
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
        seo = (0, deepmerge_ts_1.deepmerge)(defaultOpt, seo);
        cache.setSync(key, seo);
        return seo;
    }
    return cache.getSync(key);
};
exports["default"] = getConfig;
