/// <reference path="../../src/Object.d.ts" />
declare function object_join(obj: Record<any, unknown>): string;
declare function extend_object<T1 extends Record<any, unknown>, T2 extends Record<any, unknown>>(arg1: T1, arg2: T2): T1 & T2;
