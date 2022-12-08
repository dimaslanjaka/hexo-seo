export = SchemaTypeEnum;
/**
 * Enum schema type.
 */
declare class SchemaTypeEnum extends SchemaType {
    /**
     *
     * @param {String} name
     * @param {Object} options
     *   @param {Boolean} [options.required=false]
     *   @param {Array} options.elements
     *   @param {*} [options.default]
     */
    constructor(name: string, options: {
        required?: boolean;
        elements: any[];
        default?: any;
    });
}
import SchemaType = require("../schematype");
//# sourceMappingURL=enum.d.ts.map