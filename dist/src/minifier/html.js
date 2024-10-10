'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bluebird_1 = __importDefault(require("bluebird"));
const html_minifier_terser_1 = require("html-minifier-terser");
const minimatch_1 = require("minimatch");
const package_json_1 = __importDefault(require("../../package.json"));
const config_1 = __importDefault(require("../config"));
const log_1 = __importDefault(require("../log"));
const utils_1 = require("../utils");
const stream_1 = require("../utils/stream");
const minHtml = function () {
    const hexo = this;
    const options = (0, config_1.default)(hexo).html;
    // if option html is false, return
    if (typeof options == 'boolean' && !options)
        return;
    const route = hexo.route;
    // Filter routes to select all html files.
    const routes = route.list().filter(function (path0) {
        let choose = (0, minimatch_1.minimatch)(path0, '**/*.{htm,html}', { nocase: true });
        if (typeof options.exclude != 'undefined') {
            choose = choose && !(0, utils_1.isIgnore)(path0, options.exclude);
        }
        if (typeof hexo.config.skip_render != 'undefined') {
            // _config.yml skip_render https://hexo.io/docs/configuration.html#Directory
            choose = choose && !(0, utils_1.isIgnore)(path0, hexo.config.skip_render);
        }
        return choose;
    });
    return bluebird_1.default.all(routes).map((path0) => {
        //const str = await minify(str, options);
        // Retrieve and concatenate buffers.
        const stream = route.get(path0);
        return (0, stream_1.streamToArray)(stream)
            .then((buff) => {
            return buff.join('');
        })
            .then((str) => {
            return (0, html_minifier_terser_1.minify)(str, options).then((result) => {
                const len0 = result.length;
                const saved = len0 ? (((len0 - result.length) / len0) * 100).toFixed(2) : 0;
                log_1.default.log('%s(HTML): %s [ %s saved]', package_json_1.default.name, path0, saved + '%');
                route.set(path0, result);
                return result;
            });
        });
    });
};
exports.default = minHtml;
