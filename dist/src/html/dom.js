"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextPartialHtml = exports.parseJSDOM = exports._JSDOM = void 0;
var jsdom_1 = require("jsdom");
var _JSDOM = /** @class */ (function () {
    function _JSDOM(str, options) {
        this.dom = new jsdom_1.JSDOM(str, options);
        this.window = this.dom.window;
        this.document = this.dom.window.document;
    }
    /**
     * Get JSDOM instances
     */
    _JSDOM.prototype.getDom = function () {
        return this.dom;
    };
    /**
     * Transform html string to Node
     * @param html
     * @returns
     */
    _JSDOM.prototype.toNode = function (html) {
        return getTextPartialHtml(html, this.options);
    };
    /**
     * serializing html / fix invalid html
     * @returns serialized html
     */
    _JSDOM.prototype.serialize = function () {
        return this.dom.serialize();
    };
    /**
     * Return Modified html (without serialization)
     */
    _JSDOM.prototype.toString = function () {
        return this.document.documentElement.outerHTML;
    };
    return _JSDOM;
}());
exports._JSDOM = _JSDOM;
var dom;
function parseJSDOM(text) {
    dom = new _JSDOM(text);
    return dom;
}
exports.parseJSDOM = parseJSDOM;
/**
 * Get text from partial html
 * @param text
 * @param options
 * @returns
 */
function getTextPartialHtml(text, options) {
    dom = new _JSDOM("<div id=\"parseJSDOM\">".concat(text, "</div>"), options);
    var document = dom.window.document;
    return document.querySelector("div#parseJSDOM").textContent;
}
exports.getTextPartialHtml = getTextPartialHtml;
