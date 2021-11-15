/* global hexo */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDev = void 0;
var js_1 = __importDefault(require("./minifier/js"));
var css_1 = __importDefault(require("./minifier/css"));
var html_1 = __importDefault(require("./minifier/html"));
var minimist_1 = __importDefault(require("minimist"));
var serve_static_1 = __importDefault(require("serve-static"));
var path_1 = __importDefault(require("path"));
var argv = (0, minimist_1.default)(process.argv.slice(2));
// --development
var arg = typeof argv["development"] == "boolean" && argv["development"];
// set NODE_ENV = "development"
var env = process.env.NODE_ENV &&
    process.env.NODE_ENV.toString().toLowerCase() === "development";
// define is development
exports.isDev = arg || env;
function default_1(hexo) {
    // hexo.config.seo = getConfig(hexo);
    if (typeof hexo.config.seo == "undefined")
        return;
    hexo.extend.filter.register("server_middleware", function (app) {
        // Main routes
        app.use(hexo.config.root + "hexo-seo/", (0, serve_static_1.default)(path_1.default.join(__dirname, "../source")));
    });
    hexo.extend.filter.register("after_render:js", js_1.default);
    hexo.extend.filter.register("after_render:css", css_1.default);
    hexo.extend.filter.register("after_render:html", html_1.default);
    //hexo.extend.filter.register("after_generate", seoImage);
    //hexo.extend.filter.register("after_generate", testAfterGenerate);
    //hexo.extend.filter.register("after_render:html", testAfterRenderHtml);
}
exports.default = default_1;
