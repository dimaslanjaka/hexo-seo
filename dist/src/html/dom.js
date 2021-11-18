"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePartialJsdom = exports.parseJsdom = void 0;
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
var parsePartialJsdom = /** @class */ (function () {
    function parsePartialJsdom(text, options) {
        this.dom = new jsdom_1.default.JSDOM("<div id=\"parseJSDOM\">" + text + "</div>", options);
    }
    /**
     * Get texts from partial html
     * @returns
     */
    parsePartialJsdom.prototype.getText = function () {
        var document = this.dom.window.document;
        return document.querySelector("div#parseJSDOM").textContent;
    };
    return parsePartialJsdom;
}());
exports.parsePartialJsdom = parsePartialJsdom;
