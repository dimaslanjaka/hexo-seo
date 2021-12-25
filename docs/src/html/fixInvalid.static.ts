import { ReturnConfig } from "../config";
import { _JSDOM } from "./dom";
import { HexoSeo } from "./schema/article";

export default function (dom: _JSDOM, HSconfig: ReturnConfig, data: HexoSeo) {
  const cssx = dom.document.querySelectorAll('*[href="/.css"],*[src="/.js"]');
  cssx.forEach((i) => {
    i.outerHTML = `<!-- invalid ${i.outerHTML} -->`;
  });
}
