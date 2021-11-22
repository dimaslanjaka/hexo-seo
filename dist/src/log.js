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
logger.olog = logger.log;
logger.prepend = function (text) {
    logger.log = function () {
        var anyx = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            anyx[_i] = arguments[_i];
        }
        logger.olog(text, anyx);
    };
};
exports.default = logger;
