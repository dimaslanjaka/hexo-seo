"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = __importDefault(require("../log"));
var config_1 = __importDefault(require("../config"));
var hexo_is_1 = __importDefault(require("../hexo/hexo-is"));
var utils_1 = require("../utils");
var cache_1 = require("../cache");
var package_json_1 = __importDefault(require("../../package.json"));
var jsdom_1 = require("jsdom");
var cF = new cache_1.CacheFile();
function fixAttributes(content, data) {
    (0, cache_1.releaseMemory)();
    var is = (0, hexo_is_1.default)(data);
    var path0 = data.page ? data.page.full_source : data.path;
    if ((!path0 || !is.post) && !is.page) {
        if (!is.tag && !is.archive && !is.home && !is.category && !is.year) {
            console.log(path0, is);
            (0, utils_1.dump)("dump-path0.txt", path0);
            (0, utils_1.dump)("dump-data.txt", (0, utils_1.extractSimplePageData)(data));
            (0, utils_1.dump)("dump-page.txt", (0, utils_1.extractSimplePageData)(data.page));
            (0, utils_1.dump)("dump-this.txt", (0, utils_1.extractSimplePageData)(this));
        }
        return content;
    }
    var HSconfig = (0, config_1.default)(this);
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
        if (HSconfig.html.fix) {
            content = dom.serialize();
        }
        else {
            content = document_1.documentElement.outerHTML;
        }
        dom.window.close();
        cF.set(path0, content);
        return content;
    }
    log_1.default.log("%s(IMG:attr) cached [%s]", package_json_1.default.name, path0.replace(this.base_dir, ""));
    content = cF.get(path0, "");
    return content;
}
exports.default = fixAttributes;
