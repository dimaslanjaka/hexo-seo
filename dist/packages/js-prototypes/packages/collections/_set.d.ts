export = GlobalSet;
declare class GlobalSet {
    private constructor();
    reduce(callback: any, basis: any, ...args: any[]): any;
    reduceRight(callback: any, basis: any, ...args: any[]): any;
    equals(that: any, equals: any): any;
    constructClone(values: any): any;
    toJSON(): any;
    one(): any;
    pop(): any;
    shift(): any;
    get length(): any;
    valuesArray: any;
    entriesArray: any;
}
