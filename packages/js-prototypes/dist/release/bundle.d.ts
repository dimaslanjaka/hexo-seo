/// <reference types="node" />
declare type anyOf = Buffer & string & object & symbol & null & undefined & Record<string, any> & (() => any) & boolean & boolean[] & keyof [false];

//type anyOf = keyof any | boolean | [key];

/**
 * Arrays
 */
interface Array<T> {
  /**
   * Array unique
   * @example
   * var duplicate = [1,2,1,2,3,4,5,6];
   * var unique = duplicate.unique(); // [1,2,3,4,5,6]
   */
  unique: () => Array<T>;

  /**
   * Move item to another index
   * @see {@link https://stackoverflow.com/a/7180095/6404439}
   */
  move: (from: number, to: number) => void;

  /**
   * Unique array of objects by key
   * @see {@link https://stackoverflow.com/a/51537887}
   * @param key object key to check
   * @param removeNull remove null and undefined (default=true)
   */
  uniqueObjectKey: (key: string, removeNull?: boolean) => Array<T>;

  /**
   * Remove array item from other arrays
   */
  hapusItemDariArrayLain: (...arrayLain: any[]) => any[];

  /**
   * Pick random array element
   */
  random: <T>() => T;

  /**
   * Add Element
   * @param element
   * @example
   * var a = [1,2];
   * a.add(3);
   * console.log(a); // [1,2,3]
   *
   * var b = [0,9];
   * console.log(b.add(2)); // [0,9,2]
   */
  add(element: any): Array<T>;

  /**
   * Add other array
   * @param otherArray
   * @example
   * var a = [0,1];
   * var b = ['a','b'];
   * console.log(b.addAll(a)); //['a','b',0,1]
   * var c = ['z',10];
   * c.add(b);
   * console.log(c); // ['z',10,'a','b',0,1]
   */
  addAll(otherArray: Array<T>): Array<T>;

  /**
   * Get element in range from array
   * @param start start number index
   * @param end end number index
   * @example
   * const arr = [1, 2, 3, 4, 5];
   * console.log(arr.range(1, 3));
   */
  range(start: number, end: number): Array<T>;

  /**
   * Returns true  if self contains no elements.
   */
  isEmpty(): boolean;

  /**
   * Returns the first element, or the first n elements, of the array.
   * If the array is empty, requesting one element returns undefined ,
   * and requesting multiple elements returns an empty array.
   * @example
   *   var a = [ "q", "r", "s", "t" ]
   *   a.first()   // => "q"
   *   a.first(2)  // => ["q", "r"]
   */
  first(n: number): Array<T>;

  /**
   * Returns the last element(s) of self.
   * If the array is empty, returns undefined  if only one element requested.
   * @example
   *   var a = [ "w", "x", "y", "z" ]
   *   a.last()     // => "z"
   *   a.last(2)    // => ["y", "z"]
   */
  last(n: number): Array<T>;

  /**
   * Unset element value from array
   * @param n value element
   * @example
   * var arr = ['a','b','c'];
   * arr.unset('c');
   * console.log(arr); // ['a','b']
   */
  unset(n: any): Array<T>;

  /**
   * Deletes the element at the specified index, returning that element, or undefined  if the index is out of range.
   * A negative index is counted from the end of the array, where -1 corresponds to the last element. Returns self
   * for chaining purposes.
   * @example
   *   var a = ["ant", "bat", "cat", "dog"]
   *   a.deleteAt(2)    // => "cat"
   *   a                // => ["ant", "bat", "dog"]
   *   a.deleteAt(99)   // => undefined (because index 99 not found)
   *   if(a.deleteAt(1)) console.log('item with index 1 removed') // conditional
   */
  deleteAt(n: number): Array<T>;

  /**
   * Removes null  and undefined  elements from the array, turning it into a dense array.
   * Returns self for chaining purposes
   */
  compact(): Array<T>;

  /**
   * Check element index exists
   * @example
   * ['a','b'].exists(1); //true
   * ['a','b'].exists(4); //false
   */
  exists(n: number): boolean;

  /**
   * Check array contains string/any
   * @param obj
   * @example
   * alert([1, 2, 3].contains(2)); // => true
   * alert([1, 2, 3].contains('2')); // => false
   */
  contains(obj: any): boolean;

  /**
   * Check if array offset (index) exists
   * @param n
   * @example
   * alert([{},'a','x'].hasIndex(2)); // => true - array has offset 2 is 'x'
   * alert([{},'a','x'].hasIndex(3)); // => false
   */
  hasIndex(n: number): boolean;

  /**
   * Shuffle arrays.
   * @description Randomize array elements
   * @example
   * alert([1,2,3,4,5].shuffle())
   */
  shuffle(): Array<T>;

  /**
   * Remove null, empty string, or undefined values
   */
  removeEmpties(): Array<T>;

  /**
   * trim array of strings
   */
  trim(): Array<string>;
}

declare function array_filter(array: []): never[];
/**
 * pick random from array
 * @param {Array<any>} arrays
 * @param {boolean} unique Unique the arrays
 */
declare function array_rand(arrays: any[], unique: any): {
    index: number;
    value: any;
};
/**
 * Array unique
 * @param {Array<any>} arrays
 */
declare function array_unique(arrays: any[]): any[];
/**
 * Unset array
 * @param {Array<any>} arrayName
 * @param {String|number} key
 */
declare function array_unset(arrayName: {
    [x: string]: any;
}, key: any): any[];
/**
 * PHP shuffle array equivalent
 * @param array
 * @example
 * var arr = [2, 11, 37, 42];
 * shuffle(arr);
 * console.log(arr); //return random
 */
declare function shuffle(array: Array<any>): any[];
declare function arrayCompare(a1: Array<any>, a2: Array<any>): boolean;
/**
 * in_array PHP equivalent
 * @param needle string etc
 * @param haystack
 */
declare function inArray(needle: any, haystack: Array<any>): boolean;
/**
 * in_array PHP equivalent
 * @param needle string etc
 * @param haystack
 */
declare function in_array(needle: any, haystack: Array<any>): boolean;
/**
 * get all keys
 * @param haystack string etc
 */
declare function array_keys(haystack: any): string[];
/**
 * Shuffles array in place.
 * @param a items An array containing the items.
 */
declare function array_shuffle(a: Array<any>): any[];
/**
 * Deep merge two or more objects into the first.
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param objects  The objects to merge together
 * @returns Merged values of defaults and options
 */
declare function deepAssign(...objects: Record<any, unknown>[]): Record<any, unknown>;
/**
 * Remove item from array
 * @param arr
 * @param value
 * @returns
 */
declare function removeItem<T>(arr: Array<T>, value: T): Array<T>;

interface Date {
    addHours: (h: number) => Date;
    addHours2: (h: number) => Date;

    toGMTString(): string;

    /**
     * Check if Date is `n` hour ago
     * @param source number of hours
     */
    isHourAgo(source: number): boolean;
}
declare function datetime_local(date: any): string;



declare interface Number {
    getMS(type: string): number;
    /**
     * Get X Hour from date
     * @return number ms from Date().getTime()
     * @example
     * get `1 hour from current Date()`
     * 1.addHour()
     * get `1 hour from spesific Date()`
     * 1.addHour(new Date('2020-06-04 01:10:53'))
     */
    addHour(source: Date | null): number;
    /**
     * add zero leading
     * @param add
     * @param target
     */
    AddZero(add: number, target: string): number;
}
/**
 * Odd or Even (Ganjil Genap);
 * @param n
 * @param type odd or even
 */
declare function oddoreven(n: string, type: string): boolean;
/**
 * strpad / startwith zero [0]
 * @param {number} val
 */
declare function strpad(val: number): string | number;
/**
 * is variable number?
 * @param n
 * @returns
 */
declare function isInt(n: any): boolean;
/**
 * is variable float?
 * @param n
 * @returns
 */
declare function isFloat(n: any): boolean;

interface Object {
  length: number;
  void;

  [str: string]: any;

  /**
   * Iterate Object
   * @param callback function each element
   * @example
   * var a = {'a','n'};
   * a.each(function(el){
   *  console.log(el); //a, n each iteration
   * })
   */
  each(callback: (arg0: any) => any): any;

  /**
   * Check is empty
   */
  isEmpty(): boolean;

  replaceKeyFrom(anotherObj): any;
}

interface ObjectConstructor {
  /**
   * Count size length of object
   */
  size: (obj: any) => number;

  //[pair: string|number]: any;

  /**
   * Is Object Has Property of key ?
   * @param key
   */
  hasOwnProperty(key: any): boolean;

  /**
   * check if has child and go for callback
   * @param str  match child property
   * @param callback function callback
   * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
   */
  child(str: string | number, callback: (arg: any) => any): any;

  /**
   * check object has child, if not exist return alternative value
   * @param str match child property
   * @param alternative default value callback
   * @author Dimas Lanjaka <dimaslanjaka@gmail.com>
   */
  alt(str: any, alternative: string | number | boolean): any;

  /**
   * Check object has child
   * @param str
   */
  has(str: string | number): any;
}

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

/**
 * Strings
 */
interface String {
  /**
   * Truncate string
   * @param n sequence number to cut the next sentence
   * @param useWordBoundary true ? subString.substr(0, subString.lastIndexOf(" "))
   * @see https://stackoverflow.com/questions/1199352/smart-way-to-truncate-long-strings
   */
  truncate: (n: number, useWordBoundary: boolean | null) => string;

  /**
   * Printf
   * @see {@link https://stackoverflow.com/a/46078375}
   * @example
   * console.log("Hello I am " + "%s %s".printf(["foo", "bar"]));
   */
  printf: (obj: any[] | string) => string;

  /**
   * Matches a string an object that supports being matched against, and returns an array containing the results of
   * that search.
   * @param matcher An object that supports being matched against.
   */
  match(matcher: {
    [Symbol.match](string: string): RegExpMatchArray | null;
  }): RegExpMatchArray | null;

  /**
   * Replaces text in a string, using an object that supports replacement within a string.
   * @param searchValue A object can search for and replace matches within a string.
   * @param replaceValue A string containing the text to replace for every successful match of searchValue in this
   *     string.
   */
  replace(
    searchValue: {
      [Symbol.replace](string: string, replaceValue: string): string;
    },
    replaceValue: string
  ): string;

  /**
   * Replaces text in a string, using an object that supports replacement within a string.
   * @param searchValue A object can search for and replace matches within a string.
   * @param replacer A function that returns the replacement text.
   */
  replace(
    searchValue: {
      [Symbol.replace](
        string: string,
        replacer: (substring: string, ...args: any[]) => string
      ): string;
    },
    replacer: (substring: string, ...args: any[]) => string
  ): string;

  /**
   * Finds the first substring match in a regular expression search.
   * @param searcher An object which supports searching within a string.
   */
  search(searcher: { [Symbol.search](string: string): number }): number;

  /**
   * Split a string into substrings using the specified separator and return them as an array.
   * @param splitter An object that can split a string.
   * @param limit A value used to limit the number of elements returned in the array.
   */
  split(
    splitter: { [Symbol.split](string: string, limit?: number): string[] },
    limit?: number
  ): string[];

  /**
   * Parse url into part object
   */
  parse_url(): {
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    searchObject: Record<any, any>;
    hash: string;
    protohost: string;
  };

  /**
   * Call css from url/path
   */
  CSS(): void;

  /**
   * Hex encrypt
   */
  hexE(): string;

  /**
   * Hex Decrypt
   */
  hexD(): string;

  /**
   * Capitalize all first character string
   * @example [PHP] ucwords($string)
   */
  capitalize(): string;

  /**
   * PHP str_rot13 equivalent
   */
  rot13(): string;

  /**
   * Check if string empty or blank
   */
  isEmpty(): boolean;

  /**
   * Replace string by array pattern
   * @param array
   * @param replacement
   */
  replaceArr(array: string[], replacement: string): string;

  /**
   * Convert a string to HTML entities
   * @see {@link https://stackoverflow.com/a/27020300}
   * @example
   * "Test´†®¥¨©˙∫ø…ˆƒ∆÷∑™ƒ∆æøπ£¨ ƒ™en tést".toHtmlEntities();
   * console.log("Entities:", str);
   */
  toHtmlEntities(): string;

  /**
   * Check if string contains some text from array of substrings
   * @see {@link https://stackoverflow.com/a/5582621}
   * @param arrayStr
   */
  includesArray(arrayStr: string[]): boolean;
}

interface StringConstructor {
  /**
   * Create string from HTML entities
   * @see {@link https://stackoverflow.com/a/27020300}
   * @example
   * var str = "Test´†®¥¨©˙∫ø…ˆƒ∆÷∑™ƒ∆æøπ£¨ ƒ™en tést".toHtmlEntities();
   * console.log("String:", String.fromHtmlEntities(str));
   */
  fromHtmlEntities(str: string): string;
}

/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference types="jquery" />
/// <reference lib="dom" />

//declare const $: JQuery;

type jQuery = JQuery;

interface XMLHttpRequest extends XMLHttpRequestEventTarget {
  responseJSON: Array<any> | Record<string, unknown> | null;
}

interface EventTarget {
  matches(pattern: string): boolean;
}

/**
 * HTML element
 */
interface HTMLScriptElement extends HTMLElement {
  async: boolean;

  onreadystatechange(): void;
}

interface HTMLElement
  extends Element,
    DocumentAndElementEventHandlers,
    ElementCSSInlineStyle,
    ElementContentEditable,
    GlobalEventHandlers,
    HTMLOrSVGElement {
  mozMatchesSelector: (selectors: string) => boolean;
  msMatchesSelector: (selectors: string) => boolean;

  [attachEvent: string]: any;
}

/**
 * Create element options
 */
interface createElementOpt {
  childs: any[];
  /**
   * Tag name to be created
   */
  tagName: string;
  /**
   * Add classname
   */
  className: string;
  /**
   * Some attributes ?
   */
  attributes: { attributes: { [str: string]: any } };
  /**
   * InnerText ?
   */
  text: string;
  /**
   * InnerHTML ?
   */
  html: string;
  /**
   * Some options
   */
  options: { attributes: any[]; childs: [] };
}

/**
 * Create element helper
 * * if you use without tagName you will get a document fragment
 * @example
 * document.body.appendChild(createElement({
  tagName: "div",
  className: "my-class",
  text: "Blah blah",
  attributes: {
    "id": "element id",
    "data-truc": "value"
  },
  childs: [{ `recursif call` }]
}))
 */
declare function createElement(params: createElementOpt);

/**
 * String start
 */

/**
 * Window Start
 */
// Add IE-specific interfaces to Window
interface Window {
  HTMLElement: HTMLElement;
  //user: user;
  /**
   * Opera navigator
   */
  readonly opera: string;
  dataLayer: [];
  mozRTCPeerConnection: any;

  attachEvent(event: string, listener: EventListener): boolean;

  detachEvent(event: string, listener: EventListener): void;

  [func: string]: any;

  gtag(message?: any, ...optionalParams: any[]): void;
}

interface Document
  extends Node,
    DocumentAndElementEventHandlers,
    DocumentOrShadowRoot,
    GlobalEventHandlers,
    NonElementParentNode,
    ParentNode,
    XPathEvaluatorBase {
  /**
   * window.addEventListener
   *
   * Appends an event listener for events whose type attribute value is type. The callback argument sets the callback
   * that will be invoked when the event is dispatched.
   *
   * The options argument sets listener-specific options. For compatibility this can be a boolean, in which case the
   * method behaves exactly as if the value was specified as options's capture.
   */
  attachEvent: any;

  /**
   * @see {@link Document.addEventListener}
   */
  listen<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  listen(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
  removeListener<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

