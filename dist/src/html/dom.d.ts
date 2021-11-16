import { Cheerio, Element, Document } from "cheerio";
export declare const cheerioParseHtml: (htmlstring: string) => import("cheerio").CheerioAPI;
export declare type CheerioElement = Cheerio<Element>;
export declare type CheerioDocument = Cheerio<Document>;
export declare const getAllAttributes: (node: Element) => {
    name: string;
    value: string;
}[];
