export function fuzzDeque(Deque: any): void;
export function makePlan(length: any, seed: any, biasWeight: any, maxAddLength: any): {
    seed: any;
    length: any;
    biasWeight: any;
    maxAddLength: any;
    ops: (string | number[])[][];
};
export function execute(Collection: any, ops: any): void;
export function executeOp(collection: any, op: any): void;
export function stringify(ops: any): any;
export function stringifyOp(op: any): string;
