"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var object_assign_1 = __importDefault(require("object-assign"));
var underscore_1 = require("underscore");
var source_1 = __importDefault(require("../source"));
var getConfig = (0, underscore_1.memoize)(function (hexo) {
    var defaultOpt = {
        js: {
            exclude: ["*.min.js"]
        },
        css: {
            exclude: ["*.min.css"]
        },
        html: {
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
        img: { default: source_1.default.img.fallback.public, onerror: "serverside" },
        host: ["webmanajemen.com"],
        links: {
            allow: ["webmanajemen.com"]
        },
        schema: true
    };
    var config = hexo.config;
    var seo = config.seo;
    if (typeof seo !== "object")
        return defaultOpt;
    return (0, object_assign_1.default)(defaultOpt, seo);
});
exports.default = getConfig;
