export = GenericSet;
declare function GenericSet(): void;
declare class GenericSet {
    isSet: boolean;
    union(that: any): any;
    intersection(that: any): any;
    difference(that: any): any;
    symmetricDifference(that: any): any;
    deleteAll(value: any): number;
    equals(that: any, equals: any): any;
    forEach(callback: any, ...args: any[]): any;
    toJSON(): any;
    contains(value: any): any;
    remove(value: any): any;
    toggle(value: any): void;
    valuesArray(): any;
    entriesArray(): any;
}
