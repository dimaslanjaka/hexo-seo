"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var parsePartialJsdom = /** @class */ (function (_super) {
    __extends(parsePartialJsdom, _super);
    function parsePartialJsdom(text, options) {
        return _super.call(this, "<div id=\"parseJSDOM\">" + text + "</div>", options) || this;
    }
    parsePartialJsdom.prototype.getDocument = function () {
        return this.window.document;
    };
    /**
     * Get texts from partial html
     * @returns
     */
    parsePartialJsdom.prototype.getText = function () {
        var document = this.window.document;
        return document.querySelector("div#parseJSDOM").textContent;
    };
    return parsePartialJsdom;
}(jsdom_1.default.JSDOM));
exports.parsePartialJsdom = parsePartialJsdom;
