/// <reference path="../../src/Array.d.ts" />
declare function array_filter(array: []): never[];
declare function array_rand(arrays: any[], unique: any): {
    index: number;
    value: any;
};
declare function array_unique(arrays: any[]): any[];
declare function array_unset(arrayName: {
    [x: string]: any;
}, key: any): any[];
declare function shuffle(array: Array<any>): any[];
declare function arrayCompare(a1: Array<any>, a2: Array<any>): boolean;
declare function inArray(needle: any, haystack: Array<any>): boolean;
declare function in_array(needle: any, haystack: Array<any>): boolean;
declare function array_keys(haystack: any): string[];
declare function array_shuffle(a: Array<any>): any[];
declare function deepAssign(...objects: Record<any, unknown>[]): Record<any, unknown>;
declare function removeItem<T>(arr: Array<T>, value: T): Array<T>;
