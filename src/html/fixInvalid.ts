import Hexo from "hexo";
import { JSDOM } from "jsdom";

export default function (this: Hexo, content: string) {
  const dom = new JSDOM(content);
  const document: Document = dom.window.document;
  const cssx = document.querySelectorAll('*[href="/.css"],*[src="/.js"]');
  cssx.forEach((i) => {
    i.outerHTML = `<!-- invalid ${i.outerHTML} -->`;
  });
  content = document.documentElement.outerHTML;
  return content;
}
