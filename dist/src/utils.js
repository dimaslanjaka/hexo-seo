/* global hexo */
'use strict';
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
exports.isIgnore = void 0;
exports.extractSimplePageData = extractSimplePageData;
exports.dumpOnce = dumpOnce;
exports.dump = dump;
exports.getCacheFolder = getCacheFolder;
exports.getPackageFolder = getPackageFolder;
exports.getPackageFile = getPackageFile;
const fs = __importStar(require("fs-extra"));
const minimatch_1 = require("minimatch");
const rimraf_1 = require("rimraf");
const sanitize_filename_1 = __importDefault(require("sanitize-filename"));
const upath_1 = __importDefault(require("upath"));
const util_1 = __importDefault(require("util"));
const package_json_1 = __importDefault(require("../package.json"));
const hexo_seo_1 = require("./hexo-seo");
/**
 * is ignore pattern matching?
 */
const isIgnore = (path0, exclude, hexo) => {
    if (exclude && !Array.isArray(exclude))
        exclude = [exclude];
    if (path0 && exclude && exclude.length) {
        for (let i = 0, len = exclude.length; i < len; i++) {
            const excludePattern = exclude[i];
            if (hexo) {
                const fromBase = upath_1.default.join(hexo.base_dir, excludePattern);
                const fromSource = upath_1.default.join(hexo.source_dir, excludePattern);
                //log.log([path0, fromBase, fromSource, excludePattern]);
                if ((0, minimatch_1.minimatch)(path0, fromSource))
                    return true;
                if ((0, minimatch_1.minimatch)(path0, fromBase))
                    return true;
            }
            if ((0, minimatch_1.minimatch)(path0, excludePattern))
                return true;
        }
    }
    return false;
};
exports.isIgnore = isIgnore;
/**
 * Simplify object data / delete object key
 * @param data
 */
function extractSimplePageData(data, additional = []) {
    if (data) {
        delete data['_raw'];
        delete data['raw'];
        delete data['_model'];
        delete data['_content'];
        delete data['content'];
        delete data['site'];
        delete data['more'];
        delete data['excerpt'];
    }
    if (additional.forEach) {
        additional.forEach((key) => {
            if (typeof key == 'string')
                delete data[key];
        });
    }
    return data;
}
const dumpKeys = [];
/**
 * Dump once
 * @param filename
 * @param obj
 */
function dumpOnce(filename, ...obj) {
    if (!dumpKeys[filename]) {
        dumpKeys[filename] = true;
        dump(filename, obj);
    }
}
/**
 * first initialization indicator
 */
const firstIndicator = {};
/**
 * Dump large objects
 * @param filename
 * @param obj
 */
function dump(filename, ...obj) {
    if (!hexo_seo_1.isDev)
        return;
    const hash = (0, sanitize_filename_1.default)(filename).toString().replace(/\s/g, '-');
    const filePath = upath_1.default.join(process.cwd(), '/tmp/hexo-seo/dump', hash);
    // truncate directory on first time
    if (!('dump' in firstIndicator)) {
        (0, rimraf_1.rimrafSync)(filePath);
        firstIndicator['dump'] = true;
    }
    if (!fs.existsSync(upath_1.default.dirname(filePath))) {
        fs.mkdirSync(upath_1.default.dirname(filePath), { recursive: true });
    }
    let buildLog = '';
    for (let index = 0; index < obj.length; index++) {
        buildLog += util_1.default.inspect(obj[index], { showHidden: true, depth: null }) + '\n\n';
    }
    fs.writeFileSync(filePath, buildLog);
    console.log(`dump results saved to ${upath_1.default.resolve(filePath)}`);
}
/**
 * get cache folder location
 * @param folderName
 * @returns
 */
function getCacheFolder(folderName = '') {
    let root = process.cwd();
    if (typeof hexo != 'undefined') {
        root = hexo.base_dir;
    }
    return upath_1.default.join(root, 'build/hexo-seo', folderName);
}
/**
 * get current package folder
 * @returns
 */
function getPackageFolder() {
    return upath_1.default.join(process.cwd(), 'node_modules', package_json_1.default.name);
}
/**
 * Get current package file
 * @param name
 * @returns
 */
function getPackageFile(pathname) {
    return upath_1.default.join(getPackageFolder(), pathname);
}
