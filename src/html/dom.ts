import jsdom from "jsdom";

export function parseJsdom(text: string) {
  const dom = new jsdom.JSDOM(text);
  const document = dom.window.document;
  /*
  return {
    dom,
    document
  };*/
  return dom;
}

/**
 * Get text from partial html
 * @param text
 * @param options
 * @returns
 */
export function getTextPartialHtml(
  text: string,
  options?: jsdom.ConstructorOptions
) {
  const domPart = new jsdom.JSDOM(
    `<div id="parseJSDOM">${text}</div>`,
    options
  );
  const document: Document = domPart.window.document;
  return document.querySelector("div#parseJSDOM").textContent;
}
