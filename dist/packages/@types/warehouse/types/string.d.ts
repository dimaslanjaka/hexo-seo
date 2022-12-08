export = SchemaTypeString;
/**
 * String schema type.
 */
declare class SchemaTypeString extends SchemaType {
    /**
     * Casts a string.
     *
     * @param {*} value
     * @param {Object} data
     * @return {String}
     */
    cast(value_: any, data: any): string;
    /**
     * Validates a string.
     *
     * @param {*} value
     * @param {Object} data
     * @return {String|Error}
     */
    validate(value_: any, data: any): string | Error;
    /**
     * Checks the equality of data.
     *
     * @param {*} value
     * @param {String|RegExp} query
     * @param {Object} data
     * @return {Boolean}
     */
    match(value: any, query: string | RegExp, data: any): boolean;
    /**
     * Checks whether a string is equal to one of elements in `query`.
     *
     * @param {String} value
     * @param {Array} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$in(value: string, query: any[], data: any): boolean;
    /**
     * Checks whether a string is not equal to any elements in `query`.
     *
     * @param {String} value
     * @param {Array} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$nin(value: string, query: any[], data: any): boolean;
    /**
     * Checks length of a string.
     *
     * @param {String} value
     * @param {Number} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$length(value: string, query: number, data: any): boolean;
}
import SchemaType = require("../schematype");
//# sourceMappingURL=string.d.ts.map