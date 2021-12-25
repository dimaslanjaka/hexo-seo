export = GenericMap;
declare function GenericMap(): void;
declare class GenericMap {
    isMap: boolean;
    addEach(values: any): GenericMap;
    get(key: any, defaultValue: any, ...args: any[]): any;
    set(key: any, value: any): GenericMap;
    add(value: any, key: any): GenericMap;
    has(key: any): any;
    delete(key: any): boolean;
    clear(): void;
    length: number | undefined;
    reduce(callback: any, basis: any, thisp: any): any;
    reduceRight(callback: any, basis: any, thisp: any): any;
    keysArray(): any;
    keys(): Iterator;
    valuesArray(): any;
    values(): Iterator;
    entriesArray(): any;
    entries(): Iterator;
    items(): any;
    equals(that: any, equals: any): any;
    toJSON(): any;
    Item: typeof Item;
}
import Iterator = require("./iterator");
declare function Item(key: any, value: any): void;
declare class Item {
    constructor(key: any, value: any);
    key: any;
    value: any;
    equals(that: any): any;
    compare(that: any): any;
}
