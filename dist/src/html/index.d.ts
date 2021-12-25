import Hexo, { TemplateLocals } from "hexo";
import { HexoSeo } from "./schema/article";
import "js-prototypes";
import Promise from "bluebird";
export declare function getPagePath(data: HexoSeo | TemplateLocals): string;
export default function (this: Hexo, content: string, data: HexoSeo): Promise<string>;
