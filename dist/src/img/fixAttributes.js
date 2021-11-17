"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio_1 = __importDefault(require("cheerio"));
var cache_1 = __importDefault(require("../cache"));
var cache = new cache_1.default();
function default_1(content, data) {
    var path0 = data.path;
    return cache.isFileChanged(path0).then(function (isChanged) {
        if (!isChanged) {
            console.log("changed", path0);
            var $_1 = cheerio_1.default.load(content);
            //const config = getConfig(this).img;
            var title_1 = data.title;
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
            });
            cache.set(path0, $_1.html());
            return $_1.html();
        }
        return cache.get(path0);
    });
}
exports.default = default_1;
