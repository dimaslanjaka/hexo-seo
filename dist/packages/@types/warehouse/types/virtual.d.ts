export = SchemaTypeVirtual;
/**
 * Virtual schema type.
 */
declare class SchemaTypeVirtual extends SchemaType {
    /**
     * Add a getter.
     *
     * @param {Function} fn
     * @chainable
     */
    get(fn: Function): SchemaTypeVirtual;
    getter: Function;
    /**
     * Add a setter.
     *
     * @param {Function} fn
     * @chainable
     */
    set(fn: Function): SchemaTypeVirtual;
    setter: Function;
    /**
     * Applies setters.
     *
     * @param {*} value
     * @param {Object} data
     */
    validate(value: any, data: any): void;
}
import SchemaType = require("../schematype");
//# sourceMappingURL=virtual.d.ts.map