export = Deque;
declare function Deque(values: any, capacity: any): Deque;
declare class Deque {
    constructor(values: any, capacity: any);
    capacity: any;
    length: number | undefined;
    front: number | undefined;
    maxCapacity: number;
    minCapacity: number;
    constructClone(values: any): any;
    add(value: any): void;
    push(value: any, ...args: any[]): number | undefined;
    pop(): any;
    shift(): any;
    unshift(value: any, ...args: any[]): number | undefined;
    clear(): void;
    ensureCapacity(capacity: any): void;
    grow(capacity: any): void;
    init(): void;
    snap(capacity: any): any;
    one(): any;
    peek(): any;
    poke(value: any): void;
    peekBack(): any;
    pokeBack(value: any): void;
    get(index: any): any;
    indexOf(value: any, index: any): any;
    lastIndexOf(value: any, index: any): any;
    find(...args: any[]): any;
    findValue(value: any, equals: any, index: any): any;
    findLast(...args: any[]): any;
    findLastValue(value: any, equals: any, index: any): any;
    has(value: any, equals: any): boolean;
    reduce(callback: any, basis: any, ...args: any[]): any;
    reduceRight(callback: any, basis: any, ...args: any[]): any;
}
declare namespace Deque {
    const from: (...args: any[]) => void;
}
