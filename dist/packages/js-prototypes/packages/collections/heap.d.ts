export = Heap;
declare function Heap(values: any, equals: any, compare: any): Heap;
declare class Heap {
    constructor(values: any, equals: any, compare: any);
    contentEquals: any;
    contentCompare: any;
    content: any[] | undefined;
    length: number | undefined;
    constructClone(values: any): any;
    push(value: any): void;
    pop(): undefined;
    add(value: any): void;
    indexOf(value: any): number;
    delete(value: any, equals: any): boolean;
    peek(): undefined;
    max(): undefined;
    one(): undefined;
    float(index: any): void;
    sink(index: any): void;
    clear(): void;
    reduce(callback: any, basis: any, ...args: any[]): any;
    reduceRight(callback: any, basis: any, ...args: any[]): any;
    toJSON(): any;
    makeObservable(): void;
    handleContentRangeChange(plus: any, minus: any, index: any): void;
    handleContentRangeWillChange(plus: any, minus: any, index: any): void;
    handleContentMapChange(value: any, key: any): void;
    handleContentMapWillChange(value: any, key: any): void;
}
declare namespace Heap {
    export { Heap };
    export const from: (...args: any[]) => void;
}
