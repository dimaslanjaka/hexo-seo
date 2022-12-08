export = SchemaTypeDate;
/**
 * Date schema type.
 */
declare class SchemaTypeDate extends SchemaType {
    /**
     * Casts data.
     *
     * @param {*} value
     * @param {Object} data
     * @return {Date}
     */
    cast(value_: any, data: any): Date;
    /**
     * Validates data.
     *
     * @param {*} value
     * @param {Object} data
     * @return {Date|Error}
     */
    validate(value_: any, data: any): Date | Error;
    /**
     * Checks the equality of data.
     *
     * @param {Date} value
     * @param {Date} query
     * @param {Object} data
     * @return {Boolean}
     */
    match(value: Date, query: Date, data: any): boolean;
    /**
     * Compares between two dates.
     *
     * @param {Date} a
     * @param {Date} b
     * @return {Number}
     */
    compare(a: Date, b: Date): number;
    /**
     * Parses data and transforms it into a date object.
     *
     * @param {*} value
     * @param {Object} data
     * @return {Date}
     */
    parse(value: any, data: any): Date;
    /**
     * Transforms a date object to a string.
     *
     * @param {Date} value
     * @param {Object} data
     * @return {String}
     */
    value(value: Date, data: any): string;
    /**
     * Finds data by its date.
     *
     * @param {Date} value
     * @param {Number} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$day(value: Date, query: number, data: any): boolean;
    /**
     * Finds data by its month. (Start from 0)
     *
     * @param {Date} value
     * @param {Number} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$month(value: Date, query: number, data: any): boolean;
    /**
     * Finds data by its year. (4-digit)
     *
     * @param {Date} value
     * @param {Number} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$year(value: Date, query: number, data: any): boolean;
    /**
     * Adds milliseconds to date.
     *
     * @param {Date} value
     * @param {Number} update
     * @param {Object} data
     * @return {Date}
     */
    u$inc(value: Date, update: number, data: any): Date;
    /**
     * Subtracts milliseconds from date.
     *
     * @param {Date} value
     * @param {Number} update
     * @param {Object} data
     * @return {Date}
     */
    u$dec(value: Date, update: number, data: any): Date;
}
import SchemaType = require("../schematype");
//# sourceMappingURL=date.d.ts.map