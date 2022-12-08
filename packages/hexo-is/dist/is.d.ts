declare function isCurrentHelper(path: string, strict: any): any;
declare function isHomeHelper(): boolean;
declare function isPostHelper(): boolean;
declare function isPageHelper(): boolean;
declare function isArchiveHelper(): boolean;
declare function isYearHelper(year: any): boolean;
declare function isMonthHelper(year: any, month: any): boolean;
declare function isCategoryHelper(category: any): boolean;
declare function isTagHelper(this: any, tag: any): boolean;
export declare const current: typeof isCurrentHelper;
export declare const home: typeof isHomeHelper;
export declare const post: typeof isPostHelper;
export declare const page: typeof isPageHelper;
export declare const archive: typeof isArchiveHelper;
export declare const year: typeof isYearHelper;
export declare const month: typeof isMonthHelper;
export declare const category: typeof isCategoryHelper;
export declare const tag: typeof isTagHelper;
/**
 * Custom function
 * @param hexo
 * @returns
 */
export default function (hexo: any): HexoIs;
export interface HexoIs {
    current: boolean;
    home: boolean;
    post: boolean;
    page: boolean;
    archive: boolean;
    year: boolean;
    month: boolean;
    category: boolean;
    tag: boolean;
    message?: string;
}
export {};
