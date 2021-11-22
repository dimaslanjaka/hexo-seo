"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("../../packages/js-prototypes/src/String");
require("../../packages/js-prototypes/src/Array");
var fixSchema_1 = __importDefault(require("./fixSchema"));
var fixInvalid_1 = __importDefault(require("./fixInvalid"));
var fixHyperlinks_1 = __importDefault(require("./fixHyperlinks"));
var fixAttributes_1 = __importDefault(require("../img/fixAttributes"));
function default_1(content, data) {
    content = fixAttributes_1.default.bind(this)(content, data);
    content = fixHyperlinks_1.default.bind(this)(content, data);
    content = fixSchema_1.default.bind(this)(content, data);
    content = fixInvalid_1.default.bind(this)(content, data);
    return content;
}
exports.default = default_1;
