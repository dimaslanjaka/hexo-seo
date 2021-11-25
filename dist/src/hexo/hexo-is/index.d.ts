import Hexo from "hexo";
/**
 * @example
 * // run inside plugin or theme event
 * import hexoIs from 'hexo-is';
 * const hexo = this;
 * console.log(hexoIs(hexo)); // object or string
 * @param hexo
 * @returns
 */
declare const hexoIs: (hexo: Hexo | Hexo.View) => {
    current: boolean;
    home: boolean;
    post: boolean;
    page: boolean;
    archive: boolean;
    year: boolean;
    month: boolean;
    category: boolean;
    tag: boolean;
    message: string;
} | {
    current: any;
    home: any;
    post: any;
    page: any;
    archive: any;
    year: any;
    month: any;
    category: any;
    tag: any;
};
/**
 * Dump variable to file
 * @param toDump
 */
export declare function hexoIsDump(toDump: any, name?: string): void;
export default hexoIs;
