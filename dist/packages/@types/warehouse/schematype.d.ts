export = SchemaType;
/**
 * This is the basic schema type.
 * All schema types should inherit from this class.
 * For example:
 *
 * ``` js
 * class SchemaTypeCustom extends SchemaType {};
 * ```
 *
 * **Query operators**
 *
 * To add a query operator, defines a method whose name is started with `q$`.
 * For example:
 *
 * ``` js
 * SchemaTypeCustom.q$foo = function(value, query, data){
 *   // ...
 * };
 * ```
 *
 * The `value` parameter is the value of specified field; the `query` parameter
 * is the value passed to the query operator; the `data` parameter is the
 * complete data.
 *
 * The return value must be a boolean indicating whether the data passed.
 *
 * **Update operators**
 *
 * To add a update operator, defines a method whose name is started with `u$`.
 * For example:
 *
 * ``` js
 * SchemaTypeCustom.u$foo = function(value, update, data){
 *   // ...
 * };
 * ```
 *
 * The `value` parameter is the value of specified field; the `update` parameter
 * is the value passed to the update operator; the `data` parameter is the
 * complete data.
 *
 * The return value will replace the original data.
 */
declare class SchemaType {
    /**
     * SchemaType constructor.
     *
     * @param {String} name
     * @param {Object} [options]
     *   @param {Boolean} [options.required=false]
     *   @param {*} [options.default]
     */
    constructor(name: string, options?: {
        required?: boolean;
        default?: any;
    });
    name: string;
    options: {
        required: boolean;
    } & {
        required?: boolean;
        default?: any;
    };
    default: any;
    /**
     * Casts data. This function is used by getters to cast an object to document
     * instances. If the value is null, the default value will be returned.
     *
     * @param {*} value
     * @param {Object} data
     * @return {*}
     */
    cast(value: any, data: any): any;
    /**
     * Validates data. This function is used by setters.
     *
     * @param {*} value
     * @param {Object} data
     * @return {*|Error}
     */
    validate(value: any, data: any): any | Error;
    /**
     * Compares data. This function is used when sorting.
     *
     * @param {*} a
     * @param {*} b
     * @return {Number}
     */
    compare(a: any, b: any): number;
    /**
     * Parses data. This function is used when restoring data from database files.
     *
     * @param {*} value
     * @param {Object} data
     * @return {*}
     */
    parse(value: any, data: any): any;
    /**
     * Transforms value. This function is used when saving data to database files.
     *
     * @param {*} value
     * @param {Object} data
     * @return {*}
     */
    value(value: any, data: any): any;
    /**
     * Checks the equality of data.
     *
     * @param {*} value
     * @param {*} query
     * @param {Object} data
     * @return {Boolean}
     */
    match(value: any, query: any, data: any): boolean;
    /**
     * Checks the existance of data.
     *
     * @param {*} value
     * @param {*} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$exist(value: any, query: any, data: any): boolean;
    /**
     * Checks the equality of data. Returns true if the value doesn't match.
     *
     * @param {*} value
     * @param {*} query
     * @param {Object} data
     * @return {boolean}
     */
    q$ne(value: any, query: any, data: any): boolean;
    /**
     * Checks whether `value` is less than (i.e. <) the `query`.
     *
     * @param {*} value
     * @param {*} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$lt(value: any, query: any, data: any): boolean;
    /**
     * Checks whether `value` is less than or equal to (i.e. <=) the `query`.
     *
     * @param {*} value
     * @param {*} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$lte(value: any, query: any, data: any): boolean;
    /**
     * Checks whether `value` is greater than (i.e. >) the `query`.
     *
     * @param {*} value
     * @param {*} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$gt(value: any, query: any, data: any): boolean;
    /**
     * Checks whether `value` is greater than or equal to (i.e. >=) the `query`.
     *
     * @param {*} value
     * @param {*} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$gte(value: any, query: any, data: any): boolean;
    /**
     * Checks whether `value` is equal to one of elements in `query`.
     *
     * @param {*} value
     * @param {Array} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$in(value: any, query: any[], data: any): boolean;
    /**
     * Checks whether `value` is not equal to any elements in `query`.
     *
     * @param {*} value
     * @param {Array} query
     * @param {Object} data
     * @return {Boolean}
     */
    q$nin(value: any, query: any[], data: any): boolean;
    /**
     * Sets the value.
     *
     * @param {*} value
     * @param {*} update
     * @param {Object} data
     * @return {*}
     */
    u$set(value: any, update: any, data: any): any;
    /**
     * Unsets the value.
     *
     * @param {*} value
     * @param {*} update
     * @param {Object} data
     * @return {*}
     */
    u$unset(value: any, update: any, data: any): any;
    /**
     * Renames a field.
     *
     * @param {*} value
     * @param {*} update
     * @param {Object} data
     * @return {*}
     */
    u$rename(value: any, update: any, data: any): any;
    q$exists: (value: any, query: any, data: any) => boolean;
    q$max: (value: any, query: any, data: any) => boolean;
    q$min: (value: any, query: any, data: any) => boolean;
}
//# sourceMappingURL=schematype.d.ts.map