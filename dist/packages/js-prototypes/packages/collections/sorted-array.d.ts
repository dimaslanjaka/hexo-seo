export = SortedArray;
declare function SortedArray(values: any, equals: any, compare: any, getDefault: any): SortedArray;
declare class SortedArray {
    constructor(values: any, equals: any, compare: any, getDefault: any);
    array: any[] | undefined;
    contentEquals: any;
    contentCompare: any;
    getDefault: any;
    length: number | undefined;
    isSorted: boolean;
    constructClone(values: any): any;
    has(value: any, equals: any): boolean;
    get(value: any, equals: any): any;
    add(value: any): boolean;
    delete(value: any, equals: any): boolean;
    deleteAll(value: any, equals: any): any;
    indexOf(value: any): any;
    lastIndexOf(value: any): any;
    find(value: any, equals: any, index: any, ...args: any[]): any;
    findValue(value: any, equals: any, index: any): any;
    findLast(value: any, equals: any, index: any, ...args: any[]): any;
    findLastValue(value: any, equals: any, index: any): any;
    push(...args: any[]): void;
    unshift(...args: any[]): void;
    pop(): any;
    shift(): any;
    slice(...args: any[]): any[];
    splice(index: any, length: any, ...args: any[]): any;
    swap(index: any, length: any, plus: any): any;
    reduce(callback: any, basis: any, ...args: any[]): any;
    reduceRight(...args: any[]): any;
    min(): any;
    max(): any;
    one(): any;
    clear(): void;
    equals(that: any, equals: any): any;
    compare(that: any, compare: any): any;
    iterate(start: any, end: any): any;
    toJSON(): any;
    Iterator: any;
}
declare namespace SortedArray {
    export { SortedArray };
    export const from: (...args: any[]) => void;
}
