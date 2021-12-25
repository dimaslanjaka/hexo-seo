export = FastSet;
declare function FastSet(values: any, equals: any, hash: any, getDefault: any): FastSet;
declare class FastSet {
    constructor(values: any, equals: any, hash: any, getDefault: any);
    contentEquals: any;
    contentHash: any;
    getDefault: any;
    buckets: Dict | undefined;
    length: number | undefined;
    Buckets: typeof Dict;
    Bucket: typeof List;
    constructClone(values: any): any;
    has(value: any): any;
    get(value: any, equals: any): any;
    delete(value: any, equals: any): boolean;
    clear(): void;
    add(value: any): boolean;
    reduce(callback: any, basis: any, ...args: any[]): any;
    one(): any;
    iterate(): any;
    log(charmap: any, logNode: any, callback: any, thisp: any): void;
    logNode(node: any, write: any): void;
}
declare namespace FastSet {
    export { FastSet };
    export const from: (...args: any[]) => void;
}
import Dict = require("./_dict");
import List = require("./_list");
