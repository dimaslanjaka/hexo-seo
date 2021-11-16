"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocalImage = void 0;
var log_1 = __importDefault(require("../log"));
var cheerio_1 = __importDefault(require("cheerio"));
var config_1 = __importDefault(require("src/config"));
var check_1 = __importDefault(require("src/curl/check"));
var bluebird_1 = __importDefault(require("bluebird"));
/**
 * is local image
 */
var isLocalImage = function (url) {
    var regex = /^http?s/gs;
    return regex.test(url);
};
exports.isLocalImage = isLocalImage;
/**
 * Broken image fix
 * @param img
 */
function default_1(content, data) {
    var $ = cheerio_1.default.load(content);
    var config = (0, config_1.default)(this).img;
    var title = data.title;
    var images = [];
    $("img").each(function (i, el) {
        var img = $(el);
        var img_alt = img.attr("alt");
        var img_title = img.attr("title");
        var img_itemprop = img.attr("itemprop");
        if (!img_alt || img_alt.trim().length === 0) {
            img.attr("alt", title);
        }
        if (!img_title || img_title.trim().length === 0) {
            img.attr("title", title);
        }
        if (!img_itemprop || img_itemprop.trim().length === 0) {
            img.attr("itemprop", "image");
        }
        var img_src = img.attr("src");
        if (img_src &&
            img_src.trim().length > 0 &&
            /^https?:\/\//gs.test(img_src)) {
            images.push(img);
        }
    });
    var fixBrokenImg = function (img) {
        var img_src = img.attr("src");
        return (0, check_1.default)(img_src).then(function (isWorking) {
            var new_img_src = config.default.toString();
            if (!isWorking) {
                img.attr("src", new_img_src);
                img.attr("src-original", img_src);
                log_1.default.log("%s is broken, replaced with %s", img_src, new_img_src);
            }
            return img;
        });
    };
    return bluebird_1.default.all(images)
        .map(fixBrokenImg)
        .catch(function () { })
        .then(function () {
        return $.html();
    });
}
exports.default = default_1;
