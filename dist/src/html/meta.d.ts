import { CheerioAPI } from "cheerio";
import { HexoSeo } from "./schema/article";
declare const fixMeta: ($: CheerioAPI, data: HexoSeo) => CheerioAPI;
export default fixMeta;
