export = Permalink;
declare class Permalink {
    constructor(rule: any, options: any);
    rule: any;
    regex: RegExp;
    params: any[];
    test(str: any): boolean;
    parse(str: any): {};
    stringify(data: any): any;
}
//# sourceMappingURL=permalink.d.ts.map