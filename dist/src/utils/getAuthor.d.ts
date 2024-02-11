import Hexo from 'hexo';
/**
 * get post author from post object
 * @param postObj post object like { title: '', permalink: '' }
 * @param hexoConfig hexo.config object
 * @returns author name
 */
export default function getAuthor(postObj: Record<string, any> | string, hexoConfig?: Hexo['config']): string;
