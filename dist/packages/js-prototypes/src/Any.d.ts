/// <reference types="node" />
declare type anyOf = keyof any | Buffer | string | object | symbol | Record<string, any> | (() => any);
