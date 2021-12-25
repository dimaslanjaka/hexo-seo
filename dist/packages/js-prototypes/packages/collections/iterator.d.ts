export = Iterator;
declare function Iterator(iterable: any, standardMode: any): any;
declare class Iterator {
    constructor(iterable: any, standardMode: any);
    next: any;
    forEach: any;
    map: any;
    filter: any;
    every: any;
    some: any;
    any: any;
    all: any;
    min: any;
    max: any;
    sum: any;
    average: any;
    flatten: any;
    zip: any;
    enumerate: any;
    sorted: any;
    group: any;
    reversed: any;
    toArray: any;
    toObject: any;
    iterator: any;
    __iterationObject: any;
    get _iterationObject(): any;
    constructClone(values: any): any[];
    mapIterator(callback: any, ...args: any[]): any;
    filterIterator(callback: any, ...args: any[]): any;
    reduce(callback: any, ...args: any[]): any;
    concat(...args: any[]): Iterator;
    dropWhile(callback: any, ...args: any[]): any;
    takeWhile(callback: any, ...args: any[]): any;
    zipIterator(...args: any[]): Iterator;
    enumerateIterator(start: any): Iterator;
}
declare namespace Iterator {
    function iterate(iterable: any): Iterator;
    function cycle(cycle: any, times: any, ...args: any[]): Iterator;
    function concat(iterators: any): Iterator;
    function unzip(iterators: any): Iterator;
    function zip(...args: any[]): Iterator;
    function chain(...args: any[]): Iterator;
    function range(start: any, stop: any, step: any, ...args: any[]): Iterator;
    function count(start: any, step: any): Iterator;
    function repeat(value: any, times: any): any;
}
