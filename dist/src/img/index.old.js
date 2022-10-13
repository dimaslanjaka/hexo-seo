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
exports.__esModule = true;
var log_1 = __importDefault(require("../log"));
var config_1 = __importDefault(require("../config"));
var minimatch_1 = __importDefault(require("minimatch"));
var utils_1 = require("../utils");
var stream_1 = require("../utils/stream");
var cheerio_1 = __importDefault(require("cheerio"));
function default_1() {
    return __awaiter(this, void 0, void 0, function () {
        var hexo, route, options, routes, processor;
        return __generator(this, function (_a) {
            hexo = this;
            route = hexo.route;
            options = (0, config_1["default"])(hexo).img;
            routes = route.list().filter(function (path0) {
                var choose = (0, minimatch_1["default"])(path0, "**/*.{htm,html}", { nocase: true });
                if (typeof options == "object" && typeof options.exclude != "undefined") {
                    choose = choose && !(0, utils_1.isIgnore)(path0, options.exclude);
                }
                if (typeof hexo.config.skip_render != "undefined") {
                    // _config.yml skip_render https://hexo.io/docs/configuration.html#Directory
                    choose = choose && !(0, utils_1.isIgnore)(path0, hexo.config.skip_render);
                }
                return choose;
            });
            processor = function (stream) {
                (0, stream_1.streamToArray)(stream)
                    .then(function (arr) {
                    return arr.join("");
                })
                    .then(function (str) {
                    try {
                        //dump("after_generate.txt", str);
                        //logger.log(typeof str, "str");
                        var $_1 = cheerio_1["default"].load(str);
                        var title_1 = $_1("title").text();
                        $_1("img").map(function (i, img) {
                            // fix image alt
                            var alt = $_1(img).attr("alt");
                            if (!alt || alt.trim().length === 0) {
                                $_1(img).attr("alt", title_1);
                            }
                            //const src = $(img).attr("src");
                        });
                    }
                    catch (e) {
                        log_1["default"].error(e);
                    }
                    return str;
                });
            };
            /*return bPromise.map(routes, (path0) => {
              const stream = route.get(path0);
              return processor(stream);
            });*/
            return [2 /*return*/, routes.map(function (path0, index, arr) {
                    var stream = route.get(path0);
                    return processor(stream);
                })];
        });
    });
}
exports["default"] = default_1;
