/// <reference types="node" />
import Promise from 'bluebird';
import { Stream } from 'stream';
export declare function isStream(stream: any): boolean;
export declare function isWritableStream(stream: any): boolean;
export declare function isReadableStream(stream: any): boolean;
export declare function isDuplexStream(stream: any): boolean;
export declare function isTransformStream(stream: any): boolean;
export declare function streamToString(stream: Stream): Promise<unknown>;
export declare function streamToArray(self: Stream, done?: {
    (arg0: any, arg1: string[]): void;
    (error: any): void | PromiseLike<void>;
    (arg0: any, arg1: string[]): any;
}): Promise<string[]>;
