// Type definitions for through2 v 2.0
// Project: https://github.com/rvagg/through2
// Definitions by: Bart van der Schoor <https://github.com/Bartvds>,
//                 jedmao <https://github.com/jedmao>,
//                 Georgios Valotasios <https://github.com/valotas>,
//                 Ben Chauvette < https://github.com/bdchauvette>,
//                 TeamworkGuy2 <https://github.com/TeamworkGuy2>,
//                 Alorel <https://github.com/Alorel>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

/// <reference types="node" />

import stream = require('stream');
import Vinyl = require('vinyl');

declare function through2(transform?: through2.TransformFunction, flush?: through2.FlushCallback): stream.Transform;
declare function through2(opts?: stream.DuplexOptions, transform?: through2.TransformFunction, flush?: through2.FlushCallback): stream.Transform;

declare namespace through2 {
  interface Through2Constructor extends stream.Transform {
    new(opts?: stream.DuplexOptions): stream.Transform;
    (opts?: stream.DuplexOptions): stream.Transform;
  }

  /**
   * * `callback()` drop this data.\
    this makes the map work like `filter`,\
    note: 
   * * `callback(null,null)` is not the same, and will emit `null`
   * * `callback(null, newData)` turn data into newData
   * * `callback(error)` emit an error for this item.
   * * `callback(null,null)` emit nulled data
   */
  export type TransformCallback = (err?: any, data?: any) => void;
  export type TransformFunction = (this: stream.Transform, chunk: Vinyl, enc: BufferEncoding, callback: TransformCallback) => void;
  type FlushCallback = (this: stream.Transform, flushCallback: () => void) => void;

  /**
   * Convenvience method for creating object streams
   * @param transform
   * @example
   * gulp.src('*.*').pipe(through2.obj((vinyl, encoding, callback) => {
   *  if (vinyl.isNull() || vinyl.isStream()) return callback(); // skip null and stream object
   *  vinyl.contents = Buffer.from(vinyl.contents).toString().replace('old', 'new');
   *  this.push(vinyl); // emit this file
   *  callback(null, vinyl); // emit new data
   * * // `callback()` drop this data
   * * // `callback(null, newData)` emit data into newData
   * * // `callback(error)` emit an error for this item.
   * * // `callback(null,null)` emit nulled data
   * }));
   */
   function obj(transform?: TransformFunction, flush?: FlushCallback): stream.Transform;

   export type objFunc = typeof obj;

  /**
   * Creates a constructor for a custom Transform. This is useful when you
   * want to use the same transform logic in multiple instances.
   */
  function ctor(transform?: TransformFunction, flush?: FlushCallback): Through2Constructor;
  function ctor(opts?: stream.DuplexOptions, transform?: TransformFunction, flush?: FlushCallback): Through2Constructor;
}

export = through2;
//export default through2;
