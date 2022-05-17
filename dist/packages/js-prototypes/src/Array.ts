/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-prototype-builtins */
/// <reference path="./Array.d.ts" />

Array.prototype.shuffle = function () {
  let i = this.length,
    j: number,
    temp: any;
  if (i == 0) return this;
  while (--i) {
    j = Math.floor(Math.random() * (i + 1));
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
  return this;
};

Array.prototype.last = function (n) {
  if (!n) {
    if (this.length === 0) return undefined;

    return this[this.length - 1];
  } else {
    let start = this.length - n;
    if (start < 0) start = 0;

    return this.slice(start, this.length);
  }
};

Array.prototype.trim = function () {
  return this.map((str) => {
    if (typeof str == "string") return str.trim();
  });
};

Array.prototype.isEmpty = function () {
  return this.length === 0;
};

Array.prototype.range = function (start, end) {
  if (end < start) {
    return [];
  }
  return this.slice(start, end + 1);
};

Array.prototype.add = function (element) {
  this.push(element);
  return this;
};

Array.prototype.addAll = function (others: Array<any>) {
  const self = this;
  others.forEach(function (e: any) {
    self.push(e);
  });
  return self;
};

Array.prototype.random = function () {
  return this[Math.floor(Math.random() * this.length)];
};

Array.prototype.unique = function (this: Array<any>) {
  const a = this.concat();
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }

  return a;
};

Array.prototype.uniqueStringArray = function (this: Array<string>) {
  const filter = new Map(this.map((s) => [s.toLowerCase(), s]));
  return [...filter.values()];
};

Array.prototype.uniqueObjectKey = function (this: Array<Record<string, unknown>>, key, removeNull = true) {
  if (!key) return this;
  const resArr = [];
  this.filter(function (item) {
    const i = resArr.findIndex((x) => x[key] == item[key]);
    if (i <= -1) {
      if (removeNull) {
        if (item[key]) resArr.push(item);
      } else {
        resArr.push(item);
      }
    }
    return null;
  });
  return resArr;
};

Array.prototype.contains = function (obj) {
  let i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
};

Array.prototype.hasIndex = function (n: number) {
  return typeof this[n] != "undefined";
};

Array.prototype.first = function (n) {
  if (!n) {
    if (this.length === 0) return undefined;

    return this[0];
  } else {
    if (this.length === 0) return [];

    return this.slice(0, n);
  }
};

Array.prototype.compact = function () {
  //var changes = false;
  for (let i = 0; i < this.length; i++) {
    // If element is non-existent, undefined or null, remove it.
    if (!this[i]) {
      this.splice(i, 1);
      i = i - 1;
      //changes = true;
    }
  }
  //if (!changes) return undefined;

  return this;
};

Array.prototype.deleteAt = function <T>(this: T[], index): T {
  if (index < 0) index = this.length + index;

  // If element is non-existent, return undefined:
  if (!this.hasOwnProperty(index)) return undefined;

  const elem = this[index];
  this.splice(index, 1);
  return elem;
};

Array.prototype.unset = function (value) {
  if (this.indexOf(value) != -1) {
    // Make sure the value exists
    this.splice(this.indexOf(value), 1);
  }
  return this;
};

Array.prototype.exists = function (n: number) {
  return typeof this[n] !== "undefined";
};

if (!Array.prototype.hasOwnProperty("every")) {
  Array.prototype.every = function (fun: any /*, thisp */) {
    "use strict";
    const t: { [x: string]: any; length: number } = Object(this);
    const len = t.length >>> 0;
    let i: string | number;
    const thisp: any = arguments[1];

    if (this == null) {
      throw new TypeError();
    }

    if (typeof fun !== "function") {
      throw new TypeError();
    }

    for (i = 0; i < len; i++) {
      if (i in t && !fun.call(thisp, t[i], i, t)) {
        return false;
      }
    }

    return true;
  };
}

Array.prototype.move = function (from, to) {
  let itemRemoved = this.splice(from, 1); // splice() returns the remove element as an array
  this.splice(to, 0, itemRemoved[0]); // Insert itemRemoved into the target index
  return this;
};

Array.prototype.hapusItemDariArrayLain = function (this: any[], ...arrayLain) {
  let thisArr = this;
  arrayLain.forEach((otherArr) => {
    thisArr = thisArr.filter(function (el) {
      return !otherArr.includes(el);
    });
  });

  return thisArr;
};

Array.prototype.removeEmpties = function () {
  const filter = this.filter(function (el) {
    const notnull =
      // make sure element is not null
      el != null &&
      // make sure element is not undefined
      typeof el != "undefined";
    // if element is string, make sure string length not zero
    if (typeof el == "string") {
      return notnull && el.trim().length > 0;
    }
    return notnull;
  });
  return this;
};

function array_filter(array: []) {
  return array.filter(function (el) {
    return el != null;
  });
}

/**
 * pick random from array
 * @param {Array<any>} arrays
 * @param {boolean} unique Unique the arrays
 */
function array_rand(arrays: any[], unique: any) {
  if (unique) {
    arrays = array_unique(arrays);
  }
  const index = Math.floor(Math.random() * arrays.length);
  return {
    index: index,
    value: arrays[index]
  };
}

/**
 * Array unique
 * @param {Array<any>} arrays
 */
function array_unique(arrays: any[]) {
  return arrays.filter(function (item: any, pos: any, self: string | any[]) {
    return self.indexOf(item) == pos;
  });
}

/**
 * Unset array
 * @param {Array<any>} arrayName
 * @param {String|number} key
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function array_unset(arrayName: { [x: string]: any }, key: any) {
  let x: string | number;
  const tmpArray = [];
  for (x in arrayName) {
    if (x != key) {
      tmpArray[x] = arrayName[x];
    }
  }
  return tmpArray;
}

/**
 * PHP shuffle array equivalent
 * @param array
 * @example
 * var arr = [2, 11, 37, 42];
 * shuffle(arr);
 * console.log(arr); //return random
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function shuffle(array: Array<any>) {
  let currentIndex = array.length,
    temporaryValue: any,
    randomIndex: number;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function arrayCompare(a1: Array<any>, a2: Array<any>) {
  if (a1.length != a2.length) return false;
  const length = a2.length;
  for (let i = 0; i < length; i++) {
    if (a1[i] !== a2[i]) return false;
  }
  return true;
}

/**
 * in_array PHP equivalent
 * @param needle string etc
 * @param haystack
 */
function inArray(needle: any, haystack: Array<any>) {
  const length = haystack.length;
  for (let i = 0; i < length; i++) {
    if (typeof haystack[i] == "object") {
      if (arrayCompare(haystack[i], needle)) return true;
    } else {
      if (haystack[i] == needle) return true;
    }
  }
  return false;
}

/**
 * in_array PHP equivalent
 * @param needle string etc
 * @param haystack
 */
function in_array(needle: any, haystack: Array<any>) {
  return inArray(needle, haystack);
}

/**
 * get all keys
 * @param haystack string etc
 */
function array_keys(haystack: any) {
  return Object.keys(haystack);
}

/**
 * Shuffles array in place.
 * @param a items An array containing the items.
 */
function array_shuffle(a: Array<any>) {
  let j: number, x: any, i: number;
  for (i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
}

/**
 * Deep merge two or more objects into the first.
 * (c) 2021 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param objects  The objects to merge together
 * @returns Merged values of defaults and options
 */
function deepAssign(...objects: Record<any, unknown>[]): Record<any, unknown> {
  // Make sure there are objects to merge
  const len = objects.length;
  if (len < 1) return;
  if (len < 2) return objects[0];

  // Merge all objects into first
  for (let i = 1; i < len; i++) {
    for (const key in objects[i]) {
      if (objects[i].hasOwnProperty(key)) {
        // If it's an object, recursively merge
        // Otherwise, push to key
        if (Object.prototype.toString.call(objects[i][key]) === "[object Object]") {
          objects[0][key] = deepAssign(<any>objects[0][key] || {}, <any>objects[i][key]);
        } else {
          objects[0][key] = objects[i][key];
        }
      }
    }
  }

  return arguments[0];
}

/**
 * Remove item from array
 * @param arr
 * @param value
 * @returns
 */
function removeItem<T>(arr: Array<T>, value: T): Array<T> {
  const index = arr.indexOf(value);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    array_shuffle,
    array_keys,
    in_array,
    deepAssign,
    removeItem
  };
}
