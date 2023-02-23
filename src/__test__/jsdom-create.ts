// title: Create DOM with JSDOM
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>');
const window = dom.window;
const document = dom.window.document;
const navigator = window.navigator;

const div = document.createElement('div');
const content = document.createTextNode('hello');
console.log(content); //  Text {}
div.appendChild(content);
console.log(div.outerHTML); // undefined
