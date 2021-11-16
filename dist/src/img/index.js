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
exports.imageBuffer2base64 = exports.getBuffer = void 0;
var fs_1 = require("fs");
var path_1 = __importDefault(require("path"));
var sanitize_filename_1 = __importDefault(require("sanitize-filename"));
var config_1 = __importDefault(require("../config"));
var log_1 = __importDefault(require("../log"));
var fileType = __importStar(require("file-type"));
var check_1 = __importDefault(require("../curl/check"));
var cheerio_1 = __importDefault(require("cheerio"));
/**
 * Get buffer from source
 * @param src
 * @param hexo
 * @returns
 */
var getBuffer = function (src, hexo) {
    if (typeof src == "string") {
        var base_dir = hexo.base_dir;
        var source_dir = hexo.source_dir;
        var find = src;
        if (!(0, fs_1.existsSync)(src)) {
            if ((0, fs_1.existsSync)(path_1.default.join(source_dir, src))) {
                find = path_1.default.join(source_dir, src);
            }
            else if ((0, fs_1.existsSync)(path_1.default.join(base_dir, src))) {
                find = path_1.default.join(base_dir, src);
            }
        }
        return Buffer.from(find);
    }
    if (Buffer.isBuffer(src))
        return src;
};
exports.getBuffer = getBuffer;
/**
 * Image buffer to base64 encoded
 * @param buffer
 * @returns
 */
var imageBuffer2base64 = function (buffer) { return __awaiter(void 0, void 0, void 0, function () {
    var type;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fileType.fromBuffer(buffer)];
            case 1:
                type = _a.sent();
                return [2 /*return*/, "data:" + type.mime + ";base64," + buffer.toString("base64")];
        }
    });
}); };
exports.imageBuffer2base64 = imageBuffer2base64;
var seoImage = function (
/*$: CheerioAPI*/ content, hexo) {
    return __awaiter(this, void 0, void 0, function () {
        var $, title, config, imgs, index, img, img_alt, img_title, img_itemprop, img_src, isExternal, img_onerror, check, new_img_src;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    $ = cheerio_1.default.load(content);
                    title = $("title").text();
                    config = (0, config_1.default)(hexo).img;
                    imgs = $("img");
                    if (!imgs.length) return [3 /*break*/, 6];
                    index = 0;
                    _a.label = 1;
                case 1:
                    if (!(index < imgs.length)) return [3 /*break*/, 6];
                    img = $(imgs[index]);
                    img_alt = img.attr("alt");
                    img_title = img.attr("title");
                    img_itemprop = img.attr("itemprop");
                    //logger.log("alt", alt);
                    if (!img_alt || img_alt.trim().length === 0) {
                        img.attr("alt", (0, sanitize_filename_1.default)(title));
                    }
                    if (!img_title || img_title.trim().length === 0) {
                        img.attr("title", (0, sanitize_filename_1.default)(title));
                    }
                    if (!img_itemprop || img_itemprop.trim().length === 0) {
                        img.attr("itemprop", "image");
                    }
                    img_src = img.attr("src");
                    if (!img_src) return [3 /*break*/, 5];
                    isExternal = /^https?:\/\//gs.test(img_src);
                    if (!isExternal) return [3 /*break*/, 5];
                    if (!(config.onerror == "clientside")) return [3 /*break*/, 2];
                    img_onerror = img.attr("onerror");
                    if (!img_onerror /*|| img_onerror.trim().length === 0*/) {
                        // to avoid image error, and fix endless loop onerror images
                        //const imgBuf = getBuffer(config.default, hexo);
                        //const base64 = await imageBuffer2base64(imgBuf);
                        img.attr("onerror", "this.onerror=null;this.src='" + config.default + "';");
                    }
                    return [3 /*break*/, 5];
                case 2:
                    if (!(img_src.length > 0)) return [3 /*break*/, 4];
                    return [4 /*yield*/, (0, check_1.default)(img_src)];
                case 3:
                    check = _a.sent();
                    if (!check) {
                        new_img_src = config.default.toString();
                        //logger.log("default img", img_src);
                        log_1.default.debug("%s is broken, replaced with %s", img_src, new_img_src);
                        img.attr("src", new_img_src);
                    }
                    _a.label = 4;
                case 4:
                    img.attr("src-original", img_src);
                    _a.label = 5;
                case 5:
                    index++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, $.html()];
            }
        });
    });
};
exports.default = seoImage;
