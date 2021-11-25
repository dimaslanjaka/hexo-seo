"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.identifyRels = void 0;
var fixHyperlinks_1 = require("./fixHyperlinks");
var url_parse_1 = __importDefault(require("url-parse"));
function default_1(dom, HSconfig, data) {
    var a = dom.document.querySelectorAll("a[href]");
    if (a.length) {
        a.forEach(function (el) {
            var href = el.href;
            // only process anchor start with https?, otherwise abadoned
            if (/https?/gs.test(href)) {
                var parseHref = (0, url_parse_1.default)(href);
                var rels = el.getAttribute("rel")
                    ? el.getAttribute("rel").split(" ")
                    : [];
                var external_1 = (0, fixHyperlinks_1.isExternal)(parseHref, hexo);
                rels = identifyRels(el, external_1, HSconfig);
                el.setAttribute("rel", rels.join(" "));
            }
            // set anchor title
            var aTitle = el.getAttribute("title");
            if (!aTitle || aTitle.length < 1) {
                var textContent = void 0;
                if (!el.textContent || el.textContent.length < 1) {
                    textContent = hexo.config.title;
                }
                else {
                    textContent = el.textContent;
                }
                el.setAttribute("title", (0, fixHyperlinks_1.formatAnchorText)(textContent));
            }
        });
    }
}
exports.default = default_1;
function identifyRels(el, external, HSconfig) {
    var rels = [];
    var externalArr = ["nofollow", "noopener", "noreferer", "noreferrer"];
    var internalArr = ["internal", "follow", "bookmark"];
    // if external link, assign external rel attributes and remove items from internal attributes if exists, and will do the opposite if the internal link
    if (external) {
        rels = rels
            .concat(externalArr)
            .unique()
            .hapusItemDariArrayLain(internalArr);
        if (typeof HSconfig.blank == "boolean" && HSconfig.blank) {
            el.setAttribute("target", "_blank");
        }
    }
    else {
        rels = rels
            .concat(internalArr)
            .unique()
            .hapusItemDariArrayLain(externalArr);
    }
    return rels;
}
exports.identifyRels = identifyRels;
