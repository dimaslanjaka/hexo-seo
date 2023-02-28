"use strict";
exports.__esModule = true;
var deepmerge_ts_1 = require("deepmerge-ts");
var fs_1 = require("fs");
var path_1 = require("path");
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
            "default": 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png',
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
        sitemap: false
    };
    var seo = hexo.config.seo;
    (0, fs_1.writeFileSync)((0, path_1.join)(__dirname, '_config_data.json'), JSON.stringify(seo, null, 2));
    if (typeof seo === 'undefined')
        return defaultOpt;
    return (0, deepmerge_ts_1.deepmerge)(defaultOpt, seo);
};
exports["default"] = getConfig;
