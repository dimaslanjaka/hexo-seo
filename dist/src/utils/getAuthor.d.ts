import Hexo from 'hexo';
/**
 * get post author from post object
 * @param postObj post object like { title: '', permalink: '' } or author object
 * @param hexoConfig hexo.config object
 * @returns author name
 */
export declare function getAuthorName(postObj: Record<string, any> | string, hexoConfig?: Hexo['config']): string;
export declare function getAuthorLink(postObj: Record<string, any> | string, hexoConfig?: Hexo['config']): any;
export default function getAuthor(postObj: Record<string, any> | string, hexoConfig?: Hexo['config']): {
    name: string;
    link: any;
};
