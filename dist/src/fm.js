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
Object.defineProperty(exports, "__esModule", { value: true });
exports.readFile = exports.writeFile = exports.resolveFile = void 0;
var fs = __importStar(require("fs"));
var path = __importStar(require("path"));
/**
 * resolve dirname of file
 * @param filePath
 * @returns
 */
function resolveFile(filePath) {
    if (!fs.existsSync(path.dirname(filePath))) {
        fs.mkdirSync(path.dirname(filePath), { recursive: true });
    }
    return filePath;
}
exports.resolveFile = resolveFile;
/**
 * write file nested path
 * @param filePath
 */
function writeFile(filePath, content) {
    resolveFile(filePath);
    fs.writeFileSync(filePath, content);
}
exports.writeFile = writeFile;
/**
 * read file nested path
 * @param filePath
 * @param options
 * @returns
 */
function readFile(filePath, options, autocreate) {
    resolveFile(filePath);
    if (autocreate && !fs.existsSync(filePath)) {
        writeFile(filePath, "");
    }
    return fs.readFileSync(filePath, options);
}
exports.readFile = readFile;
