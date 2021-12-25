import { HexoSeo } from "../html/schema/article";
import Hexo from "hexo";
declare function fixAttributes(this: Hexo, content: string, data: HexoSeo): string;
export default fixAttributes;
