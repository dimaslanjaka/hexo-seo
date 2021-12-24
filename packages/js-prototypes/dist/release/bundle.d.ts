/// <reference types="node" />
declare type anyOf = Buffer & string & object & symbol & null & undefined & Record<string, any> & (() => any) & boolean & boolean[] & keyof [false];

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

/// <reference path="../../src/Date.d.ts" />
declare function datetime_local(date: any): string;



declare interface Number {
    getMS(type: string): number;
    addHour(source: Date | null): number;
    AddZero(add: number, target: string): number;
}
declare function oddoreven(n: string, type: string): boolean;
declare function strpad(val: number): string | number;
declare function isInt(n: any): boolean;
declare function isFloat(n: any): boolean;

/// <reference path="../../src/Object.d.ts" />
declare function object_join(obj: Record<any, unknown>): string;
declare function extend_object<T1 extends Record<any, unknown>, T2 extends Record<any, unknown>>(arg1: T1, arg2: T2): T1 & T2;

/// <reference path="../../src/String.d.ts" />
/// <reference path="../../src/globals.d.ts" />


