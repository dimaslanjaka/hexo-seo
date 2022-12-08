export = SchemaTypeBoolean;
/**
 * Boolean schema type.
 */
declare class SchemaTypeBoolean extends SchemaType {
    /**
     * Casts a boolean.
     *
     * @param {*} value
     * @param {Object} data
     * @return {Boolean}
     */
    cast(value_: any, data: any): boolean;
    /**
     * Validates a boolean.
     *
     * @param {*} value
     * @param {Object} data
     * @return {Boolean|Error}
     */
    validate(value_: any, data: any): boolean | Error;
    /**
     * Parses data and transform them into boolean values.
     *
     * @param {*} value
     * @param {Object} data
     * @return {Boolean}
     */
    parse(value: any, data: any): boolean;
    /**
     * Transforms data into number to compress the size of database files.
     *
     * @param {Boolean} value
     * @param {Object} data
     * @return {Number}
     */
    value(value: boolean, data: any): number;
}
import SchemaType = require("../schematype");
//# sourceMappingURL=boolean.d.ts.map