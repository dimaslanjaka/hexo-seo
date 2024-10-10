"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
exports.identifyRels = identifyRels;
const url_parse_1 = __importDefault(require("url-parse"));
const array_1 = require("../utils/array");
const url_1 = require("../utils/url");
const types_1 = require("./types");
function default_1(dom, HSconfig, _data) {
    const a = dom.document.querySelectorAll('a[href]');
    if (a.length) {
        a.forEach((el) => {
            const href = el.href;
            // only process anchor start with https?, otherwise abadoned
            if ((0, url_1.isValidHttpUrl)(href)) {
                const parseHref = (0, url_parse_1.default)(href);
                let rels = el.getAttribute('rel') ? el.getAttribute('rel').split(' ') : [];
                const external = (0, types_1.isExternal)(parseHref, hexo);
                rels = identifyRels(el, external, HSconfig);
                el.setAttribute('rel', rels.join(' '));
            }
            // set anchor title
            const aTitle = el.getAttribute('title');
            if (!aTitle || aTitle.length < 1) {
                let textContent;
                if (!el.textContent || el.textContent.length < 1) {
                    textContent = hexo.config.title;
                }
                else {
                    textContent = el.textContent;
                }
                el.setAttribute('title', (0, types_1.formatAnchorText)(textContent));
            }
        });
    }
}
function identifyRels(el, external, HSconfig) {
    let rels = [];
    const externalArr = ['nofollow', 'noopener', 'noreferer', 'noreferrer', 'external'];
    const internalArr = ['internal', 'follow', 'bookmark'];
    // if external link, assign external rel attributes and remove items from internal attributes if exists, and will do the opposite if the internal link
    const newRels = (0, array_1.array_unique)(rels);
    if (external) {
        rels = (0, array_1.remove_array_item_from)(newRels.concat(externalArr), internalArr);
        if (typeof HSconfig.blank == 'boolean' && HSconfig.blank) {
            el.setAttribute('target', '_blank');
        }
    }
    else {
        rels = (0, array_1.remove_array_item_from)(newRels.concat(internalArr), externalArr);
    }
    return rels;
}
