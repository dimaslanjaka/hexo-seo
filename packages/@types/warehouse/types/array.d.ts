export = SchemaTypeArray;
/**
 * Array schema type.
 */
declare class SchemaTypeArray extends SchemaType {
    /**
     *
     * @param {String} name
     * @param {Object} [options]
     *   @param {Boolean} [options.required=false]
     *   @param {Array|Function} [options.default=[]]
     *   @param {SchemaType} [options.child]
     */
    constructor(name: string, options?: {
        required?: boolean;
        default?: any[] | Function;
        child?: SchemaType;
    });
    child: any;
    /**
     * Casts an array and its child elements.
     *
     * @param {*} value
     * @param {Object} data
     * @return {Array}
     */
    cast(value_: any, data: any): any[];
    /**
     * Validates an array and its child elements.
     *
     * @param {*} value
     * @param {Object} data
     * @return {Array|Error}
     */
    validate(value_: any, data: any): any[] | Error;
    /**
     * Compares an array by its child elements and the size of the array.
     *
     * @param {Array} a
     * @param {Array} b
     * @return {Number}
     */
    compare(a: any[], b: any[]): number;
    /**
     * Parses data.
     *
     * @param {Array} value
     * @param {Object} data
     * @return {Array}
     */
    parse(value: any[], data: any): any[];
    /**
     * Transforms data.
     *
     * @param {Array} value
     * @param {Object} data
     * @return {Array}
     */
    value(value: any[], data: any): any[];
    /**
     * Checks the equality of an array.
     *
     * @param {Array} value
     * @param {Array} query
     * @param {Object} data
     * @return {Boolean}
     */
    match(value: any[], query: any[], data: any): boolean;
    /**
     * Checks whether the number of elements in an array is equal to `query`.
     *
     * @param {Array} value
     * @param {Number} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$size(value: any[], query: number, data: any): boolean;
    /**
     * Checks whether an array contains one of elements in `query`.
     *
     * @param {Array} value
     * @param {Array} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$in(value: any[], query: any[], data: any): boolean;
    /**
     * Checks whether an array does not contain in any elements in `query`.
     *
     * @param {Array} value
     * @param {Array} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$nin(value: any[], query: any[], data: any): boolean;
    /**
     * Checks whether an array contains all elements in `query`.
     *
     * @param {Array} value
     * @param {Array} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$all(value: any[], query: any[], data: any): boolean;
    /**
     * Add elements to an array.
     *
     * @param {Array} value
     * @param {*} update
     * @param {Object} data
     * @return {Array}
     */
    u$push(value: any[], update: any, data: any): any[];
    /**
     * Add elements in front of an array.
     *
     * @param {Array} value
     * @param {*} update
     * @param {Object} data
     * @return {Array}
     */
    u$unshift(value: any[], update: any, data: any): any[];
    /**
     * Removes elements from an array.
     *
     * @param {Array} value
     * @param {*} update
     * @param {Object} data
     * @return {Array}
     */
    u$pull(value: any[], update: any, data: any): any[];
    /**
     * Removes the first element from an array.
     *
     * @param {Array} value
     * @param {Number|Boolean} update
     * @param {Object} data
     * @return {Array}
     */
    u$shift(value: any[], update: number | boolean, data: any): any[];
    /**
     * Removes the last element from an array.
     *
     * @param {Array} value
     * @param {Number|Boolean} update
     * @param {Object} data
     * @return {Array}
     */
    u$pop(value: any[], update: number | boolean, data: any): any[];
    /**
     * Add elements to an array only if the value is not already in the array.
     *
     * @param {Array} value
     * @param {*} update
     * @param {Object} data
     * @return {Array}
     */
    u$addToSet(value: any[], update: any, data: any): any[];
    q$length: (value: any[], query: number, data: any) => boolean;
    u$append: (value: any[], update: any, data: any) => any[];
    u$prepend: (value: any[], update: any, data: any) => any[];
}
import SchemaType = require("../schematype");
//# sourceMappingURL=array.d.ts.map