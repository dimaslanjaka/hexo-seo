"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBrokenImg = exports.isLocalImage = void 0;
var cheerio_1 = __importDefault(require("cheerio"));
var config_1 = __importDefault(require("../config"));
var check_1 = __importDefault(require("../curl/check"));
var bluebird_1 = __importDefault(require("bluebird"));
var cache_1 = require("../cache");
var cache = new cache_1.CacheFile("img-broken");
/**
 * is local image
 */
var isLocalImage = function (url) {
    if (!url)
        return false;
    var regex = /^https?/gs;
    return regex.test(url);
};
exports.isLocalImage = isLocalImage;
var new_src = {
    original: null,
    resolved: null,
    success: false
};
/**
 * check broken image with caching strategy
 * @param src
 * @param defaultImg
 * @returns
 */
var checkBrokenImg = function (src, defaultImg) {
    if (defaultImg === void 0) { defaultImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Wikipedia_Hello_World_Graphic.svg/2560px-Wikipedia_Hello_World_Graphic.svg.png"; }
    new_src.original = src;
    new_src.resolved = src;
    var cached = cache.getCache(src, null);
    if (!cached) {
        return bluebird_1.default.resolve((0, check_1.default)(src)).then(function (isWorking) {
            // fix image redirect
            if ((isWorking.statusCode == 302 || isWorking.statusCode == 301) &&
                isWorking.headers[0] &&
                isWorking.headers[0].location) {
                return (0, exports.checkBrokenImg)(isWorking.headers[0].location, defaultImg);
            }
            new_src.success = isWorking.result;
            if (!isWorking) {
                // image is broken, replace with default broken image fallback
                new_src.resolved = defaultImg; //config.default.toString();
            }
            cache.setCache(src, new_src);
            return new_src;
        });
    }
    return bluebird_1.default.any([cached]).then(function (srcx) {
        return srcx;
    });
};
exports.checkBrokenImg = checkBrokenImg;
/**
 * Broken image fix
 * @param img
 */
function default_1(content, data) {
    var path0 = data.path;
    var isChanged = cache.isFileChanged(path0);
    if (isChanged) {
        var $_1 = cheerio_1.default.load(content);
        var config_2 = (0, config_1.default)(this).img;
        var title = data.title;
        var images_1 = [];
        $_1("img").each(function (i, el) {
            var img = $_1(el);
            var img_src = img.attr("src");
            if (img_src &&
                img_src.trim().length > 0 &&
                /^https?:\/\//gs.test(img_src)) {
                images_1.push(img);
            }
        });
        var fixBrokenImg = function (img) {
            var img_src = img.attr("src");
            var img_check = (0, exports.checkBrokenImg)(img_src, config_2.default.toString());
            return img_check.then(function (chk) {
                img.attr("src", chk.resolved);
                img.attr("src-original", chk.original);
                return img;
            });
        };
        return bluebird_1.default.all(images_1)
            .map(fixBrokenImg)
            .catch(function () { })
            .then(function () {
            content = $_1.html();
            cache.setCache(path0, content);
            return content;
        });
    }
    else {
        var gCache = cache.getCache(path0);
        return bluebird_1.default.any(gCache).then(function (content) {
            return content;
        });
    }
}
exports.default = default_1;
