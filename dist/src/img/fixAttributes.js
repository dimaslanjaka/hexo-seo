"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.usingJQuery = exports.usingJSDOM = void 0;
var log_1 = __importDefault(require("../log"));
var cheerio_1 = __importDefault(require("cheerio"));
var hexo_is_1 = __importDefault(require("../hexo/hexo-is"));
var utils_1 = require("../utils");
var cache_1 = __importStar(require("../cache"));
var package_json_1 = __importDefault(require("../../package.json"));
var jsdom_1 = require("jsdom");
var jquery_1 = __importDefault(require("jquery"));
var cache = new cache_1.default();
var usingCheerio = function (content, data) {
    return __awaiter(this, void 0, void 0, function () {
        var page, path0, isChanged, config, $_1, title_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    page = data.page ? data.page.full_source : null;
                    path0 = page ? page : data.path;
                    return [4 /*yield*/, cache.isFileChanged(path0)];
                case 1:
                    isChanged = _a.sent();
                    config = this.config;
                    //console.log("changed", isChanged, path0);
                    if (isChanged) {
                        $_1 = cheerio_1.default.load(content);
                        title_1 = data.title || config.title;
                        $_1("img").each(function (i, el) {
                            var img = $_1(el);
                            var img_alt = img.attr("alt");
                            var img_title = img.attr("title");
                            var img_itemprop = img.attr("itemprop");
                            var img_src = img.attr("src");
                            if (!img_alt || img_alt.trim().length === 0) {
                                img.attr("alt", title_1);
                                log_1.default.log("%s(IMG:alt): %s [%s]", package_json_1.default.name, path0, img_src);
                            }
                            if (!img_title || img_title.trim().length === 0) {
                                img.attr("title", title_1);
                                log_1.default.log("%s(IMG:title): %s [%s]", package_json_1.default.name, path0, img_src);
                            }
                            if (!img_itemprop || img_itemprop.trim().length === 0) {
                                img.attr("itemprop", "image");
                                log_1.default.log("%s(IMG:itemprop): %s [%s]", package_json_1.default.name, path0, img_src);
                            }
                        });
                        cache.set(path0, $_1.html());
                        return [2 /*return*/, $_1.html()];
                    }
                    else {
                        return [2 /*return*/, cache.get(path0)];
                    }
                    return [2 /*return*/];
            }
        });
    });
};
var cF = new cache_1.CacheFile();
var usingJSDOM = function (content, data) {
    (0, cache_1.releaseMemory)();
    var path0 = data.page ? data.page.full_source : data.path;
    var is = (0, hexo_is_1.default)(data);
    if (is.home)
        return content;
    if (!path0) {
        console.log(is);
        (0, utils_1.dump)("dump-path0.txt", (0, utils_1.extractSimplePageData)(data));
        return content;
    }
    /*dump("dump.txt", extractSimplePageData(data));
    dump("dump-page.txt", extractSimplePageData(data.page));
    dump("dump-this.txt", extractSimplePageData(this));*/
    var title = data.page && data.page.title && data.page.title.trim().length > 0
        ? data.page.title
        : this.config.title;
    var isChanged = cF.isFileChanged(path0);
    if (isChanged) {
        var dom = new jsdom_1.JSDOM(content);
        var document_1 = dom.window.document;
        log_1.default.log("%s(IMG:attr) parsing start [%s]", package_json_1.default.name, path0);
        document_1.querySelectorAll("img[src]").forEach(function (element) {
            if (!element.getAttribute("title")) {
                element.setAttribute("title", title);
            }
            if (!element.getAttribute("alt")) {
                element.setAttribute("alt", title);
            }
            if (!element.getAttribute("itemprop")) {
                element.setAttribute("itemprop", "image");
            }
        });
        //dom.serialize() === "<!DOCTYPE html><html><head></head><body>hello</body></html>";
        //document.documentElement.outerHTML === "<html><head></head><body>hello</body></html>";
        content = document_1.documentElement.outerHTML;
        dom.window.close();
        cF.set(path0, content);
        return content;
    }
    log_1.default.log("%s(IMG:attr) cached [%s]", package_json_1.default.name, path0.replace(this.base_dir, ""));
    content = cF.get(path0, "");
    return content;
};
exports.usingJSDOM = usingJSDOM;
var usingJQuery = function (content, data) {
    var htmlDOM = new jsdom_1.JSDOM(content);
    var $ = (0, jquery_1.default)(htmlDOM.window);
    var page = data.page ? data.page.full_source : null;
    var path0 = page ? page : data.path;
    console.log($.html());
    return content;
};
exports.usingJQuery = usingJQuery;
exports.default = usingCheerio;
