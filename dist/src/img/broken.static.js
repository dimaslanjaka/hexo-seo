"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var broken_1 = require("../img/broken");
var log_1 = __importDefault(require("../log"));
var package_json_1 = __importDefault(require("../../package.json"));
var bluebird_1 = __importDefault(require("bluebird"));
function default_1(dom, HSconfig, data) {
    return bluebird_1.default.all(Array.from(dom.document.querySelectorAll("img[src]"))).then(function (images) {
        return images.map(function (img) {
            var src = img.getAttribute("src");
            if (src) {
                if (/^https?:\/\//.test(src)) {
                    return (0, broken_1.checkBrokenImg)(src).then(function (check) {
                        if (typeof check == "object" && !check.success) {
                            log_1.default.log("%s(IMG:broken) fixing %s", package_json_1.default.name, src);
                            img.setAttribute("src", check.resolved);
                            img.setAttribute("src-ori", check.original);
                        }
                    });
                }
            }
            return img;
        });
    });
}
exports.default = default_1;
