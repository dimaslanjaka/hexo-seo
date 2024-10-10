"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HexoSeoJs;
exports.minifyJS = minifyJS;
const fs_extra_1 = __importDefault(require("fs-extra"));
const object_assign_1 = __importDefault(require("object-assign"));
const terser_1 = require("terser");
const package_json_1 = __importDefault(require("../../package.json"));
const cache_1 = __importDefault(require("../cache"));
const config_1 = __importDefault(require("../config"));
const log_1 = __importDefault(require("../log"));
const utils_1 = require("../utils");
const cache = new cache_1.default();
/**
 * minify js
 * @param this
 * @param str
 * @param data
 * @returns
 */
async function HexoSeoJs(str, data) {
    const path0 = data.path;
    if (!path0) {
        log_1.default.error('%s(CSS) invalid path', package_json_1.default.name);
        return;
    }
    const hexoCfg = (0, config_1.default)(this);
    const jsCfg = hexoCfg.js;
    // if option js is false, return original content
    if (typeof jsCfg == 'boolean' && !jsCfg)
        return str;
    // keep original js file when concatenate JS enabled
    if (jsCfg.concat)
        return str;
    const isChanged = await cache.isFileChanged(path0);
    const useCache = hexoCfg.cache;
    if (isChanged || !useCache) {
        // if original file is changed, re-minify js
        //const hexo: Hexo = this;
        let options = {
            exclude: ['*.min.js']
        };
        if (typeof jsCfg === 'boolean') {
            if (!jsCfg)
                return str;
        }
        else if (typeof jsCfg == 'object') {
            options = (0, object_assign_1.default)(options, jsCfg);
            if ((0, utils_1.isIgnore)(path0, options.exclude))
                return str;
        }
        let minifyOptions = {
            mangle: {
                toplevel: true, // to mangle names declared in the top level scope.
                properties: false, // disable mangle object and array properties
                safari10: true, // to work around the Safari 10 loop iterator
                keep_fnames: true, // keep function names
                keep_classnames: true // keep class name
            },
            compress: {
                dead_code: true //remove unreachable code
            }
        };
        if (typeof options.options == 'object') {
            minifyOptions = (0, object_assign_1.default)(minifyOptions, options.options);
        }
        try {
            const result = await (0, terser_1.minify)(str, minifyOptions);
            if (result.code && result.code.length > 0) {
                const saved = (((str.length - result.code.length) / str.length) * 100).toFixed(2);
                log_1.default.log('%s(JS): %s [%s saved]', package_json_1.default.name, path0, `${saved}%`);
                str = result.code;
                // set new minified js cache
                cache.setCache(path0, str);
            }
        }
        catch (e) {
            log_1.default.error(`Minifying ${path0} error`, e);
            // minify error, return original js
            return str;
        }
    }
    else {
        // get cached minified js
        str = await cache.getCache(path0, str);
        log_1.default.log('%s(JS) cached [%s]', package_json_1.default.name, path0.replace(this.base_dir, ''));
    }
    return str;
}
/**
 * minify js
 * @param str
 * @param options
 * @returns
 */
async function minifyJS(str, options) {
    let minifyOptions = {
        mangle: {
            toplevel: true, // to mangle names declared in the top level scope.
            properties: false, // disable mangle object and array properties
            safari10: true, // to work around the Safari 10 loop iterator
            keep_fnames: true, // keep function names
            keep_classnames: true // keep class name
        },
        compress: {
            dead_code: true //remove unreachable code
        }
    };
    if (typeof options == 'object') {
        minifyOptions = (0, object_assign_1.default)(minifyOptions, options);
    }
    const path0 = fs_extra_1.default.existsSync(str) ? str : 'inline';
    if (path0 !== 'inline') {
        str = fs_extra_1.default.readFileSync(path0).toString();
    }
    try {
        const result = await (0, terser_1.minify)(str, minifyOptions);
        if (result.code && result.code.length > 0) {
            const saved = (((str.length - result.code.length) / str.length) * 100).toFixed(2);
            log_1.default.log('%s(JS): %s [%s saved]', package_json_1.default.name, path0, `${saved}%`);
            str = result.code;
            // set new minified js cache
            if (path0 !== 'inline')
                cache.setCache(path0, str);
        }
    }
    catch (e) {
        log_1.default.error(`Minifying ${path0} error`, e);
        // minify error, return original js
        return str;
    }
}
