export = Dict;
declare function Dict(values: any, getDefault: any): Dict;
declare class Dict {
    constructor(values: any, getDefault: any);
    getDefault: any;
    store: any;
    length: number | undefined;
    constructClone(values: any): any;
    assertString(key: any): void;
    readonly $__proto__: any;
    get _hasProto(): boolean;
    set _protoValue(arg: any);
    get _protoValue(): any;
    readonly size: number;
    get(key: any, defaultValue: any, ...args: any[]): any;
    set(key: any, value: any): boolean;
    has(key: any): boolean;
    delete(key: any): boolean;
    clear(): void;
    reduce(callback: any, basis: any, thisp: any): any;
    reduceRight(callback: any, basis: any, thisp: any): any;
    one(): any;
    toJSON(): any;
}
declare namespace Dict {
    export { Dict };
    export const from: (...args: any[]) => void;
}
