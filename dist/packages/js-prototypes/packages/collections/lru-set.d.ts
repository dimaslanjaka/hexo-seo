export = LruSet;
declare function LruSet(values: any, capacity: any, equals: any, hash: any, getDefault: any): LruSet;
declare class LruSet {
    constructor(values: any, capacity: any, equals: any, hash: any, getDefault: any);
    store: any;
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
    delete(value: any, equals: any): any;
    one(): any;
    clear(): void;
    reduce(callback: any, basis: any, ...args: any[]): any;
    reduceRight(callback: any, basis: any, ...args: any[]): any;
    iterate(): any;
}
declare namespace LruSet {
    export { LruSet };
    export const from: (...args: any[]) => void;
}
