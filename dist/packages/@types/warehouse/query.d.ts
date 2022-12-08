/* eslint-disable @typescript-eslint/ban-types */
export = Query;
declare class Query<T> {
  /**
   * Query constructor.
   *
   * @param {Array} data
   */
  constructor(data: any[]);
  data: any[];
  length: number;
  /**
   * Returns the number of elements.
   *
   * @return Number
   */
  count(): number;
  /**
   * Iterates over all documents.
   *
   * @param iterator
   */
  forEach(iterator: (v: T, i: number) => any): void;
  /**
   * Returns an array containing all documents.
   *
   * @return {Array}
   */
  toArray(): T[];
  /**
   * Returns the document at the specified index. `num` can be a positive or
   * negative number.
   *
   * @param {Number} i
   * @return {Document|Object}
   */
  eq(i: number): Document | T;
  /**
   * Returns the first document.
   *
   * @return {Document|Object}
   */
  first(): Document | T;
  /**
   * Returns the last document.
   *
   * @return {Document|Object}
   */
  last(): Document | any;
  /**
   * Returns the specified range of documents.
   *
   * @param {Number} start
   * @param {Number} [end]
   * @return {Query}
   */
  slice(start: number, end?: number): Query<T>;
  /**
   * Limits the number of documents returned.
   *
   * @param {Number} i
   * @return {Query}
   */
  limit(i: number): Query<T>;
  /**
   * Specifies the number of items to skip.
   *
   * @param {Number} i
   * @return {Query}
   */
  skip(i: number): Query<T>;
  /**
   * Returns documents in a reversed order.
   *
   * @return {Query}
   */
  reverse(): Query<T>;
  /**
   * Returns documents in random order.
   *
   * @return {Query}
   */
  shuffle(): Query<T>;
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
  find(
    query: any,
    options?: {
      limit?: number;
      skip?: number;
      lean?: boolean;
    }
  ): Query<T> | T[];
  /**
   * Finds the first matching documents.
   *
   * @param {Object} query
   * @param {Object} [options]
   *   @param {Number} [options.skip=0] Skips the first elements.
   *   @param {Boolean} [options.lean=false] Returns a plain JavaScript object.
   * @return {Document|Object}
   */
  findOne(
    query: any,
    options?: {
      skip?: number;
      lean?: boolean;
    }
  ): Document | any;
  /**
   * Sorts documents.
   *
   * Example:
   *
   * ``` js
   * query.sort('date', -1);
   * query.sort({date: -1, title: 1});
   * query.sort('-date title');
   * ```
   *
   * If the `order` equals to `-1`, `desc` or `descending`, the data will be
   * returned in reversed order.
   *
   * @param {String|Object} orderby
   * @param {String|Number} [order]
   * @return {Query}
   */
  sort(orderby: string | any, order?: string | number): Query<T>;

  /**
   * Creates an array of values by iterating each element in the collection.
   *
   * @param iterator
   * @return
   */
  map<U>(iterator: (v: T, i: number) => U): U[];

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
   * @return {Query}
   */
  filter(iterator: (v: T, i: number) => boolean): Query<T>;
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
   * Update all documents.
   *
   * @param {Object} data
   * @param {Function} [callback]
   * @return {Promise}
   */
  update(data: any, callback?: Function): Promise<any>;
  /**
   * Replace all documents.
   *
   * @param {Object} data
   * @param {Function} [callback]
   * @return {Promise}
   */
  replace(data: any, callback?: Function): Promise<any>;
  /**
   * Remove all documents.
   *
   * @param {Function} [callback]
   * @return {Promise}
   */
  remove(callback?: Function): Promise<any>;
  /**
   * Populates document references.
   *
   * @param {String|Object} expr
   * @return {Query}
   */
  populate(expr: string | any): Query<T>;
  size: () => number;
  each: (iterator: Function) => void;
  random: () => Query<T>;
}
import Promise = require('bluebird');
import Document = require('./document');
//# sourceMappingURL=query.d.ts.map
