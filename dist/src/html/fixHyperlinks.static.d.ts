import { _JSDOM } from './dom';
import { HexoSeo } from './schema/article';
import { hyperlinkOptions } from './types';
export default function (dom: _JSDOM, HSconfig: hyperlinkOptions, _data: HexoSeo): void;
export declare function identifyRels(el: HTMLAnchorElement | import('node-html-parser').HTMLElement, external: boolean, HSconfig: hyperlinkOptions): string[];
