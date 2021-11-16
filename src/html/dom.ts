import cheerio, { Cheerio, Element, Document } from "cheerio";
import { InternalOptions } from "cheerio/lib/options";

// not working
export const cheerioParseHtml = function (htmlstring: string) {
  if (!htmlstring || htmlstring.length < 1) return null;
  return cheerio.load(htmlstring);
};
export type CheerioElement = Cheerio<Element>;
export type CheerioDocument = Cheerio<Document>;
export const getAllAttributes = function (node: Element) {
  return (
    node.attributes ||
    Object.keys(node.attribs).map((name) => ({
      name,
      value: node.attribs[name]
    }))
  );
};
