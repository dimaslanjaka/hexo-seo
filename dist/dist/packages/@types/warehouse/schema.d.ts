export = Schema;
declare class Schema {
    /**
     * Schema constructor.
     *
     * @param {Object} schema
     */
    constructor(schema: any);
    paths: {};
    statics: {};
    methods: {};
    hooks: {
        pre: {
            save: any[];
            remove: any[];
        };
        post: {
            save: any[];
            remove: any[];
        };
    };
    stacks: {
        getter: any[];
        setter: any[];
        import: any[];
        export: any[];
    };
    /**
     * Adds paths.
     *
     * @param {Object} schema
     * @param {String} prefix
     */
    add(schema: any, prefix?: string): void;
    /**
     * Gets/Sets a path.
     *
     * @param {String} name
     * @param {*} obj
     * @return {SchemaType | undefined}
     */
    path(name: string, obj: any): SchemaType | undefined;
    /**
     * Updates cache stacks.
     *
     * @param {String} name
     * @param {SchemaType} type
     * @private
     */
    private _updateStack;
    /**
     * Adds a virtual path.
     *
     * @param {String} name
     * @param {Function} [getter]
     * @return {SchemaType.Virtual}
     */
    virtual(name: string, getter?: Function): SchemaType.Virtual;
    /**
     * Adds a pre-hook.
     *
     * @param {String} type Hook type. One of `save` or `remove`.
     * @param {Function} fn
     */
    pre(type: string, fn: Function): void;
    /**
     * Adds a post-hook.
     *
     * @param {String} type Hook type. One of `save` or `remove`.
     * @param {Function} fn
     */
    post(type: string, fn: Function): void;
    /**
     * Adds a instance method.
     *
     * @param {String} name
     * @param {Function} fn
     */
    method(name: string, fn: Function): void;
    /**
     * Adds a static method.
     *
     * @param {String} name
     * @param {Function} fn
     */
    static(name: string, fn: Function): void;
    /**
     * Apply getters.
     *
     * @param {Object} data
     * @return {void}
     * @private
     */
    private _applyGetters;
    /**
     * Apply setters.
     *
     * @param {Object} data
     * @return {void}
     * @private
     */
    private _applySetters;
    /**
     * Parses database.
     *
     * @param {Object} data
     * @return {Object}
     * @private
     */
    private _parseDatabase;
    /**
     * Exports database.
     *
     * @param {Object} data
     * @return {Object}
     * @private
     */
    private _exportDatabase;
    /**
     * Parses updating expressions and returns a stack.
     *
     * @param {Object} updates
     * @return {queryCallback[]}
     * @private
     */
    private _parseUpdate;
    /**
     * Returns a function for querying.
     *
     * @param {Object} query
     * @return {queryFilterCallback}
     * @private
     */
    private _execQuery;
    /**
     * Parses sorting expressions and returns a stack.
     *
     * @param {Object} sorts
     * @param {string} [prefix]
     * @param {queryParseCallback[]} [stack]
     * @return {queryParseCallback[]}
     * @private
     */
    private _parseSort;
    /**
     * Returns a function for sorting.
     *
     * @param {Object} sorts
     * @return {queryParseCallback}
     * @private
     */
    private _execSort;
    /**
     * Parses population expression and returns a stack.
     *
     * @param {String|Object} expr
     * @return {PopulateResult[]}
     * @private
     */
    private _parsePopulate;
    Types: typeof Types;
}
declare namespace Schema {
    export { Types_1 as Types, queryFilterCallback, queryCallback, queryParseCallback, PopulateResult };
}
import SchemaType = require("./schematype");
import Types = require("./types");
export { Types as Types_1 };
type queryFilterCallback = (data: any) => boolean;
type queryCallback = (data: any) => void;
type queryParseCallback = (a: any, b: any) => any;
type PopulateResult = {
    path: string;
    model: any;
};
//# sourceMappingURL=schema.d.ts.map