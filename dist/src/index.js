/* global hexo */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDev = void 0;
var js_1 = __importDefault(require("./minifier/js"));
var css_1 = __importDefault(require("./minifier/css"));
var minimist_1 = __importDefault(require("minimist"));
var config_1 = __importDefault(require("./config"));
var fixSchema_1 = __importDefault(require("./html/fixSchema"));
var hyperlink_1 = __importDefault(require("./html/hyperlink"));
var fixAttributes_1 = require("./img/fixAttributes");
var argv = (0, minimist_1.default)(process.argv.slice(2));
// --development
var arg = typeof argv["development"] == "boolean" && argv["development"];
// set NODE_ENV = "development"
var env = process.env.NODE_ENV &&
    process.env.NODE_ENV.toString().toLowerCase() === "development";
// define is development
exports.isDev = arg || env;
function default_1(hexo) {
    // return if hexo-seo configuration unavailable
    if (typeof hexo.config.seo == "undefined") {
        console.error("ERROR", "seo options not found");
        return;
    }
    // bind configuration
    hexo.config.seo = (0, config_1.default)(hexo);
    // register source to hexo middleware
    // hexo-seo available in server http://localhost:4000/hexo-seo
    /*hexo.extend.filter.register("server_middleware", function (app) {
      // Main routes
      app.use(hexo.config.root, serveStatic(path.join(__dirname, "../source")));
    });*/
    // minify javascripts
    hexo.extend.filter.register("after_render:js", js_1.default);
    // minify css
    hexo.extend.filter.register("after_render:css", css_1.default);
    // fix external link
    hexo.extend.filter.register("after_render:html", hyperlink_1.default);
    // fix schema meta
    hexo.extend.filter.register("after_render:html", fixSchema_1.default);
    // test image fix
    hexo.extend.filter.register("after_render:html", fixAttributes_1.usingJSDOM);
    // minify html on production mode
    //hexo.extend.filter.register("after_generate", minHtml);
}
exports.default = default_1;
