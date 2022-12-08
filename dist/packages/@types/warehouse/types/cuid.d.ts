export = SchemaTypeCUID;
/**
 * [CUID](https://github.com/ericelliott/cuid) schema type.
 */
declare class SchemaTypeCUID extends SchemaType {
    /**
     * Casts data. Returns a new CUID only if value is null and the field is
     * required.
     *
     * @param {String} value
     * @param {Object} data
     * @return {String}
     */
    cast(value: string, data: any): string;
    /**
     * Validates data. A valid CUID must be started with `c` and 25 in length.
     *
     * @param {*} value
     * @param {Object} data
     * @return {String|Error}
     */
    validate(value: any, data: any): string | Error;
}
import SchemaType = require("../schematype");
//# sourceMappingURL=cuid.d.ts.map