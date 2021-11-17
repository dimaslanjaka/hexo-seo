import { HexoSeo } from "../html/schema/article";
import Hexo from "hexo";
declare const usingCheerio: (this: Hexo, content: string, data: HexoSeo) => globalThis.Promise<string>;
export declare const usingJSDOM: (this: Hexo, content: string, data: HexoSeo) => string;
export declare const usingJQuery: (this: Hexo, content: string, data: HexoSeo) => string;
export default usingCheerio;
