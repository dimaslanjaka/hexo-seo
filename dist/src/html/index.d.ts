import Hexo, { TemplateLocals } from "hexo";
import { HexoSeo } from "./schema/article";
import "../../packages/js-prototypes/src/String";
import "../../packages/js-prototypes/src/Array";
import Promise from "bluebird";
export declare function getPagePath(data: HexoSeo | TemplateLocals): string;
export default function (this: Hexo, content: string, data: HexoSeo): Promise<string>;
