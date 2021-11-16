"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.parse = void 0;
/**
 * JSON.parse with fallback value
 * @param json
 * @param fallback
 * @returns
 */
function parse(json, fallback) {
    try {
        return JSON.parse(json);
    }
    catch (e) {
        return fallback;
    }
}
exports.parse = parse;
function stringify(object) {
    return JSON.stringify(object);
}
exports.stringify = stringify;
