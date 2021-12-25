export = LfuMap;
declare function LfuMap(values: any, maxLength: any, equals: any, hash: any, getDefault: any): LfuMap;
declare class LfuMap {
    constructor(values: any, maxLength: any, equals: any, hash: any, getDefault: any);
    contentEquals: any;
    contentHash: any;
    getDefault: any;
    store: LfuSet | undefined;
    length: number | undefined;
    readonly size: number;
    constructClone(values: any): any;
    log(charmap: any, stringify: any): void;
    stringify(item: any, leader: any): string;
    addMapChangeListener(...args: any[]): void;
}
declare namespace LfuMap {
    export { LfuMap };
    export const from: (...args: any[]) => void;
}
import LfuSet = require("./lfu-set");
