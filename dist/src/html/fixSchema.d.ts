import Hexo from "hexo";
import { HexoSeo } from "./schema/article";
import "../../packages/js-prototypes/src/String";
import "../../packages/js-prototypes/src/Array";
declare function fixSchema(this: Hexo, content: string, data: HexoSeo): string;
export default fixSchema;
