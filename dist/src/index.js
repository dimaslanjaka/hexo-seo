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
var rimraf_1 = __importDefault(require("rimraf"));
var package_json_1 = __importDefault(require("../package.json"));
var fm_1 = require("./fm");
var index_1 = __importDefault(require("./html/index"));
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
            if (hexo.env.args._[i] == "s" || hexo.env.args._[i] == "server") {
                hexoCmd = "server";
                break;
            }
            if (hexo.env.args._[i] == "d" || hexo.env.args._[i] == "deploy") {
                hexoCmd = "deploy";
                break;
            }
            if (hexo.env.args._[i] == "g" || hexo.env.args._[i] == "generate") {
                hexoCmd = "generate";
                break;
            }
            if (hexo.env.args._[i] == "clean") {
                hexoCmd = "clean";
                break;
            }
        }
    }
    // clean build and temp folder on `hexo clean`
    if (hexoCmd && hexoCmd == "clean") {
        console.log("%s cleaning build and temp folder", package_json_1.default.name);
        (0, rimraf_1.default)(fm_1.tmpFolder, function (err) {
            if (err) {
                console.error(err);
            }
            else {
                console.log("cleaned", fm_1.tmpFolder);
            }
        });
        //rimraf.sync(buildFolder);
        return;
    }
    // execute scheduled functions before process exit
    /*if (hexoCmd && hexoCmd != "clean") {
      console.log("Scheduling functions on process exit");
      bindProcessExit("scheduler_on_exit", function () {
        console.log("executing scheduled functions");
        scheduler.executeAll();
      });
    }*/
    // bind configuration
    // hexo.config.seo = getConfig(hexo);
    // minify javascripts
    hexo.extend.filter.register("after_render:js", js_1.default);
    // minify css
    hexo.extend.filter.register("after_render:css", css_1.default);
    // all in one html fixer
    hexo.extend.filter.register("after_render:html", index_1.default);
    // fix external link
    //hexo.extend.filter.register("after_render:html", fixHyperlinks);
    // fix image attributes
    //hexo.extend.filter.register("after_render:html", usingJSDOM);
    // fix schema meta
    //hexo.extend.filter.register("after_render:html", fixSchema);
    // fix invalid link[/.js, /.css]
    //hexo.extend.filter.register("after_render:html", fixInvalid);
    // minify html
    //hexo.extend.filter.register("after_generate", minHtml);
    // register source to hexo middleware
    // hexo-seo available in server http://localhost:4000/hexo-seo
    /*hexo.extend.filter.register("server_middleware", function (app) {
      // Main routes
      app.use(hexo.config.root, serveStatic(path.join(__dirname, "../source")));
    });*/
}
exports.default = default_1;
