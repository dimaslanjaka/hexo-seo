'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HexoSeoCss;
const ansi_colors_1 = __importDefault(require("ansi-colors"));
const clean_css_1 = __importDefault(require("clean-css"));
const package_json_1 = __importDefault(require("../../package.json"));
const cache_1 = __importDefault(require("../cache"));
const config_1 = __importDefault(require("../config"));
const log_1 = __importDefault(require("../log"));
const utils_1 = require("../utils");
const cache = new cache_1.default();
async function HexoSeoCss(str, data) {
    const path0 = data.path;
    const isChanged = await cache.isFileChanged(path0);
    const useCache = this.config.seo.cache;
    if (isChanged || !useCache) {
        log_1.default.log('%s is changed %s', path0, isChanged ? ansi_colors_1.default.red(String(isChanged)) : ansi_colors_1.default.green(String(isChanged)));
        // if original file is changed, re-minify css
        const hexo = this;
        const options = (0, config_1.default)(hexo).css;
        // if option css is false, return original content
        if (typeof options == 'boolean' && !options)
            return str;
        const exclude = typeof options.exclude == 'object' ? options.exclude : [];
        if (path0 && exclude && exclude.length > 0) {
            const ignored = (0, utils_1.isIgnore)(path0, exclude);
            log_1.default.log('%s(CSS:exclude) %s %s %s', package_json_1.default.name, ignored ? ansi_colors_1.default.red(String(ignored)) : ansi_colors_1.default.green(String(ignored)), path0, exclude.join(', '));
            if (ignored)
                return str;
        }
        if (typeof options == 'object') {
            try {
                const { styles } = await new clean_css_1.default(options).minify(str);
                const saved = (((str.length - styles.length) / str.length) * 100).toFixed(2);
                log_1.default.log('%s(CSS): %s [%s saved]', package_json_1.default.name, path0, saved + '%');
                str = styles;
                cache.set(path0, str);
            }
            catch (err) {
                log_1.default.log('%d(CSS) %s %s', package_json_1.default.name, path0 + ansi_colors_1.default.redBright('failed'));
                log_1.default.error(err);
            }
        }
    }
    else {
        log_1.default.log('%s(CSS) cached [%s]', package_json_1.default.name, path0.replace(this.base_dir, ''));
        str = cache.get(path0, '');
    }
    return str;
}
