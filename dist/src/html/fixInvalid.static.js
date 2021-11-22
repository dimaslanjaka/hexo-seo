"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(dom, HSconfig, data) {
    var cssx = dom.document.querySelectorAll('*[href="/.css"],*[src="/.js"]');
    cssx.forEach(function (i) {
        i.outerHTML = "<!-- invalid " + i.outerHTML + " -->";
    });
}
exports.default = default_1;
