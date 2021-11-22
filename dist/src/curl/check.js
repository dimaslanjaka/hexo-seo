"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var node_libcurl_1 = require("node-libcurl");
var cache_1 = require("../cache");
var index_1 = require("../index");
var bluebird_1 = __importDefault(require("bluebird"));
var cache = new cache_1.CacheFile("curl");
/**
 * Check if url is exists
 */
var checkUrl = function (url) {
    var isChanged = cache.isFileChanged(url.toString());
    var defaultReturn = {
        result: false,
        statusCode: null,
        data: null,
        headers: null
    };
    if (index_1.isDev || isChanged) {
        try {
            return bluebird_1.default.resolve(node_libcurl_1.curly.get(url.toString())).then(function (response) {
                var statusCode = response.statusCode;
                var data = response.data;
                var headers = response.headers;
                var result = statusCode < 400 || statusCode >= 500 || statusCode === 200;
                cache.set(url.toString(), { result: result, statusCode: statusCode, data: data, headers: headers });
                return { result: result, statusCode: statusCode, data: data, headers: headers };
            });
        }
        catch (e) {
            return defaultReturn;
        }
    }
    return cache.get(url.toString(), defaultReturn);
};
exports.default = checkUrl;
