"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocalImage = void 0;
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
function default_1(img) { }
exports.default = default_1;
