"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._JSDOM = void 0;
exports.parseJSDOM = parseJSDOM;
exports.getTextPartialHtml = getTextPartialHtml;
const jsdom_1 = require("jsdom");
class _JSDOM {
    constructor(str, options) {
        this.dom = new jsdom_1.JSDOM(str, options);
        this.window = this.dom.window;
        this.document = this.dom.window.document;
    }
    /**
     * Get JSDOM instances
     */
    getDom() {
        return this.dom;
    }
    /**
     * Transform html string to Node
     * @param html
     * @returns
     */
    toNode(html) {
        return getTextPartialHtml(html, this.options);
    }
    /**
     * serializing html / fix invalid html
     * @returns serialized html
     */
    serialize() {
        return this.dom.serialize();
    }
    /**
     * Return Modified html (without serialization)
     */
    toString() {
        return this.document.documentElement.outerHTML;
    }
}
exports._JSDOM = _JSDOM;
let dom;
function parseJSDOM(text) {
    dom = new _JSDOM(text);
    return { dom, window: dom.window, document: dom.window.document };
}
/**
 * Get text from partial html
 * @param text
 * @param options
 * @returns
 */
function getTextPartialHtml(text, options) {
    dom = new _JSDOM(`<div id="parseJSDOM">${text}</div>`, options);
    const document = dom.window.document;
    const result = document.querySelector('div#parseJSDOM').textContent;
    // prevent memory leaks
    dom.window.close();
    return result;
}
