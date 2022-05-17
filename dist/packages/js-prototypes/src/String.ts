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

  let useArguments = false;
  const _arguments = arguments;
  let i = -1;
  if (typeof _arguments[0] == "string") {
    useArguments = true;
  }
  if (obj instanceof Array || useArguments) {
    return this.replace(/%s/g, function (a, b) {
      i++;
      if (useArguments) {
        if (typeof _arguments[i] == "string") {
          return _arguments[i];
        } else {
          throw new Error("Arguments element is an invalid type");
        }
      }
      return obj[i];
    });
  } else {
    return this.replace(/{([^{}]*)}/g, function (a, b) {
      const r = obj[b];
      return typeof r === "string" || typeof r === "number" ? r : a;
    });
  }
};

String.prototype.parse_url = function () {
  const parser = document.createElement("a");
  let searchObject: Array<Record<any, any> | any>;
  let split: Array<Record<any, any> | any>;
  let i: number;
  let queries: string[] = [];
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
    protohost: parser.protocol + "//" + parser.host
  };
};

/**
 * Load css
 */
String.prototype.CSS = function () {
  const e = document.createElement("link");
  e.rel = "stylesheet";

  e.href = this.toString();
  const n = document.getElementsByTagName("head")[0];
  window.addEventListener
    ? window.addEventListener(
        "load",
        function () {
          n.parentNode.insertBefore(e, n);
        },
        !1
      )
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
  let hex: string, i: number;

  let result = "";
  for (i = 0; i < this.length; i++) {
    hex = this.charCodeAt(i).toString(16);
    result += ("000" + hex).slice(-4);
  }

  return result;
};

String.prototype.hexD = function () {
  let j: number;
  const hexes = this.match(/.{1,4}/g) || [];
  let back = "";
  for (j = 0; j < hexes.length; j++) {
    back += String.fromCharCode(parseInt(hexes[j], 16));
  }

  return back;
};

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

String.prototype.rot13 = function () {
  return this.replace(/[a-zA-Z]/g, function (c: any) {
    return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
  });
};

String.prototype.truncate = function (n: number, useWordBoundary: boolean | null) {
  if (this.length <= n) {
    return this;
  }
  const subString = this.substr(0, n - 1); // the original check
  return (useWordBoundary ? subString.substr(0, subString.lastIndexOf(" ")) : subString) + "&hellip;";
};

String.prototype.isEmpty = function () {
  if (this != null || typeof this != "undefined") {
    return this.length === 0 || !this.trim();
  }
  return false;
};

String.prototype.replaceArr = function (this: string, array: string[], replacement: string) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  let ori = this;
  array.map((str) => {
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
    const m = s.match(/\d+/gm)[0];
    return String.fromCharCode(<any>m);
  });
};

String.prototype.includesArray = function (substrings) {
  return substrings.some((v) => this.includes(v));
};

if (typeof "".replaceAll != "function") {
  String.prototype.replaceAll = function (search, replacement) {
    let find = typeof search == "string" ? new RegExp(search, "g") : search;
    return this.replace(find, replacement);
  };
}
