import Hexo from "hexo";
import { releaseMemory } from "../cache";
import { dump, extractSimplePageData } from "../utils";
import getConfig from "../config";
import hexoIs from "../hexo/hexo-is";
import schemaArticles, { HexoSeo, SchemaAuthor } from "./schema/article";
import { isDev } from "..";
import { getTextPartialHtml } from "./dom";
import { trimText } from "../utils/string";
import "../../packages/js-prototypes/src/String";
import "../../packages/js-prototypes/src/Array";
import { JSDOM } from "jsdom";
import log from "../log";
import pkg from "../../package.json";

export default function (this: Hexo, content: string, data: HexoSeo) {
  //dump("schema.html", content);
}
