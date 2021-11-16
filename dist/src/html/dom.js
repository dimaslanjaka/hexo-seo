"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllAttributes = exports.cheerioParseHtml = void 0;
var cheerio_1 = __importDefault(require("cheerio"));
// not working
var cheerioParseHtml = function (htmlstring) {
    if (!htmlstring || htmlstring.length < 1)
        return null;
    return cheerio_1.default.load(htmlstring);
};
exports.cheerioParseHtml = cheerioParseHtml;
var getAllAttributes = function (node) {
    return (node.attributes ||
        Object.keys(node.attribs).map(function (name) { return ({
            name: name,
            value: node.attribs[name]
        }); }));
};
exports.getAllAttributes = getAllAttributes;
