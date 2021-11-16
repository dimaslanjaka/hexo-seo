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
exports.hexoIsDump = void 0;
var hexo_log_1 = __importDefault(require("hexo-log"));
var package_json_1 = __importDefault(require("./package.json"));
var fs = __importStar(require("fs"));
var util_1 = __importDefault(require("util"));
var path_1 = __importDefault(require("path"));
var is_1 = __importDefault(require("./is"));
var log = hexo_log_1.default({
    debug: false,
    silent: false
});
/**
 * @example
 * // run inside plugin or theme event
 * import hexoIs from 'hexo-is';
 * const hexo = this;
 * console.log(hexoIs(hexo));
 * @param hexo
 * @returns
 */
var hexoIs = function (hexo) {
    if (typeof hexo["page"] != "undefined")
        return is_1.default(hexo);
    /*
    if (typeof hexo["locals"] != "undefined") {
      hexoIsDump(hexo["locals"]["page"], "locals");
    }
    */
    /*
    if (typeof hexo["extend"] != "undefined") {
      const filter = hexo["extend"]["filter"];
      //filter.register("after_render:html", dumper);
      //hexoIsDump(filter["store"]["_after_html_render"], "filter");
    }
    */
};
function dumper() {
    hexoIsDump(arguments, "arg");
}
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
    log.log(package_json_1.default.name + ": dump saved to: " + path_1.default.resolve(loc));
}
exports.hexoIsDump = hexoIsDump;
exports.default = hexoIs;
