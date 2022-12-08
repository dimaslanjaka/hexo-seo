export = Color;
declare class Color {
    /**
     * @param {string|{ r: number; g: number; b: number; a: number;}} color
     */
    constructor(color: string | {
        r: number;
        g: number;
        b: number;
        a: number;
    });
    r: number;
    g: number;
    b: number;
    a: number;
    /**
     * @param {string} color
     */
    _parse(color: string): void;
    toString(): string;
    /**
     * @param {string|{ r: number; g: number; b: number; a: number;}} color
     * @param {number} ratio
     */
    mix(color: string | {
        r: number;
        g: number;
        b: number;
        a: number;
    }, ratio: number): Color;
}
//# sourceMappingURL=color.d.ts.map