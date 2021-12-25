export = FastMap;
declare function FastMap(values: any, equals: any, hash: any, getDefault: any): FastMap;
declare class FastMap {
    constructor(values: any, equals: any, hash: any, getDefault: any);
    contentEquals: any;
    contentHash: any;
    getDefault: any;
    store: Set | undefined;
    length: number | undefined;
    constructClone(values: any): any;
    log(charmap: any, stringify: any): void;
    stringify(item: any, leader: any): string;
}
declare namespace FastMap {
    export { FastMap };
    export const from: (...args: any[]) => void;
}
import Set = require("./_fast-set");
