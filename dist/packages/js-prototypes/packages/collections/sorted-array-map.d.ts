export = SortedArrayMap;
declare function SortedArrayMap(values: any, equals: any, compare: any, getDefault: any): SortedArrayMap;
declare class SortedArrayMap {
    constructor(values: any, equals: any, compare: any, getDefault: any);
    contentEquals: any;
    contentCompare: any;
    getDefault: any;
    store: SortedArraySet | undefined;
    length: number | undefined;
    isSorted: boolean;
    constructClone(values: any): any;
}
declare namespace SortedArrayMap {
    export { SortedArrayMap };
    export const from: (...args: any[]) => void;
}
import SortedArraySet = require("./sorted-array-set");
