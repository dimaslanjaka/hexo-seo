"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var hexo_log_1 = __importDefault(require("hexo-log"));
var logger = (0, hexo_log_1.default)({
    debug: false,
    silent: false
});
exports.default = logger;
