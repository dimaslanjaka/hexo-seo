/// <reference path="../../src/Array.d.ts" />
declare function array_filter(array: []): never[];
/**
 * pick random from array
 * @param {Array<any>} arrays
 * @param {boolean} unique Unique the arrays
 */
declare function array_rand(arrays: any[], unique: any): {
    index: number;
    value: any;
};
/**
 * Array unique
 * @param {Array<any>} arrays
 */
declare function array_unique(arrays: any[]): any[];
/**
 * Unset array
 * @param {Array<any>} arrayName
 * @param {String|number} key
 */
declare function array_unset(arrayName: {
    [x: string]: any;
}, key: any): any[];
/**
 * PHP shuffle array equivalent
 * @param array
 * @example
 * var arr = [2, 11, 37, 42];
 * shuffle(arr);
 * console.log(arr); //return random
 */
declare function shuffle(array: Array<any>): any[];
declare function arrayCompare(a1: Array<any>, a2: Array<any>): boolean;
/**
 * in_array PHP equivalent
 * @param needle string etc
 * @param haystack
 */
declare function inArray(needle: any, haystack: Array<any>): boolean;
/**
 * in_array PHP equivalent
 * @param needle string etc
 * @param haystack
 */
declare function in_array(needle: any, haystack: Array<any>): boolean;
/**
 * get all keys
 * @param haystack string etc
 */
declare function array_keys(haystack: any): string[];
/**
 * Shuffles array in place.
 * @param a items An array containing the items.
 */
declare function array_shuffle(a: Array<any>): any[];
/**
 * Deep merge two or more objects into the first.
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param objects  The objects to merge together
 * @returns Merged values of defaults and options
 */
declare function deepAssign(...objects: object[]): object;

/// <reference path="../../src/Date.d.ts" />
declare function datetime_local(date: any): string;



declare interface Number {
    getMS(type: string): number;
    /**
     * Get X Hour from date
     * @return number ms from Date().getTime()
     * @example
     * get `1 hour from current Date()`
     * 1.addHour()
     * get `1 hour from spesific Date()`
     * 1.addHour(new Date('2020-06-04 01:10:53'))
     */
    addHour(source: Date | null): number;
    /**
     * add zero leading
     * @param add
     * @param target
     */
    AddZero(add: number, target: string): number;
}
/**
 * Odd or Even (Ganjil Genap);
 * @param n
 * @param type odd or even
 */
declare function oddoreven(n: string, type: string): boolean;
/**
 * strpad / startwith zero [0]
 * @param {number} val
 */
declare function strpad(val: number): string | number;

/// <reference path="../../src/Object.d.ts" />
/**
 * Join object to separated string
 * @param obj Object
 * @returns Joined string
 */
declare function object_join(obj: object): string;
/**
 * Extend Object
 * @param arg1
 * @param arg2
 * @returns
 */
declare function extend_object<T1 extends object, T2 extends object>(arg1: T1, arg2: T2): T1 & T2;

/// <reference path="../../src/String.d.ts" />
