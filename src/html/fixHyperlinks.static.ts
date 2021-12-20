import { _JSDOM } from "./dom";
import { formatAnchorText, hyperlinkOptions, isExternal } from "./fixHyperlinks";
import { HexoSeo } from "./schema/article";
import parseUrl from "url-parse";

export default function (dom: _JSDOM, HSconfig: hyperlinkOptions, data: HexoSeo) {
  const a = dom.document.querySelectorAll("a[href]");
  if (a.length) {
    a.forEach((el: HTMLAnchorElement) => {
      const href = el.href;
      // only process anchor start with https?, otherwise abadoned
      if (/https?/gs.test(href)) {
        const parseHref = parseUrl(href);
        let rels = el.getAttribute("rel") ? el.getAttribute("rel").split(" ") : [];

        const external = isExternal(parseHref, hexo);
        rels = identifyRels(el, external, HSconfig);
        el.setAttribute("rel", rels.join(" "));
      }
      // set anchor title
      const aTitle = el.getAttribute("title");
      if (!aTitle || aTitle.length < 1) {
        let textContent: string;
        if (!el.textContent || el.textContent.length < 1) {
          textContent = hexo.config.title;
        } else {
          textContent = el.textContent;
        }
        el.setAttribute("title", formatAnchorText(textContent));
      }
    });
  }
}

export function identifyRels(
  el: HTMLAnchorElement | import("node-html-parser").HTMLElement,
  external: boolean,
  HSconfig: hyperlinkOptions
) {
  let rels: string[] = [];
  const externalArr = ["nofollow", "noopener", "noreferer", "noreferrer"];
  const internalArr = ["internal", "follow", "bookmark"];
  // if external link, assign external rel attributes and remove items from internal attributes if exists, and will do the opposite if the internal link
  if (external) {
    rels = rels.concat(externalArr).unique().hapusItemDariArrayLain(internalArr);
    if (typeof HSconfig.blank == "boolean" && HSconfig.blank) {
      el.setAttribute("target", "_blank");
    }
  } else {
    rels = rels.concat(internalArr).unique().hapusItemDariArrayLain(externalArr);
  }
  return rels;
}
