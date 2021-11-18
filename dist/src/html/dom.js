"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJsdom = void 0;
var jsdom_1 = __importDefault(require("jsdom"));
var dom, document;
function parseJsdom(text) {
    dom = new jsdom_1.default.JSDOM(text);
    document = dom.window.document;
    return {
        dom: dom,
        document: document
    };
}
exports.parseJsdom = parseJsdom;
