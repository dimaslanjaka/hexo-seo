"use strict";
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
            const r = obj[b];
            return typeof r === "string" || typeof r === "number" ? r : a;
        });
    }
};
String.prototype.parse_url = function () {
    const parser = document.createElement("a");
    let searchObject;
    let split;
    let i;
    let queries = [];
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
    const e = document.createElement("link");
    e.rel = "stylesheet";
    e.href = this.toString();
    const n = document.getElementsByTagName("head")[0];
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
    let hex, i;
    let result = "";
    for (i = 0; i < this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000" + hex).slice(-4);
    }
    return result;
};
String.prototype.hexD = function () {
    let j;
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
    return this.replace(/[a-zA-Z]/g, function (c) {
        return String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26);
    });
};
String.prototype.truncate = function (n, useWordBoundary) {
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
String.prototype.replaceArr = function (array, replacement) {
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
        return String.fromCharCode(m);
    });
};
String.prototype.includesArray = function (substrings) {
    return substrings.some((v) => this.includes(v));
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RyaW5nLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9qcy1wcm90b3R5cGVzL3NyYy9TdHJpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHVEQUF1RDtBQUN2RCx1Q0FBdUM7QUFDdkMsOERBQThEO0FBQzlELG9DQUFvQztBQUNwQyxxQ0FBcUM7QUFFckMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsVUFBVSxHQUFHO0lBQ3JDOzs7Ozs7O09BT0c7SUFFSCxJQUFJLFlBQVksR0FBRyxLQUFLLENBQUM7SUFDekIsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDO0lBQzdCLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQ1gsSUFBSSxPQUFPLFVBQVUsQ0FBQyxDQUFDLENBQUMsSUFBSSxRQUFRLEVBQUU7UUFDcEMsWUFBWSxHQUFHLElBQUksQ0FBQztLQUNyQjtJQUNELElBQUksR0FBRyxZQUFZLEtBQUssSUFBSSxZQUFZLEVBQUU7UUFDeEMsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDO1lBQ3ZDLENBQUMsRUFBRSxDQUFDO1lBQ0osSUFBSSxZQUFZLEVBQUU7Z0JBQ2hCLElBQUksT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLElBQUksUUFBUSxFQUFFO29CQUNwQyxPQUFPLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDdEI7cUJBQU07b0JBQ0wsTUFBTSxJQUFJLEtBQUssQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO2lCQUN6RDthQUNGO1lBQ0QsT0FBTyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUM7S0FDSjtTQUFNO1FBQ0wsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxVQUFVLENBQUMsRUFBRSxDQUFDO1lBQy9DLE1BQU0sQ0FBQyxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNqQixPQUFPLE9BQU8sQ0FBQyxLQUFLLFFBQVEsSUFBSSxPQUFPLENBQUMsS0FBSyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hFLENBQUMsQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLFNBQVMsR0FBRztJQUMzQixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNDLElBQUksWUFBMkMsQ0FBQztJQUNoRCxJQUFJLEtBQW9DLENBQUM7SUFDekMsSUFBSSxDQUFTLENBQUM7SUFDZCxJQUFJLE9BQU8sR0FBYSxFQUFFLENBQUM7SUFDM0IsOEJBQThCO0lBQzlCLE1BQU0sQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzlCLGlDQUFpQztJQUNqQyxPQUFPLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUN0RCxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7UUFDbkMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNuQztJQUNELE9BQU87UUFDTCxRQUFRLEVBQUUsTUFBTSxDQUFDLFFBQVE7UUFDekIsSUFBSSxFQUFFLE1BQU0sQ0FBQyxJQUFJO1FBQ2pCLFFBQVEsRUFBRSxNQUFNLENBQUMsUUFBUTtRQUN6QixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7UUFDakIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO1FBQ3pCLE1BQU0sRUFBRSxNQUFNLENBQUMsTUFBTTtRQUNyQixZQUFZLEVBQUUsWUFBWTtRQUMxQixJQUFJLEVBQUUsTUFBTSxDQUFDLElBQUk7UUFDakIsU0FBUyxFQUFFLE1BQU0sQ0FBQyxRQUFRLEdBQUcsSUFBSSxHQUFHLE1BQU0sQ0FBQyxJQUFJO0tBQ2hELENBQUM7QUFDSixDQUFDLENBQUM7QUFFRjs7R0FFRztBQUNILE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRyxHQUFHO0lBQ3JCLE1BQU0sQ0FBQyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDekMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUM7SUFFckIsQ0FBQyxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDekIsTUFBTSxDQUFDLEdBQUcsUUFBUSxDQUFDLG9CQUFvQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ25ELE1BQU0sQ0FBQyxnQkFBZ0I7UUFDckIsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FDdkIsTUFBTSxFQUNOO1lBQ0UsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2xDLENBQUMsRUFDRCxDQUFDLENBQUMsQ0FDSDtRQUNELENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVztZQUNsQixDQUFDLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7Z0JBQzdCLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUM7WUFDRixDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHO2dCQUNqQixDQUFDLENBQUMsVUFBVSxDQUFDLFlBQVksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7QUFDVCxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRztJQUN0QixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ3pDLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHO0lBQ3RCLElBQUksR0FBVyxFQUFFLENBQVMsQ0FBQztJQUUzQixJQUFJLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDaEIsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ2hDLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUN0QyxNQUFNLElBQUksQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbkM7SUFFRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLElBQUksR0FBRztJQUN0QixJQUFJLENBQVMsQ0FBQztJQUNkLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzFDLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNkLEtBQUssQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNqQyxJQUFJLElBQUksTUFBTSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7S0FDckQ7SUFFRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsVUFBVSxHQUFHO0lBQzVCLE9BQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RELENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsS0FBSyxHQUFHO0lBQ3ZCLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsVUFBVSxDQUFNO1FBQy9DLE9BQU8sTUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7SUFDL0YsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQVMsRUFBRSxlQUErQjtJQUM5RSxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO1FBQ3BCLE9BQU8sSUFBSSxDQUFDO0tBQ2I7SUFDRCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxxQkFBcUI7SUFDOUQsT0FBTyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsU0FBUyxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxVQUFVLENBQUM7QUFDdEcsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxPQUFPLEdBQUc7SUFDekIsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLE9BQU8sSUFBSSxJQUFJLFdBQVcsRUFBRTtRQUM5QyxPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQzFDO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsU0FBUyxDQUFDLFVBQVUsR0FBRyxVQUF3QixLQUFlLEVBQUUsV0FBbUI7SUFDeEYsNERBQTREO0lBQzVELElBQUksR0FBRyxHQUFHLElBQUksQ0FBQztJQUNmLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNoQixHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDdEMsQ0FBQyxDQUFDLENBQUM7SUFDSCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUFHO0lBQ2hDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDO1FBQ3BDLHVDQUF1QztRQUN2QyxPQUFPLENBQUMsQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0lBQ3BFLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLGdCQUFnQixHQUFHLFVBQVUsR0FBRztJQUNyQyxPQUFPLENBQUMsR0FBRyxHQUFHLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsVUFBVSxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUIsT0FBTyxNQUFNLENBQUMsWUFBWSxDQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLFNBQVMsQ0FBQyxhQUFhLEdBQUcsVUFBVSxVQUFVO0lBQ25ELE9BQU8sVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xELENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIEB0eXBlc2NyaXB0LWVzbGludC9uby12YXItcmVxdWlyZXMgKi9cbi8qIGVzbGludC1kaXNhYmxlIHByZWZlci1yZXN0LXBhcmFtcyAqL1xuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L3RyaXBsZS1zbGFzaC1yZWZlcmVuY2UgKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJTdHJpbmcuZC50c1wiIC8+XG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZ2xvYmFscy5kLnRzXCIgLz5cblxuU3RyaW5nLnByb3RvdHlwZS5wcmludGYgPSBmdW5jdGlvbiAob2JqKSB7XG4gIC8qY29uc3QgaXNOb2RlID0gbmV3IEZ1bmN0aW9uKFxuICAgIFwidHJ5IHtyZXR1cm4gdGhpcz09PWdsb2JhbDt9Y2F0Y2goZSl7cmV0dXJuIGZhbHNlO31cIlxuICApO1xuXG4gIGlmIChpc05vZGUoKSkge1xuICAgIGNvbnN0IHV0aWwgPSByZXF1aXJlKFwidXRpbFwiKTtcbiAgICByZXR1cm4gdXRpbC5mb3JtYXQodGhpcywgb2JqKTtcbiAgfSovXG5cbiAgbGV0IHVzZUFyZ3VtZW50cyA9IGZhbHNlO1xuICBjb25zdCBfYXJndW1lbnRzID0gYXJndW1lbnRzO1xuICBsZXQgaSA9IC0xO1xuICBpZiAodHlwZW9mIF9hcmd1bWVudHNbMF0gPT0gXCJzdHJpbmdcIikge1xuICAgIHVzZUFyZ3VtZW50cyA9IHRydWU7XG4gIH1cbiAgaWYgKG9iaiBpbnN0YW5jZW9mIEFycmF5IHx8IHVzZUFyZ3VtZW50cykge1xuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICBpKys7XG4gICAgICBpZiAodXNlQXJndW1lbnRzKSB7XG4gICAgICAgIGlmICh0eXBlb2YgX2FyZ3VtZW50c1tpXSA9PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgcmV0dXJuIF9hcmd1bWVudHNbaV07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQXJndW1lbnRzIGVsZW1lbnQgaXMgYW4gaW52YWxpZCB0eXBlXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gb2JqW2ldO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL3soW157fV0qKX0vZywgZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgIGNvbnN0IHIgPSBvYmpbYl07XG4gICAgICByZXR1cm4gdHlwZW9mIHIgPT09IFwic3RyaW5nXCIgfHwgdHlwZW9mIHIgPT09IFwibnVtYmVyXCIgPyByIDogYTtcbiAgICB9KTtcbiAgfVxufTtcblxuU3RyaW5nLnByb3RvdHlwZS5wYXJzZV91cmwgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHBhcnNlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJhXCIpO1xuICBsZXQgc2VhcmNoT2JqZWN0OiBBcnJheTxSZWNvcmQ8YW55LCBhbnk+IHwgYW55PjtcbiAgbGV0IHNwbGl0OiBBcnJheTxSZWNvcmQ8YW55LCBhbnk+IHwgYW55PjtcbiAgbGV0IGk6IG51bWJlcjtcbiAgbGV0IHF1ZXJpZXM6IHN0cmluZ1tdID0gW107XG4gIC8vIExldCB0aGUgYnJvd3NlciBkbyB0aGUgd29ya1xuICBwYXJzZXIuaHJlZiA9IHRoaXMudG9TdHJpbmcoKTtcbiAgLy8gQ29udmVydCBxdWVyeSBzdHJpbmcgdG8gb2JqZWN0XG4gIHF1ZXJpZXMgPSBwYXJzZXIuc2VhcmNoLnJlcGxhY2UoL15cXD8vLCBcIlwiKS5zcGxpdChcIiZcIik7XG4gIGZvciAoaSA9IDA7IGkgPCBxdWVyaWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgc3BsaXQgPSBxdWVyaWVzW2ldLnNwbGl0KFwiPVwiKTtcbiAgICBzZWFyY2hPYmplY3Rbc3BsaXRbMF1dID0gc3BsaXRbMV07XG4gIH1cbiAgcmV0dXJuIHtcbiAgICBwcm90b2NvbDogcGFyc2VyLnByb3RvY29sLFxuICAgIGhvc3Q6IHBhcnNlci5ob3N0LFxuICAgIGhvc3RuYW1lOiBwYXJzZXIuaG9zdG5hbWUsXG4gICAgcG9ydDogcGFyc2VyLnBvcnQsXG4gICAgcGF0aG5hbWU6IHBhcnNlci5wYXRobmFtZSxcbiAgICBzZWFyY2g6IHBhcnNlci5zZWFyY2gsXG4gICAgc2VhcmNoT2JqZWN0OiBzZWFyY2hPYmplY3QsXG4gICAgaGFzaDogcGFyc2VyLmhhc2gsXG4gICAgcHJvdG9ob3N0OiBwYXJzZXIucHJvdG9jb2wgKyBcIi8vXCIgKyBwYXJzZXIuaG9zdCxcbiAgfTtcbn07XG5cbi8qKlxuICogTG9hZCBjc3NcbiAqL1xuU3RyaW5nLnByb3RvdHlwZS5DU1MgPSBmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcbiAgZS5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuICBlLmhyZWYgPSB0aGlzLnRvU3RyaW5nKCk7XG4gIGNvbnN0IG4gPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImhlYWRcIilbMF07XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgPyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcbiAgICAgIFwibG9hZFwiLFxuICAgICAgZnVuY3Rpb24gKCkge1xuICAgICAgICBuLnBhcmVudE5vZGUuaW5zZXJ0QmVmb3JlKGUsIG4pO1xuICAgICAgfSxcbiAgICAgICExXG4gICAgKVxuICAgIDogd2luZG93LmF0dGFjaEV2ZW50XG4gICAgICA/IHdpbmRvdy5hdHRhY2hFdmVudChcIm9ubG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIG4ucGFyZW50Tm9kZS5pbnNlcnRCZWZvcmUoZSwgbik7XG4gICAgICB9KVxuICAgICAgOiAod2luZG93Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbi5wYXJlbnROb2RlLmluc2VydEJlZm9yZShlLCBuKTtcbiAgICAgIH0pO1xufTtcblxuU3RyaW5nLnByb3RvdHlwZS50cmltID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nbSwgXCJcIik7XG59O1xuXG5TdHJpbmcucHJvdG90eXBlLmhleEUgPSBmdW5jdGlvbiAoKSB7XG4gIGxldCBoZXg6IHN0cmluZywgaTogbnVtYmVyO1xuXG4gIGxldCByZXN1bHQgPSBcIlwiO1xuICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuICAgIGhleCA9IHRoaXMuY2hhckNvZGVBdChpKS50b1N0cmluZygxNik7XG4gICAgcmVzdWx0ICs9IChcIjAwMFwiICsgaGV4KS5zbGljZSgtNCk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuU3RyaW5nLnByb3RvdHlwZS5oZXhEID0gZnVuY3Rpb24gKCkge1xuICBsZXQgajogbnVtYmVyO1xuICBjb25zdCBoZXhlcyA9IHRoaXMubWF0Y2goLy57MSw0fS9nKSB8fCBbXTtcbiAgbGV0IGJhY2sgPSBcIlwiO1xuICBmb3IgKGogPSAwOyBqIDwgaGV4ZXMubGVuZ3RoOyBqKyspIHtcbiAgICBiYWNrICs9IFN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQoaGV4ZXNbal0sIDE2KSk7XG4gIH1cblxuICByZXR1cm4gYmFjaztcbn07XG5cblN0cmluZy5wcm90b3R5cGUuY2FwaXRhbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0aGlzLnNsaWNlKDEpO1xufTtcblxuU3RyaW5nLnByb3RvdHlwZS5yb3QxMyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMucmVwbGFjZSgvW2EtekEtWl0vZywgZnVuY3Rpb24gKGM6IGFueSkge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKChjIDw9IFwiWlwiID8gOTAgOiAxMjIpID49IChjID0gYy5jaGFyQ29kZUF0KDApICsgMTMpID8gYyA6IGMgLSAyNik7XG4gIH0pO1xufTtcblxuU3RyaW5nLnByb3RvdHlwZS50cnVuY2F0ZSA9IGZ1bmN0aW9uIChuOiBudW1iZXIsIHVzZVdvcmRCb3VuZGFyeTogYm9vbGVhbiB8IG51bGwpIHtcbiAgaWYgKHRoaXMubGVuZ3RoIDw9IG4pIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuICBjb25zdCBzdWJTdHJpbmcgPSB0aGlzLnN1YnN0cigwLCBuIC0gMSk7IC8vIHRoZSBvcmlnaW5hbCBjaGVja1xuICByZXR1cm4gKHVzZVdvcmRCb3VuZGFyeSA/IHN1YlN0cmluZy5zdWJzdHIoMCwgc3ViU3RyaW5nLmxhc3RJbmRleE9mKFwiIFwiKSkgOiBzdWJTdHJpbmcpICsgXCImaGVsbGlwO1wiO1xufTtcblxuU3RyaW5nLnByb3RvdHlwZS5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICBpZiAodGhpcyAhPSBudWxsIHx8IHR5cGVvZiB0aGlzICE9IFwidW5kZWZpbmVkXCIpIHtcbiAgICByZXR1cm4gdGhpcy5sZW5ndGggPT09IDAgfHwgIXRoaXMudHJpbSgpO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn07XG5cblN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFyciA9IGZ1bmN0aW9uICh0aGlzOiBzdHJpbmcsIGFycmF5OiBzdHJpbmdbXSwgcmVwbGFjZW1lbnQ6IHN0cmluZykge1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXRoaXMtYWxpYXNcbiAgbGV0IG9yaSA9IHRoaXM7XG4gIGFycmF5Lm1hcCgoc3RyKSA9PiB7XG4gICAgb3JpID0gb3JpLnJlcGxhY2Uoc3RyLCByZXBsYWNlbWVudCk7XG4gIH0pO1xuICByZXR1cm4gb3JpO1xufTtcblxuU3RyaW5nLnByb3RvdHlwZS50b0h0bWxFbnRpdGllcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMucmVwbGFjZSgvLi9nbSwgZnVuY3Rpb24gKHMpIHtcbiAgICAvLyByZXR1cm4gXCImI1wiICsgcy5jaGFyQ29kZUF0KDApICsgXCI7XCI7XG4gICAgcmV0dXJuIHMubWF0Y2goL1thLXowLTlcXHNdKy9pKSA/IHMgOiBcIiYjXCIgKyBzLmNoYXJDb2RlQXQoMCkgKyBcIjtcIjtcbiAgfSk7XG59O1xuXG5TdHJpbmcuZnJvbUh0bWxFbnRpdGllcyA9IGZ1bmN0aW9uIChzdHIpIHtcbiAgcmV0dXJuIChzdHIgKyBcIlwiKS5yZXBsYWNlKC8mI1xcZCs7L2dtLCBmdW5jdGlvbiAocykge1xuICAgIGNvbnN0IG0gPSBzLm1hdGNoKC9cXGQrL2dtKVswXTtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSg8YW55Pm0pO1xuICB9KTtcbn07XG5cblN0cmluZy5wcm90b3R5cGUuaW5jbHVkZXNBcnJheSA9IGZ1bmN0aW9uIChzdWJzdHJpbmdzKSB7XG4gIHJldHVybiBzdWJzdHJpbmdzLnNvbWUoKHYpID0+IHRoaXMuaW5jbHVkZXModikpO1xufTtcbiJdfQ==