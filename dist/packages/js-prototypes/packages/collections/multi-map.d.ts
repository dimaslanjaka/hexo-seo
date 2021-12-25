export = MultiMap;
declare function MultiMap(values: any, bucket: any, equals: any, hash: any): MultiMap;
declare class MultiMap {
    constructor(values: any, bucket: any, equals: any, hash: any);
    bucket: any;
    constructor: typeof MultiMap;
    constructClone(values: any): MultiMap;
    set(key: any, newValues: any): void;
}
declare namespace MultiMap {
    export { MultiMap };
}
