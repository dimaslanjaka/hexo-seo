"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimText = void 0;
function trimText(content) {
    if (typeof content === "string")
        return content.trim();
    return content;
}
exports.trimText = trimText;
