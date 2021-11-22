"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../packages/js-prototypes/src/String");
require("../../packages/js-prototypes/src/Array");
var log_1 = __importDefault(require("../log"));
var package_json_1 = __importDefault(require("../../package.json"));
function default_1(content, data) {
    log_1.default.log("%s fixing schema..", package_json_1.default.name);
    //content = fixSchema.bind(this)(content, data);
    return content;
}
exports.default = default_1;
