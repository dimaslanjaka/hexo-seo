export = SchemaTypeBuffer;
/**
 * Boolean schema type.
 */
declare class SchemaTypeBuffer extends SchemaType {
    /**
     * @param {string} name
     * @param {object} [options]
     *   @param {boolean} [options.required=false]
     *   @param {boolean|Function} [options.default]
     *   @param {string} [options.encoding=hex]
     */
    constructor(name: string, options?: {
        required?: boolean;
        default?: boolean | Function;
        encoding?: string;
    });
    /**
     * Casts data.
     *
     * @param {*} value
     * @param {Object} data
     * @return {Buffer}
     */
    cast(value_: any, data: any): Buffer;
    /**
     * Validates data.
     *
     * @param {*} value
     * @param {Object} data
     * @return {Buffer}
     */
    validate(value_: any, data: any): Buffer;
    /**
     * Compares between two buffers.
     *
     * @param {Buffer} a
     * @param {Buffer} b
     * @return {Number}
     */
    compare(a: Buffer, b: Buffer): number;
    /**
     * Parses data and transform them into buffer values.
     *
     * @param {*} value
     * @param {Object} data
     * @return {Boolean}
     */
    parse(value: any, data: any): boolean;
    /**
     * Transforms data into number to compress the size of database files.
     *
     * @param {Buffer} value
     * @param {Object} data
     * @return {Number}
     */
    value(value: Buffer, data: any): number;
    /**
     * Checks the equality of data.
     *
     * @param {Buffer} value
     * @param {Buffer} query
     * @param {Object} data
     * @return {Boolean}
     */
    match(value: Buffer, query: Buffer, data: any): boolean;
}
import SchemaType = require("../schematype");
//# sourceMappingURL=buffer.d.ts.map