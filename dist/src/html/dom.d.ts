import jsdom from "jsdom";
export declare function parseJsdom(text: string): jsdom.JSDOM;
/**
 * Get text from partial html
 * @param text
 * @param options
 * @returns
 */
export declare function getTextPartialHtml(text: string, options?: jsdom.ConstructorOptions): string;
