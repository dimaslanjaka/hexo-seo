import Hexo from "hexo";
import { JSDOM } from "jsdom";
import getConfig from "../config";

export default function (this: Hexo, content: string) {
  const HSconfig = getConfig(this);
  const dom = new JSDOM(content);
  const document: Document = dom.window.document;
  const cssx = document.querySelectorAll('*[href="/.css"],*[src="/.js"]');
  cssx.forEach((i) => {
    i.outerHTML = `<!-- invalid ${i.outerHTML} -->`;
  });
  if (typeof HSconfig.html.fix == "boolean" && HSconfig.html.fix) {
    content = dom.serialize();
  } else {
    content = document.documentElement.outerHTML;
  }
  return content;
}
