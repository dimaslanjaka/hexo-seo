export = versionParser;
/**
 * Version Parser
 */
declare class versionParser {
    /**
     * Version Parser Constructor
     * @param {string} str
     */
    constructor(str: string);
    result: {
        major: number;
        minor: number;
        build: number;
    };
    /**
     * Parse Version String
     * @param {string} str
     * @returns
     */
    parseVersion(str: string): {
        major: number;
        minor: number;
        build: number;
    };
    toString(): string;
}
