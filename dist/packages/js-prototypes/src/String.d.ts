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
