export = Mutex;
declare class Mutex {
    _locked: boolean;
    _queue: any[];
    lock(fn: any): void;
    unlock(): void;
}
//# sourceMappingURL=mutex.d.ts.map