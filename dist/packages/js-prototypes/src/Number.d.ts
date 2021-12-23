declare interface Number {
    getMS(type: string): number;
    /**
     * Get X Hour from date
     * @return number ms from Date().getTime()
     * @example
     * get `1 hour from current Date()`
     * 1.addHour()
     * get `1 hour from spesific Date()`
     * 1.addHour(new Date('2020-06-04 01:10:53'))
     */
    addHour(source: Date | null): number;
    /**
     * add zero leading
     * @param add
     * @param target
     */
    AddZero(add: number, target: string): number;
}
/**
 * Odd or Even (Ganjil Genap);
 * @param n
 * @param type odd or even
 */
declare function oddoreven(n: string, type: string): boolean;
/**
 * strpad / startwith zero [0]
 * @param {number} val
 */
declare function strpad(val: number): string | number;
/**
 * is variable number?
 * @param n
 * @returns
 */
declare function isInt(n: any): boolean;
/**
 * is variable float?
 * @param n
 * @returns
 */
declare function isFloat(n: any): boolean;
