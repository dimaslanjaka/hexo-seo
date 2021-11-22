"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(dom, HSconfig, data) {
    var title = data.page && data.page.title && data.page.title.trim().length > 0
        ? data.page.title
        : data.config.title;
    dom.document.querySelectorAll("img[src]").forEach(function (element) {
        if (!element.getAttribute("title")) {
            element.setAttribute("title", title);
        }
        if (!element.getAttribute("alt")) {
            element.setAttribute("alt", title);
        }
        if (!element.getAttribute("itemprop")) {
            element.setAttribute("itemprop", "image");
        }
    });
}
exports.default = default_1;
