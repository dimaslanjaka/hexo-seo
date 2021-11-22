import Hexo from "hexo";
import { HexoSeo } from "./schema/article";
import "../../packages/js-prototypes/src/String";
import "../../packages/js-prototypes/src/Array";
import Promise from "bluebird";
export declare function getPath(data: HexoSeo): any;
export default function (this: Hexo, content: string, data: HexoSeo): string | Promise<string>;
