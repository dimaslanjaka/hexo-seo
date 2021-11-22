import Hexo from "hexo";
import { HexoSeo } from "./schema/article";
import "../../packages/js-prototypes/src/String";
import "../../packages/js-prototypes/src/Array";
import fixSchema from "./fixSchema";
import fixInvalid from "./fixInvalid";
import fixHyperlinks from "./fixHyperlinks";
import fixAttributes from "../img/fixAttributes";

export default function (this: Hexo, content: string, data: HexoSeo) {
  content = fixAttributes.bind(this)(content, data);
  content = fixHyperlinks.bind(this)(content, data);
  content = fixSchema.bind(this)(content, data);
  content = fixInvalid.bind(this)(content, data);
  return content;
}
