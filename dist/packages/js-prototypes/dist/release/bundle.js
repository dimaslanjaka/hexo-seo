"use strict";
/* eslint-disable @typescript-eslint/no-this-alias */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable prefer-rest-params */
/* eslint-disable no-prototype-builtins */
/// <reference path="./Array.d.ts" />
Array.prototype.shuffle = function () {
    var i = this.length, j, temp;
    if (i == 0)
        return this;
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
        if (this.length === 0)
            return undefined;
        return this[this.length - 1];
    }
    else {
        var start = this.length - n;
        if (start < 0)
            start = 0;
        return this.slice(start, this.length);
    }
};
Array.prototype.trim = function () {
    return this.map(function (str) {
        if (typeof str == "string")
            return str.trim();
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
Array.prototype.addAll = function (others) {
    var self = this;
    others.forEach(function (e) {
        self.push(e);
    });
    return self;
};
Array.prototype.random = function () {
    return this[Math.floor(Math.random() * this.length)];
};
Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    return a;
};
Array.prototype.uniqueObjectKey = function (key, removeNull) {
    if (removeNull === void 0) {
        removeNull = true;
    }
    if (!key)
        return this;
    var resArr = [];
    this.filter(function (item) {
        var i = resArr.findIndex(function (x) { return x[key] == item[key]; });
        if (i <= -1) {
            if (removeNull) {
                if (item[key])
                    resArr.push(item);
            }
            else {
                resArr.push(item);
            }
        }
        return null;
    });
    return resArr;
};
Array.prototype.contains = function (obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
};
Array.prototype.hasIndex = function (n) {
    return typeof this[n] != "undefined";
};
Array.prototype.first = function (n) {
    if (!n) {
        if (this.length === 0)
            return undefined;
        return this[0];
    }
    else {
        if (this.length === 0)
            return [];
        return this.slice(0, n);
    }
};
Array.prototype.compact = function () {
    //var changes = false;
    for (var i = 0; i < this.length; i++) {
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
Array.prototype.deleteAt = function (index) {
    if (index < 0)
        index = this.length + index;
    // If element is non-existent, return undefined:
    if (!this.hasOwnProperty(index))
        return undefined;
    var elem = this[index];
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
Array.prototype.exists = function (n) {
    return typeof this[n] !== "undefined";
};
if (!Array.prototype.hasOwnProperty("every")) {
    Array.prototype.every = function (fun /*, thisp */) {
        "use strict";
        var t = Object(this);
        var len = t.length >>> 0;
        var i;
        var thisp = arguments[1];
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
Array.prototype.hapusItemDariArrayLain = function () {
    var arrayLain = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        arrayLain[_i] = arguments[_i];
    }
    var thisArr = this;
    arrayLain.forEach(function (otherArr) {
        thisArr = thisArr.filter(function (el) {
            return !otherArr.includes(el);
        });
    });
    return thisArr;
};
Array.prototype.removeEmpties = function () {
    var filter = this.filter(function (el) {
        var notnull = 
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
function array_filter(array) {
    return array.filter(function (el) {
        return el != null;
    });
}
/**
 * pick random from array
 * @param {Array<any>} arrays
 * @param {boolean} unique Unique the arrays
 */
function array_rand(arrays, unique) {
    if (unique) {
        arrays = array_unique(arrays);
    }
    var index = Math.floor(Math.random() * arrays.length);
    return {
        index: index,
        value: arrays[index]
    };
}
/**
 * Array unique
 * @param {Array<any>} arrays
 */
function array_unique(arrays) {
    return arrays.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
    });
}
/**
 * Unset array
 * @param {Array<any>} arrayName
 * @param {String|number} key
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function array_unset(arrayName, key) {
    var x;
    var tmpArray = [];
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
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
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
function arrayCompare(a1, a2) {
    if (a1.length != a2.length)
        return false;
    var length = a2.length;
    for (var i = 0; i < length; i++) {
        if (a1[i] !== a2[i])
            return false;
    }
    return true;
}
/**
 * in_array PHP equivalent
 * @param needle string etc
 * @param haystack
 */
function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (typeof haystack[i] == "object") {
            if (arrayCompare(haystack[i], needle))
                return true;
        }
        else {
            if (haystack[i] == needle)
                return true;
        }
    }
    return false;
}
/**
 * in_array PHP equivalent
 * @param needle string etc
 * @param haystack
 */
function in_array(needle, haystack) {
    return inArray(needle, haystack);
}
/**
 * get all keys
 * @param haystack string etc
 */
function array_keys(haystack) {
    return Object.keys(haystack);
}
/**
 * Shuffles array in place.
 * @param a items An array containing the items.
 */
function array_shuffle(a) {
    var j, x, i;
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
function deepAssign() {
    var objects = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        objects[_i] = arguments[_i];
    }
    // Make sure there are objects to merge
    var len = objects.length;
    if (len < 1)
        return;
    if (len < 2)
        return objects[0];
    // Merge all objects into first
    for (var i = 1; i < len; i++) {
        for (var key in objects[i]) {
            if (objects[i].hasOwnProperty(key)) {
                // If it's an object, recursively merge
                // Otherwise, push to key
                if (Object.prototype.toString.call(objects[i][key]) === "[object Object]") {
                    objects[0][key] = deepAssign(objects[0][key] || {}, objects[i][key]);
                }
                else {
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
function removeItem(arr, value) {
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        array_shuffle: array_shuffle,
        array_keys: array_keys,
        in_array: in_array,
        deepAssign: deepAssign,
        removeItem: removeItem
    };
}
/// <reference path="Date.d.ts" />
Date.prototype.isHourAgo = function (hour) {
    var hour = hour * 60 * 1000; /* ms */
    var hourago = Date.now() - hour;
    return hour > hourago;
};
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}
Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + h * 60 * 60 * 1000);
    //this.setHours(this.getHours()+h);
    return this;
};
Date.prototype.addHours2 = function (hrs) {
    this.setHours(this.getHours() + hrs);
    return this;
};
function datetime_local(date) {
    return new Date(date).toJSON().slice(0, 19);
}
if (typeof document != "undefined") {
    Document.prototype.listen = function (eventType, listener, options) {
        if (options === void 0) {
            options = {};
        }
        if (this.addEventListener) {
            this.addEventListener(eventType, listener, options);
        }
        else if (this.attachEvent) {
            this.attachEvent("on" + eventType, listener, options);
        }
    };
}
Number.prototype.getMS = function (type) {
    var self = this;
    return this * 60 * 1000;
};
Number.prototype.addHour = function (source) {
    var self = this;
    var Hour = this * 60 * 1000; /* ms */
    if (!source)
        source = new Date();
    return new Date(source.getTime() + Hour).getTime();
};
Number.prototype.AddZero = function (b, c) {
    var l = String(b || 10).length - String(this).length + 1;
    return l > 0 ? new Array(l).join(c || "0") + this : this;
};
/**
 * Odd or Even (Ganjil Genap);
 * @param n
 * @param type odd or even
 */
function oddoreven(n, type) {
    if (!type) {
        type = "odd";
    }
    var time = !n ? new Date().getDay() : Number(n);
    if (!/^-?\d+jQuery/.test(time.toString())) {
        alert("arguments is not number, please remove quote");
        return null;
    }
    var hasil = time % 2;
    var rType = /^(odd|ganjil)$/.test(type) ? "1" : "0";
    //return hasil == (type == ('odd' || 'ganjil') ? 1 : 0);
    return hasil.toString() == rType.toString();
}
/**
 * strpad / startwith zero [0]
 * @param {number} val
 */
function strpad(val) {
    if (val >= 10) {
        return val;
    }
    else {
        return "0" + val;
    }
}
/**
 * is variable number?
 * @param n
 * @returns
 */
function isInt(n) {
    return Number(n) === n && n % 1 === 0;
}
/**
 * is variable float?
 * @param n
 * @returns
 */
function isFloat(n) {
    return Number(n) === n && n % 1 !== 0;
}
if (typeof module.exports != 'undefined') {
    global.isInt = isInt;
    global.isFloat = isFloat;
}
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="Object.d.ts" />
Object.size = function (obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
};
Object.child = function (str, callback) {
    var self = this;
    if (self.hasOwnProperty(str)) {
        if (typeof callback == "function") {
            return callback(self[str]);
        }
        else {
            return true;
        }
    }
    else {
        return undefined;
    }
};
Object.alt = function (str, alternative) {
    var self = this;
    if (self.hasOwnProperty(str)) {
        return self[str];
    }
    else {
        return alternative;
    }
};
Object.has = function (str) {
    return this.hasOwnProperty(str);
};
Object.each = function (callback) {
    for (var key in this) {
        //callback.call(scope, key, this[key]);
        callback.call(this[key]);
    }
};
Object.isEmpty = function () {
    return this.length === 0;
};
Object.replaceKeyFrom = function (anotherObj) {
    return Object.entries(this).reduce(function (op, _a) {
        var key = _a[0], value = _a[1];
        var newKey = anotherObj[key];
        op[newKey || key] = value;
        return op;
    }, {});
    /*if (typeof anotherObj == 'object') {
      for (const key in anotherObj) {
        if (Object.prototype.hasOwnProperty.call(anotherObj, key)) {
          const element = anotherObj[key];
          def[key] = element;
        }
      }
    }*/
};
/**
 * Join object to separated string
 * @param obj Object
 * @returns Joined string
 */
function object_join(obj) {
    return Object.keys(obj)
        .map(function (k) {
        return obj[k];
    })
        .join(",");
}
/**
 * Extend Object
 * @param arg1
 * @param arg2
 * @returns
 */
function extend_object(arg1, arg2) {
    var result = {};
    for (var prop in arg1) {
        if (arg1.hasOwnProperty(prop)) {
            // error when using --strictNullChecks
            result[prop] = arg1[prop];
        }
    }
    for (var prop in arg2) {
        if (arg2.hasOwnProperty(prop)) {
            // error when using --strictNullChecks
            result[prop] = arg2[prop];
        }
    }
    return result;
}
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="String.d.ts" />
/// <reference path="globals.d.ts" />
String.prototype.printf = function (obj) {
    /*const isNode = new Function(
      "try {return this===global;}catch(e){return false;}"
    );
  
    if (isNode()) {
      const util = require("util");
      return util.format(this, obj);
    }*/
    var useArguments = false;
    var _arguments = arguments;
    var i = -1;
    if (typeof _arguments[0] == "string") {
        useArguments = true;
    }
    if (obj instanceof Array || useArguments) {
        return this.replace(/%s/g, function (a, b) {
            i++;
            if (useArguments) {
                if (typeof _arguments[i] == "string") {
                    return _arguments[i];
                }
                else {
                    throw new Error("Arguments element is an invalid type");
                }
            }
            return obj[i];
        });
    }
    else {
        return this.replace(/{([^{}]*)}/g, function (a, b) {
            var r = obj[b];
            return typeof r === "string" || typeof r === "number" ? r : a;
        });
    }
};
String.prototype.parse_url = function () {
    var parser = document.createElement("a");
    var searchObject;
    var split;
    var i;
    var queries = [];
    // Let the browser do the work
    parser.href = this.toString();
    // Convert query string to object
    queries = parser.search.replace(/^\?/, "").split("&");
    for (i = 0; i < queries.length; i++) {
        split = queries[i].split("=");
        searchObject[split[0]] = split[1];
    }
    return {
        protocol: parser.protocol,
        host: parser.host,
        hostname: parser.hostname,
        port: parser.port,
        pathname: parser.pathname,
        search: parser.search,
        searchObject: searchObject,
        hash: parser.hash,
        protohost: parser.protocol + "//" + parser.host,
    };
};
/**
 * Load css
 */
String.prototype.CSS = function () {
    var e = document.createElement("link");
    e.rel = "stylesheet";
    e.href = this.toString();
    var n = document.getElementsByTagName("head")[0];
    window.addEventListener
        ? window.addEventListener("load", function () {
            n.parentNode.insertBefore(e, n);
        }, !1)
        : window.attachEvent
            ? window.attachEvent("onload", function () {
                n.parentNode.insertBefore(e, n);
            })
            : (window.onload = function () {
                n.parentNode.insertBefore(e, n);
            });
};
String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/gm, "");
};
String.prototype.hexE = function () {
    var hex, i;
    var result = "";
    for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000" + hex).slice(-4);
    }
    return result;
};
String.prototype.hexD = function () {
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for (j = 0; j < hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }
    return back;
};
String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.rot13 = function () {
    return this.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
};
String.prototype.truncate = function (n, useWordBoundary) {
    if (this.length <= n) {
        return this;
    }
    var subString = this.substr(0, n - 1); // the original check
    return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(" ")) : subString) + "&hellip;";
};
String.prototype.isEmpty = function () {
    if (this != null || typeof this != "undefined") {
        return this.length === 0 || !this.trim();
    }
    return false;
};
String.prototype.replaceArr = function (array, replacement) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    var ori = this;
    array.map(function (str) {
        ori = ori.replace(str, replacement);
    });
    return ori;
};
String.prototype.toHtmlEntities = function () {
    return this.replace(/./gm, function (s) {
        // return "&#" + s.charCodeAt(0) + ";";
        return s.match(/[a-z0-9\s]+/i) ? s : "&#" + s.charCodeAt(0) + ";";
    });
};
String.fromHtmlEntities = function (str) {
    return (str + "").replace(/&#\d+;/gm, function (s) {
        var m = s.match(/\d+/gm)[0];
        return String.fromCharCode(m);
    });
};
String.prototype.includesArray = function (substrings) {
    var _this = this;
    return substrings.some(function (v) { return _this.includes(v); });
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9qcy1wcm90b3R5cGVzL2Rpc3QvcmVsZWFzZS9idW5kbGUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLHFEQUFxRDtBQUNyRCw4REFBOEQ7QUFDOUQsdUNBQXVDO0FBQ3ZDLDBDQUEwQztBQUMxQyxxQ0FBcUM7QUFDckMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUc7SUFDdEIsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDO0lBQzdCLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDTixPQUFPLElBQUksQ0FBQztJQUNoQixPQUFPLEVBQUUsQ0FBQyxFQUFFO1FBQ1IsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsSUFBSSxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNmLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztLQUNsQjtJQUNELE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUNGLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLFVBQVUsQ0FBQztJQUM5QixJQUFJLENBQUMsQ0FBQyxFQUFFO1FBQ0osSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDakIsT0FBTyxTQUFTLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztLQUNoQztTQUNJO1FBQ0QsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFDNUIsSUFBSSxLQUFLLEdBQUcsQ0FBQztZQUNULEtBQUssR0FBRyxDQUFDLENBQUM7UUFDZCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUN6QztBQUNMLENBQUMsQ0FBQztBQUNGLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHO0lBQ25CLE9BQU8sSUFBSSxDQUFDLEdBQUcsQ0FBQyxVQUFVLEdBQUc7UUFDekIsSUFBSSxPQUFPLEdBQUcsSUFBSSxRQUFRO1lBQ3RCLE9BQU8sR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFCLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDO0FBQ0YsS0FBSyxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUc7SUFDdEIsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztBQUM3QixDQUFDLENBQUM7QUFDRixLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxVQUFVLEtBQUssRUFBRSxHQUFHO0lBQ3hDLElBQUksR0FBRyxHQUFHLEtBQUssRUFBRTtRQUNiLE9BQU8sRUFBRSxDQUFDO0tBQ2I7SUFDRCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUN0QyxDQUFDLENBQUM7QUFDRixLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxVQUFVLE9BQU87SUFDbkMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUNuQixPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUM7QUFDRixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLE1BQU07SUFDckMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO1FBQ3RCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakIsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLElBQUksQ0FBQztBQUNoQixDQUFDLENBQUM7QUFDRixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRztJQUNyQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQztBQUN6RCxDQUFDLENBQUM7QUFDRixLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRztJQUNyQixJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDdEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7UUFDL0IsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxFQUFFO1lBQ25DLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztTQUN4QjtLQUNKO0lBQ0QsT0FBTyxDQUFDLENBQUM7QUFDYixDQUFDLENBQUM7QUFDRixLQUFLLENBQUMsU0FBUyxDQUFDLGVBQWUsR0FBRyxVQUFVLEdBQUcsRUFBRSxVQUFVO0lBQ3ZELElBQUksVUFBVSxLQUFLLEtBQUssQ0FBQyxFQUFFO1FBQUUsVUFBVSxHQUFHLElBQUksQ0FBQztLQUFFO0lBQ2pELElBQUksQ0FBQyxHQUFHO1FBQ0osT0FBTyxJQUFJLENBQUM7SUFDaEIsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJO1FBQ3RCLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDLElBQUksT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7WUFDVCxJQUFJLFVBQVUsRUFBRTtnQkFDWixJQUFJLElBQUksQ0FBQyxHQUFHLENBQUM7b0JBQ1QsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUN6QjtpQkFDSTtnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ3JCO1NBQ0o7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sTUFBTSxDQUFDO0FBQ2xCLENBQUMsQ0FBQztBQUNGLEtBQUssQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsR0FBRztJQUNwQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3BCLE9BQU8sQ0FBQyxFQUFFLEVBQUU7UUFDUixJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxHQUFHLEVBQUU7WUFDakIsT0FBTyxJQUFJLENBQUM7U0FDZjtLQUNKO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQyxDQUFDO0FBQ0YsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO0lBQ2xDLE9BQU8sT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksV0FBVyxDQUFDO0FBQ3pDLENBQUMsQ0FBQztBQUNGLEtBQUssQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztJQUMvQixJQUFJLENBQUMsQ0FBQyxFQUFFO1FBQ0osSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUM7WUFDakIsT0FBTyxTQUFTLENBQUM7UUFDckIsT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7U0FDSTtRQUNELElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDO1lBQ2pCLE9BQU8sRUFBRSxDQUFDO1FBQ2QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztLQUMzQjtBQUNMLENBQUMsQ0FBQztBQUNGLEtBQUssQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHO0lBQ3RCLHNCQUFzQjtJQUN0QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNsQyw0REFBNEQ7UUFDNUQsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNWLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2xCLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ1YsaUJBQWlCO1NBQ3BCO0tBQ0o7SUFDRCxpQ0FBaUM7SUFDakMsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBQ0YsS0FBSyxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxLQUFLO0lBQ3RDLElBQUksS0FBSyxHQUFHLENBQUM7UUFDVCxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7SUFDaEMsZ0RBQWdEO0lBQ2hELElBQUksQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQztRQUMzQixPQUFPLFNBQVMsQ0FBQztJQUNyQixJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdkIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDdEIsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBQ0YsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsVUFBVSxLQUFLO0lBQ25DLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRTtRQUMzQiw2QkFBNkI7UUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3ZDO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBQ0YsS0FBSyxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxDQUFDO0lBQ2hDLE9BQU8sT0FBTyxJQUFJLENBQUMsQ0FBQyxDQUFDLEtBQUssV0FBVyxDQUFDO0FBQzFDLENBQUMsQ0FBQztBQUNGLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsRUFBRTtJQUMxQyxLQUFLLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxVQUFVLEdBQUcsQ0FBQyxZQUFZO1FBQzlDLFlBQVksQ0FBQztRQUNiLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQixJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztRQUN6QixJQUFJLENBQUMsQ0FBQztRQUNOLElBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7WUFDZCxNQUFNLElBQUksU0FBUyxFQUFFLENBQUM7U0FDekI7UUFDRCxJQUFJLE9BQU8sR0FBRyxLQUFLLFVBQVUsRUFBRTtZQUMzQixNQUFNLElBQUksU0FBUyxFQUFFLENBQUM7U0FDekI7UUFDRCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN0QixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFO2dCQUN4QyxPQUFPLEtBQUssQ0FBQzthQUNoQjtTQUNKO1FBQ0QsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQyxDQUFDO0NBQ0w7QUFDRCxLQUFLLENBQUMsU0FBUyxDQUFDLHNCQUFzQixHQUFHO0lBQ3JDLElBQUksU0FBUyxHQUFHLEVBQUUsQ0FBQztJQUNuQixLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUMxQyxTQUFTLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQ2pDO0lBQ0QsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQ25CLFNBQVMsQ0FBQyxPQUFPLENBQUMsVUFBVSxRQUFRO1FBQ2hDLE9BQU8sR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtZQUNqQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxPQUFPLENBQUM7QUFDbkIsQ0FBQyxDQUFDO0FBQ0YsS0FBSyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUc7SUFDNUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUU7UUFDakMsSUFBSSxPQUFPO1FBQ1gsZ0NBQWdDO1FBQ2hDLEVBQUUsSUFBSSxJQUFJO1lBQ04scUNBQXFDO1lBQ3JDLE9BQU8sRUFBRSxJQUFJLFdBQVcsQ0FBQztRQUM3Qix5REFBeUQ7UUFDekQsSUFBSSxPQUFPLEVBQUUsSUFBSSxRQUFRLEVBQUU7WUFDdkIsT0FBTyxPQUFPLElBQUksRUFBRSxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7U0FDMUM7UUFDRCxPQUFPLE9BQU8sQ0FBQztJQUNuQixDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUNGLFNBQVMsWUFBWSxDQUFDLEtBQUs7SUFDdkIsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRTtRQUM1QixPQUFPLEVBQUUsSUFBSSxJQUFJLENBQUM7SUFDdEIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7Ozs7R0FJRztBQUNILFNBQVMsVUFBVSxDQUFDLE1BQU0sRUFBRSxNQUFNO0lBQzlCLElBQUksTUFBTSxFQUFFO1FBQ1IsTUFBTSxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNqQztJQUNELElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUN0RCxPQUFPO1FBQ0gsS0FBSyxFQUFFLEtBQUs7UUFDWixLQUFLLEVBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQztLQUN2QixDQUFDO0FBQ04sQ0FBQztBQUNEOzs7R0FHRztBQUNILFNBQVMsWUFBWSxDQUFDLE1BQU07SUFDeEIsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJO1FBQzFDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUM7SUFDckMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7Ozs7R0FJRztBQUNILDZEQUE2RDtBQUM3RCxTQUFTLFdBQVcsQ0FBQyxTQUFTLEVBQUUsR0FBRztJQUMvQixJQUFJLENBQUMsQ0FBQztJQUNOLElBQUksUUFBUSxHQUFHLEVBQUUsQ0FBQztJQUNsQixLQUFLLENBQUMsSUFBSSxTQUFTLEVBQUU7UUFDakIsSUFBSSxDQUFDLElBQUksR0FBRyxFQUFFO1lBQ1YsUUFBUSxDQUFDLENBQUMsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUM5QjtLQUNKO0lBQ0QsT0FBTyxRQUFRLENBQUM7QUFDcEIsQ0FBQztBQUNEOzs7Ozs7O0dBT0c7QUFDSCw2REFBNkQ7QUFDN0QsU0FBUyxPQUFPLENBQUMsS0FBSztJQUNsQixJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLGNBQWMsRUFBRSxXQUFXLENBQUM7SUFDN0QsNENBQTRDO0lBQzVDLE9BQU8sQ0FBQyxLQUFLLFlBQVksRUFBRTtRQUN2Qiw4QkFBOEI7UUFDOUIsV0FBVyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLFlBQVksQ0FBQyxDQUFDO1FBQ3ZELFlBQVksSUFBSSxDQUFDLENBQUM7UUFDbEIsd0NBQXdDO1FBQ3hDLGNBQWMsR0FBRyxLQUFLLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDckMsS0FBSyxDQUFDLFlBQVksQ0FBQyxHQUFHLEtBQUssQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN6QyxLQUFLLENBQUMsV0FBVyxDQUFDLEdBQUcsY0FBYyxDQUFDO0tBQ3ZDO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQztBQUNELFNBQVMsWUFBWSxDQUFDLEVBQUUsRUFBRSxFQUFFO0lBQ3hCLElBQUksRUFBRSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsTUFBTTtRQUN0QixPQUFPLEtBQUssQ0FBQztJQUNqQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUMsTUFBTSxDQUFDO0lBQ3ZCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDN0IsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNmLE9BQU8sS0FBSyxDQUFDO0tBQ3BCO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQztBQUNEOzs7O0dBSUc7QUFDSCxTQUFTLE9BQU8sQ0FBQyxNQUFNLEVBQUUsUUFBUTtJQUM3QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO0lBQzdCLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDN0IsSUFBSSxPQUFPLFFBQVEsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUU7WUFDaEMsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQztnQkFDakMsT0FBTyxJQUFJLENBQUM7U0FDbkI7YUFDSTtZQUNELElBQUksUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU07Z0JBQ3JCLE9BQU8sSUFBSSxDQUFDO1NBQ25CO0tBQ0o7SUFDRCxPQUFPLEtBQUssQ0FBQztBQUNqQixDQUFDO0FBQ0Q7Ozs7R0FJRztBQUNILFNBQVMsUUFBUSxDQUFDLE1BQU0sRUFBRSxRQUFRO0lBQzlCLE9BQU8sT0FBTyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztBQUNyQyxDQUFDO0FBQ0Q7OztHQUdHO0FBQ0gsU0FBUyxVQUFVLENBQUMsUUFBUTtJQUN4QixPQUFPLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDakMsQ0FBQztBQUNEOzs7R0FHRztBQUNILFNBQVMsYUFBYSxDQUFDLENBQUM7SUFDcEIsSUFBSSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNaLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDL0IsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNULENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ1o7SUFDRCxPQUFPLENBQUMsQ0FBQztBQUNiLENBQUM7QUFDRDs7Ozs7R0FLRztBQUNILFNBQVMsVUFBVTtJQUNmLElBQUksT0FBTyxHQUFHLEVBQUUsQ0FBQztJQUNqQixLQUFLLElBQUksRUFBRSxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxFQUFFLEVBQUUsRUFBRTtRQUMxQyxPQUFPLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0tBQy9CO0lBQ0QsdUNBQXVDO0lBQ3ZDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUM7SUFDekIsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUNQLE9BQU87SUFDWCxJQUFJLEdBQUcsR0FBRyxDQUFDO1FBQ1AsT0FBTyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdEIsK0JBQStCO0lBQy9CLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDMUIsS0FBSyxJQUFJLEdBQUcsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDeEIsSUFBSSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFO2dCQUNoQyx1Q0FBdUM7Z0JBQ3ZDLHlCQUF5QjtnQkFDekIsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssaUJBQWlCLEVBQUU7b0JBQ3ZFLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDeEU7cUJBQ0k7b0JBQ0QsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDckM7YUFDSjtTQUNKO0tBQ0o7SUFDRCxPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN4QixDQUFDO0FBQ0Q7Ozs7O0dBS0c7QUFDSCxTQUFTLFVBQVUsQ0FBQyxHQUFHLEVBQUUsS0FBSztJQUMxQixJQUFJLEtBQUssR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFO1FBQ1osR0FBRyxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDeEI7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNmLENBQUM7QUFDRCxJQUFJLE9BQU8sTUFBTSxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsT0FBTyxFQUFFO0lBQ2pELE1BQU0sQ0FBQyxPQUFPLEdBQUc7UUFDYixhQUFhLEVBQUUsYUFBYTtRQUM1QixVQUFVLEVBQUUsVUFBVTtRQUN0QixRQUFRLEVBQUUsUUFBUTtRQUNsQixVQUFVLEVBQUUsVUFBVTtRQUN0QixVQUFVLEVBQUUsVUFBVTtLQUN6QixDQUFDO0NBQ0w7QUFFRCxrQ0FBa0M7QUFDbEMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsVUFBVSxJQUFJO0lBQ3JDLElBQUksSUFBSSxHQUFHLElBQUksR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDLENBQUMsUUFBUTtJQUNyQyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsSUFBSSxDQUFDO0lBQ2hDLE9BQU8sSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUMxQixDQUFDLENBQUM7QUFDRixJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtJQUNYLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxHQUFHO1FBQ25CLE9BQU8sSUFBSSxJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUNoQyxDQUFDLENBQUM7Q0FDTDtBQUNELElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztJQUNqQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQztJQUNsRCxtQ0FBbUM7SUFDbkMsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBQ0YsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEdBQUcsVUFBVSxHQUFHO0lBQ3BDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxHQUFHLEdBQUcsQ0FBQyxDQUFDO0lBQ3JDLE9BQU8sSUFBSSxDQUFDO0FBQ2hCLENBQUMsQ0FBQztBQUNGLFNBQVMsY0FBYyxDQUFDLElBQUk7SUFDeEIsT0FBTyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2hELENBQUM7QUFFRCxJQUFJLE9BQU8sUUFBUSxJQUFJLFdBQVcsRUFBRTtJQUNoQyxRQUFRLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLFNBQVMsRUFBRSxRQUFRLEVBQUUsT0FBTztRQUM5RCxJQUFJLE9BQU8sS0FBSyxLQUFLLENBQUMsRUFBRTtZQUFFLE9BQU8sR0FBRyxFQUFFLENBQUM7U0FBRTtRQUN6QyxJQUFJLElBQUksQ0FBQyxnQkFBZ0IsRUFBRTtZQUN2QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztTQUN2RDthQUNJLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUN2QixJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksR0FBRyxTQUFTLEVBQUUsUUFBUSxFQUFFLE9BQU8sQ0FBQyxDQUFDO1NBQ3pEO0lBQ0wsQ0FBQyxDQUFDO0NBQ0w7QUFFRCxNQUFNLENBQUMsU0FBUyxDQUFDLEtBQUssR0FBRyxVQUFVLElBQUk7SUFDbkMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLE9BQU8sSUFBSSxHQUFHLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDNUIsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUcsVUFBVSxNQUFNO0lBQ3ZDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztJQUNoQixJQUFJLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBRSxHQUFHLElBQUksQ0FBQyxDQUFDLFFBQVE7SUFDckMsSUFBSSxDQUFDLE1BQU07UUFDUCxNQUFNLEdBQUcsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUN4QixPQUFPLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUN2RCxDQUFDLENBQUM7QUFDRixNQUFNLENBQUMsU0FBUyxDQUFDLE9BQU8sR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDO0lBQ3JDLElBQUksQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0lBQ3pELE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUM3RCxDQUFDLENBQUM7QUFDRjs7OztHQUlHO0FBQ0gsU0FBUyxTQUFTLENBQUMsQ0FBQyxFQUFFLElBQUk7SUFDdEIsSUFBSSxDQUFDLElBQUksRUFBRTtRQUNQLElBQUksR0FBRyxLQUFLLENBQUM7S0FDaEI7SUFDRCxJQUFJLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxFQUFFO1FBQ3ZDLEtBQUssQ0FBQyw4Q0FBOEMsQ0FBQyxDQUFDO1FBQ3RELE9BQU8sSUFBSSxDQUFDO0tBQ2Y7SUFDRCxJQUFJLEtBQUssR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0lBQ3JCLElBQUksS0FBSyxHQUFHLGdCQUFnQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDcEQsd0RBQXdEO0lBQ3hELE9BQU8sS0FBSyxDQUFDLFFBQVEsRUFBRSxJQUFJLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztBQUNoRCxDQUFDO0FBQ0Q7OztHQUdHO0FBQ0gsU0FBUyxNQUFNLENBQUMsR0FBRztJQUNmLElBQUksR0FBRyxJQUFJLEVBQUUsRUFBRTtRQUNYLE9BQU8sR0FBRyxDQUFDO0tBQ2Q7U0FDSTtRQUNELE9BQU8sR0FBRyxHQUFHLEdBQUcsQ0FBQztLQUNwQjtBQUNMLENBQUM7QUFDRDs7OztHQUlHO0FBQ0gsU0FBUyxLQUFLLENBQUMsQ0FBQztJQUNaLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUMxQyxDQUFDO0FBQ0Q7Ozs7R0FJRztBQUNILFNBQVMsT0FBTyxDQUFDLENBQUM7SUFDZCxPQUFPLE1BQU0sQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7QUFDMUMsQ0FBQztBQUNELElBQUksT0FBTyxNQUFNLENBQUMsT0FBTyxJQUFJLFdBQVcsRUFBRTtJQUN0QyxNQUFNLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztJQUNyQixNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztDQUM1QjtBQUVELDBDQUEwQztBQUMxQyw4REFBOEQ7QUFDOUQsb0NBQW9DO0FBQ3BDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsVUFBVSxHQUFHO0lBQ3ZCLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUM7SUFDbEIsS0FBSyxHQUFHLElBQUksR0FBRyxFQUFFO1FBQ2IsSUFBSSxHQUFHLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQztZQUN2QixJQUFJLEVBQUUsQ0FBQztLQUNkO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLEtBQUssR0FBRyxVQUFVLEdBQUcsRUFBRSxRQUFRO0lBQ2xDLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztJQUNoQixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDMUIsSUFBSSxPQUFPLFFBQVEsSUFBSSxVQUFVLEVBQUU7WUFDL0IsT0FBTyxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7U0FDOUI7YUFDSTtZQUNELE9BQU8sSUFBSSxDQUFDO1NBQ2Y7S0FDSjtTQUNJO1FBQ0QsT0FBTyxTQUFTLENBQUM7S0FDcEI7QUFDTCxDQUFDLENBQUM7QUFDRixNQUFNLENBQUMsR0FBRyxHQUFHLFVBQVUsR0FBRyxFQUFFLFdBQVc7SUFDbkMsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2hCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUMxQixPQUFPLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztLQUNwQjtTQUNJO1FBQ0QsT0FBTyxXQUFXLENBQUM7S0FDdEI7QUFDTCxDQUFDLENBQUM7QUFDRixNQUFNLENBQUMsR0FBRyxHQUFHLFVBQVUsR0FBRztJQUN0QixPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLElBQUksR0FBRyxVQUFVLFFBQVE7SUFDNUIsS0FBSyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7UUFDbEIsdUNBQXVDO1FBQ3ZDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7S0FDNUI7QUFDTCxDQUFDLENBQUM7QUFDRixNQUFNLENBQUMsT0FBTyxHQUFHO0lBQ2IsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztBQUM3QixDQUFDLENBQUM7QUFDRixNQUFNLENBQUMsY0FBYyxHQUFHLFVBQVUsVUFBVTtJQUN4QyxPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUU7UUFDL0MsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQzFCLE9BQU8sRUFBRSxDQUFDO0lBQ2QsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ1A7Ozs7Ozs7T0FPRztBQUNQLENBQUMsQ0FBQztBQUNGOzs7O0dBSUc7QUFDSCxTQUFTLFdBQVcsQ0FBQyxHQUFHO0lBQ3BCLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7U0FDbEIsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUNoQixPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNsQixDQUFDLENBQUM7U0FDRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbkIsQ0FBQztBQUNEOzs7OztHQUtHO0FBQ0gsU0FBUyxhQUFhLENBQUMsSUFBSSxFQUFFLElBQUk7SUFDN0IsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxFQUFFO1FBQ25CLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUMzQixzQ0FBc0M7WUFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUM3QjtLQUNKO0lBQ0QsS0FBSyxJQUFJLElBQUksSUFBSSxJQUFJLEVBQUU7UUFDbkIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzNCLHNDQUFzQztZQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzdCO0tBQ0o7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDO0FBRUQsdURBQXVEO0FBQ3ZELHVDQUF1QztBQUN2Qyw4REFBOEQ7QUFDOUQsb0NBQW9DO0FBQ3BDLHFDQUFxQztBQUNyQyxNQUFNLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxVQUFVLEdBQUc7SUFDbkM7Ozs7Ozs7T0FPRztJQUNILElBQUksWUFBWSxHQUFHLEtBQUssQ0FBQztJQUN6QixJQUFJLFVBQVUsR0FBRyxTQUFTLENBQUM7SUFDM0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7SUFDWCxJQUFJLE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRTtRQUNsQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0tBQ3ZCO0lBQ0QsSUFBSSxHQUFHLFlBQVksS0FBSyxJQUFJLFlBQVksRUFBRTtRQUN0QyxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFVBQVUsQ0FBQyxFQUFFLENBQUM7WUFDckMsQ0FBQyxFQUFFLENBQUM7WUFDSixJQUFJLFlBQVksRUFBRTtnQkFDZCxJQUFJLE9BQU8sVUFBVSxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRTtvQkFDbEMsT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ3hCO3FCQUNJO29CQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsc0NBQXNDLENBQUMsQ0FBQztpQkFDM0Q7YUFDSjtZQUNELE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0tBQ047U0FDSTtRQUNELE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUM3QyxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixPQUFPLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xFLENBQUMsQ0FBQyxDQUFDO0tBQ047QUFDTCxDQUFDLENBQUM7QUFDRixNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRztJQUN6QixJQUFJLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pDLElBQUksWUFBWSxDQUFDO0lBQ2pCLElBQUksS0FBSyxDQUFDO0lBQ1YsSUFBSSxDQUFDLENBQUM7SUFDTixJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFDakIsOEJBQThCO0lBQzlCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzlCLGlDQUFpQztJQUNqQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0RCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDakMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNyQztJQUNELE9BQU87UUFDSCxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7UUFDekIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1FBQ2pCLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUTtRQUN6QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7UUFDakIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO1FBQ3pCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtRQUNyQixZQUFZLEVBQUUsWUFBWTtRQUMxQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7UUFDakIsU0FBUyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJO0tBQ2xELENBQUM7QUFDTixDQUFDLENBQUM7QUFDRjs7R0FFRztBQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHO0lBQ25CLElBQUksQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDdkMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUM7SUFDckIsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekIsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pELE1BQU0sQ0FBQyxnQkFBZ0I7UUFDbkIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLEVBQUU7WUFDOUIsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNOLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVztZQUNoQixDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7Z0JBQzNCLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwQyxDQUFDLENBQUM7WUFDRixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHO2dCQUNmLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwQyxDQUFDLENBQUMsQ0FBQztBQUNmLENBQUMsQ0FBQztBQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHO0lBQ3BCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDM0MsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUc7SUFDcEIsSUFBSSxHQUFHLEVBQUUsQ0FBQyxDQUFDO0lBQ1gsSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO0lBQ2hCLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUM5QixHQUFHLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDdEMsTUFBTSxJQUFJLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3JDO0lBQ0QsT0FBTyxNQUFNLENBQUM7QUFDbEIsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUc7SUFDcEIsSUFBSSxDQUFDLENBQUM7SUFDTixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUN4QyxJQUFJLElBQUksR0FBRyxFQUFFLENBQUM7SUFDZCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDL0IsSUFBSSxJQUFJLE1BQU0sQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0tBQ3ZEO0lBQ0QsT0FBTyxJQUFJLENBQUM7QUFDaEIsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxVQUFVLEdBQUc7SUFDMUIsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEQsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUc7SUFDckIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxVQUFVLENBQUM7UUFDeEMsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztJQUNqRyxDQUFDLENBQUMsQ0FBQztBQUNQLENBQUMsQ0FBQztBQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQyxFQUFFLGVBQWU7SUFDcEQsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtRQUNsQixPQUFPLElBQUksQ0FBQztLQUNmO0lBQ0QsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMscUJBQXFCO0lBQzVELE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEdBQUcsVUFBVSxDQUFDO0FBQ3hHLENBQUMsQ0FBQztBQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsT0FBTyxHQUFHO0lBQ3ZCLElBQUksSUFBSSxJQUFJLElBQUksSUFBSSxPQUFPLElBQUksSUFBSSxXQUFXLEVBQUU7UUFDNUMsT0FBTyxJQUFJLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztLQUM1QztJQUNELE9BQU8sS0FBSyxDQUFDO0FBQ2pCLENBQUMsQ0FBQztBQUNGLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHLFVBQVUsS0FBSyxFQUFFLFdBQVc7SUFDdEQsNERBQTREO0lBQzVELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQztJQUNmLEtBQUssQ0FBQyxHQUFHLENBQUMsVUFBVSxHQUFHO1FBQ25CLEdBQUcsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxXQUFXLENBQUMsQ0FBQztJQUN4QyxDQUFDLENBQUMsQ0FBQztJQUNILE9BQU8sR0FBRyxDQUFDO0FBQ2YsQ0FBQyxDQUFDO0FBQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLEdBQUc7SUFDOUIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUM7UUFDbEMsdUNBQXVDO1FBQ3ZDLE9BQU8sQ0FBQyxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDdEUsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFDRixNQUFNLENBQUMsZ0JBQWdCLEdBQUcsVUFBVSxHQUFHO0lBQ25DLE9BQU8sQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxVQUFVLENBQUM7UUFDN0MsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1QixPQUFPLE1BQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDbEMsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUM7QUFDRixNQUFNLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxVQUFVLFVBQVU7SUFDakQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDO0lBQ2pCLE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxPQUFPLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN2RSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby10aGlzLWFsaWFzICovXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvdHJpcGxlLXNsYXNoLXJlZmVyZW5jZSAqL1xuLyogZXNsaW50LWRpc2FibGUgcHJlZmVyLXJlc3QtcGFyYW1zICovXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90b3R5cGUtYnVpbHRpbnMgKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuL0FycmF5LmQudHNcIiAvPlxuQXJyYXkucHJvdG90eXBlLnNodWZmbGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGkgPSB0aGlzLmxlbmd0aCwgaiwgdGVtcDtcbiAgICBpZiAoaSA9PSAwKVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB3aGlsZSAoLS1pKSB7XG4gICAgICAgIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcbiAgICAgICAgdGVtcCA9IHRoaXNbaV07XG4gICAgICAgIHRoaXNbaV0gPSB0aGlzW2pdO1xuICAgICAgICB0aGlzW2pdID0gdGVtcDtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuQXJyYXkucHJvdG90eXBlLmxhc3QgPSBmdW5jdGlvbiAobikge1xuICAgIGlmICghbikge1xuICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICByZXR1cm4gdGhpc1t0aGlzLmxlbmd0aCAtIDFdO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5sZW5ndGggLSBuO1xuICAgICAgICBpZiAoc3RhcnQgPCAwKVxuICAgICAgICAgICAgc3RhcnQgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcy5zbGljZShzdGFydCwgdGhpcy5sZW5ndGgpO1xuICAgIH1cbn07XG5BcnJheS5wcm90b3R5cGUudHJpbSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKHN0cikge1xuICAgICAgICBpZiAodHlwZW9mIHN0ciA9PSBcInN0cmluZ1wiKVxuICAgICAgICAgICAgcmV0dXJuIHN0ci50cmltKCk7XG4gICAgfSk7XG59O1xuQXJyYXkucHJvdG90eXBlLmlzRW1wdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoID09PSAwO1xufTtcbkFycmF5LnByb3RvdHlwZS5yYW5nZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gICAgaWYgKGVuZCA8IHN0YXJ0KSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuc2xpY2Uoc3RhcnQsIGVuZCArIDEpO1xufTtcbkFycmF5LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHRoaXMucHVzaChlbGVtZW50KTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5BcnJheS5wcm90b3R5cGUuYWRkQWxsID0gZnVuY3Rpb24gKG90aGVycykge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBvdGhlcnMuZm9yRWFjaChmdW5jdGlvbiAoZSkge1xuICAgICAgICBzZWxmLnB1c2goZSk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHNlbGY7XG59O1xuQXJyYXkucHJvdG90eXBlLnJhbmRvbSA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpc1tNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmxlbmd0aCldO1xufTtcbkFycmF5LnByb3RvdHlwZS51bmlxdWUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGEgPSB0aGlzLmNvbmNhdCgpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYS5sZW5ndGg7ICsraSkge1xuICAgICAgICBmb3IgKHZhciBqID0gaSArIDE7IGogPCBhLmxlbmd0aDsgKytqKSB7XG4gICAgICAgICAgICBpZiAoYVtpXSA9PT0gYVtqXSlcbiAgICAgICAgICAgICAgICBhLnNwbGljZShqLS0sIDEpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhO1xufTtcbkFycmF5LnByb3RvdHlwZS51bmlxdWVPYmplY3RLZXkgPSBmdW5jdGlvbiAoa2V5LCByZW1vdmVOdWxsKSB7XG4gICAgaWYgKHJlbW92ZU51bGwgPT09IHZvaWQgMCkgeyByZW1vdmVOdWxsID0gdHJ1ZTsgfVxuICAgIGlmICgha2V5KVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB2YXIgcmVzQXJyID0gW107XG4gICAgdGhpcy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgdmFyIGkgPSByZXNBcnIuZmluZEluZGV4KGZ1bmN0aW9uICh4KSB7IHJldHVybiB4W2tleV0gPT0gaXRlbVtrZXldOyB9KTtcbiAgICAgICAgaWYgKGkgPD0gLTEpIHtcbiAgICAgICAgICAgIGlmIChyZW1vdmVOdWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1ba2V5XSlcbiAgICAgICAgICAgICAgICAgICAgcmVzQXJyLnB1c2goaXRlbSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByZXNBcnIucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gcmVzQXJyO1xufTtcbkFycmF5LnByb3RvdHlwZS5jb250YWlucyA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICB2YXIgaSA9IHRoaXMubGVuZ3RoO1xuICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgaWYgKHRoaXNbaV0gPT09IG9iaikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcbkFycmF5LnByb3RvdHlwZS5oYXNJbmRleCA9IGZ1bmN0aW9uIChuKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzW25dICE9IFwidW5kZWZpbmVkXCI7XG59O1xuQXJyYXkucHJvdG90eXBlLmZpcnN0ID0gZnVuY3Rpb24gKG4pIHtcbiAgICBpZiAoIW4pIHtcbiAgICAgICAgaWYgKHRoaXMubGVuZ3RoID09PSAwKVxuICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgcmV0dXJuIHRoaXNbMF07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAodGhpcy5sZW5ndGggPT09IDApXG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIHJldHVybiB0aGlzLnNsaWNlKDAsIG4pO1xuICAgIH1cbn07XG5BcnJheS5wcm90b3R5cGUuY29tcGFjdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAvL3ZhciBjaGFuZ2VzID0gZmFsc2U7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIC8vIElmIGVsZW1lbnQgaXMgbm9uLWV4aXN0ZW50LCB1bmRlZmluZWQgb3IgbnVsbCwgcmVtb3ZlIGl0LlxuICAgICAgICBpZiAoIXRoaXNbaV0pIHtcbiAgICAgICAgICAgIHRoaXMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgaSA9IGkgLSAxO1xuICAgICAgICAgICAgLy9jaGFuZ2VzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvL2lmICghY2hhbmdlcykgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICByZXR1cm4gdGhpcztcbn07XG5BcnJheS5wcm90b3R5cGUuZGVsZXRlQXQgPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICBpZiAoaW5kZXggPCAwKVxuICAgICAgICBpbmRleCA9IHRoaXMubGVuZ3RoICsgaW5kZXg7XG4gICAgLy8gSWYgZWxlbWVudCBpcyBub24tZXhpc3RlbnQsIHJldHVybiB1bmRlZmluZWQ6XG4gICAgaWYgKCF0aGlzLmhhc093blByb3BlcnR5KGluZGV4KSlcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB2YXIgZWxlbSA9IHRoaXNbaW5kZXhdO1xuICAgIHRoaXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICByZXR1cm4gZWxlbTtcbn07XG5BcnJheS5wcm90b3R5cGUudW5zZXQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodGhpcy5pbmRleE9mKHZhbHVlKSAhPSAtMSkge1xuICAgICAgICAvLyBNYWtlIHN1cmUgdGhlIHZhbHVlIGV4aXN0c1xuICAgICAgICB0aGlzLnNwbGljZSh0aGlzLmluZGV4T2YodmFsdWUpLCAxKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXM7XG59O1xuQXJyYXkucHJvdG90eXBlLmV4aXN0cyA9IGZ1bmN0aW9uIChuKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB0aGlzW25dICE9PSBcInVuZGVmaW5lZFwiO1xufTtcbmlmICghQXJyYXkucHJvdG90eXBlLmhhc093blByb3BlcnR5KFwiZXZlcnlcIikpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuZXZlcnkgPSBmdW5jdGlvbiAoZnVuIC8qLCB0aGlzcCAqLykge1xuICAgICAgICBcInVzZSBzdHJpY3RcIjtcbiAgICAgICAgdmFyIHQgPSBPYmplY3QodGhpcyk7XG4gICAgICAgIHZhciBsZW4gPSB0Lmxlbmd0aCA+Pj4gMDtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciB0aGlzcCA9IGFyZ3VtZW50c1sxXTtcbiAgICAgICAgaWYgKHRoaXMgPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigpO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YgZnVuICE9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpIGluIHQgJiYgIWZ1bi5jYWxsKHRoaXNwLCB0W2ldLCBpLCB0KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9O1xufVxuQXJyYXkucHJvdG90eXBlLmhhcHVzSXRlbURhcmlBcnJheUxhaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGFycmF5TGFpbiA9IFtdO1xuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBhcmd1bWVudHMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICAgIGFycmF5TGFpbltfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgIH1cbiAgICB2YXIgdGhpc0FyciA9IHRoaXM7XG4gICAgYXJyYXlMYWluLmZvckVhY2goZnVuY3Rpb24gKG90aGVyQXJyKSB7XG4gICAgICAgIHRoaXNBcnIgPSB0aGlzQXJyLmZpbHRlcihmdW5jdGlvbiAoZWwpIHtcbiAgICAgICAgICAgIHJldHVybiAhb3RoZXJBcnIuaW5jbHVkZXMoZWwpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpc0Fycjtcbn07XG5BcnJheS5wcm90b3R5cGUucmVtb3ZlRW1wdGllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZmlsdGVyID0gdGhpcy5maWx0ZXIoZnVuY3Rpb24gKGVsKSB7XG4gICAgICAgIHZhciBub3RudWxsID0gXG4gICAgICAgIC8vIG1ha2Ugc3VyZSBlbGVtZW50IGlzIG5vdCBudWxsXG4gICAgICAgIGVsICE9IG51bGwgJiZcbiAgICAgICAgICAgIC8vIG1ha2Ugc3VyZSBlbGVtZW50IGlzIG5vdCB1bmRlZmluZWRcbiAgICAgICAgICAgIHR5cGVvZiBlbCAhPSBcInVuZGVmaW5lZFwiO1xuICAgICAgICAvLyBpZiBlbGVtZW50IGlzIHN0cmluZywgbWFrZSBzdXJlIHN0cmluZyBsZW5ndGggbm90IHplcm9cbiAgICAgICAgaWYgKHR5cGVvZiBlbCA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICByZXR1cm4gbm90bnVsbCAmJiBlbC50cmltKCkubGVuZ3RoID4gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm90bnVsbDtcbiAgICB9KTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5mdW5jdGlvbiBhcnJheV9maWx0ZXIoYXJyYXkpIHtcbiAgICByZXR1cm4gYXJyYXkuZmlsdGVyKGZ1bmN0aW9uIChlbCkge1xuICAgICAgICByZXR1cm4gZWwgIT0gbnVsbDtcbiAgICB9KTtcbn1cbi8qKlxuICogcGljayByYW5kb20gZnJvbSBhcnJheVxuICogQHBhcmFtIHtBcnJheTxhbnk+fSBhcnJheXNcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gdW5pcXVlIFVuaXF1ZSB0aGUgYXJyYXlzXG4gKi9cbmZ1bmN0aW9uIGFycmF5X3JhbmQoYXJyYXlzLCB1bmlxdWUpIHtcbiAgICBpZiAodW5pcXVlKSB7XG4gICAgICAgIGFycmF5cyA9IGFycmF5X3VuaXF1ZShhcnJheXMpO1xuICAgIH1cbiAgICB2YXIgaW5kZXggPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiBhcnJheXMubGVuZ3RoKTtcbiAgICByZXR1cm4ge1xuICAgICAgICBpbmRleDogaW5kZXgsXG4gICAgICAgIHZhbHVlOiBhcnJheXNbaW5kZXhdXG4gICAgfTtcbn1cbi8qKlxuICogQXJyYXkgdW5pcXVlXG4gKiBAcGFyYW0ge0FycmF5PGFueT59IGFycmF5c1xuICovXG5mdW5jdGlvbiBhcnJheV91bmlxdWUoYXJyYXlzKSB7XG4gICAgcmV0dXJuIGFycmF5cy5maWx0ZXIoZnVuY3Rpb24gKGl0ZW0sIHBvcywgc2VsZikge1xuICAgICAgICByZXR1cm4gc2VsZi5pbmRleE9mKGl0ZW0pID09IHBvcztcbiAgICB9KTtcbn1cbi8qKlxuICogVW5zZXQgYXJyYXlcbiAqIEBwYXJhbSB7QXJyYXk8YW55Pn0gYXJyYXlOYW1lXG4gKiBAcGFyYW0ge1N0cmluZ3xudW1iZXJ9IGtleVxuICovXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVudXNlZC12YXJzXG5mdW5jdGlvbiBhcnJheV91bnNldChhcnJheU5hbWUsIGtleSkge1xuICAgIHZhciB4O1xuICAgIHZhciB0bXBBcnJheSA9IFtdO1xuICAgIGZvciAoeCBpbiBhcnJheU5hbWUpIHtcbiAgICAgICAgaWYgKHggIT0ga2V5KSB7XG4gICAgICAgICAgICB0bXBBcnJheVt4XSA9IGFycmF5TmFtZVt4XTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdG1wQXJyYXk7XG59XG4vKipcbiAqIFBIUCBzaHVmZmxlIGFycmF5IGVxdWl2YWxlbnRcbiAqIEBwYXJhbSBhcnJheVxuICogQGV4YW1wbGVcbiAqIHZhciBhcnIgPSBbMiwgMTEsIDM3LCA0Ml07XG4gKiBzaHVmZmxlKGFycik7XG4gKiBjb25zb2xlLmxvZyhhcnIpOyAvL3JldHVybiByYW5kb21cbiAqL1xuLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby11bnVzZWQtdmFyc1xuZnVuY3Rpb24gc2h1ZmZsZShhcnJheSkge1xuICAgIHZhciBjdXJyZW50SW5kZXggPSBhcnJheS5sZW5ndGgsIHRlbXBvcmFyeVZhbHVlLCByYW5kb21JbmRleDtcbiAgICAvLyBXaGlsZSB0aGVyZSByZW1haW4gZWxlbWVudHMgdG8gc2h1ZmZsZS4uLlxuICAgIHdoaWxlICgwICE9PSBjdXJyZW50SW5kZXgpIHtcbiAgICAgICAgLy8gUGljayBhIHJlbWFpbmluZyBlbGVtZW50Li4uXG4gICAgICAgIHJhbmRvbUluZGV4ID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogY3VycmVudEluZGV4KTtcbiAgICAgICAgY3VycmVudEluZGV4IC09IDE7XG4gICAgICAgIC8vIEFuZCBzd2FwIGl0IHdpdGggdGhlIGN1cnJlbnQgZWxlbWVudC5cbiAgICAgICAgdGVtcG9yYXJ5VmFsdWUgPSBhcnJheVtjdXJyZW50SW5kZXhdO1xuICAgICAgICBhcnJheVtjdXJyZW50SW5kZXhdID0gYXJyYXlbcmFuZG9tSW5kZXhdO1xuICAgICAgICBhcnJheVtyYW5kb21JbmRleF0gPSB0ZW1wb3JhcnlWYWx1ZTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5O1xufVxuZnVuY3Rpb24gYXJyYXlDb21wYXJlKGExLCBhMikge1xuICAgIGlmIChhMS5sZW5ndGggIT0gYTIubGVuZ3RoKVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgdmFyIGxlbmd0aCA9IGEyLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChhMVtpXSAhPT0gYTJbaV0pXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufVxuLyoqXG4gKiBpbl9hcnJheSBQSFAgZXF1aXZhbGVudFxuICogQHBhcmFtIG5lZWRsZSBzdHJpbmcgZXRjXG4gKiBAcGFyYW0gaGF5c3RhY2tcbiAqL1xuZnVuY3Rpb24gaW5BcnJheShuZWVkbGUsIGhheXN0YWNrKSB7XG4gICAgdmFyIGxlbmd0aCA9IGhheXN0YWNrLmxlbmd0aDtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaGF5c3RhY2tbaV0gPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgaWYgKGFycmF5Q29tcGFyZShoYXlzdGFja1tpXSwgbmVlZGxlKSlcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGlmIChoYXlzdGFja1tpXSA9PSBuZWVkbGUpXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuLyoqXG4gKiBpbl9hcnJheSBQSFAgZXF1aXZhbGVudFxuICogQHBhcmFtIG5lZWRsZSBzdHJpbmcgZXRjXG4gKiBAcGFyYW0gaGF5c3RhY2tcbiAqL1xuZnVuY3Rpb24gaW5fYXJyYXkobmVlZGxlLCBoYXlzdGFjaykge1xuICAgIHJldHVybiBpbkFycmF5KG5lZWRsZSwgaGF5c3RhY2spO1xufVxuLyoqXG4gKiBnZXQgYWxsIGtleXNcbiAqIEBwYXJhbSBoYXlzdGFjayBzdHJpbmcgZXRjXG4gKi9cbmZ1bmN0aW9uIGFycmF5X2tleXMoaGF5c3RhY2spIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMoaGF5c3RhY2spO1xufVxuLyoqXG4gKiBTaHVmZmxlcyBhcnJheSBpbiBwbGFjZS5cbiAqIEBwYXJhbSBhIGl0ZW1zIEFuIGFycmF5IGNvbnRhaW5pbmcgdGhlIGl0ZW1zLlxuICovXG5mdW5jdGlvbiBhcnJheV9zaHVmZmxlKGEpIHtcbiAgICB2YXIgaiwgeCwgaTtcbiAgICBmb3IgKGkgPSBhLmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICAgICAgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgICAgICB4ID0gYVtpXTtcbiAgICAgICAgYVtpXSA9IGFbal07XG4gICAgICAgIGFbal0gPSB4O1xuICAgIH1cbiAgICByZXR1cm4gYTtcbn1cbi8qKlxuICogRGVlcCBtZXJnZSB0d28gb3IgbW9yZSBvYmplY3RzIGludG8gdGhlIGZpcnN0LlxuICogKGMpIDIwMjEgQ2hyaXMgRmVyZGluYW5kaSwgTUlUIExpY2Vuc2UsIGh0dHBzOi8vZ29tYWtldGhpbmdzLmNvbVxuICogQHBhcmFtIG9iamVjdHMgIFRoZSBvYmplY3RzIHRvIG1lcmdlIHRvZ2V0aGVyXG4gKiBAcmV0dXJucyBNZXJnZWQgdmFsdWVzIG9mIGRlZmF1bHRzIGFuZCBvcHRpb25zXG4gKi9cbmZ1bmN0aW9uIGRlZXBBc3NpZ24oKSB7XG4gICAgdmFyIG9iamVjdHMgPSBbXTtcbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICBvYmplY3RzW19pXSA9IGFyZ3VtZW50c1tfaV07XG4gICAgfVxuICAgIC8vIE1ha2Ugc3VyZSB0aGVyZSBhcmUgb2JqZWN0cyB0byBtZXJnZVxuICAgIHZhciBsZW4gPSBvYmplY3RzLmxlbmd0aDtcbiAgICBpZiAobGVuIDwgMSlcbiAgICAgICAgcmV0dXJuO1xuICAgIGlmIChsZW4gPCAyKVxuICAgICAgICByZXR1cm4gb2JqZWN0c1swXTtcbiAgICAvLyBNZXJnZSBhbGwgb2JqZWN0cyBpbnRvIGZpcnN0XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBmb3IgKHZhciBrZXkgaW4gb2JqZWN0c1tpXSkge1xuICAgICAgICAgICAgaWYgKG9iamVjdHNbaV0uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIC8vIElmIGl0J3MgYW4gb2JqZWN0LCByZWN1cnNpdmVseSBtZXJnZVxuICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSwgcHVzaCB0byBrZXlcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iamVjdHNbaV1ba2V5XSkgPT09IFwiW29iamVjdCBPYmplY3RdXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0c1swXVtrZXldID0gZGVlcEFzc2lnbihvYmplY3RzWzBdW2tleV0gfHwge30sIG9iamVjdHNbaV1ba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBvYmplY3RzWzBdW2tleV0gPSBvYmplY3RzW2ldW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBhcmd1bWVudHNbMF07XG59XG4vKipcbiAqIFJlbW92ZSBpdGVtIGZyb20gYXJyYXlcbiAqIEBwYXJhbSBhcnJcbiAqIEBwYXJhbSB2YWx1ZVxuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gcmVtb3ZlSXRlbShhcnIsIHZhbHVlKSB7XG4gICAgdmFyIGluZGV4ID0gYXJyLmluZGV4T2YodmFsdWUpO1xuICAgIGlmIChpbmRleCA+IC0xKSB7XG4gICAgICAgIGFyci5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgICByZXR1cm4gYXJyO1xufVxuaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICAgICAgYXJyYXlfc2h1ZmZsZTogYXJyYXlfc2h1ZmZsZSxcbiAgICAgICAgYXJyYXlfa2V5czogYXJyYXlfa2V5cyxcbiAgICAgICAgaW5fYXJyYXk6IGluX2FycmF5LFxuICAgICAgICBkZWVwQXNzaWduOiBkZWVwQXNzaWduLFxuICAgICAgICByZW1vdmVJdGVtOiByZW1vdmVJdGVtXG4gICAgfTtcbn1cblxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIkRhdGUuZC50c1wiIC8+XG5EYXRlLnByb3RvdHlwZS5pc0hvdXJBZ28gPSBmdW5jdGlvbiAoaG91cikge1xuICAgIHZhciBob3VyID0gaG91ciAqIDYwICogMTAwMDsgLyogbXMgKi9cbiAgICB2YXIgaG91cmFnbyA9IERhdGUubm93KCkgLSBob3VyO1xuICAgIHJldHVybiBob3VyID4gaG91cmFnbztcbn07XG5pZiAoIURhdGUubm93KSB7XG4gICAgRGF0ZS5ub3cgPSBmdW5jdGlvbiBub3coKSB7XG4gICAgICAgIHJldHVybiBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB9O1xufVxuRGF0ZS5wcm90b3R5cGUuYWRkSG91cnMgPSBmdW5jdGlvbiAoaCkge1xuICAgIHRoaXMuc2V0VGltZSh0aGlzLmdldFRpbWUoKSArIGggKiA2MCAqIDYwICogMTAwMCk7XG4gICAgLy90aGlzLnNldEhvdXJzKHRoaXMuZ2V0SG91cnMoKStoKTtcbiAgICByZXR1cm4gdGhpcztcbn07XG5EYXRlLnByb3RvdHlwZS5hZGRIb3VyczIgPSBmdW5jdGlvbiAoaHJzKSB7XG4gICAgdGhpcy5zZXRIb3Vycyh0aGlzLmdldEhvdXJzKCkgKyBocnMpO1xuICAgIHJldHVybiB0aGlzO1xufTtcbmZ1bmN0aW9uIGRhdGV0aW1lX2xvY2FsKGRhdGUpIHtcbiAgICByZXR1cm4gbmV3IERhdGUoZGF0ZSkudG9KU09OKCkuc2xpY2UoMCwgMTkpO1xufVxuXG5pZiAodHlwZW9mIGRvY3VtZW50ICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICBEb2N1bWVudC5wcm90b3R5cGUubGlzdGVuID0gZnVuY3Rpb24gKGV2ZW50VHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpIHtcbiAgICAgICAgaWYgKG9wdGlvbnMgPT09IHZvaWQgMCkgeyBvcHRpb25zID0ge307IH1cbiAgICAgICAgaWYgKHRoaXMuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICAgICAgdGhpcy5hZGRFdmVudExpc3RlbmVyKGV2ZW50VHlwZSwgbGlzdGVuZXIsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHRoaXMuYXR0YWNoRXZlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuYXR0YWNoRXZlbnQoXCJvblwiICsgZXZlbnRUeXBlLCBsaXN0ZW5lciwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICB9O1xufVxuXG5OdW1iZXIucHJvdG90eXBlLmdldE1TID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgcmV0dXJuIHRoaXMgKiA2MCAqIDEwMDA7XG59O1xuTnVtYmVyLnByb3RvdHlwZS5hZGRIb3VyID0gZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICB2YXIgSG91ciA9IHRoaXMgKiA2MCAqIDEwMDA7IC8qIG1zICovXG4gICAgaWYgKCFzb3VyY2UpXG4gICAgICAgIHNvdXJjZSA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHNvdXJjZS5nZXRUaW1lKCkgKyBIb3VyKS5nZXRUaW1lKCk7XG59O1xuTnVtYmVyLnByb3RvdHlwZS5BZGRaZXJvID0gZnVuY3Rpb24gKGIsIGMpIHtcbiAgICB2YXIgbCA9IFN0cmluZyhiIHx8IDEwKS5sZW5ndGggLSBTdHJpbmcodGhpcykubGVuZ3RoICsgMTtcbiAgICByZXR1cm4gbCA+IDAgPyBuZXcgQXJyYXkobCkuam9pbihjIHx8IFwiMFwiKSArIHRoaXMgOiB0aGlzO1xufTtcbi8qKlxuICogT2RkIG9yIEV2ZW4gKEdhbmppbCBHZW5hcCk7XG4gKiBAcGFyYW0gblxuICogQHBhcmFtIHR5cGUgb2RkIG9yIGV2ZW5cbiAqL1xuZnVuY3Rpb24gb2Rkb3JldmVuKG4sIHR5cGUpIHtcbiAgICBpZiAoIXR5cGUpIHtcbiAgICAgICAgdHlwZSA9IFwib2RkXCI7XG4gICAgfVxuICAgIHZhciB0aW1lID0gIW4gPyBuZXcgRGF0ZSgpLmdldERheSgpIDogTnVtYmVyKG4pO1xuICAgIGlmICghL14tP1xcZCtqUXVlcnkvLnRlc3QodGltZS50b1N0cmluZygpKSkge1xuICAgICAgICBhbGVydChcImFyZ3VtZW50cyBpcyBub3QgbnVtYmVyLCBwbGVhc2UgcmVtb3ZlIHF1b3RlXCIpO1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIGhhc2lsID0gdGltZSAlIDI7XG4gICAgdmFyIHJUeXBlID0gL14ob2RkfGdhbmppbCkkLy50ZXN0KHR5cGUpID8gXCIxXCIgOiBcIjBcIjtcbiAgICAvL3JldHVybiBoYXNpbCA9PSAodHlwZSA9PSAoJ29kZCcgfHwgJ2dhbmppbCcpID8gMSA6IDApO1xuICAgIHJldHVybiBoYXNpbC50b1N0cmluZygpID09IHJUeXBlLnRvU3RyaW5nKCk7XG59XG4vKipcbiAqIHN0cnBhZCAvIHN0YXJ0d2l0aCB6ZXJvIFswXVxuICogQHBhcmFtIHtudW1iZXJ9IHZhbFxuICovXG5mdW5jdGlvbiBzdHJwYWQodmFsKSB7XG4gICAgaWYgKHZhbCA+PSAxMCkge1xuICAgICAgICByZXR1cm4gdmFsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwiMFwiICsgdmFsO1xuICAgIH1cbn1cbi8qKlxuICogaXMgdmFyaWFibGUgbnVtYmVyP1xuICogQHBhcmFtIG5cbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIGlzSW50KG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4pID09PSBuICYmIG4gJSAxID09PSAwO1xufVxuLyoqXG4gKiBpcyB2YXJpYWJsZSBmbG9hdD9cbiAqIEBwYXJhbSBuXG4gKiBAcmV0dXJuc1xuICovXG5mdW5jdGlvbiBpc0Zsb2F0KG4pIHtcbiAgICByZXR1cm4gTnVtYmVyKG4pID09PSBuICYmIG4gJSAxICE9PSAwO1xufVxuaWYgKHR5cGVvZiBtb2R1bGUuZXhwb3J0cyAhPSAndW5kZWZpbmVkJykge1xuICAgIGdsb2JhbC5pc0ludCA9IGlzSW50O1xuICAgIGdsb2JhbC5pc0Zsb2F0ID0gaXNGbG9hdDtcbn1cblxuLyogZXNsaW50LWRpc2FibGUgbm8tcHJvdG90eXBlLWJ1aWx0aW5zICovXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvdHJpcGxlLXNsYXNoLXJlZmVyZW5jZSAqL1xuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIk9iamVjdC5kLnRzXCIgLz5cbk9iamVjdC5zaXplID0gZnVuY3Rpb24gKG9iaikge1xuICAgIHZhciBzaXplID0gMCwga2V5O1xuICAgIGZvciAoa2V5IGluIG9iaikge1xuICAgICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgICAgICBzaXplKys7XG4gICAgfVxuICAgIHJldHVybiBzaXplO1xufTtcbk9iamVjdC5jaGlsZCA9IGZ1bmN0aW9uIChzdHIsIGNhbGxiYWNrKSB7XG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIGlmIChzZWxmLmhhc093blByb3BlcnR5KHN0cikpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBjYWxsYmFjayA9PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayhzZWxmW3N0cl0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxufTtcbk9iamVjdC5hbHQgPSBmdW5jdGlvbiAoc3RyLCBhbHRlcm5hdGl2ZSkge1xuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICBpZiAoc2VsZi5oYXNPd25Qcm9wZXJ0eShzdHIpKSB7XG4gICAgICAgIHJldHVybiBzZWxmW3N0cl07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gYWx0ZXJuYXRpdmU7XG4gICAgfVxufTtcbk9iamVjdC5oYXMgPSBmdW5jdGlvbiAoc3RyKSB7XG4gICAgcmV0dXJuIHRoaXMuaGFzT3duUHJvcGVydHkoc3RyKTtcbn07XG5PYmplY3QuZWFjaCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzKSB7XG4gICAgICAgIC8vY2FsbGJhY2suY2FsbChzY29wZSwga2V5LCB0aGlzW2tleV0pO1xuICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXNba2V5XSk7XG4gICAgfVxufTtcbk9iamVjdC5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLmxlbmd0aCA9PT0gMDtcbn07XG5PYmplY3QucmVwbGFjZUtleUZyb20gPSBmdW5jdGlvbiAoYW5vdGhlck9iaikge1xuICAgIHJldHVybiBPYmplY3QuZW50cmllcyh0aGlzKS5yZWR1Y2UoZnVuY3Rpb24gKG9wLCBfYSkge1xuICAgICAgICB2YXIga2V5ID0gX2FbMF0sIHZhbHVlID0gX2FbMV07XG4gICAgICAgIHZhciBuZXdLZXkgPSBhbm90aGVyT2JqW2tleV07XG4gICAgICAgIG9wW25ld0tleSB8fCBrZXldID0gdmFsdWU7XG4gICAgICAgIHJldHVybiBvcDtcbiAgICB9LCB7fSk7XG4gICAgLyppZiAodHlwZW9mIGFub3RoZXJPYmogPT0gJ29iamVjdCcpIHtcbiAgICAgIGZvciAoY29uc3Qga2V5IGluIGFub3RoZXJPYmopIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhbm90aGVyT2JqLCBrZXkpKSB7XG4gICAgICAgICAgY29uc3QgZWxlbWVudCA9IGFub3RoZXJPYmpba2V5XTtcbiAgICAgICAgICBkZWZba2V5XSA9IGVsZW1lbnQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9Ki9cbn07XG4vKipcbiAqIEpvaW4gb2JqZWN0IHRvIHNlcGFyYXRlZCBzdHJpbmdcbiAqIEBwYXJhbSBvYmogT2JqZWN0XG4gKiBAcmV0dXJucyBKb2luZWQgc3RyaW5nXG4gKi9cbmZ1bmN0aW9uIG9iamVjdF9qb2luKG9iaikge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmopXG4gICAgICAgIC5tYXAoZnVuY3Rpb24gKGspIHtcbiAgICAgICAgcmV0dXJuIG9ialtrXTtcbiAgICB9KVxuICAgICAgICAuam9pbihcIixcIik7XG59XG4vKipcbiAqIEV4dGVuZCBPYmplY3RcbiAqIEBwYXJhbSBhcmcxXG4gKiBAcGFyYW0gYXJnMlxuICogQHJldHVybnNcbiAqL1xuZnVuY3Rpb24gZXh0ZW5kX29iamVjdChhcmcxLCBhcmcyKSB7XG4gICAgdmFyIHJlc3VsdCA9IHt9O1xuICAgIGZvciAodmFyIHByb3AgaW4gYXJnMSkge1xuICAgICAgICBpZiAoYXJnMS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xuICAgICAgICAgICAgLy8gZXJyb3Igd2hlbiB1c2luZyAtLXN0cmljdE51bGxDaGVja3NcbiAgICAgICAgICAgIHJlc3VsdFtwcm9wXSA9IGFyZzFbcHJvcF07XG4gICAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgcHJvcCBpbiBhcmcyKSB7XG4gICAgICAgIGlmIChhcmcyLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAgICAgICAvLyBlcnJvciB3aGVuIHVzaW5nIC0tc3RyaWN0TnVsbENoZWNrc1xuICAgICAgICAgICAgcmVzdWx0W3Byb3BdID0gYXJnMltwcm9wXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKiBlc2xpbnQtZGlzYWJsZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdmFyLXJlcXVpcmVzICovXG4vKiBlc2xpbnQtZGlzYWJsZSBwcmVmZXItcmVzdC1wYXJhbXMgKi9cbi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC90cmlwbGUtc2xhc2gtcmVmZXJlbmNlICovXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiU3RyaW5nLmQudHNcIiAvPlxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImdsb2JhbHMuZC50c1wiIC8+XG5TdHJpbmcucHJvdG90eXBlLnByaW50ZiA9IGZ1bmN0aW9uIChvYmopIHtcbiAgICAvKmNvbnN0IGlzTm9kZSA9IG5ldyBGdW5jdGlvbihcbiAgICAgIFwidHJ5IHtyZXR1cm4gdGhpcz09PWdsb2JhbDt9Y2F0Y2goZSl7cmV0dXJuIGZhbHNlO31cIlxuICAgICk7XG4gIFxuICAgIGlmIChpc05vZGUoKSkge1xuICAgICAgY29uc3QgdXRpbCA9IHJlcXVpcmUoXCJ1dGlsXCIpO1xuICAgICAgcmV0dXJuIHV0aWwuZm9ybWF0KHRoaXMsIG9iaik7XG4gICAgfSovXG4gICAgdmFyIHVzZUFyZ3VtZW50cyA9IGZhbHNlO1xuICAgIHZhciBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xuICAgIHZhciBpID0gLTE7XG4gICAgaWYgKHR5cGVvZiBfYXJndW1lbnRzWzBdID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdXNlQXJndW1lbnRzID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5IHx8IHVzZUFyZ3VtZW50cykge1xuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC8lcy9nLCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgaWYgKHVzZUFyZ3VtZW50cykge1xuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgX2FyZ3VtZW50c1tpXSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBfYXJndW1lbnRzW2ldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXJndW1lbnRzIGVsZW1lbnQgaXMgYW4gaW52YWxpZCB0eXBlXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBvYmpbaV07XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgveyhbXnt9XSopfS9nLCBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgdmFyIHIgPSBvYmpbYl07XG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHIgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHIgPT09IFwibnVtYmVyXCIgPyByIDogYTtcbiAgICAgICAgfSk7XG4gICAgfVxufTtcblN0cmluZy5wcm90b3R5cGUucGFyc2VfdXJsID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBwYXJzZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKTtcbiAgICB2YXIgc2VhcmNoT2JqZWN0O1xuICAgIHZhciBzcGxpdDtcbiAgICB2YXIgaTtcbiAgICB2YXIgcXVlcmllcyA9IFtdO1xuICAgIC8vIExldCB0aGUgYnJvd3NlciBkbyB0aGUgd29ya1xuICAgIHBhcnNlci5ocmVmID0gdGhpcy50b1N0cmluZygpO1xuICAgIC8vIENvbnZlcnQgcXVlcnkgc3RyaW5nIHRvIG9iamVjdFxuICAgIHF1ZXJpZXMgPSBwYXJzZXIuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCBcIlwiKS5zcGxpdChcIiZcIik7XG4gICAgZm9yIChpID0gMDsgaSA8IHF1ZXJpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgc3BsaXQgPSBxdWVyaWVzW2ldLnNwbGl0KFwiPVwiKTtcbiAgICAgICAgc2VhcmNoT2JqZWN0W3NwbGl0WzBdXSA9IHNwbGl0WzFdO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgICBwcm90b2NvbDogcGFyc2VyLnByb3RvY29sLFxuICAgICAgICBob3N0OiBwYXJzZXIuaG9zdCxcbiAgICAgICAgaG9zdG5hbWU6IHBhcnNlci5ob3N0bmFtZSxcbiAgICAgICAgcG9ydDogcGFyc2VyLnBvcnQsXG4gICAgICAgIHBhdGhuYW1lOiBwYXJzZXIucGF0aG5hbWUsXG4gICAgICAgIHNlYXJjaDogcGFyc2VyLnNlYXJjaCxcbiAgICAgICAgc2VhcmNoT2JqZWN0OiBzZWFyY2hPYmplY3QsXG4gICAgICAgIGhhc2g6IHBhcnNlci5oYXNoLFxuICAgICAgICBwcm90b2hvc3Q6IHBhcnNlci5wcm90b2NvbCArIFwiLy9cIiArIHBhcnNlci5ob3N0LFxuICAgIH07XG59O1xuLyoqXG4gKiBMb2FkIGNzc1xuICovXG5TdHJpbmcucHJvdG90eXBlLkNTUyA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuICAgIGUucmVsID0gXCJzdHlsZXNoZWV0XCI7XG4gICAgZS5ocmVmID0gdGhpcy50b1N0cmluZygpO1xuICAgIHZhciBuID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJoZWFkXCIpWzBdO1xuICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgICAgID8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIG4ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZSwgbik7XG4gICAgICAgIH0sICExKVxuICAgICAgICA6IHdpbmRvdy5hdHRhY2hFdmVudFxuICAgICAgICAgICAgPyB3aW5kb3cuYXR0YWNoRXZlbnQoXCJvbmxvYWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIG4ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZSwgbik7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgOiAod2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBuLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGUsIG4pO1xuICAgICAgICAgICAgfSk7XG59O1xuU3RyaW5nLnByb3RvdHlwZS50cmltID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2dtLCBcIlwiKTtcbn07XG5TdHJpbmcucHJvdG90eXBlLmhleEUgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGhleCwgaTtcbiAgICB2YXIgcmVzdWx0ID0gXCJcIjtcbiAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBoZXggPSB0aGlzLmNoYXJDb2RlQXQoaSkudG9TdHJpbmcoMTYpO1xuICAgICAgICByZXN1bHQgKz0gKFwiMDAwXCIgKyBoZXgpLnNsaWNlKC00KTtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn07XG5TdHJpbmcucHJvdG90eXBlLmhleEQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGo7XG4gICAgdmFyIGhleGVzID0gdGhpcy5tYXRjaCgvLnsxLDR9L2cpIHx8IFtdO1xuICAgIHZhciBiYWNrID0gXCJcIjtcbiAgICBmb3IgKGogPSAwOyBqIDwgaGV4ZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgYmFjayArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KGhleGVzW2pdLCAxNikpO1xuICAgIH1cbiAgICByZXR1cm4gYmFjaztcbn07XG5TdHJpbmcucHJvdG90eXBlLmNhcGl0YWxpemUgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnNsaWNlKDEpO1xufTtcblN0cmluZy5wcm90b3R5cGUucm90MTMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvW2EtekEtWl0vZywgZnVuY3Rpb24gKGMpIHtcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoKGMgPD0gXCJaXCIgPyA5MCA6IDEyMikgPj0gKGMgPSBjLmNoYXJDb2RlQXQoMCkgKyAxMykgPyBjIDogYyAtIDI2KTtcbiAgICB9KTtcbn07XG5TdHJpbmcucHJvdG90eXBlLnRydW5jYXRlID0gZnVuY3Rpb24gKG4sIHVzZVdvcmRCb3VuZGFyeSkge1xuICAgIGlmICh0aGlzLmxlbmd0aCA8PSBuKSB7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICB2YXIgc3ViU3RyaW5nID0gdGhpcy5zdWJzdHIoMCwgbiAtIDEpOyAvLyB0aGUgb3JpZ2luYWwgY2hlY2tcbiAgICByZXR1cm4gKHVzZVdvcmRCb3VuZGFyeSA/IHN1YlN0cmluZy5zdWJzdHIoMCwgc3ViU3RyaW5nLmxhc3RJbmRleE9mKFwiIFwiKSkgOiBzdWJTdHJpbmcpICsgXCImaGVsbGlwO1wiO1xufTtcblN0cmluZy5wcm90b3R5cGUuaXNFbXB0eSA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAodGhpcyAhPSBudWxsIHx8IHR5cGVvZiB0aGlzICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubGVuZ3RoID09PSAwIHx8ICF0aGlzLnRyaW0oKTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufTtcblN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFyciA9IGZ1bmN0aW9uIChhcnJheSwgcmVwbGFjZW1lbnQpIHtcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXRoaXMtYWxpYXNcbiAgICB2YXIgb3JpID0gdGhpcztcbiAgICBhcnJheS5tYXAoZnVuY3Rpb24gKHN0cikge1xuICAgICAgICBvcmkgPSBvcmkucmVwbGFjZShzdHIsIHJlcGxhY2VtZW50KTtcbiAgICB9KTtcbiAgICByZXR1cm4gb3JpO1xufTtcblN0cmluZy5wcm90b3R5cGUudG9IdG1sRW50aXRpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvLi9nbSwgZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgLy8gcmV0dXJuIFwiJiNcIiArIHMuY2hhckNvZGVBdCgwKSArIFwiO1wiO1xuICAgICAgICByZXR1cm4gcy5tYXRjaCgvW2EtejAtOVxcc10rL2kpID8gcyA6IFwiJiNcIiArIHMuY2hhckNvZGVBdCgwKSArIFwiO1wiO1xuICAgIH0pO1xufTtcblN0cmluZy5mcm9tSHRtbEVudGl0aWVzID0gZnVuY3Rpb24gKHN0cikge1xuICAgIHJldHVybiAoc3RyICsgXCJcIikucmVwbGFjZSgvJiNcXGQrOy9nbSwgZnVuY3Rpb24gKHMpIHtcbiAgICAgICAgdmFyIG0gPSBzLm1hdGNoKC9cXGQrL2dtKVswXTtcbiAgICAgICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUobSk7XG4gICAgfSk7XG59O1xuU3RyaW5nLnByb3RvdHlwZS5pbmNsdWRlc0FycmF5ID0gZnVuY3Rpb24gKHN1YnN0cmluZ3MpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHJldHVybiBzdWJzdHJpbmdzLnNvbWUoZnVuY3Rpb24gKHYpIHsgcmV0dXJuIF90aGlzLmluY2x1ZGVzKHYpOyB9KTtcbn07XG4iXX0=