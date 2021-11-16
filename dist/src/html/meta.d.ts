import { CheerioAPI } from "cheerio";
import { HexoSeo } from "./schema/article";
declare const fixMeta: (content: CheerioAPI | string, data: HexoSeo) => CheerioAPI;
export default fixMeta;
