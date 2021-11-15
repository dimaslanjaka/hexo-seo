/* eslint-disable import/no-import-module-exports */
/* global hexo */
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dump = exports.extractSimplePageData = exports.isIgnore = void 0;
var minimatch_1 = __importDefault(require("minimatch"));
var underscore_1 = __importDefault(require("underscore"));
var path_1 = __importDefault(require("path"));
var fs = __importStar(require("fs"));
var rimraf_1 = __importDefault(require("rimraf"));
var util_1 = __importDefault(require("util"));
var log_1 = __importDefault(require("./log"));
var sanitize_filename_1 = __importDefault(require("sanitize-filename"));
var hexo_seo_1 = require("./hexo-seo");
var md5Cache = {};
var fileCache = {};
/**
 * is ignore pattern matching?
 */
exports.isIgnore = underscore_1.default.memoize(function (path0, exclude, hexo) {
    if (exclude && !Array.isArray(exclude))
        exclude = [exclude];
    if (path0 && exclude && exclude.length) {
        for (var i = 0, len = exclude.length; i < len; i++) {
            var excludePattern = exclude[i];
            if (hexo) {
                var fromBase = path_1.default.join(hexo.base_dir, excludePattern);
                var fromSource = path_1.default.join(hexo.source_dir, excludePattern);
                //log.log([path0, fromBase, fromSource, excludePattern]);
                if ((0, minimatch_1.default)(path0, fromSource))
                    return true;
                if ((0, minimatch_1.default)(path0, fromBase))
                    return true;
            }
            if ((0, minimatch_1.default)(path0, excludePattern))
                return true;
        }
    }
    return false;
});
/**
 * Simplify object data
 * @param data
 */
function extractSimplePageData(data) {
    delete data._raw;
    delete data.raw;
    delete data._content;
    delete data.content;
    delete data.site;
    return data;
}
exports.extractSimplePageData = extractSimplePageData;
var isFirst = true;
/**
 * Dump large objects
 * @param filename
 * @param obj
 */
var dump = function (filename) {
    var obj = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        obj[_i - 1] = arguments[_i];
    }
    if (!hexo_seo_1.isDev)
        return;
    var hash = (0, sanitize_filename_1.default)(filename).toString().replace(/\s+/, "-");
    var loc = path_1.default.join(__dirname, "../tmp", hash);
    if (isFirst) {
        (0, rimraf_1.default)(loc, function (err) {
            log_1.default.log(loc, "deleted", err ? "fail" : "success");
        });
        isFirst = false;
    }
    if (!fs.existsSync(path_1.default.dirname(loc))) {
        fs.mkdirSync(path_1.default.dirname(loc), { recursive: true });
    }
    var buildLog = "";
    for (var index = 0; index < obj.length; index++) {
        buildLog +=
            util_1.default.inspect(obj[index], { showHidden: true, depth: null }) + "\n\n";
    }
    fs.writeFileSync(loc, buildLog);
    console.log("dump results saved to " + path_1.default.resolve(loc));
};
exports.dump = dump;
