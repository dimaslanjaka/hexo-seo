"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLocalImage = void 0;
var underscore_1 = require("underscore");
/**
 * is local image
 */
exports.isLocalImage = (0, underscore_1.memoize)(function (url) {
    var regex = /^http?s/gs;
    return regex.test(url);
});
/**
 * Broken image fix
 * @param img
 */
function default_1(img) { }
exports.default = default_1;
