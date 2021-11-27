import { imgOptions } from "../img/index.old";
import { _JSDOM } from "./dom";
import { HexoSeo } from "./schema/article";

export default function (dom: _JSDOM, HSconfig: imgOptions, data: HexoSeo) {
  const title =
    data.page && data.page.title && data.page.title.trim().length > 0
      ? data.page.title
      : data.config.title;
  dom.document.querySelectorAll("img[src]").forEach((element) => {
    if (!element.getAttribute("title")) {
      element.setAttribute("title", title);
    }
    if (!element.getAttribute("alt")) {
      element.setAttribute("alt", title);
    }
    if (!element.getAttribute("itemprop")) {
      element.setAttribute("itemprop", "image");
    }
  });
}
