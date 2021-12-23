import data from "./data-index.json";
import { SchemaArticleOptions } from "../article";
import { TemplateLocals } from "hexo";
declare type articleListElement = typeof data.mainEntity.itemListElement[0];
export interface homepageArticle extends ObjectConstructor, articleListElement {
    [key: string]: any;
}
declare class schemaHomepage {
    schema: {
        "@context": string;
        "@type": string;
        "@id": string;
        title: string;
        mainEntity: {
            "@type": string;
            name: string;
            itemListOrder: string;
            itemListElement: {
                "@type": string;
                position: string;
                headline: string;
                author: {
                    "@type": string;
                    image: string;
                    name: string;
                    sameAs: string;
                };
                image: string;
            }[];
        };
    };
    options: SchemaArticleOptions;
    hexo: TemplateLocals;
    constructor(options?: SchemaArticleOptions);
    addArticle(article: {
        author?: {
            name?: string;
            image?: string;
            url?: string;
        };
        title: string;
        image?: string;
    }): void;
    /**
     * Set custom property and value
     * @param key
     * @param value
     */
    set(key: string, value: any): void;
    /**
     * get schema property
     */
    get(key: any): any;
    toString(): string;
}
export default schemaHomepage;
