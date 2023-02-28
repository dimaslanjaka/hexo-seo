"use strict";
exports.__esModule = true;
exports.isValidHttpUrl = exports.isValidUrlPattern = void 0;
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
function isValidHttpUrl(string) {
    var url;
    try {
        url = new URL(string);
    }
    catch (_) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
}
exports.isValidHttpUrl = isValidHttpUrl;
