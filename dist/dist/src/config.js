"use strict";
exports.__esModule = true;
var deepmerge_ts_1 = require("deepmerge-ts");
//const cache = persistentCache({ persist: true, name: "hexo-seo", base: join(process.cwd(), "tmp") });
var getConfig = function (hexo, _key) {
    if (_key === void 0) { _key = "config-hexo-seo"; }
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
        schema: true,
        sitemap: false
    };
    var seo = hexo.config.seo;
    if (typeof seo.css === "boolean") {
        if (seo.css)
            delete seo.css;
    }
    if (typeof seo.js === "boolean") {
        if (seo.js)
            delete seo.js;
    }
    if (typeof seo.html === "boolean") {
        if (seo.html)
            delete seo.html;
    }
    if (typeof seo === "undefined")
        return defaultOpt;
    return (0, deepmerge_ts_1.deepmerge)(defaultOpt, seo);
};
exports["default"] = getConfig;
