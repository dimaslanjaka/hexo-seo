export = List;
declare function List(values: any, equals: any, getDefault: any): any;
declare class List {
    constructor(values: any, equals: any, getDefault: any);
    constructClone(values: any): any;
    find(value: any, equals: any, index: any): any;
    findLast(value: any, equals: any, index: any): any;
    has(value: any, equals: any): boolean;
    get(value: any, equals: any): any;
    delete(value: any, equals: any): boolean;
    deleteAll(value: any, equals: any): number;
    clear(): void;
    length: number | undefined;
    add(value: any): boolean;
    _addNode(node: any): boolean;
    push(...args: any[]): void;
    unshift(...args: any[]): void;
    _shouldPop(): any;
    pop(_before: any, _after: any): any;
    shift(_before: any, _after: any): any;
    peek(): any;
    poke(value: any): void;
    one(): any;
    scan(at: any, fallback: any): any;
    slice(at: any, end: any): any[];
    splice(at: any, length: any, ...args: any[]): any[];
    swap(start: any, length: any, plus: any, _before: any, _after: any): any[];
    reverse(): List;
    sort(...args: any[]): void;
    reduce(callback: any, basis: any, ...args: any[]): any;
    reduceRight(callback: any, basis: any, ...args: any[]): any;
    updateIndexes(node: any, index: any): void;
    iterate(): ListIterator;
    Node: typeof Node;
}
declare namespace List {
    export function _init(constructor: any, object: any, values: any, equals: any, getDefault: any): any;
    export { List };
    export const from: (...args: any[]) => void;
}
declare function ListIterator(head: any): void;
declare class ListIterator {
    constructor(head: any);
    head: any;
    at: any;
    __iterationObject: any;
    get _iterationObject(): any;
    next(): any;
}
declare function Node(value: any): void;
declare class Node {
    constructor(value: any);
    value: any;
    prev: any;
    next: any;
    delete(): void;
    addBefore(node: any): void;
    addAfter(node: any): void;
}
