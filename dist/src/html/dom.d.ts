import jsdom from "jsdom";
export declare function parseJsdom(text: string): jsdom.JSDOM;
export declare class parsePartialJsdom {
    dom: jsdom.JSDOM;
    constructor(text: string, options?: jsdom.ConstructorOptions);
    /**
     * Get texts from partial html
     * @returns
     */
    getText(): string;
}
