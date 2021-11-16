"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var md5_file_1 = __importDefault(require("md5-file"));
/**
 * IN MEMORY CACHE PROCESSOR, Save any values in RAM as caches.
 * - Reduce CPU Usage
 * - Reduce Resource Usage
 */
var default_1 = /** @class */ (function () {
    function default_1() {
        /**
         * Storage object for storing
         */
        this.caches = {};
        /**
         * Identifier Hash for cache
         */
        this.md5Cache = {};
    }
    /**
     * Set cache
     * @param key
     * @param value
     * @returns
     */
    default_1.prototype.set = function (key, value) {
        return this.setCache(key, value);
    };
    default_1.prototype.setCache = function (key, value) {
        this.caches[key] = value;
    };
    default_1.prototype.get = function (key, fallback) {
        return this.getCache(key, fallback);
    };
    default_1.prototype.getCache = function (key, fallback) {
        return this.caches[key] || fallback;
    };
    default_1.prototype.isFileChanged = function (filePath) {
        return __awaiter(this, void 0, void 0, function () {
            var hash1, hash, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, md5_file_1.default(filePath)];
                    case 1:
                        hash1 = _a.sent();
                        hash = this.md5Cache[filePath];
                        this.md5Cache[filePath] = hash1;
                        if (!hash) {
                            return [2 /*return*/, true];
                        }
                        if (hash === hash1) {
                            return [2 /*return*/, false];
                        }
                        return [2 /*return*/, true];
                    case 2:
                        err_1 = _a.sent();
                        return [2 /*return*/, true];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    return default_1;
}());
exports.default = default_1;
