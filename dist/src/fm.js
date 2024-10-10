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
exports.buildFolder = exports.tmpFolder = void 0;
exports.resolveFile = resolveFile;
exports.readFile = readFile;
exports.md5FileSync = md5FileSync;
exports.md5File = md5File;
exports.readDir = readDir;
const crypto_1 = __importDefault(require("crypto"));
const fs = __importStar(require("fs-extra"));
const sbg_utility_1 = require("sbg-utility");
const path = __importStar(require("upath"));
/**
 * Temp folder
 */
exports.tmpFolder = path.join(process.cwd(), 'tmp/hexo-seo');
exports.buildFolder = path.join(exports.tmpFolder, 'build');
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
/**
 * read file nested path
 * @param filePath
 * @param options
 * @returns
 */
function readFile(filePath, options, autocreate = undefined) {
    resolveFile(filePath);
    if (autocreate && !fs.existsSync(filePath)) {
        if (typeof autocreate === 'boolean') {
            (0, sbg_utility_1.writefile)(filePath, '');
        }
        else if (autocreate) {
            let text;
            if (Array.isArray(autocreate) || typeof autocreate === 'object') {
                text = JSON.stringify(autocreate);
            }
            (0, sbg_utility_1.writefile)(filePath, text);
        }
        return autocreate;
    }
    return fs.readFileSync(filePath, options);
}
const BUFFER_SIZE = 8192;
function md5FileSync(path) {
    const fd = fs.openSync(path, 'r');
    const hash = crypto_1.default.createHash('md5');
    const buffer = Buffer.alloc(BUFFER_SIZE);
    try {
        let bytesRead;
        do {
            bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE, null);
            hash.update(buffer.slice(0, bytesRead));
        } while (bytesRead === BUFFER_SIZE);
    }
    finally {
        fs.closeSync(fd);
    }
    return hash.digest('hex');
}
function md5File(path) {
    return new Promise((resolve, reject) => {
        const output = crypto_1.default.createHash('md5');
        const input = fs.createReadStream(path);
        input.on('error', (err) => {
            reject(err);
        });
        output.once('readable', () => {
            resolve(output.read().toString('hex'));
        });
        input.pipe(output);
    });
}
/**
 * Read Dir
 * @param folder
 * @returns
 */
function readDir(folder) {
    return fs.readdirSync(folder).map((file) => {
        return path.join(folder, file);
    });
}
