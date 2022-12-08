"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var minimatch_1 = __importDefault(require("minimatch"));
var path_1 = __importDefault(require("path"));
var locts = path_1.default.join(__dirname, "tsconfig.json");
if ((0, fs_1.existsSync)(locts)) {
    var tsconfig_1 = JSON.parse((0, fs_1.readFileSync)(locts).toString());
    var outDir_1 = tsconfig_1.compilerOptions.outDir;
    var readDir = (0, fs_1.readdirSync)(__dirname).filter(function (file) {
        return matchPatternList(file, tsconfig_1.include, { matchBase: true });
    });
    if ((0, fs_1.existsSync)(outDir_1)) {
        readDir.forEach(function (file) {
            var toCopy = path_1.default.join(__dirname, file);
            var destCopy = path_1.default.resolve(path_1.default.join(outDir_1, file));
            //console.log(toCopy, destCopy);
            (0, fs_1.copyFileSync)(toCopy, destCopy);
        });
    }
}
/**
 * Match a single string against a list of patterns
 *
 * @param path String - a string to match
 * @param patternList Array - list of patterns to match against
 * @param options Object - hash of options that will be passed to minimatch()
 */
function matchPatternList(path, patternList, options) {
    return patternList.some(function (pattern) {
        return (0, minimatch_1.default)(path, pattern, options);
    });
}
