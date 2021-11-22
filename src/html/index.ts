import Hexo from "hexo";
import { HexoSeo } from "./schema/article";
import "../../packages/js-prototypes/src/String";
import "../../packages/js-prototypes/src/Array";
import log from "../log";
import pkg from "../../package.json";
import fixSchema from "./fixSchema";

export default function (this: Hexo, content: string, data: HexoSeo) {
  log.log("%s fixing schema..", pkg.name);
  //content = fixSchema.bind(this)(content, data);
  return content;
}
