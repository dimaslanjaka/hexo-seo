/// <reference path="../../src/Object.d.ts" />
/**
 * Join object to separated string
 * @param obj Object
 * @returns Joined string
 */
declare function object_join(obj: Record<any, unknown>): string;
/**
 * Extend Object
 * @param arg1
 * @param arg2
 * @returns
 */
declare function extend_object<T1 extends Record<any, unknown>, T2 extends Record<any, unknown>>(arg1: T1, arg2: T2): T1 & T2;
