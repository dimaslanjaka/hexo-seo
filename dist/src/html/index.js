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
exports.getPath = void 0;
require("../../packages/js-prototypes/src/String");
require("../../packages/js-prototypes/src/Array");
var fixSchema_static_1 = __importDefault(require("./fixSchema.static"));
var fixInvalid_static_1 = __importDefault(require("./fixInvalid.static"));
var fixImageAttributes_1 = __importDefault(require("./fixImageAttributes"));
var dom_1 = require("./dom");
var fixHyperlinks_static_1 = __importDefault(require("./fixHyperlinks.static"));
var config_1 = __importDefault(require("../config"));
var cache_1 = require("../cache");
var broken_static_1 = __importDefault(require("../img/broken.static"));
function getPath(data) {
    if (data.page) {
        if (data.page.full_source)
            return data.page.full_source;
        if (data.page.path)
            return data.page.path;
    }
    if (data.path)
        return data.path;
}
exports.getPath = getPath;
var cache = new cache_1.CacheFile("index");
function default_1(content, data) {
    return __awaiter(this, void 0, void 0, function () {
        var path0, dom, cfg;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    path0 = getPath(data) ? getPath(data) : content;
                    if (!cache.isFileChanged((0, cache_1.md5)(path0))) return [3 /*break*/, 2];
                    dom = new dom_1._JSDOM(content);
                    cfg = (0, config_1.default)(this);
                    return [4 /*yield*/, (0, broken_static_1.default)(dom, cfg.img, data)];
                case 1:
                    _a.sent();
                    (0, fixHyperlinks_static_1.default)(dom, cfg.links, data);
                    (0, fixInvalid_static_1.default)(dom, cfg, data);
                    (0, fixImageAttributes_1.default)(dom, cfg.img, data);
                    (0, fixSchema_static_1.default)(dom, cfg, data);
                    if (cfg.html.fix) {
                        content = dom.serialize();
                    }
                    else {
                        content = dom.toString();
                    }
                    cache.set((0, cache_1.md5)(path0), content);
                    return [2 /*return*/, content];
                case 2:
                    content = cache.getCache((0, cache_1.md5)(path0));
                    _a.label = 3;
                case 3: 
                //content = fixAttributes.bind(this)(content, data);
                //content = fixHyperlinks.bind(this)(content, data);
                //content = fixSchema.bind(this)(content, data);
                //content = fixInvalid.bind(this)(content, data);
                return [2 /*return*/, content];
            }
        });
    });
}
exports.default = default_1;
