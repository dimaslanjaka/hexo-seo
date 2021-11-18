import jsdom from "jsdom";
export declare function parseJsdom(text: string): jsdom.JSDOM;
export declare class parsePartialJsdom extends jsdom.JSDOM {
    constructor(text: string, options?: jsdom.ConstructorOptions);
    getDocument(): Document;
    /**
     * Get texts from partial html
     * @returns
     */
    getText(): string;
}
