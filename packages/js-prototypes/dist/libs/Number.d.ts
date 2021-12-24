declare interface Number {
    getMS(type: string): number;
    addHour(source: Date | null): number;
    AddZero(add: number, target: string): number;
}
declare function oddoreven(n: string, type: string): boolean;
declare function strpad(val: number): string | number;
declare function isInt(n: any): boolean;
declare function isFloat(n: any): boolean;
