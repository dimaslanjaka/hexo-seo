"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUrlPattern = void 0;
function isValidUrlPattern(url) {
    try {
        if (new URL(url).hostname)
            return true;
    }
    catch (e) {
        return false;
    }
    return false;
}
exports.isValidUrlPattern = isValidUrlPattern;
