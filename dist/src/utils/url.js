"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUrlPattern = isValidUrlPattern;
exports.isValidHttpUrl = isValidHttpUrl;
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
function isValidHttpUrl(string) {
    let url;
    try {
        url = new URL(string);
    }
    catch (_) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
}
