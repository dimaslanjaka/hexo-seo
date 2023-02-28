'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.isDev = void 0;
var ansi_colors_1 = __importDefault(require("ansi-colors"));
var fs_extra_1 = __importStar(require("fs-extra"));
var minimist_1 = __importDefault(require("minimist"));
var config_1 = __importDefault(require("./config"));
var fm_1 = require("./fm");
var html_1 = __importDefault(require("./html"));
var css_1 = __importDefault(require("./minifier/css"));
var js_1 = __importDefault(require("./minifier/js"));
var scheduler_1 = __importDefault(require("./scheduler"));
var cleanup_1 = __importDefault(require("./utils/cleanup"));
var argv = (0, minimist_1["default"])(process.argv.slice(2));
// --development
var arg = typeof argv['development'] == 'boolean' && argv['development'];
// set NODE_ENV = "development"
var env = process.env.NODE_ENV && process.env.NODE_ENV.toString().toLowerCase() === 'development';
// define is development
exports.isDev = arg || env;
var logname = ansi_colors_1["default"].magentaBright('hexo-seo');
// core
function HexoSeo(hexo) {
    //console.log("hexo-seo starting", { dev: env });
    // return if hexo-seo configuration unavailable
    if (typeof hexo.config.seo == 'undefined') {
        hexo.log.error(logname, 'seo options not found');
        return;
    }
    // detect hexo arguments
    var hexoCmd;
    if (hexo.env.args._ && hexo.env.args._.length > 0) {
        for (var i = 0; i < hexo.env.args._.length; i++) {
            if (hexo.env.args._[i] == 's' || hexo.env.args._[i] == 'server') {
                hexoCmd = 'server';
                break;
            }
            if (hexo.env.args._[i] == 'd' || hexo.env.args._[i] == 'deploy') {
                hexoCmd = 'deploy';
                break;
            }
            if (hexo.env.args._[i] == 'g' || hexo.env.args._[i] == 'generate') {
                hexoCmd = 'generate';
                break;
            }
            if (hexo.env.args._[i] == 'c' || hexo.env.args._[i] == 'clean') {
                hexoCmd = 'clean';
                break;
            }
        }
    }
    // clean build and temp folder on `hexo clean`
    hexo.extend.filter.register('after_clean', function () {
        // remove some other temporary files
        hexo.log.info(logname + '(clean)', 'cleaning build and temp folder');
        if ((0, fs_extra_1.existsSync)(fm_1.tmpFolder))
            fs_extra_1["default"].rmSync(fm_1.tmpFolder, { recursive: true, force: true });
        if ((0, fs_extra_1.existsSync)(fm_1.buildFolder))
            fs_extra_1["default"].rmSync(fm_1.buildFolder, { recursive: true, force: true });
    });
    // execute scheduled functions before process exit
    if (hexoCmd != 'clean') {
        (0, cleanup_1["default"])('scheduler_on_exit', function () {
            hexo.log.info(logname, 'executing scheduled functions');
            scheduler_1["default"].executeAll();
        });
    }
    // bind configuration
    var config = (0, config_1["default"])(hexo);
    hexo.config.seo = config;
    if (config.js && config.js.enable) {
        // minify javascripts
        hexo.extend.filter.register('after_render:js', js_1["default"]);
    }
    if (config.css && config.css.enable) {
        // minify css
        hexo.extend.filter.register('after_render:css', css_1["default"]);
    }
    if (config.html && config.html.enable) {
        // all in one html fixer
        hexo.extend.filter.register('after_render:html', html_1["default"]);
    }
}
exports["default"] = HexoSeo;
