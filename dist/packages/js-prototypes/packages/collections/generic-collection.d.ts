export = GenericCollection;
declare function GenericCollection(): void;
declare class GenericCollection {
    addEach(values: any, mapFn: any, thisp: any): GenericCollection;
    deleteEach(values: any, equals: any): GenericCollection;
    forEach(callback: any, ...args: any[]): any;
    map(callback: any, ...args: any[]): any[];
    enumerate(start: any): any[];
    group(callback: any, thisp: any, equals: any): any[];
    toArray(): any[];
    toObject(): {};
    filter(callback: any, ...args: any[]): any;
    every(callback: any, ...args: any[]): any;
    some(callback: any, ...args: any[]): any;
    all(): any;
    any(): any;
    min(compare: any): any;
    max(compare: any): any;
    sum(zero: any): any;
    average(zero: any): number;
    concat(...args: any[]): any;
    flatten(): any;
    zip(...args: any[]): any;
    join(delimiter: any): any;
    sorted(compare: any, by: any, order: any): any[];
    reversed(): any;
    clone(depth: any, memo: any): any;
    only(): any;
    iterator(...args: any[]): any;
    readonly size: number;
}
declare namespace GenericCollection {
    const EmptyArray: any[];
    function from(...args: any[]): void;
    namespace _sizePropertyDescriptor {
        function get(): number;
        const enumerable: boolean;
        const configurable: boolean;
    }
}
