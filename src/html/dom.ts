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

export class parsePartialJsdom extends jsdom.JSDOM {
  constructor(text: string, options?: jsdom.ConstructorOptions) {
    super(`<div id="parseJSDOM">${text}</div>`, options);
  }

  getDocument(): Document {
    return this.window.document;
  }

  /**
   * Get texts from partial html
   * @returns
   */
  getText() {
    const document: Document = this.window.document;
    return document.querySelector("div#parseJSDOM").textContent;
  }
}
