"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimText = void 0;
function trimText(content) {
    if (typeof content === "string")
        return content.trim();
    console.log(content, typeof content);
}
exports.trimText = trimText;
