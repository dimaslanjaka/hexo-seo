import makeRandom = require("./prng");
declare function makeFuzz(length: any, seed: any, max: any): ({
    type: string;
    value: number | undefined;
} | undefined)[];
declare function stringifyFuzz(operations: any): any;
declare function parseFuzz(fuzz: any): any;
declare function executeFuzz(set: any, operations: any, log: any): void;
export { makeRandom, makeFuzz as make, stringifyFuzz as stringify, parseFuzz as parse, executeFuzz as execute };
