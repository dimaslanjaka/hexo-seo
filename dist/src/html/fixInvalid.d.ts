import Hexo from "hexo";
import { HexoSeo } from "./schema/article";
declare function fixInvalid(this: Hexo, content: string, data: HexoSeo): string;
export default fixInvalid;
