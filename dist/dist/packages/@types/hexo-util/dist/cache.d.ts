export = Cache;
declare class Cache {
    cache: Map<any, any>;
    set(id: any, value: any): void;
    has(id: any): boolean;
    get(id: any): any;
    del(id: any): void;
    apply(id: any, value: any): any;
    flush(): void;
    size(): number;
    dump(): any;
}
//# sourceMappingURL=cache.d.ts.map