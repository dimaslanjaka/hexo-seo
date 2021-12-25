export = LruMap;
declare function LruMap(values: any, maxLength: any, equals: any, hash: any, getDefault: any): LruMap;
declare class LruMap {
    constructor(values: any, maxLength: any, equals: any, hash: any, getDefault: any);
    contentEquals: any;
    contentHash: any;
    getDefault: any;
    store: LruSet | undefined;
    length: number | undefined;
    readonly size: number;
    constructClone(values: any): any;
    log(charmap: any, stringify: any): void;
    stringify(item: any, leader: any): string;
    addMapChangeListener(...args: any[]): void;
}
declare namespace LruMap {
    export { LruMap };
    export const from: (...args: any[]) => void;
}
import LruSet = require("./lru-set");
