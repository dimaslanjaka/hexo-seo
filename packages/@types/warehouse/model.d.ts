/* eslint-disable @typescript-eslint/ban-types */
export = Model;

declare class Model extends EventEmitter {
  /**
   * Model constructor.
   *
   * @param {string} name Model name
   * @param {Schema|object} [schema] Schema
   */
  constructor(name: string, schema_: any);
  name: string;
  data: {};
  _mutex: Mutex;
  schema: Schema | Schema;
  length: number;
  Document: {
    new (data: any): {
      _model: this;
      _schema: Schema | Schema;
      save(callback?: CallableFunction): globalThis.Promise<any>;
      update(data: any, callback?: CallableFunction): globalThis.Promise<any>;
      replace(data: any, callback?: CallableFunction): globalThis.Promise<any>;
      remove(callback?: CallableFunction): globalThis.Promise<any>;
      toObject(): any;
      toString(): string;
      populate(expr: any): Document;
    };
  };
  Query: {
    new (data: any[]): {
      _model: this;
      _schema: Schema | Schema;
      data: any[];
      length: number;
      count(): number;
      forEach(iterator: CallableFunction): void;
      toArray(): any[];
      eq(i: number): any;
      first(): any;
      last(): any;
      slice(start: number, end?: number): Query;
      limit(i: number): Query;
      skip(i: number): Query;
      reverse(): Query;
      shuffle(): Query;
      find(
        query: any,
        options?: {
          limit?: number;
          skip?: number;
          lean?: boolean;
        }
      ): any[] | Query;
      findOne(
        query: any,
        options?: {
          skip?: number;
          lean?: boolean;
        }
      ): any;
      sort(orderby: any, order?: string | number): Query;
      map(iterator: CallableFunction): any[];
      reduce(iterator: CallableFunction, initial?: any): any;
      reduceRight(iterator: CallableFunction, initial?: any): any;
      filter(iterator: CallableFunction): Query;
      every(iterator: CallableFunction): boolean;
      some(iterator: CallableFunction): boolean;
      update(data: any, callback?: CallableFunction): Promise<any>;
      replace(data: any, callback?: CallableFunction): Promise<any>;
      remove(callback?: CallableFunction): Promise<any>;
      populate(expr: any): Query;
      size: () => number;
      each: (iterator: CallableFunction) => void;
      random: () => Query;
    };
  };
  /**
   * Creates a new document.
   *
   * @param {object} data
   * @return {Document}
   */
  new(data: object): Document;
  /**
   * Finds a document by its identifier.
   *
   * @param {*} id
   * @param {object} options
   *   @param {boolean} [options.lean=false] Returns a plain JavaScript object
   * @return {Document|object}
   */
  findById(id: any, options_: any): Document | object;
  /**
   * Checks if the model contains a document with the specified id.
   *
   * @param {*} id
   * @return {boolean}
   */
  has(id: any): boolean;
  /**
   * Acquires write lock.
   *
   * @param {*} id
   * @return {Promise}
   * @private
   */
  private _acquireWriteLock;
  /**
   * Inserts a document.
   *
   * @param {Document|object} data
   * @return {Promise}
   * @private
   */
  private _insertOne;
  /**
   * Inserts a document.
   *
   * @param {object} data
   * @param {function} [callback]
   * @return {Promise}
   */
  insertOne(data: object, callback?: Function): Promise<any>;
  /**
   * Inserts documents.
   *
   * @param {object|array} data
   * @param {function} [callback]
   * @return {Promise}
   */
  insert(data: object | any[], callback?: Function): Promise<any>;
  /**
   * Inserts the document if it does not exist; otherwise updates it.
   *
   * @param {object} data
   * @param {function} [callback]
   * @return {Promise}
   */
  save(data: object, callback?: Function): Promise<any>;
  /**
   * Updates a document with a compiled stack.
   *
   * @param {*} id
   * @param {array} stack
   * @return {Promise}
   * @private
   */
  private _updateWithStack;
  /**
   * Finds a document by its identifier and update it.
   *
   * @param {*} id
   * @param {object} update
   * @param {function} [callback]
   * @return {Promise}
   */
  updateById(id: any, update: object, callback?: Function): Promise<any>;
  /**
   * Updates matching documents.
   *
   * @param {object} query
   * @param {object} data
   * @param {function} [callback]
   * @return {Promise}
   */
  update(query: object, data: object, callback?: Function): Promise<any>;
  /**
   * Finds a document by its identifier and replace it.
   *
   * @param {*} id
   * @param  {object} data
   * @return {Promise}
   * @private
   */
  private _replaceById;
  /**
   * Finds a document by its identifier and replace it.
   *
   * @param {*} id
   * @param {object} data
   * @param {function} [callback]
   * @return {Promise}
   */
  replaceById(id: any, data: object, callback?: Function): Promise<any>;
  /**
   * Replaces matching documents.
   *
   * @param {object} query
   * @param {object} data
   * @param {function} [callback]
   * @return {Promise}
   */
  replace(query: object, data: object, callback?: Function): Promise<any>;
  /**
   * Finds a document by its identifier and remove it.
   *
   * @param {*} id
   * @param {function} [callback]
   * @return {Promise}
   * @private
   */
  private _removeById;
  /**
   * Finds a document by its identifier and remove it.
   *
   * @param {*} id
   * @param {function} [callback]
   * @return {Promise}
   */
  removeById(id: any, callback?: Function): Promise<any>;
  /**
   * Removes matching documents.
   *
   * @param {object} query
   * @param {object} [callback]
   * @return {Promise}
   */
  remove(query: object, callback?: object): Promise<any>;
  /**
   * Deletes a model.
   */
  destroy(): void;
  /**
   * Returns the number of elements.
   *
   * @return {number}
   */
  count(): number;
  /**
   * Iterates over all documents.
   *
   * @param {function} iterator
   * @param {object} [options] See {@link Model#findById}.
   */
  forEach(iterator: Function, options?: object): void;
  /**
   * Returns an array containing all documents.
   *
   * @param {Object} [options] See {@link Model#findById}.
   * @return {Array}
   */
  toArray(options?: any): any[];
  /**
   * Finds matching documents.
   *
   * @param {Object} query
   * @param {Object} [options]
   *   @param {Number} [options.limit=0] Limits the number of documents returned.
   *   @param {Number} [options.skip=0] Skips the first elements.
   *   @param {Boolean} [options.lean=false] Returns a plain JavaScript object.
   * @return {Query|Array}
   */
  find(query: any, options_: any): Query | any[];
  /**
   * Finds the first matching documents.
   *
   * @param {Object} query
   * @param {Object} [options]
   *   @param {Number} [options.skip=0] Skips the first elements.
   *   @param {Boolean} [options.lean=false] Returns a plain JavaScript object.
   * @return {Document|Object}
   */
  findOne(query: any, options_: any): Document | any;
  /**
   * Sorts documents. See {@link Query#sort}.
   *
   * @param {String|Object} orderby
   * @param {String|Number} [order]
   * @return {Query}
   */
  sort(orderby: string | any, order?: string | number): Query;
  /**
   * Returns the document at the specified index. `num` can be a positive or
   * negative number.
   *
   * @param {Number} i
   * @param {Object} [options] See {@link Model#findById}.
   * @return {Document|Object}
   */
  eq(i_: any, options?: any): Document | any;
  /**
   * Returns the first document.
   *
   * @param {Object} [options] See {@link Model#findById}.
   * @return {Document|Object}
   */
  first(options?: any): Document | any;
  /**
   * Returns the last document.
   *
   * @param {Object} [options] See {@link Model#findById}.
   * @return {Document|Object}
   */
  last(options?: any): Document | any;
  /**
   * Returns the specified range of documents.
   *
   * @param {Number} start
   * @param {Number} [end]
   * @return {Query}
   */
  slice(start_: any, end_: any): Query;
  /**
   * Limits the number of documents returned.
   *
   * @param {Number} i
   * @return {Query}
   */
  limit(i: number): Query;
  /**
   * Specifies the number of items to skip.
   *
   * @param {Number} i
   * @return {Query}
   */
  skip(i: number): Query;
  /**
   * Returns documents in a reversed order.
   *
   * @return {Query}
   */
  reverse(): Query;
  /**
   * Returns documents in random order.
   *
   * @return {Query}
   */
  shuffle(): Query;
  /**
   * Creates an array of values by iterating each element in the collection.
   *
   * @param {Function} iterator
   * @param {Object} [options]
   * @return {Array}
   */
  map(iterator: Function, options?: any): any[];
  /**
   * Reduces a collection to a value which is the accumulated result of iterating
   * each element in the collection.
   *
   * @param {Function} iterator
   * @param {*} [initial] By default, the initial value is the first document.
   * @return {*}
   */
  reduce(iterator: Function, initial?: any): any;
  /**
   * Reduces a collection to a value which is the accumulated result of iterating
   * each element in the collection from right to left.
   *
   * @param {Function} iterator
   * @param {*} [initial] By default, the initial value is the last document.
   * @return {*}
   */
  reduceRight(iterator: Function, initial?: any): any;
  /**
   * Creates a new array with all documents that pass the test implemented by the
   * provided function.
   *
   * @param {Function} iterator
   * @param {Object} [options]
   * @return {Query}
   */
  filter(iterator: Function, options?: any): Query;
  /**
   * Tests whether all documents pass the test implemented by the provided
   * function.
   *
   * @param {Function} iterator
   * @return {Boolean}
   */
  every(iterator: Function): boolean;
  /**
   * Tests whether some documents pass the test implemented by the provided
   * function.
   *
   * @param {Function} iterator
   * @return {Boolean}
   */
  some(iterator: Function): boolean;
  /**
   * Returns a getter function for normal population.
   *
   * @param {Object} data
   * @param {Model} model
   * @param {Object} options
   * @return {Function}
   * @private
   */
  private _populateGetter;
  /**
   * Returns a getter function for array population.
   *
   * @param {Object} data
   * @param {Model} model
   * @param {Object} options
   * @return {Function}
   * @private
   */
  private _populateGetterArray;
  /**
   * Populates document references with a compiled stack.
   *
   * @param {Object} data
   * @param {Array} stack
   * @return {Object}
   * @private
   */
  private _populate;
  /**
   * Populates document references.
   *
   * @param {String|Object} path
   * @return {Query}
   */
  populate(path: string | any): Query;
  /**
   * Imports data.
   *
   * @param {Array} arr
   * @private
   */
  private _import;
  /**
   * Exports data.
   *
   * @return {String}
   * @private
   */
  private _export;
  toJSON(): any[];
  get: (id: any, options_: any) => Document | object;
  size: () => number;
  each: (iterator: Function, options?: object) => void;
  random: () => Query;
}
import { EventEmitter } from 'events';
import Mutex = require('./mutex');
import Schema = require('./schema');
import Document = require('./document');
import Query = require('./query');
import Promise = require('bluebird');
//# sourceMappingURL=model.d.ts.map
