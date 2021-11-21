"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom_1 = require("jsdom");
function default_1(content) {
    var dom = new jsdom_1.JSDOM(content);
    var document = dom.window.document;
    var cssx = document.querySelectorAll('*[href="/.css"],*[src="/.js"]');
    cssx.forEach(function (i) {
        i.outerHTML = "<!-- invalid " + i.outerHTML + " -->";
    });
    content = document.documentElement.outerHTML;
    return content;
}
exports.default = default_1;
