import { DomHandler, Parser } from "htmlparser2";

const html = `<html><body> <div><p>1. Some text .../p><p>2. Some text .../p></div><p> <b>Click</b> to change the <span id="tag">html</span> </p><p> to a <span id="text">text</span> node. </p><p> This <button name="nada">button</button> does nothing. </p><script src="index.js"></script></body></html>`;

const handler = new DomHandler();
const parser = new Parser(handler);

parser.write(html);
parser.end();

const root = handler.root;

console.log(root);
