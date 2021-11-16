"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// title: Create DOM with JSDOM
var jsdom_1 = require("jsdom");
var dom = new jsdom_1.JSDOM("<!doctype html><html><body></body></html>");
var window = dom.window;
var document = dom.window.document;
var navigator = window.navigator;
var div = document.createElement("div");
var content = document.createTextNode("hello");
console.log(content); //  Text {}
div.appendChild(content);
console.log(div.outerHTML); // undefined
