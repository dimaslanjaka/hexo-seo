import Hexo from "hexo";
export declare type MutableHexo = {
    -readonly [K in keyof Hexo]: Hexo[K];
};
/**
 * Remove readonly and ?
 * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#improved-control-over-mapped-type-modifiers}
 */
export declare type MutableRequired<T> = {
    -readonly [P in keyof T]-?: T[P];
};
/**
 * Add readonly and ?
 * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#improved-control-over-mapped-type-modifiers}
 */
export declare type ReadonlyPartial<T> = {
    +readonly [P in keyof T]+?: T[P];
};
