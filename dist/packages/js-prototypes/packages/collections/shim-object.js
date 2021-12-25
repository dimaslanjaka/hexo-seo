"use strict";
var WeakMap = require("./weak-map");
require("./shim-function");
module.exports = Object;
/*
    Based in part on extras from Motorola Mobility’s Montage
    Copyright (c) 2012, Motorola Mobility LLC. All Rights Reserved.
    3-Clause BSD License
    https://github.com/motorola-mobility/montage/blob/master/LICENSE.md
*/
/**
    Defines extensions to intrinsic <code>Object</code>.
    @see [Object class]{@link external:Object}
*/
/**
    A utility object to avoid unnecessary allocations of an empty object
    <code>{}</code>.  This object is frozen so it is safe to share.

    @object external:Object.empty
*/
Object.empty = Object.freeze(Object.create(null));
/**
    Returns whether the given value is an object, as opposed to a value.
    Unboxed numbers, strings, true, false, undefined, and null are not
    objects.  Arrays are objects.

    @function external:Object.isObject
    @param {Any} value
    @returns {Boolean} whether the given value is an object
*/
Object.isObject = function (object) {
    return Object(object) === object;
};
/**
    Returns the value of an any value, particularly objects that
    implement <code>valueOf</code>.

    <p>Note that, unlike the precedent of methods like
    <code>Object.equals</code> and <code>Object.compare</code> would suggest,
    this method is named <code>Object.getValueOf</code> instead of
    <code>valueOf</code>.  This is a delicate issue, but the basis of this
    decision is that the JavaScript runtime would be far more likely to
    accidentally call this method with no arguments, assuming that it would
    return the value of <code>Object</code> itself in various situations,
    whereas <code>Object.equals(Object, null)</code> protects against this case
    by noting that <code>Object</code> owns the <code>equals</code> property
    and therefore does not delegate to it.

    @function external:Object.getValueOf
    @param {Any} value a value or object wrapping a value
    @returns {Any} the primitive value of that object, if one exists, or passes
    the value through
*/
Object.getValueOf = function (value) {
    if (value && typeof value.valueOf === "function") {
        value = value.valueOf();
    }
    return value;
};
var hashMap = new WeakMap();
Object.hash = function (object) {
    if (object && typeof object.hash === "function") {
        return "" + object.hash();
    }
    else if (Object(object) === object) {
        if (!hashMap.has(object)) {
            hashMap.set(object, Math.random().toString(36).slice(2));
        }
        return hashMap.get(object);
    }
    else {
        return "" + object;
    }
};
/**
    A shorthand for <code>Object.prototype.hasOwnProperty.call(object,
    key)</code>.  Returns whether the object owns a property for the given key.
    It does not consult the prototype chain and works for any string (including
    "hasOwnProperty") except "__proto__".

    @function external:Object.owns
    @param {Object} object
    @param {String} key
    @returns {Boolean} whether the object owns a property wfor the given key.
*/
var owns = Object.prototype.hasOwnProperty;
Object.owns = function (object, key) {
    return owns.call(object, key);
};
/**
    A utility that is like Object.owns but is also useful for finding
    properties on the prototype chain, provided that they do not refer to
    methods on the Object prototype.  Works for all strings except "__proto__".

    <p>Alternately, you could use the "in" operator as long as the object
    descends from "null" instead of the Object.prototype, as with
    <code>Object.create(null)</code>.  However,
    <code>Object.create(null)</code> only works in fully compliant EcmaScript 5
    JavaScript engines and cannot be faithfully shimmed.

    <p>If the given object is an instance of a type that implements a method
    named "has", this function defers to the collection, so this method can be
    used to generically handle objects, arrays, or other collections.  In that
    case, the domain of the key depends on the instance.

    @param {Object} object
    @param {String} key
    @returns {Boolean} whether the object, or any of its prototypes except
    <code>Object.prototype</code>
    @function external:Object.has
*/
Object.has = function (object, key) {
    if (typeof object !== "object") {
        throw new Error("Object.has can't accept non-object: " + typeof object);
    }
    // forward to mapped collections that implement "has"
    if (object && typeof object.has === "function") {
        return object.has(key);
        // otherwise report whether the key is on the prototype chain,
        // as long as it is not one of the methods on object.prototype
    }
    else if (typeof key === "string") {
        return key in object && object[key] !== Object.prototype[key];
    }
    else {
        throw new Error("Key must be a string for Object.has on plain objects");
    }
};
/**
    Gets the value for a corresponding key from an object.

    <p>Uses Object.has to determine whether there is a corresponding value for
    the given key.  As such, <code>Object.get</code> is capable of retriving
    values from the prototype chain as long as they are not from the
    <code>Object.prototype</code>.

    <p>If there is no corresponding value, returns the given default, which may
    be <code>undefined</code>.

    <p>If the given object is an instance of a type that implements a method
    named "get", this function defers to the collection, so this method can be
    used to generically handle objects, arrays, or other collections.  In that
    case, the domain of the key depends on the implementation.  For a `Map`,
    for example, the key might be any object.

    @param {Object} object
    @param {String} key
    @param {Any} value a default to return, <code>undefined</code> if omitted
    @returns {Any} value for key, or default value
    @function external:Object.get
*/
Object.get = function (object, key, value) {
    if (typeof object !== "object") {
        throw new Error("Object.get can't accept non-object: " + typeof object);
    }
    // forward to mapped collections that implement "get"
    if (object && typeof object.get === "function") {
        return object.get(key, value);
    }
    else if (Object.has(object, key)) {
        return object[key];
    }
    else {
        return value;
    }
};
/**
    Sets the value for a given key on an object.

    <p>If the given object is an instance of a type that implements a method
    named "set", this function defers to the collection, so this method can be
    used to generically handle objects, arrays, or other collections.  As such,
    the key domain varies by the object type.

    @param {Object} object
    @param {String} key
    @param {Any} value
    @returns <code>undefined</code>
    @function external:Object.set
*/
Object.set = function (object, key, value) {
    if (object && typeof object.set === "function") {
        object.set(key, value);
    }
    else {
        object[key] = value;
    }
};
Object.addEach = function (target, source, overrides) {
    var overridesExistingProperty = arguments.length === 3 ? overrides : true;
    if (!source) {
    }
    else if (typeof source.forEach === "function" && !source.hasOwnProperty("forEach")) {
        // copy map-alikes
        if (source.isMap === true) {
            source.forEach(function (value, key) {
                target[key] = value;
            });
            // iterate key value pairs of other iterables
        }
        else {
            source.forEach(function (pair) {
                target[pair[0]] = pair[1];
            });
        }
    }
    else if (typeof source.length === "number") {
        // arguments, strings
        for (var index = 0; index < source.length; index++) {
            target[index] = source[index];
        }
    }
    else {
        // copy other objects as map-alikes
        for (var keys = Object.keys(source), i = 0, key; (key = keys[i]); i++) {
            if (overridesExistingProperty || !Object.owns(target, key)) {
                target[key] = source[key];
            }
        }
    }
    return target;
};
/*
var defineEach = function defineEach(target, prototype) {
    // console.log("Map defineEach: ",Object.keys(prototype));
    var proto = Map.prototype;
    for (var name in prototype) {
        if(!proto.hasOwnProperty(name)) {
            Object.defineProperty(proto, name, {
                value: prototype[name],
                writable: writable,
                configurable: configurable,
                enumerable: enumerable
            });
        }
    }
}
*/
Object.defineEach = function (target, source, overrides, configurable, enumerable, writable) {
    var overridesExistingProperty = arguments.length === 3 ? overrides : true;
    if (!source) {
    }
    else if (typeof source.forEach === "function" && !source.hasOwnProperty("forEach")) {
        // copy map-alikes
        if (source.isMap === true) {
            source.forEach(function (value, key) {
                Object.defineProperty(target, key, {
                    value: value,
                    writable: writable,
                    configurable: configurable,
                    enumerable: enumerable
                });
            });
            // iterate key value pairs of other iterables
        }
        else {
            source.forEach(function (pair) {
                Object.defineProperty(target, pair[0], {
                    value: pair[1],
                    writable: writable,
                    configurable: configurable,
                    enumerable: enumerable
                });
            });
        }
    }
    else if (typeof source.length === "number") {
        // arguments, strings
        for (var index = 0; index < source.length; index++) {
            Object.defineProperty(target, index, {
                value: source[index],
                writable: writable,
                configurable: configurable,
                enumerable: enumerable
            });
        }
    }
    else {
        // copy other objects as map-alikes
        for (var keys = Object.keys(source), i = 0, key; (key = keys[i]); i++) {
            if (overridesExistingProperty || !Object.owns(target, key)) {
                Object.defineProperty(target, key, {
                    value: source[key],
                    writable: writable,
                    configurable: configurable,
                    enumerable: enumerable
                });
            }
        }
    }
    return target;
};
/**
    Iterates over the owned properties of an object.

    @function external:Object.forEach
    @param {Object} object an object to iterate.
    @param {Function} callback a function to call for every key and value
    pair in the object.  Receives <code>value</code>, <code>key</code>,
    and <code>object</code> as arguments.
    @param {Object} thisp the <code>this</code> to pass through to the
    callback
*/
Object.forEach = function (object, callback, thisp) {
    var keys = Object.keys(object), i = 0, iKey;
    for (; (iKey = keys[i]); i++) {
        callback.call(thisp, object[iKey], iKey, object);
    }
};
/**
    Iterates over the owned properties of a map, constructing a new array of
    mapped values.

    @function external:Object.map
    @param {Object} object an object to iterate.
    @param {Function} callback a function to call for every key and value
    pair in the object.  Receives <code>value</code>, <code>key</code>,
    and <code>object</code> as arguments.
    @param {Object} thisp the <code>this</code> to pass through to the
    callback
    @returns {Array} the respective values returned by the callback for each
    item in the object.
*/
Object.map = function (object, callback, thisp) {
    var keys = Object.keys(object), i = 0, result = [], iKey;
    for (; (iKey = keys[i]); i++) {
        result.push(callback.call(thisp, object[iKey], iKey, object));
    }
    return result;
};
/**
    Returns the values for owned properties of an object.

    @function external:Object.map
    @param {Object} object
    @returns {Array} the respective value for each owned property of the
    object.
*/
Object.values = function (object) {
    return Object.map(object, Function.identity);
};
// TODO inline document concat
Object.concat = function () {
    var object = {};
    for (var i = 0; i < arguments.length; i++) {
        Object.addEach(object, arguments[i]);
    }
    return object;
};
Object.from = Object.concat;
/**
    Returns whether two values are identical.  Any value is identical to itself
    and only itself.  This is much more restictive than equivalence and subtly
    different than strict equality, <code>===</code> because of edge cases
    including negative zero and <code>NaN</code>.  Identity is useful for
    resolving collisions among keys in a mapping where the domain is any value.
    This method does not delgate to any method on an object and cannot be
    overridden.
    @see http://wiki.ecmascript.org/doku.php?id=harmony:egal
    @param {Any} this
    @param {Any} that
    @returns {Boolean} whether this and that are identical
    @function external:Object.is
*/
Object.is = function (x, y) {
    if (x === y) {
        // 0 === -0, but they are not identical
        return x !== 0 || 1 / x === 1 / y;
    }
    // NaN !== NaN, but they are identical.
    // NaNs are the only non-reflexive value, i.e., if x !== x,
    // then x is a NaN.
    // isNaN is broken: it converts its argument to number, so
    // isNaN("foo") => true
    return x !== x && y !== y;
};
/**
    Performs a polymorphic, type-sensitive deep equivalence comparison of any
    two values.

    <p>As a basic principle, any value is equivalent to itself (as in
    identity), any boxed version of itself (as a <code>new Number(10)</code> is
    to 10), and any deep clone of itself.

    <p>Equivalence has the following properties:

    <ul>
        <li><strong>polymorphic:</strong>
            If the given object is an instance of a type that implements a
            methods named "equals", this function defers to the method.  So,
            this function can safely compare any values regardless of type,
            including undefined, null, numbers, strings, any pair of objects
            where either implements "equals", or object literals that may even
            contain an "equals" key.
        <li><strong>type-sensitive:</strong>
            Incomparable types are not equal.  No object is equivalent to any
            array.  No string is equal to any other number.
        <li><strong>deep:</strong>
            Collections with equivalent content are equivalent, recursively.
        <li><strong>equivalence:</strong>
            Identical values and objects are equivalent, but so are collections
            that contain equivalent content.  Whether order is important varies
            by type.  For Arrays and lists, order is important.  For Objects,
            maps, and sets, order is not important.  Boxed objects are mutally
            equivalent with their unboxed values, by virtue of the standard
            <code>valueOf</code> method.
    </ul>
    @param this
    @param that
    @returns {Boolean} whether the values are deeply equivalent
    @function external:Object.equals
*/
Object.equals = function (a, b, equals, memo) {
    equals = equals || Object.equals;
    //console.log("Object.equals: a:",a, "b:",b, "equals:",equals);
    // unbox objects, but do not confuse object literals
    a = Object.getValueOf(a);
    b = Object.getValueOf(b);
    if (a === b)
        return true;
    if (Object.isObject(a)) {
        memo = memo || new WeakMap();
        if (memo.has(a)) {
            return true;
        }
        memo.set(a, true);
    }
    if (Object.isObject(a) && typeof a.equals === "function") {
        return a.equals(b, equals, memo);
    }
    // commutative
    if (Object.isObject(b) && typeof b.equals === "function") {
        return b.equals(a, equals, memo);
    }
    if (Object.isObject(a) && Object.isObject(b)) {
        if (Object.getPrototypeOf(a) === Object.prototype && Object.getPrototypeOf(b) === Object.prototype) {
            for (var name in a) {
                if (!equals(a[name], b[name], equals, memo)) {
                    return false;
                }
            }
            for (var name in b) {
                if (!(name in a) || !equals(b[name], a[name], equals, memo)) {
                    return false;
                }
            }
            return true;
        }
    }
    // NaN !== NaN, but they are equal.
    // NaNs are the only non-reflexive value, i.e., if x !== x,
    // then x is a NaN.
    // isNaN is broken: it converts its argument to number, so
    // isNaN("foo") => true
    // We have established that a !== b, but if a !== a && b !== b, they are
    // both NaN.
    if (a !== a && b !== b)
        return true;
    if (!a || !b)
        return a === b;
    return false;
};
// Because a return value of 0 from a `compare` function  may mean either
// "equals" or "is incomparable", `equals` cannot be defined in terms of
// `compare`.  However, `compare` *can* be defined in terms of `equals` and
// `lessThan`.  Again however, more often it would be desirable to implement
// all of the comparison functions in terms of compare rather than the other
// way around.
/**
    Determines the order in which any two objects should be sorted by returning
    a number that has an analogous relationship to zero as the left value to
    the right.  That is, if the left is "less than" the right, the returned
    value will be "less than" zero, where "less than" may be any other
    transitive relationship.

    <p>Arrays are compared by the first diverging values, or by length.

    <p>Any two values that are incomparable return zero.  As such,
    <code>equals</code> should not be implemented with <code>compare</code>
    since incomparability is indistinguishable from equality.

    <p>Sorts strings lexicographically.  This is not suitable for any
    particular international setting.  Different locales sort their phone books
    in very different ways, particularly regarding diacritics and ligatures.

    <p>If the given object is an instance of a type that implements a method
    named "compare", this function defers to the instance.  The method does not
    need to be an owned property to distinguish it from an object literal since
    object literals are incomparable.  Unlike <code>Object</code> however,
    <code>Array</code> implements <code>compare</code>.

    @param {Any} left
    @param {Any} right
    @returns {Number} a value having the same transitive relationship to zero
    as the left and right values.
    @function external:Object.compare
*/
Object.compare = function (a, b) {
    // unbox objects, but do not confuse object literals
    // mercifully handles the Date case
    a = Object.getValueOf(a);
    b = Object.getValueOf(b);
    if (a === b)
        return 0;
    var aType = typeof a;
    var bType = typeof b;
    if (aType === "number" && bType === "number")
        return a - b;
    if (aType === "string" && bType === "string")
        return a < b ? -Infinity : Infinity;
    // the possibility of equality elimiated above
    if (a && typeof a.compare === "function")
        return a.compare(b);
    // not commutative, the relationship is reversed
    if (b && typeof b.compare === "function")
        return -b.compare(a);
    return 0;
};
/**
    Creates a deep copy of any value.  Values, being immutable, are
    returned without alternation.  Forwards to <code>clone</code> on
    objects and arrays.

    @function external:Object.clone
    @param {Any} value a value to clone
    @param {Number} depth an optional traversal depth, defaults to infinity.
    A value of <code>0</code> means to make no clone and return the value
    directly.
    @param {Map} memo an optional memo of already visited objects to preserve
    reference cycles.  The cloned object will have the exact same shape as the
    original, but no identical objects.  Te map may be later used to associate
    all objects in the original object graph with their corresponding member of
    the cloned graph.
    @returns a copy of the value
*/
Object.clone = function (value, depth, memo) {
    value = Object.getValueOf(value);
    memo = memo || new WeakMap();
    if (depth === undefined) {
        depth = Infinity;
    }
    else if (depth === 0) {
        return value;
    }
    if (Object.isObject(value)) {
        if (!memo.has(value)) {
            if (value && typeof value.clone === "function") {
                memo.set(value, value.clone(depth, memo));
            }
            else {
                var prototype = Object.getPrototypeOf(value);
                if (prototype === null || prototype === Object.prototype) {
                    var clone = Object.create(prototype);
                    memo.set(value, clone);
                    for (var key in value) {
                        clone[key] = Object.clone(value[key], depth - 1, memo);
                    }
                }
                else {
                    throw new Error("Can't clone " + value);
                }
            }
        }
        return memo.get(value);
    }
    return value;
};
/**
    Removes all properties owned by this object making the object suitable for
    reuse.

    @function external:Object.clear
    @returns this
*/
Object.clear = function (object) {
    if (object && typeof object.clear === "function") {
        object.clear();
    }
    else {
        var keys = Object.keys(object), i = keys.length;
        while (i) {
            i--;
            delete object[keys[i]];
        }
    }
    return object;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpbS1vYmplY3QuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2pzLXByb3RvdHlwZXMvcGFja2FnZXMvY29sbGVjdGlvbnMvc2hpbS1vYmplY3QuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsWUFBWSxDQUFDO0FBRWIsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDO0FBRXBDLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBRTNCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO0FBRXhCOzs7OztFQUtFO0FBRUY7OztFQUdFO0FBRUY7Ozs7O0VBS0U7QUFDRixNQUFNLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBRWxEOzs7Ozs7OztFQVFFO0FBQ0YsTUFBTSxDQUFDLFFBQVEsR0FBRyxVQUFVLE1BQU07SUFDOUIsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssTUFBTSxDQUFDO0FBQ3JDLENBQUMsQ0FBQztBQUVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0VBbUJFO0FBQ0YsTUFBTSxDQUFDLFVBQVUsR0FBRyxVQUFVLEtBQUs7SUFDL0IsSUFBSSxLQUFLLElBQUksT0FBTyxLQUFLLENBQUMsT0FBTyxLQUFLLFVBQVUsRUFBRTtRQUM5QyxLQUFLLEdBQUcsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDO0tBQzNCO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQyxDQUFDO0FBRUYsSUFBSSxPQUFPLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUM1QixNQUFNLENBQUMsSUFBSSxHQUFHLFVBQVUsTUFBTTtJQUMxQixJQUFJLE1BQU0sSUFBSSxPQUFPLE1BQU0sQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFFO1FBQzdDLE9BQU8sRUFBRSxHQUFHLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FB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LElBQUksQ0FBQyxNQUFNLENBQUMsRUFDMUIsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDcEIsT0FBTyxDQUFDLEVBQUU7WUFDTixDQUFDLEVBQUUsQ0FBQztZQUNKLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzFCO0tBQ0o7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNsQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIFdlYWtNYXAgPSByZXF1aXJlKFwiLi93ZWFrLW1hcFwiKTtcblxucmVxdWlyZShcIi4vc2hpbS1mdW5jdGlvblwiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Q7XG5cbi8qXG4gICAgQmFzZWQgaW4gcGFydCBvbiBleHRyYXMgZnJvbSBNb3Rvcm9sYSBNb2JpbGl0eeKAmXMgTW9udGFnZVxuICAgIENvcHlyaWdodCAoYykgMjAxMiwgTW90b3JvbGEgTW9iaWxpdHkgTExDLiBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICAgIDMtQ2xhdXNlIEJTRCBMaWNlbnNlXG4gICAgaHR0cHM6Ly9naXRodWIuY29tL21vdG9yb2xhLW1vYmlsaXR5L21vbnRhZ2UvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuKi9cblxuLyoqXG4gICAgRGVmaW5lcyBleHRlbnNpb25zIHRvIGludHJpbnNpYyA8Y29kZT5PYmplY3Q8L2NvZGU+LlxuICAgIEBzZWUgW09iamVjdCBjbGFzc117QGxpbmsgZXh0ZXJuYWw6T2JqZWN0fVxuKi9cblxuLyoqXG4gICAgQSB1dGlsaXR5IG9iamVjdCB0byBhdm9pZCB1bm5lY2Vzc2FyeSBhbGxvY2F0aW9ucyBvZiBhbiBlbXB0eSBvYmplY3RcbiAgICA8Y29kZT57fTwvY29kZT4uICBUaGlzIG9iamVjdCBpcyBmcm96ZW4gc28gaXQgaXMgc2FmZSB0byBzaGFyZS5cblxuICAgIEBvYmplY3QgZXh0ZXJuYWw6T2JqZWN0LmVtcHR5XG4qL1xuT2JqZWN0LmVtcHR5ID0gT2JqZWN0LmZyZWV6ZShPYmplY3QuY3JlYXRlKG51bGwpKTtcblxuLyoqXG4gICAgUmV0dXJucyB3aGV0aGVyIHRoZSBnaXZlbiB2YWx1ZSBpcyBhbiBvYmplY3QsIGFzIG9wcG9zZWQgdG8gYSB2YWx1ZS5cbiAgICBVbmJveGVkIG51bWJlcnMsIHN0cmluZ3MsIHRydWUsIGZhbHNlLCB1bmRlZmluZWQsIGFuZCBudWxsIGFyZSBub3RcbiAgICBvYmplY3RzLiAgQXJyYXlzIGFyZSBvYmplY3RzLlxuXG4gICAgQGZ1bmN0aW9uIGV4dGVybmFsOk9iamVjdC5pc09iamVjdFxuICAgIEBwYXJhbSB7QW55fSB2YWx1ZVxuICAgIEByZXR1cm5zIHtCb29sZWFufSB3aGV0aGVyIHRoZSBnaXZlbiB2YWx1ZSBpcyBhbiBvYmplY3RcbiovXG5PYmplY3QuaXNPYmplY3QgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdChvYmplY3QpID09PSBvYmplY3Q7XG59O1xuXG4vKipcbiAgICBSZXR1cm5zIHRoZSB2YWx1ZSBvZiBhbiBhbnkgdmFsdWUsIHBhcnRpY3VsYXJseSBvYmplY3RzIHRoYXRcbiAgICBpbXBsZW1lbnQgPGNvZGU+dmFsdWVPZjwvY29kZT4uXG5cbiAgICA8cD5Ob3RlIHRoYXQsIHVubGlrZSB0aGUgcHJlY2VkZW50IG9mIG1ldGhvZHMgbGlrZVxuICAgIDxjb2RlPk9iamVjdC5lcXVhbHM8L2NvZGU+IGFuZCA8Y29kZT5PYmplY3QuY29tcGFyZTwvY29kZT4gd291bGQgc3VnZ2VzdCxcbiAgICB0aGlzIG1ldGhvZCBpcyBuYW1lZCA8Y29kZT5PYmplY3QuZ2V0VmFsdWVPZjwvY29kZT4gaW5zdGVhZCBvZlxuICAgIDxjb2RlPnZhbHVlT2Y8L2NvZGU+LiAgVGhpcyBpcyBhIGRlbGljYXRlIGlzc3VlLCBidXQgdGhlIGJhc2lzIG9mIHRoaXNcbiAgICBkZWNpc2lvbiBpcyB0aGF0IHRoZSBKYXZhU2NyaXB0IHJ1bnRpbWUgd291bGQgYmUgZmFyIG1vcmUgbGlrZWx5IHRvXG4gICAgYWNjaWRlbnRhbGx5IGNhbGwgdGhpcyBtZXRob2Qgd2l0aCBubyBhcmd1bWVudHMsIGFzc3VtaW5nIHRoYXQgaXQgd291bGRcbiAgICByZXR1cm4gdGhlIHZhbHVlIG9mIDxjb2RlPk9iamVjdDwvY29kZT4gaXRzZWxmIGluIHZhcmlvdXMgc2l0dWF0aW9ucyxcbiAgICB3aGVyZWFzIDxjb2RlPk9iamVjdC5lcXVhbHMoT2JqZWN0LCBudWxsKTwvY29kZT4gcHJvdGVjdHMgYWdhaW5zdCB0aGlzIGNhc2VcbiAgICBieSBub3RpbmcgdGhhdCA8Y29kZT5PYmplY3Q8L2NvZGU+IG93bnMgdGhlIDxjb2RlPmVxdWFsczwvY29kZT4gcHJvcGVydHlcbiAgICBhbmQgdGhlcmVmb3JlIGRvZXMgbm90IGRlbGVnYXRlIHRvIGl0LlxuXG4gICAgQGZ1bmN0aW9uIGV4dGVybmFsOk9iamVjdC5nZXRWYWx1ZU9mXG4gICAgQHBhcmFtIHtBbnl9IHZhbHVlIGEgdmFsdWUgb3Igb2JqZWN0IHdyYXBwaW5nIGEgdmFsdWVcbiAgICBAcmV0dXJucyB7QW55fSB0aGUgcHJpbWl0aXZlIHZhbHVlIG9mIHRoYXQgb2JqZWN0LCBpZiBvbmUgZXhpc3RzLCBvciBwYXNzZXNcbiAgICB0aGUgdmFsdWUgdGhyb3VnaFxuKi9cbk9iamVjdC5nZXRWYWx1ZU9mID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS52YWx1ZU9mKCk7XG4gICAgfVxuICAgIHJldHVybiB2YWx1ZTtcbn07XG5cbnZhciBoYXNoTWFwID0gbmV3IFdlYWtNYXAoKTtcbk9iamVjdC5oYXNoID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdC5oYXNoID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIFwiXCIgKyBvYmplY3QuaGFzaCgpO1xuICAgIH0gZWxzZSBpZiAoT2JqZWN0KG9iamVjdCkgPT09IG9iamVjdCkge1xuICAgICAgICBpZiAoIWhhc2hNYXAuaGFzKG9iamVjdCkpIHtcbiAgICAgICAgICAgIGhhc2hNYXAuc2V0KG9iamVjdCwgTWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc2xpY2UoMikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBoYXNoTWFwLmdldChvYmplY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBcIlwiICsgb2JqZWN0O1xuICAgIH1cbn07XG5cbi8qKlxuICAgIEEgc2hvcnRoYW5kIGZvciA8Y29kZT5PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LFxuICAgIGtleSk8L2NvZGU+LiAgUmV0dXJucyB3aGV0aGVyIHRoZSBvYmplY3Qgb3ducyBhIHByb3BlcnR5IGZvciB0aGUgZ2l2ZW4ga2V5LlxuICAgIEl0IGRvZXMgbm90IGNvbnN1bHQgdGhlIHByb3RvdHlwZSBjaGFpbiBhbmQgd29ya3MgZm9yIGFueSBzdHJpbmcgKGluY2x1ZGluZ1xuICAgIFwiaGFzT3duUHJvcGVydHlcIikgZXhjZXB0IFwiX19wcm90b19fXCIuXG5cbiAgICBAZnVuY3Rpb24gZXh0ZXJuYWw6T2JqZWN0Lm93bnNcbiAgICBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gICAgQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgIEByZXR1cm5zIHtCb29sZWFufSB3aGV0aGVyIHRoZSBvYmplY3Qgb3ducyBhIHByb3BlcnR5IHdmb3IgdGhlIGdpdmVuIGtleS5cbiovXG52YXIgb3ducyA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5PYmplY3Qub3ducyA9IGZ1bmN0aW9uIChvYmplY3QsIGtleSkge1xuICAgIHJldHVybiBvd25zLmNhbGwob2JqZWN0LCBrZXkpO1xufTtcblxuLyoqXG4gICAgQSB1dGlsaXR5IHRoYXQgaXMgbGlrZSBPYmplY3Qub3ducyBidXQgaXMgYWxzbyB1c2VmdWwgZm9yIGZpbmRpbmdcbiAgICBwcm9wZXJ0aWVzIG9uIHRoZSBwcm90b3R5cGUgY2hhaW4sIHByb3ZpZGVkIHRoYXQgdGhleSBkbyBub3QgcmVmZXIgdG9cbiAgICBtZXRob2RzIG9uIHRoZSBPYmplY3QgcHJvdG90eXBlLiAgV29ya3MgZm9yIGFsbCBzdHJpbmdzIGV4Y2VwdCBcIl9fcHJvdG9fX1wiLlxuXG4gICAgPHA+QWx0ZXJuYXRlbHksIHlvdSBjb3VsZCB1c2UgdGhlIFwiaW5cIiBvcGVyYXRvciBhcyBsb25nIGFzIHRoZSBvYmplY3RcbiAgICBkZXNjZW5kcyBmcm9tIFwibnVsbFwiIGluc3RlYWQgb2YgdGhlIE9iamVjdC5wcm90b3R5cGUsIGFzIHdpdGhcbiAgICA8Y29kZT5PYmplY3QuY3JlYXRlKG51bGwpPC9jb2RlPi4gIEhvd2V2ZXIsXG4gICAgPGNvZGU+T2JqZWN0LmNyZWF0ZShudWxsKTwvY29kZT4gb25seSB3b3JrcyBpbiBmdWxseSBjb21wbGlhbnQgRWNtYVNjcmlwdCA1XG4gICAgSmF2YVNjcmlwdCBlbmdpbmVzIGFuZCBjYW5ub3QgYmUgZmFpdGhmdWxseSBzaGltbWVkLlxuXG4gICAgPHA+SWYgdGhlIGdpdmVuIG9iamVjdCBpcyBhbiBpbnN0YW5jZSBvZiBhIHR5cGUgdGhhdCBpbXBsZW1lbnRzIGEgbWV0aG9kXG4gICAgbmFtZWQgXCJoYXNcIiwgdGhpcyBmdW5jdGlvbiBkZWZlcnMgdG8gdGhlIGNvbGxlY3Rpb24sIHNvIHRoaXMgbWV0aG9kIGNhbiBiZVxuICAgIHVzZWQgdG8gZ2VuZXJpY2FsbHkgaGFuZGxlIG9iamVjdHMsIGFycmF5cywgb3Igb3RoZXIgY29sbGVjdGlvbnMuICBJbiB0aGF0XG4gICAgY2FzZSwgdGhlIGRvbWFpbiBvZiB0aGUga2V5IGRlcGVuZHMgb24gdGhlIGluc3RhbmNlLlxuXG4gICAgQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAgIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICBAcmV0dXJucyB7Qm9vbGVhbn0gd2hldGhlciB0aGUgb2JqZWN0LCBvciBhbnkgb2YgaXRzIHByb3RvdHlwZXMgZXhjZXB0XG4gICAgPGNvZGU+T2JqZWN0LnByb3RvdHlwZTwvY29kZT5cbiAgICBAZnVuY3Rpb24gZXh0ZXJuYWw6T2JqZWN0Lmhhc1xuKi9cbk9iamVjdC5oYXMgPSBmdW5jdGlvbiAob2JqZWN0LCBrZXkpIHtcbiAgICBpZiAodHlwZW9mIG9iamVjdCAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPYmplY3QuaGFzIGNhbid0IGFjY2VwdCBub24tb2JqZWN0OiBcIiArIHR5cGVvZiBvYmplY3QpO1xuICAgIH1cbiAgICAvLyBmb3J3YXJkIHRvIG1hcHBlZCBjb2xsZWN0aW9ucyB0aGF0IGltcGxlbWVudCBcImhhc1wiXG4gICAgaWYgKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0LmhhcyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QuaGFzKGtleSk7XG4gICAgLy8gb3RoZXJ3aXNlIHJlcG9ydCB3aGV0aGVyIHRoZSBrZXkgaXMgb24gdGhlIHByb3RvdHlwZSBjaGFpbixcbiAgICAvLyBhcyBsb25nIGFzIGl0IGlzIG5vdCBvbmUgb2YgdGhlIG1ldGhvZHMgb24gb2JqZWN0LnByb3RvdHlwZVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIGtleSA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgICByZXR1cm4ga2V5IGluIG9iamVjdCAmJiBvYmplY3Rba2V5XSAhPT0gT2JqZWN0LnByb3RvdHlwZVtrZXldO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIktleSBtdXN0IGJlIGEgc3RyaW5nIGZvciBPYmplY3QuaGFzIG9uIHBsYWluIG9iamVjdHNcIik7XG4gICAgfVxufTtcblxuLyoqXG4gICAgR2V0cyB0aGUgdmFsdWUgZm9yIGEgY29ycmVzcG9uZGluZyBrZXkgZnJvbSBhbiBvYmplY3QuXG5cbiAgICA8cD5Vc2VzIE9iamVjdC5oYXMgdG8gZGV0ZXJtaW5lIHdoZXRoZXIgdGhlcmUgaXMgYSBjb3JyZXNwb25kaW5nIHZhbHVlIGZvclxuICAgIHRoZSBnaXZlbiBrZXkuICBBcyBzdWNoLCA8Y29kZT5PYmplY3QuZ2V0PC9jb2RlPiBpcyBjYXBhYmxlIG9mIHJldHJpdmluZ1xuICAgIHZhbHVlcyBmcm9tIHRoZSBwcm90b3R5cGUgY2hhaW4gYXMgbG9uZyBhcyB0aGV5IGFyZSBub3QgZnJvbSB0aGVcbiAgICA8Y29kZT5PYmplY3QucHJvdG90eXBlPC9jb2RlPi5cblxuICAgIDxwPklmIHRoZXJlIGlzIG5vIGNvcnJlc3BvbmRpbmcgdmFsdWUsIHJldHVybnMgdGhlIGdpdmVuIGRlZmF1bHQsIHdoaWNoIG1heVxuICAgIGJlIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4uXG5cbiAgICA8cD5JZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIGluc3RhbmNlIG9mIGEgdHlwZSB0aGF0IGltcGxlbWVudHMgYSBtZXRob2RcbiAgICBuYW1lZCBcImdldFwiLCB0aGlzIGZ1bmN0aW9uIGRlZmVycyB0byB0aGUgY29sbGVjdGlvbiwgc28gdGhpcyBtZXRob2QgY2FuIGJlXG4gICAgdXNlZCB0byBnZW5lcmljYWxseSBoYW5kbGUgb2JqZWN0cywgYXJyYXlzLCBvciBvdGhlciBjb2xsZWN0aW9ucy4gIEluIHRoYXRcbiAgICBjYXNlLCB0aGUgZG9tYWluIG9mIHRoZSBrZXkgZGVwZW5kcyBvbiB0aGUgaW1wbGVtZW50YXRpb24uICBGb3IgYSBgTWFwYCxcbiAgICBmb3IgZXhhbXBsZSwgdGhlIGtleSBtaWdodCBiZSBhbnkgb2JqZWN0LlxuXG4gICAgQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAgIEBwYXJhbSB7U3RyaW5nfSBrZXlcbiAgICBAcGFyYW0ge0FueX0gdmFsdWUgYSBkZWZhdWx0IHRvIHJldHVybiwgPGNvZGU+dW5kZWZpbmVkPC9jb2RlPiBpZiBvbWl0dGVkXG4gICAgQHJldHVybnMge0FueX0gdmFsdWUgZm9yIGtleSwgb3IgZGVmYXVsdCB2YWx1ZVxuICAgIEBmdW5jdGlvbiBleHRlcm5hbDpPYmplY3QuZ2V0XG4qL1xuT2JqZWN0LmdldCA9IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgdmFsdWUpIHtcbiAgICBpZiAodHlwZW9mIG9iamVjdCAhPT0gXCJvYmplY3RcIikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJPYmplY3QuZ2V0IGNhbid0IGFjY2VwdCBub24tb2JqZWN0OiBcIiArIHR5cGVvZiBvYmplY3QpO1xuICAgIH1cbiAgICAvLyBmb3J3YXJkIHRvIG1hcHBlZCBjb2xsZWN0aW9ucyB0aGF0IGltcGxlbWVudCBcImdldFwiXG4gICAgaWYgKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0LmdldCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QuZ2V0KGtleSwgdmFsdWUpO1xuICAgIH0gZWxzZSBpZiAoT2JqZWN0LmhhcyhvYmplY3QsIGtleSkpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdFtrZXldO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG59O1xuXG4vKipcbiAgICBTZXRzIHRoZSB2YWx1ZSBmb3IgYSBnaXZlbiBrZXkgb24gYW4gb2JqZWN0LlxuXG4gICAgPHA+SWYgdGhlIGdpdmVuIG9iamVjdCBpcyBhbiBpbnN0YW5jZSBvZiBhIHR5cGUgdGhhdCBpbXBsZW1lbnRzIGEgbWV0aG9kXG4gICAgbmFtZWQgXCJzZXRcIiwgdGhpcyBmdW5jdGlvbiBkZWZlcnMgdG8gdGhlIGNvbGxlY3Rpb24sIHNvIHRoaXMgbWV0aG9kIGNhbiBiZVxuICAgIHVzZWQgdG8gZ2VuZXJpY2FsbHkgaGFuZGxlIG9iamVjdHMsIGFycmF5cywgb3Igb3RoZXIgY29sbGVjdGlvbnMuICBBcyBzdWNoLFxuICAgIHRoZSBrZXkgZG9tYWluIHZhcmllcyBieSB0aGUgb2JqZWN0IHR5cGUuXG5cbiAgICBAcGFyYW0ge09iamVjdH0gb2JqZWN0XG4gICAgQHBhcmFtIHtTdHJpbmd9IGtleVxuICAgIEBwYXJhbSB7QW55fSB2YWx1ZVxuICAgIEByZXR1cm5zIDxjb2RlPnVuZGVmaW5lZDwvY29kZT5cbiAgICBAZnVuY3Rpb24gZXh0ZXJuYWw6T2JqZWN0LnNldFxuKi9cbk9iamVjdC5zZXQgPSBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gICAgaWYgKG9iamVjdCAmJiB0eXBlb2Ygb2JqZWN0LnNldCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIG9iamVjdC5zZXQoa2V5LCB2YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgb2JqZWN0W2tleV0gPSB2YWx1ZTtcbiAgICB9XG59O1xuXG5PYmplY3QuYWRkRWFjaCA9IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSwgb3ZlcnJpZGVzKSB7XG4gICAgdmFyIG92ZXJyaWRlc0V4aXN0aW5nUHJvcGVydHkgPSBhcmd1bWVudHMubGVuZ3RoID09PSAzID8gb3ZlcnJpZGVzIDogdHJ1ZTtcbiAgICBpZiAoIXNvdXJjZSkge1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNvdXJjZS5mb3JFYWNoID09PSBcImZ1bmN0aW9uXCIgJiYgIXNvdXJjZS5oYXNPd25Qcm9wZXJ0eShcImZvckVhY2hcIikpIHtcbiAgICAgICAgLy8gY29weSBtYXAtYWxpa2VzXG4gICAgICAgIGlmIChzb3VyY2UuaXNNYXAgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHNvdXJjZS5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSB2YWx1ZTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAvLyBpdGVyYXRlIGtleSB2YWx1ZSBwYWlycyBvZiBvdGhlciBpdGVyYWJsZXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNvdXJjZS5mb3JFYWNoKGZ1bmN0aW9uIChwYWlyKSB7XG4gICAgICAgICAgICAgICAgdGFyZ2V0W3BhaXJbMF1dID0gcGFpclsxXTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2Ygc291cmNlLmxlbmd0aCA9PT0gXCJudW1iZXJcIikge1xuICAgICAgICAvLyBhcmd1bWVudHMsIHN0cmluZ3NcbiAgICAgICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IHNvdXJjZS5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgIHRhcmdldFtpbmRleF0gPSBzb3VyY2VbaW5kZXhdO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY29weSBvdGhlciBvYmplY3RzIGFzIG1hcC1hbGlrZXNcbiAgICAgICAgZm9yKHZhciBrZXlzID0gT2JqZWN0LmtleXMoc291cmNlKSwgaSA9IDAsIGtleTsoa2V5ID0ga2V5c1tpXSk7IGkrKykge1xuICAgICAgICAgICAgaWYob3ZlcnJpZGVzRXhpc3RpbmdQcm9wZXJ0eSB8fCAhT2JqZWN0Lm93bnModGFyZ2V0LGtleSkpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG59O1xuXG5cbi8qXG52YXIgZGVmaW5lRWFjaCA9IGZ1bmN0aW9uIGRlZmluZUVhY2godGFyZ2V0LCBwcm90b3R5cGUpIHtcbiAgICAvLyBjb25zb2xlLmxvZyhcIk1hcCBkZWZpbmVFYWNoOiBcIixPYmplY3Qua2V5cyhwcm90b3R5cGUpKTtcbiAgICB2YXIgcHJvdG8gPSBNYXAucHJvdG90eXBlO1xuICAgIGZvciAodmFyIG5hbWUgaW4gcHJvdG90eXBlKSB7XG4gICAgICAgIGlmKCFwcm90by5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3RvLCBuYW1lLCB7XG4gICAgICAgICAgICAgICAgdmFsdWU6IHByb3RvdHlwZVtuYW1lXSxcbiAgICAgICAgICAgICAgICB3cml0YWJsZTogd3JpdGFibGUsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBjb25maWd1cmFibGUsXG4gICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZW51bWVyYWJsZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG59XG4qL1xuT2JqZWN0LmRlZmluZUVhY2ggPSBmdW5jdGlvbiAodGFyZ2V0LCBzb3VyY2UsIG92ZXJyaWRlcywgY29uZmlndXJhYmxlLCBlbnVtZXJhYmxlLCB3cml0YWJsZSkge1xuICAgIHZhciBvdmVycmlkZXNFeGlzdGluZ1Byb3BlcnR5ID0gYXJndW1lbnRzLmxlbmd0aCA9PT0gMyA/IG92ZXJyaWRlcyA6IHRydWU7XG4gICAgaWYgKCFzb3VyY2UpIHtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBzb3VyY2UuZm9yRWFjaCA9PT0gXCJmdW5jdGlvblwiICYmICFzb3VyY2UuaGFzT3duUHJvcGVydHkoXCJmb3JFYWNoXCIpKSB7XG4gICAgICAgIC8vIGNvcHkgbWFwLWFsaWtlc1xuICAgICAgICBpZiAoc291cmNlLmlzTWFwID09PSB0cnVlKSB7XG4gICAgICAgICAgICBzb3VyY2UuZm9yRWFjaChmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWUsXG4gICAgICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB3cml0YWJsZSxcbiAgICAgICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiBjb25maWd1cmFibGUsXG4gICAgICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGVudW1lcmFibGVcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAvLyBpdGVyYXRlIGtleSB2YWx1ZSBwYWlycyBvZiBvdGhlciBpdGVyYWJsZXNcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHNvdXJjZS5mb3JFYWNoKGZ1bmN0aW9uIChwYWlyKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgcGFpclswXSwge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogcGFpclsxXSxcbiAgICAgICAgICAgICAgICAgICAgd3JpdGFibGU6IHdyaXRhYmxlLFxuICAgICAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGNvbmZpZ3VyYWJsZSxcbiAgICAgICAgICAgICAgICAgICAgZW51bWVyYWJsZTogZW51bWVyYWJsZVxuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0gZWxzZSBpZiAodHlwZW9mIHNvdXJjZS5sZW5ndGggPT09IFwibnVtYmVyXCIpIHtcbiAgICAgICAgLy8gYXJndW1lbnRzLCBzdHJpbmdzXG4gICAgICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBzb3VyY2UubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBpbmRleCwge1xuICAgICAgICAgICAgICAgIHZhbHVlOiBzb3VyY2VbaW5kZXhdLFxuICAgICAgICAgICAgICAgIHdyaXRhYmxlOiB3cml0YWJsZSxcbiAgICAgICAgICAgICAgICBjb25maWd1cmFibGU6IGNvbmZpZ3VyYWJsZSxcbiAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBlbnVtZXJhYmxlXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgLy8gY29weSBvdGhlciBvYmplY3RzIGFzIG1hcC1hbGlrZXNcbiAgICAgICAgZm9yKHZhciBrZXlzID0gT2JqZWN0LmtleXMoc291cmNlKSwgaSA9IDAsIGtleTsoa2V5ID0ga2V5c1tpXSk7IGkrKykge1xuICAgICAgICAgICAgaWYob3ZlcnJpZGVzRXhpc3RpbmdQcm9wZXJ0eSB8fCAhT2JqZWN0Lm93bnModGFyZ2V0LGtleSkpIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHNvdXJjZVtrZXldLFxuICAgICAgICAgICAgICAgICAgICB3cml0YWJsZTogd3JpdGFibGUsXG4gICAgICAgICAgICAgICAgICAgIGNvbmZpZ3VyYWJsZTogY29uZmlndXJhYmxlLFxuICAgICAgICAgICAgICAgICAgICBlbnVtZXJhYmxlOiBlbnVtZXJhYmxlXG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGFyZ2V0O1xufTtcblxuLyoqXG4gICAgSXRlcmF0ZXMgb3ZlciB0aGUgb3duZWQgcHJvcGVydGllcyBvZiBhbiBvYmplY3QuXG5cbiAgICBAZnVuY3Rpb24gZXh0ZXJuYWw6T2JqZWN0LmZvckVhY2hcbiAgICBAcGFyYW0ge09iamVjdH0gb2JqZWN0IGFuIG9iamVjdCB0byBpdGVyYXRlLlxuICAgIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIGEgZnVuY3Rpb24gdG8gY2FsbCBmb3IgZXZlcnkga2V5IGFuZCB2YWx1ZVxuICAgIHBhaXIgaW4gdGhlIG9iamVjdC4gIFJlY2VpdmVzIDxjb2RlPnZhbHVlPC9jb2RlPiwgPGNvZGU+a2V5PC9jb2RlPixcbiAgICBhbmQgPGNvZGU+b2JqZWN0PC9jb2RlPiBhcyBhcmd1bWVudHMuXG4gICAgQHBhcmFtIHtPYmplY3R9IHRoaXNwIHRoZSA8Y29kZT50aGlzPC9jb2RlPiB0byBwYXNzIHRocm91Z2ggdG8gdGhlXG4gICAgY2FsbGJhY2tcbiovXG5PYmplY3QuZm9yRWFjaCA9IGZ1bmN0aW9uIChvYmplY3QsIGNhbGxiYWNrLCB0aGlzcCkge1xuXG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpLCBpID0gMCwgaUtleTtcbiAgICBmb3IoOyhpS2V5ID0ga2V5c1tpXSk7aSsrKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc3AsIG9iamVjdFtpS2V5XSwgaUtleSwgb2JqZWN0KTtcbiAgICB9XG5cbn07XG5cbi8qKlxuICAgIEl0ZXJhdGVzIG92ZXIgdGhlIG93bmVkIHByb3BlcnRpZXMgb2YgYSBtYXAsIGNvbnN0cnVjdGluZyBhIG5ldyBhcnJheSBvZlxuICAgIG1hcHBlZCB2YWx1ZXMuXG5cbiAgICBAZnVuY3Rpb24gZXh0ZXJuYWw6T2JqZWN0Lm1hcFxuICAgIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgYW4gb2JqZWN0IHRvIGl0ZXJhdGUuXG4gICAgQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2sgYSBmdW5jdGlvbiB0byBjYWxsIGZvciBldmVyeSBrZXkgYW5kIHZhbHVlXG4gICAgcGFpciBpbiB0aGUgb2JqZWN0LiAgUmVjZWl2ZXMgPGNvZGU+dmFsdWU8L2NvZGU+LCA8Y29kZT5rZXk8L2NvZGU+LFxuICAgIGFuZCA8Y29kZT5vYmplY3Q8L2NvZGU+IGFzIGFyZ3VtZW50cy5cbiAgICBAcGFyYW0ge09iamVjdH0gdGhpc3AgdGhlIDxjb2RlPnRoaXM8L2NvZGU+IHRvIHBhc3MgdGhyb3VnaCB0byB0aGVcbiAgICBjYWxsYmFja1xuICAgIEByZXR1cm5zIHtBcnJheX0gdGhlIHJlc3BlY3RpdmUgdmFsdWVzIHJldHVybmVkIGJ5IHRoZSBjYWxsYmFjayBmb3IgZWFjaFxuICAgIGl0ZW0gaW4gdGhlIG9iamVjdC5cbiovXG5PYmplY3QubWFwID0gZnVuY3Rpb24gKG9iamVjdCwgY2FsbGJhY2ssIHRoaXNwKSB7XG4gICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpLCBpID0gMCwgcmVzdWx0ID0gW10sIGlLZXk7XG4gICAgZm9yKDsoaUtleSA9IGtleXNbaV0pO2krKykge1xuICAgICAgICByZXN1bHQucHVzaChjYWxsYmFjay5jYWxsKHRoaXNwLCBvYmplY3RbaUtleV0sIGlLZXksIG9iamVjdCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcblxuLyoqXG4gICAgUmV0dXJucyB0aGUgdmFsdWVzIGZvciBvd25lZCBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdC5cblxuICAgIEBmdW5jdGlvbiBleHRlcm5hbDpPYmplY3QubWFwXG4gICAgQHBhcmFtIHtPYmplY3R9IG9iamVjdFxuICAgIEByZXR1cm5zIHtBcnJheX0gdGhlIHJlc3BlY3RpdmUgdmFsdWUgZm9yIGVhY2ggb3duZWQgcHJvcGVydHkgb2YgdGhlXG4gICAgb2JqZWN0LlxuKi9cbk9iamVjdC52YWx1ZXMgPSBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5tYXAob2JqZWN0LCBGdW5jdGlvbi5pZGVudGl0eSk7XG59O1xuXG4vLyBUT0RPIGlubGluZSBkb2N1bWVudCBjb25jYXRcbk9iamVjdC5jb25jYXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG9iamVjdCA9IHt9O1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIE9iamVjdC5hZGRFYWNoKG9iamVjdCwgYXJndW1lbnRzW2ldKTtcbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbn07XG5cbk9iamVjdC5mcm9tID0gT2JqZWN0LmNvbmNhdDtcblxuLyoqXG4gICAgUmV0dXJucyB3aGV0aGVyIHR3byB2YWx1ZXMgYXJlIGlkZW50aWNhbC4gIEFueSB2YWx1ZSBpcyBpZGVudGljYWwgdG8gaXRzZWxmXG4gICAgYW5kIG9ubHkgaXRzZWxmLiAgVGhpcyBpcyBtdWNoIG1vcmUgcmVzdGljdGl2ZSB0aGFuIGVxdWl2YWxlbmNlIGFuZCBzdWJ0bHlcbiAgICBkaWZmZXJlbnQgdGhhbiBzdHJpY3QgZXF1YWxpdHksIDxjb2RlPj09PTwvY29kZT4gYmVjYXVzZSBvZiBlZGdlIGNhc2VzXG4gICAgaW5jbHVkaW5nIG5lZ2F0aXZlIHplcm8gYW5kIDxjb2RlPk5hTjwvY29kZT4uICBJZGVudGl0eSBpcyB1c2VmdWwgZm9yXG4gICAgcmVzb2x2aW5nIGNvbGxpc2lvbnMgYW1vbmcga2V5cyBpbiBhIG1hcHBpbmcgd2hlcmUgdGhlIGRvbWFpbiBpcyBhbnkgdmFsdWUuXG4gICAgVGhpcyBtZXRob2QgZG9lcyBub3QgZGVsZ2F0ZSB0byBhbnkgbWV0aG9kIG9uIGFuIG9iamVjdCBhbmQgY2Fubm90IGJlXG4gICAgb3ZlcnJpZGRlbi5cbiAgICBAc2VlIGh0dHA6Ly93aWtpLmVjbWFzY3JpcHQub3JnL2Rva3UucGhwP2lkPWhhcm1vbnk6ZWdhbFxuICAgIEBwYXJhbSB7QW55fSB0aGlzXG4gICAgQHBhcmFtIHtBbnl9IHRoYXRcbiAgICBAcmV0dXJucyB7Qm9vbGVhbn0gd2hldGhlciB0aGlzIGFuZCB0aGF0IGFyZSBpZGVudGljYWxcbiAgICBAZnVuY3Rpb24gZXh0ZXJuYWw6T2JqZWN0LmlzXG4qL1xuT2JqZWN0LmlzID0gZnVuY3Rpb24gKHgsIHkpIHtcbiAgICBpZiAoeCA9PT0geSkge1xuICAgICAgICAvLyAwID09PSAtMCwgYnV0IHRoZXkgYXJlIG5vdCBpZGVudGljYWxcbiAgICAgICAgcmV0dXJuIHggIT09IDAgfHwgMSAvIHggPT09IDEgLyB5O1xuICAgIH1cbiAgICAvLyBOYU4gIT09IE5hTiwgYnV0IHRoZXkgYXJlIGlkZW50aWNhbC5cbiAgICAvLyBOYU5zIGFyZSB0aGUgb25seSBub24tcmVmbGV4aXZlIHZhbHVlLCBpLmUuLCBpZiB4ICE9PSB4LFxuICAgIC8vIHRoZW4geCBpcyBhIE5hTi5cbiAgICAvLyBpc05hTiBpcyBicm9rZW46IGl0IGNvbnZlcnRzIGl0cyBhcmd1bWVudCB0byBudW1iZXIsIHNvXG4gICAgLy8gaXNOYU4oXCJmb29cIikgPT4gdHJ1ZVxuICAgIHJldHVybiB4ICE9PSB4ICYmIHkgIT09IHk7XG59O1xuXG4vKipcbiAgICBQZXJmb3JtcyBhIHBvbHltb3JwaGljLCB0eXBlLXNlbnNpdGl2ZSBkZWVwIGVxdWl2YWxlbmNlIGNvbXBhcmlzb24gb2YgYW55XG4gICAgdHdvIHZhbHVlcy5cblxuICAgIDxwPkFzIGEgYmFzaWMgcHJpbmNpcGxlLCBhbnkgdmFsdWUgaXMgZXF1aXZhbGVudCB0byBpdHNlbGYgKGFzIGluXG4gICAgaWRlbnRpdHkpLCBhbnkgYm94ZWQgdmVyc2lvbiBvZiBpdHNlbGYgKGFzIGEgPGNvZGU+bmV3IE51bWJlcigxMCk8L2NvZGU+IGlzXG4gICAgdG8gMTApLCBhbmQgYW55IGRlZXAgY2xvbmUgb2YgaXRzZWxmLlxuXG4gICAgPHA+RXF1aXZhbGVuY2UgaGFzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcblxuICAgIDx1bD5cbiAgICAgICAgPGxpPjxzdHJvbmc+cG9seW1vcnBoaWM6PC9zdHJvbmc+XG4gICAgICAgICAgICBJZiB0aGUgZ2l2ZW4gb2JqZWN0IGlzIGFuIGluc3RhbmNlIG9mIGEgdHlwZSB0aGF0IGltcGxlbWVudHMgYVxuICAgICAgICAgICAgbWV0aG9kcyBuYW1lZCBcImVxdWFsc1wiLCB0aGlzIGZ1bmN0aW9uIGRlZmVycyB0byB0aGUgbWV0aG9kLiAgU28sXG4gICAgICAgICAgICB0aGlzIGZ1bmN0aW9uIGNhbiBzYWZlbHkgY29tcGFyZSBhbnkgdmFsdWVzIHJlZ2FyZGxlc3Mgb2YgdHlwZSxcbiAgICAgICAgICAgIGluY2x1ZGluZyB1bmRlZmluZWQsIG51bGwsIG51bWJlcnMsIHN0cmluZ3MsIGFueSBwYWlyIG9mIG9iamVjdHNcbiAgICAgICAgICAgIHdoZXJlIGVpdGhlciBpbXBsZW1lbnRzIFwiZXF1YWxzXCIsIG9yIG9iamVjdCBsaXRlcmFscyB0aGF0IG1heSBldmVuXG4gICAgICAgICAgICBjb250YWluIGFuIFwiZXF1YWxzXCIga2V5LlxuICAgICAgICA8bGk+PHN0cm9uZz50eXBlLXNlbnNpdGl2ZTo8L3N0cm9uZz5cbiAgICAgICAgICAgIEluY29tcGFyYWJsZSB0eXBlcyBhcmUgbm90IGVxdWFsLiAgTm8gb2JqZWN0IGlzIGVxdWl2YWxlbnQgdG8gYW55XG4gICAgICAgICAgICBhcnJheS4gIE5vIHN0cmluZyBpcyBlcXVhbCB0byBhbnkgb3RoZXIgbnVtYmVyLlxuICAgICAgICA8bGk+PHN0cm9uZz5kZWVwOjwvc3Ryb25nPlxuICAgICAgICAgICAgQ29sbGVjdGlvbnMgd2l0aCBlcXVpdmFsZW50IGNvbnRlbnQgYXJlIGVxdWl2YWxlbnQsIHJlY3Vyc2l2ZWx5LlxuICAgICAgICA8bGk+PHN0cm9uZz5lcXVpdmFsZW5jZTo8L3N0cm9uZz5cbiAgICAgICAgICAgIElkZW50aWNhbCB2YWx1ZXMgYW5kIG9iamVjdHMgYXJlIGVxdWl2YWxlbnQsIGJ1dCBzbyBhcmUgY29sbGVjdGlvbnNcbiAgICAgICAgICAgIHRoYXQgY29udGFpbiBlcXVpdmFsZW50IGNvbnRlbnQuICBXaGV0aGVyIG9yZGVyIGlzIGltcG9ydGFudCB2YXJpZXNcbiAgICAgICAgICAgIGJ5IHR5cGUuICBGb3IgQXJyYXlzIGFuZCBsaXN0cywgb3JkZXIgaXMgaW1wb3J0YW50LiAgRm9yIE9iamVjdHMsXG4gICAgICAgICAgICBtYXBzLCBhbmQgc2V0cywgb3JkZXIgaXMgbm90IGltcG9ydGFudC4gIEJveGVkIG9iamVjdHMgYXJlIG11dGFsbHlcbiAgICAgICAgICAgIGVxdWl2YWxlbnQgd2l0aCB0aGVpciB1bmJveGVkIHZhbHVlcywgYnkgdmlydHVlIG9mIHRoZSBzdGFuZGFyZFxuICAgICAgICAgICAgPGNvZGU+dmFsdWVPZjwvY29kZT4gbWV0aG9kLlxuICAgIDwvdWw+XG4gICAgQHBhcmFtIHRoaXNcbiAgICBAcGFyYW0gdGhhdFxuICAgIEByZXR1cm5zIHtCb29sZWFufSB3aGV0aGVyIHRoZSB2YWx1ZXMgYXJlIGRlZXBseSBlcXVpdmFsZW50XG4gICAgQGZ1bmN0aW9uIGV4dGVybmFsOk9iamVjdC5lcXVhbHNcbiovXG5PYmplY3QuZXF1YWxzID0gZnVuY3Rpb24gKGEsIGIsIGVxdWFscywgbWVtbykge1xuICAgIGVxdWFscyA9IGVxdWFscyB8fCBPYmplY3QuZXF1YWxzO1xuICAgIC8vY29uc29sZS5sb2coXCJPYmplY3QuZXF1YWxzOiBhOlwiLGEsIFwiYjpcIixiLCBcImVxdWFsczpcIixlcXVhbHMpO1xuICAgIC8vIHVuYm94IG9iamVjdHMsIGJ1dCBkbyBub3QgY29uZnVzZSBvYmplY3QgbGl0ZXJhbHNcbiAgICBhID0gT2JqZWN0LmdldFZhbHVlT2YoYSk7XG4gICAgYiA9IE9iamVjdC5nZXRWYWx1ZU9mKGIpO1xuICAgIGlmIChhID09PSBiKVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICBpZiAoT2JqZWN0LmlzT2JqZWN0KGEpKSB7XG4gICAgICAgIG1lbW8gPSBtZW1vIHx8IG5ldyBXZWFrTWFwKCk7XG4gICAgICAgIGlmIChtZW1vLmhhcyhhKSkge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgbWVtby5zZXQoYSwgdHJ1ZSk7XG4gICAgfVxuICAgIGlmIChPYmplY3QuaXNPYmplY3QoYSkgJiYgdHlwZW9mIGEuZXF1YWxzID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgcmV0dXJuIGEuZXF1YWxzKGIsIGVxdWFscywgbWVtbyk7XG4gICAgfVxuICAgIC8vIGNvbW11dGF0aXZlXG4gICAgaWYgKE9iamVjdC5pc09iamVjdChiKSAmJiB0eXBlb2YgYi5lcXVhbHMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICByZXR1cm4gYi5lcXVhbHMoYSwgZXF1YWxzLCBtZW1vKTtcbiAgICB9XG4gICAgaWYgKE9iamVjdC5pc09iamVjdChhKSAmJiBPYmplY3QuaXNPYmplY3QoYikpIHtcbiAgICAgICAgaWYgKE9iamVjdC5nZXRQcm90b3R5cGVPZihhKSA9PT0gT2JqZWN0LnByb3RvdHlwZSAmJiBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYikgPT09IE9iamVjdC5wcm90b3R5cGUpIHtcbiAgICAgICAgICAgIGZvciAodmFyIG5hbWUgaW4gYSkge1xuICAgICAgICAgICAgICAgIGlmICghZXF1YWxzKGFbbmFtZV0sIGJbbmFtZV0sIGVxdWFscywgbWVtbykpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAodmFyIG5hbWUgaW4gYikge1xuICAgICAgICAgICAgICAgIGlmICghKG5hbWUgaW4gYSkgfHwgIWVxdWFscyhiW25hbWVdLCBhW25hbWVdLCBlcXVhbHMsIG1lbW8pKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvLyBOYU4gIT09IE5hTiwgYnV0IHRoZXkgYXJlIGVxdWFsLlxuICAgIC8vIE5hTnMgYXJlIHRoZSBvbmx5IG5vbi1yZWZsZXhpdmUgdmFsdWUsIGkuZS4sIGlmIHggIT09IHgsXG4gICAgLy8gdGhlbiB4IGlzIGEgTmFOLlxuICAgIC8vIGlzTmFOIGlzIGJyb2tlbjogaXQgY29udmVydHMgaXRzIGFyZ3VtZW50IHRvIG51bWJlciwgc29cbiAgICAvLyBpc05hTihcImZvb1wiKSA9PiB0cnVlXG4gICAgLy8gV2UgaGF2ZSBlc3RhYmxpc2hlZCB0aGF0IGEgIT09IGIsIGJ1dCBpZiBhICE9PSBhICYmIGIgIT09IGIsIHRoZXkgYXJlXG4gICAgLy8gYm90aCBOYU4uXG4gICAgaWYgKGEgIT09IGEgJiYgYiAhPT0gYilcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgaWYgKCFhIHx8ICFiKVxuICAgICAgICByZXR1cm4gYSA9PT0gYjtcbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG4vLyBCZWNhdXNlIGEgcmV0dXJuIHZhbHVlIG9mIDAgZnJvbSBhIGBjb21wYXJlYCBmdW5jdGlvbiAgbWF5IG1lYW4gZWl0aGVyXG4vLyBcImVxdWFsc1wiIG9yIFwiaXMgaW5jb21wYXJhYmxlXCIsIGBlcXVhbHNgIGNhbm5vdCBiZSBkZWZpbmVkIGluIHRlcm1zIG9mXG4vLyBgY29tcGFyZWAuICBIb3dldmVyLCBgY29tcGFyZWAgKmNhbiogYmUgZGVmaW5lZCBpbiB0ZXJtcyBvZiBgZXF1YWxzYCBhbmRcbi8vIGBsZXNzVGhhbmAuICBBZ2FpbiBob3dldmVyLCBtb3JlIG9mdGVuIGl0IHdvdWxkIGJlIGRlc2lyYWJsZSB0byBpbXBsZW1lbnRcbi8vIGFsbCBvZiB0aGUgY29tcGFyaXNvbiBmdW5jdGlvbnMgaW4gdGVybXMgb2YgY29tcGFyZSByYXRoZXIgdGhhbiB0aGUgb3RoZXJcbi8vIHdheSBhcm91bmQuXG5cbi8qKlxuICAgIERldGVybWluZXMgdGhlIG9yZGVyIGluIHdoaWNoIGFueSB0d28gb2JqZWN0cyBzaG91bGQgYmUgc29ydGVkIGJ5IHJldHVybmluZ1xuICAgIGEgbnVtYmVyIHRoYXQgaGFzIGFuIGFuYWxvZ291cyByZWxhdGlvbnNoaXAgdG8gemVybyBhcyB0aGUgbGVmdCB2YWx1ZSB0b1xuICAgIHRoZSByaWdodC4gIFRoYXQgaXMsIGlmIHRoZSBsZWZ0IGlzIFwibGVzcyB0aGFuXCIgdGhlIHJpZ2h0LCB0aGUgcmV0dXJuZWRcbiAgICB2YWx1ZSB3aWxsIGJlIFwibGVzcyB0aGFuXCIgemVybywgd2hlcmUgXCJsZXNzIHRoYW5cIiBtYXkgYmUgYW55IG90aGVyXG4gICAgdHJhbnNpdGl2ZSByZWxhdGlvbnNoaXAuXG5cbiAgICA8cD5BcnJheXMgYXJlIGNvbXBhcmVkIGJ5IHRoZSBmaXJzdCBkaXZlcmdpbmcgdmFsdWVzLCBvciBieSBsZW5ndGguXG5cbiAgICA8cD5BbnkgdHdvIHZhbHVlcyB0aGF0IGFyZSBpbmNvbXBhcmFibGUgcmV0dXJuIHplcm8uICBBcyBzdWNoLFxuICAgIDxjb2RlPmVxdWFsczwvY29kZT4gc2hvdWxkIG5vdCBiZSBpbXBsZW1lbnRlZCB3aXRoIDxjb2RlPmNvbXBhcmU8L2NvZGU+XG4gICAgc2luY2UgaW5jb21wYXJhYmlsaXR5IGlzIGluZGlzdGluZ3Vpc2hhYmxlIGZyb20gZXF1YWxpdHkuXG5cbiAgICA8cD5Tb3J0cyBzdHJpbmdzIGxleGljb2dyYXBoaWNhbGx5LiAgVGhpcyBpcyBub3Qgc3VpdGFibGUgZm9yIGFueVxuICAgIHBhcnRpY3VsYXIgaW50ZXJuYXRpb25hbCBzZXR0aW5nLiAgRGlmZmVyZW50IGxvY2FsZXMgc29ydCB0aGVpciBwaG9uZSBib29rc1xuICAgIGluIHZlcnkgZGlmZmVyZW50IHdheXMsIHBhcnRpY3VsYXJseSByZWdhcmRpbmcgZGlhY3JpdGljcyBhbmQgbGlnYXR1cmVzLlxuXG4gICAgPHA+SWYgdGhlIGdpdmVuIG9iamVjdCBpcyBhbiBpbnN0YW5jZSBvZiBhIHR5cGUgdGhhdCBpbXBsZW1lbnRzIGEgbWV0aG9kXG4gICAgbmFtZWQgXCJjb21wYXJlXCIsIHRoaXMgZnVuY3Rpb24gZGVmZXJzIHRvIHRoZSBpbnN0YW5jZS4gIFRoZSBtZXRob2QgZG9lcyBub3RcbiAgICBuZWVkIHRvIGJlIGFuIG93bmVkIHByb3BlcnR5IHRvIGRpc3Rpbmd1aXNoIGl0IGZyb20gYW4gb2JqZWN0IGxpdGVyYWwgc2luY2VcbiAgICBvYmplY3QgbGl0ZXJhbHMgYXJlIGluY29tcGFyYWJsZS4gIFVubGlrZSA8Y29kZT5PYmplY3Q8L2NvZGU+IGhvd2V2ZXIsXG4gICAgPGNvZGU+QXJyYXk8L2NvZGU+IGltcGxlbWVudHMgPGNvZGU+Y29tcGFyZTwvY29kZT4uXG5cbiAgICBAcGFyYW0ge0FueX0gbGVmdFxuICAgIEBwYXJhbSB7QW55fSByaWdodFxuICAgIEByZXR1cm5zIHtOdW1iZXJ9IGEgdmFsdWUgaGF2aW5nIHRoZSBzYW1lIHRyYW5zaXRpdmUgcmVsYXRpb25zaGlwIHRvIHplcm9cbiAgICBhcyB0aGUgbGVmdCBhbmQgcmlnaHQgdmFsdWVzLlxuICAgIEBmdW5jdGlvbiBleHRlcm5hbDpPYmplY3QuY29tcGFyZVxuKi9cbk9iamVjdC5jb21wYXJlID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAvLyB1bmJveCBvYmplY3RzLCBidXQgZG8gbm90IGNvbmZ1c2Ugb2JqZWN0IGxpdGVyYWxzXG4gICAgLy8gbWVyY2lmdWxseSBoYW5kbGVzIHRoZSBEYXRlIGNhc2VcbiAgICBhID0gT2JqZWN0LmdldFZhbHVlT2YoYSk7XG4gICAgYiA9IE9iamVjdC5nZXRWYWx1ZU9mKGIpO1xuICAgIGlmIChhID09PSBiKVxuICAgICAgICByZXR1cm4gMDtcbiAgICB2YXIgYVR5cGUgPSB0eXBlb2YgYTtcbiAgICB2YXIgYlR5cGUgPSB0eXBlb2YgYjtcbiAgICBpZiAoYVR5cGUgPT09IFwibnVtYmVyXCIgJiYgYlR5cGUgPT09IFwibnVtYmVyXCIpXG4gICAgICAgIHJldHVybiBhIC0gYjtcbiAgICBpZiAoYVR5cGUgPT09IFwic3RyaW5nXCIgJiYgYlR5cGUgPT09IFwic3RyaW5nXCIpXG4gICAgICAgIHJldHVybiBhIDwgYiA/IC1JbmZpbml0eSA6IEluZmluaXR5O1xuICAgICAgICAvLyB0aGUgcG9zc2liaWxpdHkgb2YgZXF1YWxpdHkgZWxpbWlhdGVkIGFib3ZlXG4gICAgaWYgKGEgJiYgdHlwZW9mIGEuY29tcGFyZSA9PT0gXCJmdW5jdGlvblwiKVxuICAgICAgICByZXR1cm4gYS5jb21wYXJlKGIpO1xuICAgIC8vIG5vdCBjb21tdXRhdGl2ZSwgdGhlIHJlbGF0aW9uc2hpcCBpcyByZXZlcnNlZFxuICAgIGlmIChiICYmIHR5cGVvZiBiLmNvbXBhcmUgPT09IFwiZnVuY3Rpb25cIilcbiAgICAgICAgcmV0dXJuIC1iLmNvbXBhcmUoYSk7XG4gICAgcmV0dXJuIDA7XG59O1xuXG4vKipcbiAgICBDcmVhdGVzIGEgZGVlcCBjb3B5IG9mIGFueSB2YWx1ZS4gIFZhbHVlcywgYmVpbmcgaW1tdXRhYmxlLCBhcmVcbiAgICByZXR1cm5lZCB3aXRob3V0IGFsdGVybmF0aW9uLiAgRm9yd2FyZHMgdG8gPGNvZGU+Y2xvbmU8L2NvZGU+IG9uXG4gICAgb2JqZWN0cyBhbmQgYXJyYXlzLlxuXG4gICAgQGZ1bmN0aW9uIGV4dGVybmFsOk9iamVjdC5jbG9uZVxuICAgIEBwYXJhbSB7QW55fSB2YWx1ZSBhIHZhbHVlIHRvIGNsb25lXG4gICAgQHBhcmFtIHtOdW1iZXJ9IGRlcHRoIGFuIG9wdGlvbmFsIHRyYXZlcnNhbCBkZXB0aCwgZGVmYXVsdHMgdG8gaW5maW5pdHkuXG4gICAgQSB2YWx1ZSBvZiA8Y29kZT4wPC9jb2RlPiBtZWFucyB0byBtYWtlIG5vIGNsb25lIGFuZCByZXR1cm4gdGhlIHZhbHVlXG4gICAgZGlyZWN0bHkuXG4gICAgQHBhcmFtIHtNYXB9IG1lbW8gYW4gb3B0aW9uYWwgbWVtbyBvZiBhbHJlYWR5IHZpc2l0ZWQgb2JqZWN0cyB0byBwcmVzZXJ2ZVxuICAgIHJlZmVyZW5jZSBjeWNsZXMuICBUaGUgY2xvbmVkIG9iamVjdCB3aWxsIGhhdmUgdGhlIGV4YWN0IHNhbWUgc2hhcGUgYXMgdGhlXG4gICAgb3JpZ2luYWwsIGJ1dCBubyBpZGVudGljYWwgb2JqZWN0cy4gIFRlIG1hcCBtYXkgYmUgbGF0ZXIgdXNlZCB0byBhc3NvY2lhdGVcbiAgICBhbGwgb2JqZWN0cyBpbiB0aGUgb3JpZ2luYWwgb2JqZWN0IGdyYXBoIHdpdGggdGhlaXIgY29ycmVzcG9uZGluZyBtZW1iZXIgb2ZcbiAgICB0aGUgY2xvbmVkIGdyYXBoLlxuICAgIEByZXR1cm5zIGEgY29weSBvZiB0aGUgdmFsdWVcbiovXG5PYmplY3QuY2xvbmUgPSBmdW5jdGlvbiAodmFsdWUsIGRlcHRoLCBtZW1vKSB7XG4gICAgdmFsdWUgPSBPYmplY3QuZ2V0VmFsdWVPZih2YWx1ZSk7XG4gICAgbWVtbyA9IG1lbW8gfHwgbmV3IFdlYWtNYXAoKTtcbiAgICBpZiAoZGVwdGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBkZXB0aCA9IEluZmluaXR5O1xuICAgIH0gZWxzZSBpZiAoZGVwdGggPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgICBpZiAoT2JqZWN0LmlzT2JqZWN0KHZhbHVlKSkge1xuICAgICAgICBpZiAoIW1lbW8uaGFzKHZhbHVlKSkge1xuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZS5jbG9uZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAgICAgbWVtby5zZXQodmFsdWUsIHZhbHVlLmNsb25lKGRlcHRoLCBtZW1vKSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZhciBwcm90b3R5cGUgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodmFsdWUpO1xuICAgICAgICAgICAgICAgIGlmIChwcm90b3R5cGUgPT09IG51bGwgfHwgcHJvdG90eXBlID09PSBPYmplY3QucHJvdG90eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjbG9uZSA9IE9iamVjdC5jcmVhdGUocHJvdG90eXBlKTtcbiAgICAgICAgICAgICAgICAgICAgbWVtby5zZXQodmFsdWUsIGNsb25lKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbG9uZVtrZXldID0gT2JqZWN0LmNsb25lKHZhbHVlW2tleV0sIGRlcHRoIC0gMSwgbWVtbyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCBjbG9uZSBcIiArIHZhbHVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1lbW8uZ2V0KHZhbHVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlO1xufTtcblxuLyoqXG4gICAgUmVtb3ZlcyBhbGwgcHJvcGVydGllcyBvd25lZCBieSB0aGlzIG9iamVjdCBtYWtpbmcgdGhlIG9iamVjdCBzdWl0YWJsZSBmb3JcbiAgICByZXVzZS5cblxuICAgIEBmdW5jdGlvbiBleHRlcm5hbDpPYmplY3QuY2xlYXJcbiAgICBAcmV0dXJucyB0aGlzXG4qL1xuT2JqZWN0LmNsZWFyID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgIGlmIChvYmplY3QgJiYgdHlwZW9mIG9iamVjdC5jbGVhciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIG9iamVjdC5jbGVhcigpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KSxcbiAgICAgICAgICAgIGkgPSBrZXlzLmxlbmd0aDtcbiAgICAgICAgd2hpbGUgKGkpIHtcbiAgICAgICAgICAgIGktLTtcbiAgICAgICAgICAgIGRlbGV0ZSBvYmplY3Rba2V5c1tpXV07XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG9iamVjdDtcbn07XG4iXX0=