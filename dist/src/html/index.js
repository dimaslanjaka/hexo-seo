"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../packages/js-prototypes/src/String");
require("../../packages/js-prototypes/src/Array");
var fixSchema_static_1 = __importDefault(require("./fixSchema.static"));
var fixInvalid_static_1 = __importDefault(require("./fixInvalid.static"));
var fixImageAttributes_1 = __importDefault(require("./fixImageAttributes"));
var dom_1 = require("./dom");
var fixHyperlinks_static_1 = __importDefault(require("./fixHyperlinks.static"));
var config_1 = __importDefault(require("../config"));
var cache_1 = require("../cache");
var cache = new cache_1.CacheFile("index");
function default_1(content, data) {
    if (cache.isFileChanged((0, cache_1.md5)(content))) {
        var dom = new dom_1._JSDOM(content);
        var cfg = (0, config_1.default)(this);
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
        cache.set((0, cache_1.md5)(content), content);
    }
    //content = fixAttributes.bind(this)(content, data);
    //content = fixHyperlinks.bind(this)(content, data);
    //content = fixSchema.bind(this)(content, data);
    //content = fixInvalid.bind(this)(content, data);
    return content;
}
exports.default = default_1;
