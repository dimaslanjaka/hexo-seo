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
var cleanup_1 = __importDefault(require("./utils/cleanup"));
var scheduler_1 = __importDefault(require("./scheduler"));
var log_1 = __importDefault(require("./log"));
var config_1 = __importDefault(require("./config"));
var argv = (0, minimist_1.default)(process.argv.slice(2));
// --development
var arg = typeof argv["development"] == "boolean" && argv["development"];
// set NODE_ENV = "development"
var env = process.env.NODE_ENV && process.env.NODE_ENV.toString().toLowerCase() === "development";
// define is development
exports.isDev = arg || env;
// core
function default_1(hexo) {
    // return if hexo-seo configuration unavailable
    if (typeof hexo.config.seo == "undefined") {
        log_1.default.error("seo options not found");
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
        (0, rimraf_1.default)(fm_1.buildFolder, function (err) {
            if (err) {
                console.error(err);
            }
            else {
                console.log("cleaned", fm_1.buildFolder);
            }
        });
        return;
    }
    // execute scheduled functions before process exit
    if (hexoCmd && hexoCmd != "clean") {
        (0, cleanup_1.default)("scheduler_on_exit", function () {
            log_1.default.log("executing scheduled functions");
            scheduler_1.default.executeAll();
        });
    }
    // bind configuration
    hexo.config.seo = (0, config_1.default)(hexo);
    // minify javascripts
    hexo.extend.filter.register("after_render:js", js_1.default);
    // minify css
    hexo.extend.filter.register("after_render:css", css_1.default);
    // all in one html fixer
    hexo.extend.filter.register("after_render:html", index_1.default);
}
exports.default = default_1;
