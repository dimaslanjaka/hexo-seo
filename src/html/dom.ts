import jsdom from "jsdom";

let dom: jsdom.JSDOM, document: Document;
export function parseJsdom(text: string) {
  dom = new jsdom.JSDOM(text);
  document = dom.window.document;
  return {
    dom,
    document
  };
}
