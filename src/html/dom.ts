import jsdom from "jsdom";

let dom: jsdom.JSDOM;
export function parseJsdom(text: string) {
  dom = new jsdom.JSDOM(text);
  const document = dom.window.document;
  /*
  return {
    dom,
    document
  };*/
  return dom;
}

export class parsePartialJsdom {
  dom: jsdom.JSDOM;
  constructor(text: string, options?: jsdom.ConstructorOptions) {
    this.dom = new jsdom.JSDOM(`<div id="parseJSDOM">${text}</div>`, options);
  }

  /**
   * Get texts from partial html
   * @returns
   */
  getText() {
    const document: Document = this.dom.window.document;
    return document.querySelector("div#parseJSDOM").textContent;
  }
}
