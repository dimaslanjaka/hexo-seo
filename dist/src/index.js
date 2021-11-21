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
var fixAttributes_1 = require("./img/fixAttributes");
var hyperlink_1 = __importDefault(require("./html/hyperlink"));
var fixSchema_1 = __importDefault(require("./html/fixSchema"));
var fixInvalid_1 = __importDefault(require("./html/fixInvalid"));
var rimraf_1 = __importDefault(require("rimraf"));
var fm_1 = require("./fm");
var scheduler_1 = __importDefault(require("./scheduler"));
var cleanup_1 = __importDefault(require("./utils/cleanup"));
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
    var hexoCmd;
    if (hexo.env.args._ && hexo.env.args._.length > 0) {
        for (var i = 0; i < hexo.env.args._.length; i++) {
            if (hexo.env.args._[i] == "s" || hexo.env.args._[i] == "server")
                hexoCmd = "server";
            if (hexo.env.args._[i] == "d" || hexo.env.args._[i] == "deploy")
                hexoCmd = "deploy";
            if (hexo.env.args._[i] == "g" || hexo.env.args._[i] == "generate")
                hexoCmd = "generate";
            if (hexo.env.args._[i] == "clean")
                hexoCmd = "clean";
        }
    }
    // clean build and temp folder on `hexo clean`
    if (hexoCmd && hexoCmd == "clean") {
        rimraf_1.default.sync(fm_1.tmpFolder);
        rimraf_1.default.sync(fm_1.buildFolder);
    }
    // bind configuration
    // hexo.config.seo = getConfig(hexo);
    // minify javascripts
    hexo.extend.filter.register("after_render:js", js_1.default);
    // minify css
    hexo.extend.filter.register("after_render:css", css_1.default);
    // fix external link
    hexo.extend.filter.register("after_render:html", hyperlink_1.default);
    // fix image attributes
    hexo.extend.filter.register("after_render:html", fixAttributes_1.usingJSDOM);
    // fix schema meta
    hexo.extend.filter.register("after_render:html", fixSchema_1.default);
    // fix invalid link[/.js, /.css]
    hexo.extend.filter.register("after_render:html", fixInvalid_1.default);
    // minify html
    //hexo.extend.filter.register("after_generate", minHtml);
    // execute scheduled functions before process exit
    if (hexoCmd && hexoCmd != "clean") {
        console.log("Scheduling functions on process exit");
        (0, cleanup_1.default)("scheduler_on_exit", function () {
            console.log("executing scheduled functions");
            scheduler_1.default.executeAll();
        });
    }
    // register source to hexo middleware
    // hexo-seo available in server http://localhost:4000/hexo-seo
    /*hexo.extend.filter.register("server_middleware", function (app) {
      // Main routes
      app.use(hexo.config.root, serveStatic(path.join(__dirname, "../source")));
    });*/
}
exports.default = default_1;
