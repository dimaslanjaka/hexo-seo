"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocalImage = void 0;
var log_1 = __importDefault(require("../log"));
var cheerio_1 = __importDefault(require("cheerio"));
var config_1 = __importDefault(require("../config"));
var check_1 = __importDefault(require("../curl/check"));
var bluebird_1 = __importDefault(require("bluebird"));
var cache_1 = __importDefault(require("../cache"));
var cache = new cache_1.default();
/**
 * is local image
 */
var isLocalImage = function (url) {
    if (!url)
        return false;
    var regex = /^http?s/gs;
    return regex.test(url);
};
exports.isLocalImage = isLocalImage;
/**
 * Broken image fix
 * @param img
 */
function default_1(content, data) {
    var _this = this;
    var path0 = data.path;
    cache.isFileChanged(path0).then(function (isChanged) {
        if (isChanged) {
            var $_1 = cheerio_1.default.load(content);
            var config_2 = (0, config_1.default)(_this).img;
            var title_1 = data.title;
            var images_1 = [];
            $_1("img").each(function (i, el) {
                var img = $_1(el);
                var img_alt = img.attr("alt");
                var img_title = img.attr("title");
                var img_itemprop = img.attr("itemprop");
                if (!img_alt || img_alt.trim().length === 0) {
                    img.attr("alt", title_1);
                }
                if (!img_title || img_title.trim().length === 0) {
                    img.attr("title", title_1);
                }
                if (!img_itemprop || img_itemprop.trim().length === 0) {
                    img.attr("itemprop", "image");
                }
                var img_src = img.attr("src");
                if (img_src &&
                    img_src.trim().length > 0 &&
                    /^https?:\/\//gs.test(img_src)) {
                    images_1.push(img);
                }
            });
            /**
             * check broken image with caching strategy
             */
            var checkBrokenImg_1 = function (src) {
                var new_src = {
                    original: src,
                    resolved: src,
                    cached: false
                };
                var cached = cache.getCache(src, null);
                if (!cached) {
                    return (0, check_1.default)(src).then(function (isWorking) {
                        if (!isWorking) {
                            // image is broken, replace with default broken image fallback
                            new_src.resolved = config_2.default.toString();
                        }
                        cache.setCache(src, new_src);
                        return new_src;
                    });
                }
                new_src.cached = true;
                return bluebird_1.default.any([cached]).then(function (srcx) {
                    return srcx;
                });
            };
            var fixBrokenImg = function (img) {
                var img_src = img.attr("src");
                var img_check = checkBrokenImg_1(img_src);
                return img_check.then(function (chk) {
                    img.attr("src", chk.resolved);
                    img.attr("src-original", chk.original);
                    if (!chk.cached)
                        log_1.default.log("%s is broken, replaced with %s", chk.original, chk.resolved);
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
    });
}
exports.default = default_1;
