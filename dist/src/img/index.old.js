"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const cheerio_1 = __importDefault(require("cheerio"));
const minimatch_1 = require("minimatch");
const config_1 = __importDefault(require("../config"));
const log_1 = __importDefault(require("../log"));
const utils_1 = require("../utils");
const stream_1 = require("../utils/stream");
async function default_1() {
    const hexo = this;
    const route = hexo.route;
    const options = (0, config_1.default)(hexo).img;
    // Filter routes to select all html files.
    const routes = route.list().filter(function (path0) {
        let choose = (0, minimatch_1.minimatch)(path0, '**/*.{htm,html}', { nocase: true });
        if (typeof options == 'object' && typeof options.exclude != 'undefined') {
            choose = choose && !(0, utils_1.isIgnore)(path0, options.exclude);
        }
        if (typeof hexo.config.skip_render != 'undefined') {
            // _config.yml skip_render https://hexo.io/docs/configuration.html#Directory
            choose = choose && !(0, utils_1.isIgnore)(path0, hexo.config.skip_render);
        }
        return choose;
    });
    const processor = (stream) => {
        (0, stream_1.streamToArray)(stream)
            .then((arr) => {
            return arr.join('');
        })
            .then((str) => {
            try {
                //dump("after_generate.txt", str);
                //logger.log(typeof str, "str");
                const $ = cheerio_1.default.load(str);
                const title = $('title').text();
                $('img').map(function (i, img) {
                    // fix image alt
                    const alt = $(img).attr('alt');
                    if (!alt || alt.trim().length === 0) {
                        $(img).attr('alt', title);
                    }
                    //const src = $(img).attr("src");
                });
            }
            catch (e) {
                log_1.default.error(e);
            }
            return str;
        });
    };
    /*return bPromise.map(routes, (path0) => {
      const stream = route.get(path0);
      return processor(stream);
    });*/
    return routes.map((path0) => {
        const stream = route.get(path0);
        return processor(stream);
    });
}
