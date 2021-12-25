declare class imageValidator {
    /**
     * validate image url
     * @param url
     * @returns
     */
    static validate(url: string): false | Promise<true | undefined>;
    static db: {};
    /**
     * validate image url
     * @param url
     * @returns
     */
    static isValid(url: string): false | Promise<true | undefined>;
}
export = imageValidator;
