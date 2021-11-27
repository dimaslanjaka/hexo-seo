import Hexo from "hexo";
import { HexoSeo } from "./html/schema/article";
export interface Objek extends Object {
    [key: string]: any;
}
/**
 * is ignore pattern matching?
 */
export declare const isIgnore: (path0: string, exclude: string | string[], hexo?: Hexo) => boolean;
/**
 * Simplify object data / delete object key
 * @param data
 */
export declare function extractSimplePageData(data: HexoSeo | Hexo, additional?: any[]): Hexo | HexoSeo;
/**
 * Dump large objects
 * @param filename
 * @param obj
 */
export declare const dump: (filename: string, ...obj: any) => void;
