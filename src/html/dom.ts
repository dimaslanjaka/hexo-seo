import jsdom, { ConstructorOptions, DOMWindow, JSDOM } from 'jsdom';

export class _JSDOM {
  private dom: JSDOM;
  document: Document;
  window: DOMWindow;
  options: ConstructorOptions;
  constructor(str?: string | Buffer, options?: ConstructorOptions) {
    this.dom = new JSDOM(str, options);
    this.window = this.dom.window;
    this.document = this.dom.window.document;
  }
  /**
   * Get JSDOM instances
   */
  getDom() {
    return this.dom;
  }
  /**
   * Transform html string to Node
   * @param html
   * @returns
   */
  toNode(html: string) {
    return getTextPartialHtml(html, this.options);
  }
  /**
   * serializing html / fix invalid html
   * @returns serialized html
   */
  serialize(): string {
    return this.dom.serialize();
  }
  /**
   * Return Modified html (without serialization)
   */
  toString() {
    return this.document.documentElement.outerHTML;
  }
}

let dom: _JSDOM;
export function parseJSDOM(text: string) {
  dom = new _JSDOM(text);
  return { dom, window: dom.window, document: dom.window.document };
}

/**
 * Get text from partial html
 * @param text
 * @param options
 * @returns
 */
export function getTextPartialHtml(text: string, options?: jsdom.ConstructorOptions) {
  dom = new _JSDOM(`<div id="parseJSDOM">${text}</div>`, options);
  const document: Document = dom.window.document;
  const result = document.querySelector('div#parseJSDOM').textContent;

  // prevent memory leaks
  dom.window.close();

  return result;
}
