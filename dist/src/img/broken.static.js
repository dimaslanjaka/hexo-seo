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
    var images = dom.document.querySelectorAll("img");
    var _loop_1 = function (index) {
        var img = images.item(index);
        var src = img.getAttribute("src");
        if (src) {
            if (/^https?:\/\//.test(src) && src.length > 0) {
                return { value: (0, broken_1.checkBrokenImg)(src).then(function (check) {
                        if (typeof check == "object" && !check.success) {
                            log_1.default.log("%s(IMG:broken) fixing %s", package_json_1.default.name, [
                                src,
                                check.resolved
                            ]);
                            img.setAttribute("src", check.resolved);
                            img.setAttribute("src-ori", check.original);
                        }
                    }) };
            }
        }
    };
    for (var index = 0; index < images.length; index++) {
        var state_1 = _loop_1(index);
        if (typeof state_1 === "object")
            return state_1.value;
    }
    return bluebird_1.default.resolve();
}
exports.default = default_1;
