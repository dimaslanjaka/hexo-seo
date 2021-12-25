export = SortedSet;
declare function SortedSet(values: any, equals: any, compare: any, getDefault: any): SortedSet;
declare class SortedSet {
    constructor(values: any, equals: any, compare: any, getDefault: any);
    contentEquals: any;
    contentCompare: any;
    getDefault: any;
    root: any;
    length: number | undefined;
    readonly size: number;
    isSorted: boolean;
    constructClone(values: any): any;
    has(value: any, equals: any): any;
    get(value: any, equals: any): any;
    add(value: any): boolean;
    delete(value: any, equals: any): boolean;
    indexOf(value: any, index: any): any;
    find(value: any, equals: any, index: any): any;
    findGreatest(at: any): any;
    findLeast(at: any): any;
    findGreatestLessThanOrEqual(value: any): any;
    findGreatestLessThan(value: any): any;
    findLeastGreaterThanOrEqual(value: any): any;
    findLeastGreaterThan(value: any): any;
    pop(): any;
    shift(): any;
    push(...args: any[]): void;
    unshift(...args: any[]): void;
    slice(start: any, end: any): any[];
    splice(at: any, length: any, ...args: any[]): any[];
    swap(start: any, length: any, plus: any): any[];
    splay(value: any): void;
    splayIndex(index: any): boolean;
    reduce(callback: any, basis: any, thisp: any): any;
    reduceRight(callback: any, basis: any, thisp: any): any;
    min(at: any): any;
    max(at: any): any;
    one(): any;
    clear(): void;
    iterate(start: any, end: any): Iterator;
    Iterator: typeof Iterator;
    summary(): any;
    log(charmap: any, logNode: any, callback: any, thisp: any): void;
    logNode(node: any, log: any, logBefore: any): void;
    Node: typeof Node;
}
declare namespace SortedSet {
    export { SortedSet };
    export const from: (...args: any[]) => void;
    export { TreeLog as logCharsets };
}
declare function Iterator(set: any, start: any, end: any): void;
declare class Iterator {
    constructor(set: any, start: any, end: any);
    set: any;
    prev: any;
    end: any;
    __iterationObject: any;
    get _iterationObject(): any;
    next(): any;
}
declare function Node(value: any): void;
declare class Node {
    constructor(value: any);
    value: any;
    left: any;
    right: any;
    length: number;
    reduce(callback: any, basis: any, index: any, thisp: any, tree: any, depth: any): any;
    reduceRight(callback: any, basis: any, index: any, thisp: any, tree: any, depth: any): any;
    touch(): void;
    index: any;
    checkIntegrity(): number;
    getNext(): Node | undefined;
    getPrevious(): Node | undefined;
    summary(): string;
    log(charmap: any, logNode: any, log: any, logAbove: any): void;
}
import TreeLog = require("./tree-log");
