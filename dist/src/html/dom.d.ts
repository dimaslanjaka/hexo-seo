import jsdom from "jsdom";
export declare function parseJsdom(text: string): {
    dom: jsdom.JSDOM;
    document: Document;
};
