export = SchemaTypeNumber;
/**
 * Number schema type.
 */
declare class SchemaTypeNumber extends SchemaType {
    /**
     * Casts a number.
     *
     * @param {*} value
     * @param {Object} data
     * @return {Number}
     */
    cast(value_: any, data: any): number;
    /**
     * Validates a number.
     *
     * @param {*} value
     * @param {Object} data
     * @return {Number|Error}
     */
    validate(value_: any, data: any): number | Error;
    /**
     * Adds value to a number.
     *
     * @param {Number} value
     * @param {Number} update
     * @param {Object} data
     * @return {Number}
     */
    u$inc(value: number, update: number, data: any): number;
    /**
     * Subtracts value from a number.
     *
     * @param {Number} value
     * @param {Number} update
     * @param {Object} data
     * @return {Number}
     */
    u$dec(value: number, update: number, data: any): number;
    /**
     * Multiplies value to a number.
     *
     * @param {Number} value
     * @param {Number} update
     * @param {Object} data
     * @return {Number}
     */
    u$mul(value: number, update: number, data: any): number;
    /**
     * Divides a number by a value.
     *
     * @param {Number} value
     * @param {Number} update
     * @param {Object} data
     * @return {Number}
     */
    u$div(value: number, update: number, data: any): number;
    /**
     * Divides a number by a value and returns the remainder.
     *
     * @param {Number} value
     * @param {Number} update
     * @param {Object} data
     * @return {Number}
     */
    u$mod(value: number, update: number, data: any): number;
    /**
     * Updates a number if the value is greater than the current value.
     *
     * @param {Number} value
     * @param {Number} update
     * @param {Object} data
     * @return {Number}
     */
    u$max(value: number, update: number, data: any): number;
    /**
     * Updates a number if the value is less than the current value.
     *
     * @param {Number} value
     * @param {Number} update
     * @param {Object} data
     * @return {Number}
     */
    u$min(value: number, update: number, data: any): number;
}
import SchemaType = require("../schematype");
//# sourceMappingURL=number.d.ts.map