declare class imageValidator {
    /**
     * validate image url
     * @param url
     * @returns
     */
    static validate(url: string): false | Promise<boolean>;
    static db: {};
    /**
     * validate image url
     * @param url
     * @returns
     */
    static isValid(url: string): false | Promise<boolean>;
}
export = imageValidator;
