"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom_1 = require("jsdom");
function default_1(content) {
    var dom = new jsdom_1.JSDOM(content);
    var document = dom.window.document;
    var cssx = document.querySelectorAll('link[rel="stylesheet"][href="/.css"]');
    cssx.forEach(function (i) {
        i.outerHTML = "<!-- invalid " + i.outerHTML + " -->";
    });
    return content;
}
exports.default = default_1;
