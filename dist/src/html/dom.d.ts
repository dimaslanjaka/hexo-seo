/// <reference types="node" />
import jsdom, { ConstructorOptions, DOMWindow } from "jsdom";
export declare class _JSDOM {
    private dom;
    document: Document;
    window: DOMWindow;
    options: ConstructorOptions;
    constructor(str?: string | Buffer, options?: ConstructorOptions);
    /**
     * Get JSDOM instances
     */
    getDom(): jsdom.JSDOM;
    /**
     * Transform html string to Node
     * @param html
     * @returns
     */
    toNode(html: string): string;
    /**
     * serializing html / fix invalid html
     * @returns serialized html
     */
    serialize(): string;
    /**
     * Return Modified html (without serialization)
     */
    toString(): string;
}
export declare function parseJSDOM(text: string): _JSDOM;
/**
 * Get text from partial html
 * @param text
 * @param options
 * @returns
 */
export declare function getTextPartialHtml(text: string, options?: jsdom.ConstructorOptions): string;
