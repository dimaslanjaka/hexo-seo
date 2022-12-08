"use strict";
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
exports.hexoIsDump = void 0;
var hexo_log_1 = __importDefault(require("hexo-log"));
var package_json_1 = __importDefault(require("./package.json"));
var fs = __importStar(require("fs"));
var util_1 = __importDefault(require("util"));
var path_1 = __importDefault(require("path"));
var is_1 = __importDefault(require("./is"));
var log = (0, hexo_log_1.default)({
    debug: false,
    silent: false
});
/**
 * @example
 * // run inside plugin or theme event
 * import hexoIs from 'hexo-is';
 * const hexo = this;
 * console.log(hexoIs(hexo)); // object or string
 * @param hexo
 * @returns
 */
var hexoIs = function (hexo) {
    if (typeof hexo["page"] != "undefined")
        return (0, is_1.default)(hexo);
    if (typeof hexo["type"] != "undefined") {
        var ix = (0, is_1.default)(hexo);
        if (typeof ix[hexo["type"]] != "undefined")
            ix[hexo["type"]] = true;
        return ix;
    }
};
/**
 * Dump variable to file
 * @param toDump
 */
function hexoIsDump(toDump, name) {
    if (name === void 0) { name = ""; }
    if (name.length > 0)
        name = "-" + name;
    var dump = util_1.default.inspect(toDump, { showHidden: true, depth: null });
    var loc = path_1.default.join("tmp/hexo-is/dump" + name + ".txt");
    if (!fs.existsSync(path_1.default.dirname(loc))) {
        fs.mkdirSync(path_1.default.dirname(loc), { recursive: true });
    }
    fs.writeFileSync(loc, dump);
    log.log("".concat(package_json_1.default.name, ": dump saved to: ").concat(path_1.default.resolve(loc)));
}
exports.hexoIsDump = hexoIsDump;
exports.default = hexoIs;
