export = List;
declare function List(values: any, equals: any, getDefault: any): any;
declare class List {
    constructor(values: any, equals: any, getDefault: any);
    constructor: typeof List;
    makeObservable(): void;
    dispatchesRangeChanges: boolean | undefined;
    delete(value: any, equals: any): boolean;
    superClear: any;
    clear(): void;
    add(value: any): boolean;
    superPush: any;
    push(...args: any[]): void;
    superUnshift: any;
    unshift(...args: any[]): void;
    superPop: any;
    pop(): any;
    superShift: any;
    shift(): any;
    superSwap: any;
    swap(start: any, length: any, plus: any): any;
    superReverse: any;
    reverse(): List;
}
declare namespace List {
    export { List };
    export const from: (...args: any[]) => void;
}
