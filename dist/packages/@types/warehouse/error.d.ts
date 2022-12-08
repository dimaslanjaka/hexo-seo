export = WarehouseError;
declare class WarehouseError extends Error {
    /**
     * WarehouseError constructor
     *
     * @param {string} msg
     * @param {string} code
     */
    constructor(msg: string, code: string);
    code: string;
}
declare namespace WarehouseError {
    const ID_EXIST: string;
    const ID_NOT_EXIST: string;
    const ID_UNDEFINED: string;
}
//# sourceMappingURL=error.d.ts.map