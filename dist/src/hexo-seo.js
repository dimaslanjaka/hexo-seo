/* global hexo */
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDev = void 0;
var js_1 = __importDefault(require("./minifier/js"));
var css_1 = __importDefault(require("./minifier/css"));
var cheerio_1 = __importDefault(require("cheerio"));
var minimist_1 = __importDefault(require("minimist"));
var config_1 = __importDefault(require("./config"));
var serve_static_1 = __importDefault(require("serve-static"));
var path_1 = __importDefault(require("path"));
var meta_1 = __importDefault(require("./html/meta"));
var hyperlink_1 = __importDefault(require("./html/hyperlink"));
var argv = (0, minimist_1.default)(process.argv.slice(2));
// --development
var arg = typeof argv["development"] == "boolean" && argv["development"];
// set NODE_ENV = "development"
var env = process.env.NODE_ENV &&
    process.env.NODE_ENV.toString().toLowerCase() === "development";
// define is development
exports.isDev = arg || env;
function default_1(hexo) {
    var _this = this;
    hexo.config.seo = (0, config_1.default)(hexo);
    if (typeof hexo.config.seo == "undefined")
        return;
    hexo.extend.filter.register("server_middleware", function (app) {
        // Main routes
        app.use(hexo.config.root + "hexo-seo/", (0, serve_static_1.default)(path_1.default.join(__dirname, "../source")));
    });
    hexo.extend.filter.register("after_render:js", js_1.default);
    hexo.extend.filter.register("after_render:css", css_1.default);
    var fixSeoHtml = function (str, data) { return __awaiter(_this, void 0, void 0, function () {
        var $;
        return __generator(this, function (_a) {
            $ = cheerio_1.default.load(str);
            // check image start
            //$ = await seoImage.bind(this)($, hexo);
            // filter external links and optimize seo
            $ = hyperlink_1.default.bind(this)($, hexo);
            // fix meta
            $ = meta_1.default.bind(this)($, data);
            // set modified html
            str = $.html();
            return [2 /*return*/, str];
        });
    }); };
    hexo.extend.filter.register("after_render:html", fixSeoHtml);
    //hexo.extend.filter.register("after_generate", seoImage);
    //hexo.extend.filter.register("after_generate", testAfterGenerate);
    //hexo.extend.filter.register("after_render:html", testAfterRenderHtml);
}
exports.default = default_1;
