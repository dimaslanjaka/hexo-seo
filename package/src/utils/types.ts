import Hexo from 'hexo';

export type MutableHexo = {
  -readonly [K in keyof Hexo]: Hexo[K];
};
/**
 * Remove readonly and ?
 * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#improved-control-over-mapped-type-modifiers}
 */
export type MutableRequired<T> = { -readonly [P in keyof T]-?: T[P] };
/**
 * Add readonly and ?
 * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#improved-control-over-mapped-type-modifiers}
 */
export type ReadonlyPartial<T> = { +readonly [P in keyof T]+?: T[P] };
