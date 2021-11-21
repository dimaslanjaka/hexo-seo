"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsdom_1 = require("jsdom");
var config_1 = __importDefault(require("../config"));
function default_1(content, data) {
    var HSconfig = (0, config_1.default)(this);
    var dom = new jsdom_1.JSDOM(content);
    var document = dom.window.document;
    var cssx = document.querySelectorAll('*[href="/.css"],*[src="/.js"]');
    cssx.forEach(function (i) {
        i.outerHTML = "<!-- invalid " + i.outerHTML + " -->";
    });
    if (typeof HSconfig.html.fix == "boolean" && HSconfig.html.fix) {
        content = dom.serialize();
    }
    else {
        content = document.documentElement.outerHTML;
    }
    return content;
}
exports.default = default_1;
