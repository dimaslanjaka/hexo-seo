import { _JSDOM } from "./dom";
import { hyperlinkOptions } from "./types";
import { HexoSeo } from "./schema/article";
export default function (dom: _JSDOM, HSconfig: hyperlinkOptions, data: HexoSeo): void;
export declare function identifyRels(el: HTMLAnchorElement | import("node-html-parser").HTMLElement, external: boolean, HSconfig: hyperlinkOptions): string[];
