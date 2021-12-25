export = LfuSet;
declare function LfuSet(values: any, capacity: any, equals: any, hash: any, getDefault: any): LfuSet;
declare class LfuSet {
    constructor(values: any, capacity: any, equals: any, hash: any, getDefault: any);
    store: any;
    frequencyHead: FrequencyNode | undefined;
    contentEquals: any;
    contentHash: any;
    getDefault: any;
    capacity: any;
    length: number | undefined;
    readonly size: number;
    constructClone(values: any): any;
    has(value: any): any;
    get(value: any, equals: any): any;
    add(value: any): boolean;
    delete(value: any, equals: any): boolean;
    one(): any;
    clear(): void;
    reduce(callback: any, basis: any, ...args: any[]): any;
    reduceRight(callback: any, basis: any, ...args: any[]): any;
    iterate(): any;
    Node: typeof Node;
    FrequencyNode: typeof FrequencyNode;
}
declare namespace LfuSet {
    export { LfuSet };
    export const from: (...args: any[]) => void;
}
declare function FrequencyNode(frequency: any, prev: any, next: any): void;
declare class FrequencyNode {
    constructor(frequency: any, prev: any, next: any);
    frequency: any;
    values: any;
    prev: any;
    next: any;
}
declare function Node(value: any, frequencyNode: any): void;
declare class Node {
    constructor(value: any, frequencyNode: any);
    value: any;
    frequencyNode: any;
}
