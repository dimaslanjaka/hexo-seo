"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextPartialHtml = exports.parseJsdom = void 0;
var jsdom_1 = __importDefault(require("jsdom"));
var dom;
function parseJsdom(text) {
    dom = new jsdom_1.default.JSDOM(text);
    var document = dom.window.document;
    /*
    return {
      dom,
      document
    };*/
    return dom;
}
exports.parseJsdom = parseJsdom;
var domPart;
/**
 * Get text from partial html
 * @param text
 * @param options
 * @returns
 */
function getTextPartialHtml(text, options) {
    domPart = new jsdom_1.default.JSDOM("<div id=\"parseJSDOM\">" + text + "</div>", options);
    var document = domPart.window.document;
    return document.querySelector("div#parseJSDOM").textContent;
}
exports.getTextPartialHtml = getTextPartialHtml;
