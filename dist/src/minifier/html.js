"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var bluebird_1 = __importDefault(require("bluebird"));
var html_minifier_terser_1 = require("html-minifier-terser");
var minimatch_1 = __importDefault(require("minimatch"));
var package_json_1 = __importDefault(require("../../package.json"));
var config_1 = __importDefault(require("../config"));
var log_1 = __importDefault(require("../log"));
var utils_1 = require("../utils");
var stream_1 = require("../utils/stream");
var minHtml = function () {
    var hexo = this;
    var options = (0, config_1["default"])(hexo).html;
    // if option html is false, return
    if (typeof options == "boolean" && !options)
        return;
    var route = hexo.route;
    // Filter routes to select all html files.
    var routes = route.list().filter(function (path0) {
        var choose = (0, minimatch_1["default"])(path0, "**/*.{htm,html}", { nocase: true });
        if (typeof options.exclude != "undefined") {
            choose = choose && !(0, utils_1.isIgnore)(path0, options.exclude);
        }
        if (typeof hexo.config.skip_render != "undefined") {
            // _config.yml skip_render https://hexo.io/docs/configuration.html#Directory
            choose = choose && !(0, utils_1.isIgnore)(path0, hexo.config.skip_render);
        }
        return choose;
    });
    return bluebird_1["default"].all(routes).map(function (path0) {
        //const str = await minify(str, options);
        // Retrieve and concatenate buffers.
        var stream = route.get(path0);
        return (0, stream_1.streamToArray)(stream)
            .then(function (buff) {
            return buff.join("");
        })
            .then(function (str) {
            return (0, html_minifier_terser_1.minify)(str, options).then(function (result) {
                var len0 = result.length;
                var saved = len0 ? (((len0 - result.length) / len0) * 100).toFixed(2) : 0;
                log_1["default"].log("%s(HTML): %s [ %s saved]", package_json_1["default"].name, path0, saved + "%");
                route.set(path0, result);
                return result;
            });
        });
    });
};
exports["default"] = minHtml;
