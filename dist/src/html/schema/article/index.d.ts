import { CheerioAPI } from 'cheerio';
import Hexo, { TemplateLocals } from 'hexo';
export type SchemaAuthor = ObjectConstructor & {
    image: string;
    name: string;
    sameAs?: string;
    url?: string;
};
export type HexoSeo = Hexo & Hexo.View & Hexo.Locals.Category & Hexo.Locals.Page & Hexo.Locals.Post & Hexo.Locals.Tag & TemplateLocals;
export interface SchemaArticleOptions {
    /**
     * Print pretty style
     */
    pretty?: boolean;
    /**
     * Hexo instance
     */
    hexo: TemplateLocals;
}
declare class articleSchema {
    schema: {
        "@context": string;
        "@type": string;
        headline: string;
        alternativeHeadline: string;
        image: string;
        author: {
            "@type": string;
            image: string;
            name: string;
            sameAs: string;
        };
        award: string;
        editor: string;
        genre: string;
        keywords: string;
        wordcount: string;
        publisher: {
            "@type": string;
            name: string;
            logo: {
                "@type": string;
                url: string;
            };
        };
        url: string;
        mainEntityOfPage: {
            "@type": string;
            "@id": string;
            url: string;
            potentialAction: {
                "@type": string;
                "@id": string;
                target: {
                    "@type": string;
                    urlTemplate: string;
                };
                "query-input": string;
            }[];
            mainEntity: {
                "@context": string;
                "@type": string;
                "@id": string;
                name: string;
                itemListElement: {
                    "@type": string;
                    position: number;
                    name: string;
                    item: string;
                }[];
            };
        };
        datePublished: string;
        dateCreated: string;
        dateModified: string;
        description: string;
        articleBody: string;
    };
    options: SchemaArticleOptions;
    hexo: TemplateLocals;
    constructor(options?: SchemaArticleOptions);
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
    /**
     * get all schema structure
     */
    getStructure(): {
        "@context": string;
        "@type": string;
        headline: string;
        alternativeHeadline: string;
        image: string;
        author: {
            "@type": string;
            image: string;
            name: string;
            sameAs: string;
        };
        award: string;
        editor: string;
        genre: string;
        keywords: string;
        wordcount: string;
        publisher: {
            "@type": string;
            name: string;
            logo: {
                "@type": string;
                url: string;
            };
        };
        url: string;
        mainEntityOfPage: {
            "@type": string;
            "@id": string;
            url: string;
            potentialAction: {
                "@type": string;
                "@id": string;
                target: {
                    "@type": string;
                    urlTemplate: string;
                };
                "query-input": string;
            }[];
            mainEntity: {
                "@context": string;
                "@type": string;
                "@id": string;
                name: string;
                itemListElement: {
                    "@type": string;
                    position: number;
                    name: string;
                    item: string;
                }[];
            };
        };
        datePublished: string;
        dateCreated: string;
        dateModified: string;
        description: string;
        articleBody: string;
    };
    /**
     * Set breadcrumbs by tags and categories
     * @param tags
     */
    setBreadcrumbs(tags: {
        item: any;
        name: any;
    }[]): void;
    setUrl(url: string): void;
    setDescription(description: string): void;
    setImage($: string | CheerioAPI): void;
    /**
     * Set author
     * @description automatically find author
     * @param author Author Options
     */
    setAuthor(author: SchemaAuthor): void;
    /**
     * Set schema article title
     * @param title
     */
    setTitle(title: string): void;
    /**
     * Set schema article body/content
     * @param articleBody
     */
    setArticleBody(articleBody: string): void;
    toString(): string;
}
export default articleSchema;
