import { _JSDOM } from "../html/dom";
import { HexoSeo } from "../html/schema/article";
import { imgOptions } from "./index.old";
import { checkBrokenImg } from "../img/broken";
import logger from "../log";
import pkg from "../../package.json";

export default function (dom: _JSDOM, HSconfig: imgOptions, data: HexoSeo) {
  dom.document.querySelectorAll("img[src]").forEach((img) => {
    const src = img.getAttribute("src");
    if (src) {
      if (/^https?:\/\//.test(src)) {
        checkBrokenImg(src).then((check) => {
          if (typeof check == "object") {
            logger.log("%s(IMG:broken) fixing %s", pkg.name, src);
            img.setAttribute("src", check.resolved);
            img.setAttribute("src-ori", check.original);
          }
        });
      }
    }
  });
}
