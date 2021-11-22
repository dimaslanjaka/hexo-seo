import { _JSDOM } from "../html/dom";
import { HexoSeo } from "../html/schema/article";
import { imgOptions } from "./index.old";
import { checkBrokenImg } from "../img/broken";
import logger from "../log";
import pkg from "../../package.json";

export default async function (
  dom: _JSDOM,
  HSconfig: imgOptions,
  data: HexoSeo
) {
  const images = dom.document.querySelectorAll("img[src]");
  for (let index = 0; index < images.length; index++) {
    const img = images.item(index);
    const src = img.getAttribute("src");
    if (src) {
      if (/^https?:\/\//.test(src)) {
        const check = await checkBrokenImg(src);
        if (typeof check == "object" && !check.success) {
          logger.log("%s(IMG:broken) fixing %s", pkg.name, src);
          img.setAttribute("src", check.resolved);
          img.setAttribute("src-ori", check.original);
        }
      }
    }
  }
}
