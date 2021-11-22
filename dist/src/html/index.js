"use strict";
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
    var path0 = getPath(data) ? getPath(data) : content;
    if (cache.isFileChanged((0, cache_1.md5)(path0))) {
        var dom_2 = new dom_1._JSDOM(content);
        var cfg_1 = (0, config_1.default)(this);
        return (0, broken_static_1.default)(dom_2, cfg_1.img, data).then(function () {
            (0, fixHyperlinks_static_1.default)(dom_2, cfg_1.links, data);
            (0, fixInvalid_static_1.default)(dom_2, cfg_1, data);
            (0, fixImageAttributes_1.default)(dom_2, cfg_1.img, data);
            (0, fixSchema_static_1.default)(dom_2, cfg_1, data);
            if (cfg_1.html.fix) {
                content = dom_2.serialize();
            }
            else {
                content = dom_2.toString();
            }
            cache.set((0, cache_1.md5)(path0), content);
            return content;
        });
    }
    else {
        content = cache.getCache((0, cache_1.md5)(path0));
    }
    //content = fixAttributes.bind(this)(content, data);
    //content = fixHyperlinks.bind(this)(content, data);
    //content = fixSchema.bind(this)(content, data);
    //content = fixInvalid.bind(this)(content, data);
    return content;
}
exports.default = default_1;
