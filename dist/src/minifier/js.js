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
var terser_1 = require("terser");
var log_1 = __importDefault(require("../log"));
var package_json_1 = __importDefault(require("../../package.json"));
var cache_1 = __importDefault(require("../cache"));
var object_assign_1 = __importDefault(require("object-assign"));
var utils_1 = require("../utils");
var cache = new cache_1.default();
function default_1(str, data) {
    return __awaiter(this, void 0, void 0, function () {
        var path0, isChanged, hexo_1, options, minifyOptions, result, saved, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path0 = data.path;
                    return [4 /*yield*/, cache.isFileChanged(path0)];
                case 1:
                    isChanged = _a.sent();
                    if (!isChanged) return [3 /*break*/, 6];
                    hexo_1 = this;
                    options = {
                        exclude: ["*.min.js"]
                    };
                    if (typeof hexo_1.config.seo.js === "boolean") {
                        if (!hexo_1.config.seo.js)
                            return [2 /*return*/, str];
                    }
                    else if (typeof hexo_1.config.seo.js == "object") {
                        options = (0, object_assign_1.default)(options, hexo_1.config.seo.js);
                    }
                    //console.log(`minifying ${path0}`);
                    if (typeof options == "object" && (0, utils_1.isIgnore)(path0, options.exclude))
                        return [2 /*return*/, str];
                    minifyOptions = {
                        mangle: {
                            toplevel: true,
                            properties: false,
                            safari10: true,
                            keep_fnames: true,
                            keep_classnames: true // keep class name
                        },
                        compress: {
                            dead_code: true //remove unreachable code
                        }
                    };
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, terser_1.minify)(str, minifyOptions)];
                case 3:
                    result = _a.sent();
                    if (result.code && result.code.length > 0) {
                        saved = (((str.length - result.code.length) / str.length) *
                            100).toFixed(2);
                        log_1.default.log("%s(JS): %s [%s saved]", package_json_1.default.name, path0, saved + "%");
                        str = result.code;
                        // set new minified js cache
                        cache.setCache(path0, str);
                    }
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    log_1.default.error("Minifying " + path0 + " error", e_1);
                    // minify error, return original js
                    return [2 /*return*/, str];
                case 5: return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, cache.getCache(path0, str)];
                case 7:
                    // get cached minified js
                    str = _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/, str];
            }
        });
    });
}
exports.default = default_1;
