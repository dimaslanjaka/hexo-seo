import Promise from "bluebird";
import Hexo, { TemplateLocals } from "hexo";
import { HexoSeo } from "./schema/article";
export declare function getPagePath(data: HexoSeo | TemplateLocals): string;
export default function (this: Hexo, content: string, data: HexoSeo): Promise<string>;
