import Hexo from "hexo";
import { JSDOM } from "jsdom";

export default function (this: Hexo, content: string) {
  const dom = new JSDOM(content);
  const document: Document = dom.window.document;
  const cssx = document.querySelectorAll(
    'link[rel="stylesheet"][href="/.css"]'
  );
  cssx.forEach((i) => {
    i.outerHTML = `<!-- invalid ${i.outerHTML} -->`;
  });
  return content;
}
