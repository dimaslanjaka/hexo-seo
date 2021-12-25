export = SortedArraySet;
declare function SortedArraySet(values: any, equals: any, compare: any, getDefault: any): SortedArraySet;
declare class SortedArraySet {
    constructor(values: any, equals: any, compare: any, getDefault: any);
    constructor: typeof SortedArraySet;
    isSorted: boolean;
    add(value: any): boolean;
    reduce(callback: any, basis: any, ...args: any[]): any;
    reduceRight(callback: any, basis: any, ...args: any[]): any;
}
declare namespace SortedArraySet {
    export { SortedArraySet };
    export const from: (...args: any[]) => void;
}
