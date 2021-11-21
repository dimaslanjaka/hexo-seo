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
