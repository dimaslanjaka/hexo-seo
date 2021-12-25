"use strict";
/*
 Based in part on observable arrays from Motorola Mobility’s Montage
 Copyright (c) 2012, Motorola Mobility LLC. All Rights Reserved.
 3-Clause BSD License
 https://github.com/motorola-mobility/montage/blob/master/LICENSE.md
 */
/*
 This module is responsible for observing changes to owned properties of
 objects and changes to the content of arrays caused by method calls.
 The interface for observing array content changes establishes the methods
 necessary for any collection with observable content.
 */
require("../shim");
var array_splice = Array.prototype.splice, array_spliceOne = Array.prototype.spliceOne, array_slice = Array.prototype.slice, array_reverse = Array.prototype.reverse, array_sort = Array.prototype.sort, array_swap = Array.prototype.swap, array_push = Array.prototype.push, 
// use different strategies for making arrays observable between Internet
// Explorer and other browsers.
protoIsSupported = {}.__proto__ === Object.prototype, array_makeObservable, LENGTH = "length";
if (protoIsSupported) {
    array_makeObservable = function () {
        this.__proto__ = ChangeDispatchArray;
    };
}
else {
    array_makeObservable = function () {
        Object.defineProperties(this, observableArrayProperties);
    };
}
Object.defineProperty(Array.prototype, "makeObservable", {
    value: array_makeObservable,
    writable: true,
    configurable: true,
    enumerable: false
});
//This is a no-op test in property-changes.js - PropertyChanges.prototype.makePropertyObservable, so might as well not pay the price every time....
Object.defineProperty(Array.prototype, "makePropertyObservable", {
    value: function () { },
    writable: true,
    configurable: true,
    enumerable: false
});
var observableArrayProperties = {
    isObservable: {
        value: true,
        writable: true,
        configurable: true
    },
    makeObservable: {
        value: Function.noop,
        writable: true,
        configurable: true
    },
    reverse: {
        value: function reverse() {
            var reversed = this.constructClone(this);
            reversed.reverse();
            this.swap(0, this.length, reversed);
            return this;
        },
        writable: true,
        configurable: true
    },
    sort: {
        value: function sort() {
            var index, length;
            // dispatch before change events
            this.dispatchBeforeRangeChange(this, this, 0);
            for (index = 0, length = this.length; index < length; index++) {
                PropertyChanges.dispatchBeforeOwnPropertyChange(this, index, this[index]);
                this.dispatchBeforeMapChange(index, this[index]);
            }
            // actual work
            array_sort.apply(this, arguments);
            // dispatch after change events
            for (index = 0, length = this.length; index < length; index++) {
                PropertyChanges.dispatchOwnPropertyChange(this, index, this[index]);
                this.dispatchMapChange(index, this[index]);
            }
            this.dispatchRangeChange(this, this, 0);
            return this;
        },
        writable: true,
        configurable: true
    },
    _dispatchBeforeOwnPropertyChange: {
        value: function _dispatchBeforeOwnPropertyChange(start, length) {
            for (var i = start, countI = start + length; i < countI; i++) {
                PropertyChanges.dispatchBeforeOwnPropertyChange(this, i, this[i]);
                this.dispatchBeforeMapChange(i, this[i]);
            }
        }
    },
    _dispatchOwnPropertyChange: {
        value: function _dispatchOwnPropertyChange(start, length) {
            for (var i = start, countI = start + length; i < countI; i++) {
                this.dispatchOwnPropertyChange(i, this[i]);
                this.dispatchMapChange(i, this[i]);
            }
        }
    },
    swap: {
        value: function swap(start, length, plus) {
            var hasOwnPropertyChangeDescriptor, i, j, plusLength;
            if (plus) {
                if (!Array.isArray(plus)) {
                    plus = array_slice.call(plus);
                }
            }
            else {
                plus = Array.empty;
            }
            plusLength = plus.length;
            if (start < 0) {
                start = this.length + start;
            }
            else if (start > this.length) {
                var holes = start - this.length;
                var newPlus = Array(holes + plusLength);
                for (i = 0, j = holes; i < plusLength; i++, j++) {
                    if (i in plus) {
                        newPlus[j] = plus[i];
                    }
                }
                plus = newPlus;
                plusLength = plus.length;
                start = this.length;
            }
            var minus;
            if (length === 0) {
                // minus will be empty
                if (plusLength === 0) {
                    // at this point if plus is empty there is nothing to do.
                    return []; // [], but spare us an instantiation
                }
                minus = Array.empty;
            }
            else {
                minus = array_slice.call(this, start, start + length);
            }
            var diff = plusLength - minus.length;
            var oldLength = this.length;
            var newLength = Math.max(this.length + diff, start + plusLength);
            var longest = (oldLength > newLength) ? oldLength : newLength;
            // dispatch before change events
            if (diff) {
                PropertyChanges.dispatchBeforeOwnPropertyChange(this, LENGTH, this.length);
            }
            this.dispatchBeforeRangeChange(plus, minus, start);
            if (diff === 0) { // substring replacement
                this._dispatchBeforeOwnPropertyChange(start, plusLength);
            }
            else if ((hasOwnPropertyChangeDescriptor = PropertyChanges.hasOwnPropertyChangeDescriptor(this))) {
                // all subsequent values changed or shifted.
                // avoid (longest - start) long walks if there are no
                // registered descriptors.
                this._dispatchBeforeOwnPropertyChange(start, longest - start);
            }
            // actual work
            if (start > oldLength) {
                this.length = start;
            }
            var result = array_swap.call(this, start, length, plus);
            // dispatch after change events
            if (diff === 0) { // substring replacement
                this._dispatchOwnPropertyChange(start, plusLength);
            }
            else if (hasOwnPropertyChangeDescriptor) {
                // all subsequent values changed or shifted.
                // avoid (longest - start) long walks if there are no
                // registered descriptors.
                this._dispatchOwnPropertyChange(start, longest - start);
            }
            this.dispatchRangeChange(plus, minus, start);
            if (diff) {
                this.dispatchOwnPropertyChange(LENGTH, this.length);
            }
            return result;
        },
        writable: true,
        configurable: true
    },
    splice: {
        value: function splice(start, length) {
            // start parameter should be min(start, this.length)
            // http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.12
            if (start > this.length) {
                start = this.length;
            }
            return this.swap.call(this, start, length, array_slice.call(arguments, 2));
        },
        writable: true,
        configurable: true
    },
    // splice is the array content change utility belt.  forward all other
    // content changes to splice so we only have to write observer code in one
    // place
    spliceOne: {
        value: function splice(start, itemToAdd) {
            //Nothhing to add so length will go down by one.
            var plus, minus, oldLength = this.length, newLength, longest, argumentsLength = arguments.length, hasOwnPropertyChangeDescriptor;
            if (argumentsLength === 1) {
                PropertyChanges.dispatchBeforeOwnPropertyChange(this, LENGTH, this.length);
                newLength = this.length - 1;
                plus = Array.empty;
            }
            //Care about 2 only
            else {
                plus = [itemToAdd];
                newLength = this.length;
            }
            minus = [this[start]];
            longest = (oldLength > newLength) ? oldLength : newLength;
            this.dispatchBeforeRangeChange(plus, minus, start);
            if (argumentsLength === 2) { // substring replacement
                this._dispatchBeforeOwnPropertyChange(start, 1);
            }
            else if ((hasOwnPropertyChangeDescriptor = PropertyChanges.hasOwnPropertyChangeDescriptor(this))) {
                // all subsequent values changed or shifted.
                // avoid (longest - start) long walks if there are no
                // registered descriptors.
                this._dispatchBeforeOwnPropertyChange(start, longest - start);
            }
            if (argumentsLength === 1) { // substring replacement
                array_spliceOne.call(this, start);
            }
            else {
                array_spliceOne.call(this, start, itemToAdd);
            }
            // dispatch after change events
            if (argumentsLength === 2) { // substring replacement
                this._dispatchOwnPropertyChange(start, 1);
            }
            else if (hasOwnPropertyChangeDescriptor) {
                // all subsequent values changed or shifted.
                // avoid (longest - start) long walks if there are no
                // registered descriptors.
                this._dispatchOwnPropertyChange(start, longest - start);
            }
            this.dispatchRangeChange(plus, minus, start);
            if (argumentsLength === 1) {
                this.dispatchOwnPropertyChange(LENGTH, this.length);
            }
        },
        writable: true,
        configurable: true
    },
    _setSwapBuffer: {
        get: function () {
            return this.__setSwapBuffer || (Object.defineProperty(this, "__setSwapBuffer", {
                value: [],
                writable: true,
                configurable: true,
                enumerable: false
            })).__setSwapBuffer;
        },
        enumerable: false
    },
    set: {
        value: function set(index, value) {
            var hasValue = typeof value !== undefined, diff, plus = hasValue ? [] : Array.empty, minus, start, hasOwnPropertyChangeDescriptor;
            if (index >= this.length) {
                plus[index - this.length] = value;
                diff = (index + 1) - this.length;
                start = this.length;
            }
            else {
                plus[0] = value;
                diff = 0;
                start = index;
            }
            minus = diff === 0 ? [this[index]] : Array.empty;
            if (diff > 0) {
                PropertyChanges.dispatchBeforeOwnPropertyChange(this, LENGTH, this.length);
            }
            this.dispatchBeforeRangeChange(plus, minus, start);
            if (diff === 0) { // substring replacement
                this._dispatchBeforeOwnPropertyChange(start, 1);
            }
            else if ((hasOwnPropertyChangeDescriptor = PropertyChanges.hasOwnPropertyChangeDescriptor(this))) {
                // all subsequent values changed or shifted.
                // avoid (longest - start) long walks if there are no
                // registered descriptors.
                this._dispatchBeforeOwnPropertyChange(start, diff);
            }
            this[index] = value;
            // dispatch after change events
            if (diff === 0) { // substring replacement
                this._dispatchOwnPropertyChange(start, 1);
            }
            else if (hasOwnPropertyChangeDescriptor) {
                // all subsequent values changed or shifted.
                // avoid (longest - start) long walks if there are no
                // registered descriptors.
                this._dispatchOwnPropertyChange(start, diff);
            }
            this.dispatchRangeChange(plus, minus, start);
            if (diff) {
                this.dispatchOwnPropertyChange(LENGTH, this.length);
            }
            return true;
        },
        writable: true,
        configurable: true
    },
    shift: {
        value: function shift() {
            return this.splice(0, 1)[0];
        },
        writable: true,
        configurable: true
    },
    pop: {
        value: function pop() {
            if (this.length) {
                return this.splice(this.length - 1, 1)[0];
            }
        },
        writable: true,
        configurable: true
    },
    push: {
        value: function push(arg) {
            var start = this.length, addedCount = arguments.length, argArray, hasOwnPropertyChangeDescriptor;
            argArray = addedCount === 1 ? [arguments[0]] : Array.apply(null, arguments);
            if (addedCount > 0) {
                PropertyChanges.dispatchBeforeOwnPropertyChange(this, LENGTH, start);
                this.dispatchBeforeRangeChange(argArray, Array.empty, start);
                if (hasOwnPropertyChangeDescriptor = PropertyChanges.hasOwnPropertyChangeDescriptor(this)) {
                    this._dispatchBeforeOwnPropertyChange(start, addedCount);
                }
            }
            array_push.apply(this, arguments);
            if (addedCount > 0) {
                if (hasOwnPropertyChangeDescriptor) {
                    this._dispatchOwnPropertyChange(start, addedCount);
                }
                this.dispatchRangeChange(argArray, Array.empty, start);
                this.dispatchOwnPropertyChange(LENGTH, this.length);
            }
        },
        writable: true,
        configurable: true
    },
    unshift: {
        value: function unshift(arg) {
            if (arguments.length === 1) {
                return this.splice(0, 0, arg);
            }
            else {
                var args = array_slice.call(arguments);
                return this.swap(0, 0, args);
            }
        },
        writable: true,
        configurable: true
    },
    clear: {
        value: function clear() {
            return this.splice(0, this.length);
        },
        writable: true,
        configurable: true
    }
};
var ChangeDispatchArray = Object.create(Array.prototype, observableArrayProperties);
exports.observableArrayProperties = observableArrayProperties;
var PropertyChanges = require("./property-changes");
var RangeChanges = require("./range-changes");
var MapChanges = require("./map-changes");
Object.defineEach(Array.prototype, PropertyChanges.prototype, false, /*configurable*/ true, /*enumerable*/ false, /*writable*/ true);
Object.defineEach(Array.prototype, RangeChanges.prototype, false, /*configurable*/ true, /*enumerable*/ false, /*writable*/ true);
Object.defineEach(Array.prototype, MapChanges.prototype, false, /*configurable*/ true, /*enumerable*/ false, /*writable*/ true);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXktY2hhbmdlcy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvanMtcHJvdG90eXBlcy9wYWNrYWdlcy9jb2xsZWN0aW9ucy9saXN0ZW4vYXJyYXktY2hhbmdlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7O0dBS0c7QUFFSDs7Ozs7R0FLRztBQUVILE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNuQixJQUFJLFlBQVksR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFDckMsZUFBZSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUMzQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQ25DLGFBQWEsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sRUFDdkMsVUFBVSxHQUFHLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUNqQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQ2pDLFVBQVUsR0FBRyxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUk7QUFFckMseUVBQXlFO0FBQ3pFLCtCQUErQjtBQUMzQixnQkFBZ0IsR0FBRyxFQUFFLENBQUMsU0FBUyxLQUFLLE1BQU0sQ0FBQyxTQUFTLEVBQ3BELG9CQUFvQixFQUNwQixNQUFNLEdBQUcsUUFBUSxDQUFDO0FBRXRCLElBQUksZ0JBQWdCLEVBQUU7SUFDbEIsb0JBQW9CLEdBQUc7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxtQkFBbUIsQ0FBQztJQUN6QyxDQUFDLENBQUM7Q0FDTDtLQUFNO0lBQ0gsb0JBQW9CLEdBQUc7UUFDbkIsTUFBTSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0lBQzdELENBQUMsQ0FBQztDQUNMO0FBRUQsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLGdCQUFnQixFQUFFO0lBQ3JELEtBQUssRUFB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QU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsRUFBRSxlQUFlLENBQUMsU0FBUyxFQUFFLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQSxJQUFJLEVBQUUsY0FBYyxDQUFDLEtBQUssRUFBRSxZQUFZLENBQUEsSUFBSSxDQUFDLENBQUM7QUFDbkksTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLFlBQVksQ0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixDQUFBLElBQUksRUFBRSxjQUFjLENBQUMsS0FBSyxFQUFFLFlBQVksQ0FBQSxJQUFJLENBQUMsQ0FBQztBQUNoSSxNQUFNLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUUsZ0JBQWdCLENBQUEsSUFBSSxFQUFFLGNBQWMsQ0FBQyxLQUFLLEVBQUUsWUFBWSxDQUFBLElBQUksQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLypcbiBCYXNlZCBpbiBwYXJ0IG9uIG9ic2VydmFibGUgYXJyYXlzIGZyb20gTW90b3JvbGEgTW9iaWxpdHnigJlzIE1vbnRhZ2VcbiBDb3B5cmlnaHQgKGMpIDIwMTIsIE1vdG9yb2xhIE1vYmlsaXR5IExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAzLUNsYXVzZSBCU0QgTGljZW5zZVxuIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3Rvcm9sYS1tb2JpbGl0eS9tb250YWdlL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiAqL1xuXG4vKlxuIFRoaXMgbW9kdWxlIGlzIHJlc3BvbnNpYmxlIGZvciBvYnNlcnZpbmcgY2hhbmdlcyB0byBvd25lZCBwcm9wZXJ0aWVzIG9mXG4gb2JqZWN0cyBhbmQgY2hhbmdlcyB0byB0aGUgY29udGVudCBvZiBhcnJheXMgY2F1c2VkIGJ5IG1ldGhvZCBjYWxscy5cbiBUaGUgaW50ZXJmYWNlIGZvciBvYnNlcnZpbmcgYXJyYXkgY29udGVudCBjaGFuZ2VzIGVzdGFibGlzaGVzIHRoZSBtZXRob2RzXG4gbmVjZXNzYXJ5IGZvciBhbnkgY29sbGVjdGlvbiB3aXRoIG9ic2VydmFibGUgY29udGVudC5cbiAqL1xuXG5yZXF1aXJlKFwiLi4vc2hpbVwiKTtcbnZhciBhcnJheV9zcGxpY2UgPSBBcnJheS5wcm90b3R5cGUuc3BsaWNlLFxuICAgIGFycmF5X3NwbGljZU9uZSA9IEFycmF5LnByb3RvdHlwZS5zcGxpY2VPbmUsXG4gICAgYXJyYXlfc2xpY2UgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UsXG4gICAgYXJyYXlfcmV2ZXJzZSA9IEFycmF5LnByb3RvdHlwZS5yZXZlcnNlLFxuICAgIGFycmF5X3NvcnQgPSBBcnJheS5wcm90b3R5cGUuc29ydCxcbiAgICBhcnJheV9zd2FwID0gQXJyYXkucHJvdG90eXBlLnN3YXAsXG4gICAgYXJyYXlfcHVzaCA9IEFycmF5LnByb3RvdHlwZS5wdXNoLFxuXG4vLyB1c2UgZGlmZmVyZW50IHN0cmF0ZWdpZXMgZm9yIG1ha2luZyBhcnJheXMgb2JzZXJ2YWJsZSBiZXR3ZWVuIEludGVybmV0XG4vLyBFeHBsb3JlciBhbmQgb3RoZXIgYnJvd3NlcnMuXG4gICAgcHJvdG9Jc1N1cHBvcnRlZCA9IHt9Ll9fcHJvdG9fXyA9PT0gT2JqZWN0LnByb3RvdHlwZSxcbiAgICBhcnJheV9tYWtlT2JzZXJ2YWJsZSxcbiAgICBMRU5HVEggPSBcImxlbmd0aFwiO1xuXG5pZiAocHJvdG9Jc1N1cHBvcnRlZCkge1xuICAgIGFycmF5X21ha2VPYnNlcnZhYmxlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB0aGlzLl9fcHJvdG9fXyA9IENoYW5nZURpc3BhdGNoQXJyYXk7XG4gICAgfTtcbn0gZWxzZSB7XG4gICAgYXJyYXlfbWFrZU9ic2VydmFibGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsIG9ic2VydmFibGVBcnJheVByb3BlcnRpZXMpO1xuICAgIH07XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsIFwibWFrZU9ic2VydmFibGVcIiwge1xuICAgIHZhbHVlOiBhcnJheV9tYWtlT2JzZXJ2YWJsZSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogZmFsc2Vcbn0pO1xuXG4vL1RoaXMgaXMgYSBuby1vcCB0ZXN0IGluIHByb3BlcnR5LWNoYW5nZXMuanMgLSBQcm9wZXJ0eUNoYW5nZXMucHJvdG90eXBlLm1ha2VQcm9wZXJ0eU9ic2VydmFibGUsIHNvIG1pZ2h0IGFzIHdlbGwgbm90IHBheSB0aGUgcHJpY2UgZXZlcnkgdGltZS4uLi5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcnJheS5wcm90b3R5cGUsIFwibWFrZVByb3BlcnR5T2JzZXJ2YWJsZVwiLCB7XG4gICAgdmFsdWU6IGZ1bmN0aW9uKCl7fSxcbiAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICBjb25maWd1cmFibGU6IHRydWUsXG4gICAgZW51bWVyYWJsZTogZmFsc2Vcbn0pO1xuXG52YXIgb2JzZXJ2YWJsZUFycmF5UHJvcGVydGllcyA9IHtcblxuICAgIGlzT2JzZXJ2YWJsZToge1xuICAgICAgICB2YWx1ZTogdHJ1ZSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBtYWtlT2JzZXJ2YWJsZToge1xuICAgICAgICB2YWx1ZTogRnVuY3Rpb24ubm9vcCwgLy8gaWRlbXBvdGVudFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSxcblxuICAgIHJldmVyc2U6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHJldmVyc2UoKSB7XG5cbiAgICAgICAgICAgIHZhciByZXZlcnNlZCA9IHRoaXMuY29uc3RydWN0Q2xvbmUodGhpcyk7XG4gICAgICAgICAgICByZXZlcnNlZC5yZXZlcnNlKCk7XG4gICAgICAgICAgICB0aGlzLnN3YXAoMCwgdGhpcy5sZW5ndGgsIHJldmVyc2VkKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9LFxuXG4gICAgc29ydDoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc29ydCgpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCwgbGVuZ3RoO1xuICAgICAgICAgICAgLy8gZGlzcGF0Y2ggYmVmb3JlIGNoYW5nZSBldmVudHNcbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hCZWZvcmVSYW5nZUNoYW5nZSh0aGlzLCB0aGlzLCAwKTtcbiAgICAgICAgICAgIGZvciAoaW5kZXggPSAwLCBsZW5ndGggPSB0aGlzLmxlbmd0aDsgaW5kZXggPCBsZW5ndGg7IGluZGV4KyspIHtcbiAgICAgICAgICAgICAgICBQcm9wZXJ0eUNoYW5nZXMuZGlzcGF0Y2hCZWZvcmVPd25Qcm9wZXJ0eUNoYW5nZSh0aGlzLCBpbmRleCwgdGhpc1tpbmRleF0pO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hCZWZvcmVNYXBDaGFuZ2UoaW5kZXgsIHRoaXNbaW5kZXhdKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYWN0dWFsIHdvcmtcbiAgICAgICAgICAgIGFycmF5X3NvcnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblxuICAgICAgICAgICAgLy8gZGlzcGF0Y2ggYWZ0ZXIgY2hhbmdlIGV2ZW50c1xuICAgICAgICAgICAgZm9yIChpbmRleCA9IDAsIGxlbmd0aCA9IHRoaXMubGVuZ3RoOyBpbmRleCA8IGxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgICAgICAgICAgIFByb3BlcnR5Q2hhbmdlcy5kaXNwYXRjaE93blByb3BlcnR5Q2hhbmdlKHRoaXMsIGluZGV4LCB0aGlzW2luZGV4XSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaE1hcENoYW5nZShpbmRleCwgdGhpc1tpbmRleF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJhbmdlQ2hhbmdlKHRoaXMsIHRoaXMsIDApO1xuXG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBfZGlzcGF0Y2hCZWZvcmVPd25Qcm9wZXJ0eUNoYW5nZToge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gX2Rpc3BhdGNoQmVmb3JlT3duUHJvcGVydHlDaGFuZ2Uoc3RhcnQsIGxlbmd0aCkge1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IHN0YXJ0LCBjb3VudEkgPSBzdGFydCtsZW5ndGg7IGkgPCBjb3VudEk7IGkrKykge1xuICAgICAgICAgICAgICAgIFByb3BlcnR5Q2hhbmdlcy5kaXNwYXRjaEJlZm9yZU93blByb3BlcnR5Q2hhbmdlKHRoaXMsIGksIHRoaXNbaV0pO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hCZWZvcmVNYXBDaGFuZ2UoaSwgdGhpc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2Rpc3BhdGNoT3duUHJvcGVydHlDaGFuZ2U6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIF9kaXNwYXRjaE93blByb3BlcnR5Q2hhbmdlKHN0YXJ0LCBsZW5ndGgpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSBzdGFydCwgY291bnRJID0gc3RhcnQrbGVuZ3RoOyBpIDwgY291bnRJOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoT3duUHJvcGVydHlDaGFuZ2UoaSwgdGhpc1tpXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaE1hcENoYW5nZShpLCB0aGlzW2ldKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBzd2FwOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzd2FwKHN0YXJ0LCBsZW5ndGgsIHBsdXMpIHtcbiAgICAgICAgICAgIHZhciBoYXNPd25Qcm9wZXJ0eUNoYW5nZURlc2NyaXB0b3IsIGksIGosIHBsdXNMZW5ndGg7XG4gICAgICAgICAgICBpZiAocGx1cykge1xuICAgICAgICAgICAgICAgIGlmICghQXJyYXkuaXNBcnJheShwbHVzKSkge1xuICAgICAgICAgICAgICAgICAgICBwbHVzID0gYXJyYXlfc2xpY2UuY2FsbChwbHVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHBsdXMgPSBBcnJheS5lbXB0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBsdXNMZW5ndGggPSBwbHVzLmxlbmd0aDtcblxuICAgICAgICAgICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGggKyBzdGFydDtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHZhciBob2xlcyA9IHN0YXJ0IC0gdGhpcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIG5ld1BsdXMgPSBBcnJheShob2xlcyArIHBsdXNMZW5ndGgpO1xuICAgICAgICAgICAgICAgIGZvciAoaSA9IDAsIGogPSBob2xlczsgaSA8IHBsdXNMZW5ndGg7IGkrKywgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpIGluIHBsdXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1BsdXNbal0gPSBwbHVzW2ldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHBsdXMgPSBuZXdQbHVzO1xuICAgICAgICAgICAgICAgIHBsdXNMZW5ndGggPSBwbHVzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbWludXM7XG4gICAgICAgICAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgLy8gbWludXMgd2lsbCBiZSBlbXB0eVxuICAgICAgICAgICAgICAgIGlmIChwbHVzTGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGF0IHRoaXMgcG9pbnQgaWYgcGx1cyBpcyBlbXB0eSB0aGVyZSBpcyBub3RoaW5nIHRvIGRvLlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107IC8vIFtdLCBidXQgc3BhcmUgdXMgYW4gaW5zdGFudGlhdGlvblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBtaW51cyA9IEFycmF5LmVtcHR5O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBtaW51cyA9IGFycmF5X3NsaWNlLmNhbGwodGhpcywgc3RhcnQsIHN0YXJ0ICsgbGVuZ3RoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBkaWZmID0gcGx1c0xlbmd0aCAtIG1pbnVzLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBvbGRMZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgICAgIHZhciBuZXdMZW5ndGggPSBNYXRoLm1heCh0aGlzLmxlbmd0aCArIGRpZmYsIHN0YXJ0ICsgcGx1c0xlbmd0aCk7XG4gICAgICAgICAgICB2YXIgbG9uZ2VzdCA9IChvbGRMZW5ndGggPiBuZXdMZW5ndGgpID8gb2xkTGVuZ3RoIDogbmV3TGVuZ3RoO1xuICAgICAgICAgICAgLy8gZGlzcGF0Y2ggYmVmb3JlIGNoYW5nZSBldmVudHNcbiAgICAgICAgICAgIGlmIChkaWZmKSB7XG4gICAgICAgICAgICAgICAgUHJvcGVydHlDaGFuZ2VzLmRpc3BhdGNoQmVmb3JlT3duUHJvcGVydHlDaGFuZ2UodGhpcywgTEVOR1RILCB0aGlzLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoQmVmb3JlUmFuZ2VDaGFuZ2UocGx1cywgbWludXMsIHN0YXJ0KTtcbiAgICAgICAgICAgIGlmIChkaWZmID09PSAwKSB7IC8vIHN1YnN0cmluZyByZXBsYWNlbWVudFxuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoQmVmb3JlT3duUHJvcGVydHlDaGFuZ2Uoc3RhcnQsIHBsdXNMZW5ndGgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgoaGFzT3duUHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yID0gUHJvcGVydHlDaGFuZ2VzLmhhc093blByb3BlcnR5Q2hhbmdlRGVzY3JpcHRvcih0aGlzKSkpIHtcbiAgICAgICAgICAgICAgICAvLyBhbGwgc3Vic2VxdWVudCB2YWx1ZXMgY2hhbmdlZCBvciBzaGlmdGVkLlxuICAgICAgICAgICAgICAgIC8vIGF2b2lkIChsb25nZXN0IC0gc3RhcnQpIGxvbmcgd2Fsa3MgaWYgdGhlcmUgYXJlIG5vXG4gICAgICAgICAgICAgICAgLy8gcmVnaXN0ZXJlZCBkZXNjcmlwdG9ycy5cbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEJlZm9yZU93blByb3BlcnR5Q2hhbmdlKHN0YXJ0LCBsb25nZXN0LXN0YXJ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gYWN0dWFsIHdvcmtcbiAgICAgICAgICAgIGlmIChzdGFydCA+IG9sZExlbmd0aCkge1xuICAgICAgICAgICAgICAgIHRoaXMubGVuZ3RoID0gc3RhcnQ7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gYXJyYXlfc3dhcC5jYWxsKHRoaXMsIHN0YXJ0LCBsZW5ndGgsIHBsdXMpO1xuXG4gICAgICAgICAgICAvLyBkaXNwYXRjaCBhZnRlciBjaGFuZ2UgZXZlbnRzXG4gICAgICAgICAgICBpZiAoZGlmZiA9PT0gMCkgeyAvLyBzdWJzdHJpbmcgcmVwbGFjZW1lbnRcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaE93blByb3BlcnR5Q2hhbmdlKHN0YXJ0LHBsdXNMZW5ndGgpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eUNoYW5nZURlc2NyaXB0b3IpIHtcbiAgICAgICAgICAgICAgICAvLyBhbGwgc3Vic2VxdWVudCB2YWx1ZXMgY2hhbmdlZCBvciBzaGlmdGVkLlxuICAgICAgICAgICAgICAgIC8vIGF2b2lkIChsb25nZXN0IC0gc3RhcnQpIGxvbmcgd2Fsa3MgaWYgdGhlcmUgYXJlIG5vXG4gICAgICAgICAgICAgICAgLy8gcmVnaXN0ZXJlZCBkZXNjcmlwdG9ycy5cbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaE93blByb3BlcnR5Q2hhbmdlKHN0YXJ0LGxvbmdlc3Qtc3RhcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJhbmdlQ2hhbmdlKHBsdXMsIG1pbnVzLCBzdGFydCk7XG4gICAgICAgICAgICBpZiAoZGlmZikge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hPd25Qcm9wZXJ0eUNoYW5nZShMRU5HVEgsIHRoaXMubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBzcGxpY2U6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHNwbGljZShzdGFydCwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAvLyBzdGFydCBwYXJhbWV0ZXIgc2hvdWxkIGJlIG1pbihzdGFydCwgdGhpcy5sZW5ndGgpXG4gICAgICAgICAgICAvLyBodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNS4xLyNzZWMtMTUuNC40LjEyXG4gICAgICAgICAgICBpZiAoc3RhcnQgPiB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5sZW5ndGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zd2FwLmNhbGwodGhpcywgc3RhcnQsIGxlbmd0aCwgYXJyYXlfc2xpY2UuY2FsbChhcmd1bWVudHMsIDIpKTtcbiAgICAgICAgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICAvLyBzcGxpY2UgaXMgdGhlIGFycmF5IGNvbnRlbnQgY2hhbmdlIHV0aWxpdHkgYmVsdC4gIGZvcndhcmQgYWxsIG90aGVyXG4gICAgLy8gY29udGVudCBjaGFuZ2VzIHRvIHNwbGljZSBzbyB3ZSBvbmx5IGhhdmUgdG8gd3JpdGUgb2JzZXJ2ZXIgY29kZSBpbiBvbmVcbiAgICAvLyBwbGFjZVxuXG4gICAgc3BsaWNlT25lOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzcGxpY2Uoc3RhcnQsaXRlbVRvQWRkKSB7XG4gICAgICAgICAgICAvL05vdGhoaW5nIHRvIGFkZCBzbyBsZW5ndGggd2lsbCBnbyBkb3duIGJ5IG9uZS5cbiAgICAgICAgICAgIHZhciBwbHVzLCBtaW51cywgb2xkTGVuZ3RoID0gdGhpcy5sZW5ndGgsIG5ld0xlbmd0aCwgbG9uZ2VzdCwgYXJndW1lbnRzTGVuZ3RoID0gYXJndW1lbnRzLmxlbmd0aCwgaGFzT3duUHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yO1xuICAgICAgICAgICAgaWYoYXJndW1lbnRzTGVuZ3RoID09PSAxKSB7XG4gICAgICAgICAgICAgICAgUHJvcGVydHlDaGFuZ2VzLmRpc3BhdGNoQmVmb3JlT3duUHJvcGVydHlDaGFuZ2UodGhpcywgTEVOR1RILCB0aGlzLmxlbmd0aCk7XG4gICAgICAgICAgICAgICAgbmV3TGVuZ3RoID0gdGhpcy5sZW5ndGggLSAxO1xuICAgICAgICAgICAgICAgIHBsdXMgPSBBcnJheS5lbXB0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vQ2FyZSBhYm91dCAyIG9ubHlcbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIHBsdXMgPSBbaXRlbVRvQWRkXTtcbiAgICAgICAgICAgICAgICBuZXdMZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1pbnVzID0gW3RoaXNbc3RhcnRdXTtcbiAgICAgICAgICAgIGxvbmdlc3QgPSAob2xkTGVuZ3RoID4gbmV3TGVuZ3RoKSA/IG9sZExlbmd0aCA6IG5ld0xlbmd0aDtcblxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEJlZm9yZVJhbmdlQ2hhbmdlKHBsdXMsIG1pbnVzLCBzdGFydCk7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzTGVuZ3RoID09PSAyKSB7IC8vIHN1YnN0cmluZyByZXBsYWNlbWVudFxuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoQmVmb3JlT3duUHJvcGVydHlDaGFuZ2Uoc3RhcnQsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgoaGFzT3duUHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yID0gUHJvcGVydHlDaGFuZ2VzLmhhc093blByb3BlcnR5Q2hhbmdlRGVzY3JpcHRvcih0aGlzKSkpIHtcbiAgICAgICAgICAgICAgICAvLyBhbGwgc3Vic2VxdWVudCB2YWx1ZXMgY2hhbmdlZCBvciBzaGlmdGVkLlxuICAgICAgICAgICAgICAgIC8vIGF2b2lkIChsb25nZXN0IC0gc3RhcnQpIGxvbmcgd2Fsa3MgaWYgdGhlcmUgYXJlIG5vXG4gICAgICAgICAgICAgICAgLy8gcmVnaXN0ZXJlZCBkZXNjcmlwdG9ycy5cbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEJlZm9yZU93blByb3BlcnR5Q2hhbmdlKHN0YXJ0LCBsb25nZXN0LXN0YXJ0KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKGFyZ3VtZW50c0xlbmd0aCA9PT0gMSkgeyAvLyBzdWJzdHJpbmcgcmVwbGFjZW1lbnRcbiAgICAgICAgICAgICAgICBhcnJheV9zcGxpY2VPbmUuY2FsbCh0aGlzLHN0YXJ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGFycmF5X3NwbGljZU9uZS5jYWxsKHRoaXMsc3RhcnQsaXRlbVRvQWRkKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZGlzcGF0Y2ggYWZ0ZXIgY2hhbmdlIGV2ZW50c1xuICAgICAgICAgICAgaWYgKGFyZ3VtZW50c0xlbmd0aCA9PT0gMikgeyAvLyBzdWJzdHJpbmcgcmVwbGFjZW1lbnRcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaE93blByb3BlcnR5Q2hhbmdlKHN0YXJ0LDEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChoYXNPd25Qcm9wZXJ0eUNoYW5nZURlc2NyaXB0b3IpIHtcbiAgICAgICAgICAgICAgICAvLyBhbGwgc3Vic2VxdWVudCB2YWx1ZXMgY2hhbmdlZCBvciBzaGlmdGVkLlxuICAgICAgICAgICAgICAgIC8vIGF2b2lkIChsb25nZXN0IC0gc3RhcnQpIGxvbmcgd2Fsa3MgaWYgdGhlcmUgYXJlIG5vXG4gICAgICAgICAgICAgICAgLy8gcmVnaXN0ZXJlZCBkZXNjcmlwdG9ycy5cbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaE93blByb3BlcnR5Q2hhbmdlKHN0YXJ0LGxvbmdlc3Qtc3RhcnQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaFJhbmdlQ2hhbmdlKHBsdXMsIG1pbnVzLCBzdGFydCk7XG5cbiAgICAgICAgICAgIGlmKGFyZ3VtZW50c0xlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hPd25Qcm9wZXJ0eUNoYW5nZShMRU5HVEgsIHRoaXMubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSxcbiAgICBfc2V0U3dhcEJ1ZmZlcjoge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuX19zZXRTd2FwQnVmZmVyIHx8IChPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcIl9fc2V0U3dhcEJ1ZmZlclwiLHtcbiAgICAgICAgICAgICAgICB2YWx1ZTogW10sXG4gICAgICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgICAgIGVudW1lcmFibGU6IGZhbHNlXG4gICAgICAgICAgICB9KSkuX19zZXRTd2FwQnVmZmVyO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgIH0sXG4gICAgc2V0OiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBzZXQoaW5kZXgsIHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgaGFzVmFsdWUgPSB0eXBlb2YgdmFsdWUgIT09IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICBkaWZmICxcbiAgICAgICAgICAgICAgICBwbHVzID0gaGFzVmFsdWUgPyBbXSA6IEFycmF5LmVtcHR5LFxuICAgICAgICAgICAgICAgIG1pbnVzLFxuICAgICAgICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgICAgICAgIGhhc093blByb3BlcnR5Q2hhbmdlRGVzY3JpcHRvcjtcblxuXG4gICAgICAgICAgICBpZihpbmRleCA+PSB0aGlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIHBsdXNbaW5kZXggLSB0aGlzLmxlbmd0aF0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICBkaWZmID0gKGluZGV4ICsgMSkgLSB0aGlzLmxlbmd0aDtcbiAgICAgICAgICAgICAgICBzdGFydCA9IHRoaXMubGVuZ3RoO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcGx1c1swXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGRpZmYgPSAwO1xuICAgICAgICAgICAgICAgIHN0YXJ0ID0gaW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtaW51cyA9IGRpZmYgPT09IDAgPyBbdGhpc1tpbmRleF1dIDogQXJyYXkuZW1wdHk7XG5cblxuICAgICAgICAgICAgaWYoZGlmZj4wKSB7XG4gICAgICAgICAgICAgICAgUHJvcGVydHlDaGFuZ2VzLmRpc3BhdGNoQmVmb3JlT3duUHJvcGVydHlDaGFuZ2UodGhpcywgTEVOR1RILCB0aGlzLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoQmVmb3JlUmFuZ2VDaGFuZ2UocGx1cywgbWludXMsIHN0YXJ0KTtcbiAgICAgICAgICAgIGlmIChkaWZmID09PSAwKSB7IC8vIHN1YnN0cmluZyByZXBsYWNlbWVudFxuICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoQmVmb3JlT3duUHJvcGVydHlDaGFuZ2Uoc3RhcnQsIDEpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICgoaGFzT3duUHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yID0gUHJvcGVydHlDaGFuZ2VzLmhhc093blByb3BlcnR5Q2hhbmdlRGVzY3JpcHRvcih0aGlzKSkpIHtcbiAgICAgICAgICAgICAgICAvLyBhbGwgc3Vic2VxdWVudCB2YWx1ZXMgY2hhbmdlZCBvciBzaGlmdGVkLlxuICAgICAgICAgICAgICAgIC8vIGF2b2lkIChsb25nZXN0IC0gc3RhcnQpIGxvbmcgd2Fsa3MgaWYgdGhlcmUgYXJlIG5vXG4gICAgICAgICAgICAgICAgLy8gcmVnaXN0ZXJlZCBkZXNjcmlwdG9ycy5cbiAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEJlZm9yZU93blByb3BlcnR5Q2hhbmdlKHN0YXJ0LCBkaWZmKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpc1tpbmRleF0gPSB2YWx1ZTtcblxuICAgICAgICAgICAgLy8gZGlzcGF0Y2ggYWZ0ZXIgY2hhbmdlIGV2ZW50c1xuICAgICAgICAgICAgaWYgKGRpZmYgPT09IDApIHsgLy8gc3Vic3RyaW5nIHJlcGxhY2VtZW50XG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hPd25Qcm9wZXJ0eUNoYW5nZShzdGFydCwxKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoaGFzT3duUHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICAgICAgLy8gYWxsIHN1YnNlcXVlbnQgdmFsdWVzIGNoYW5nZWQgb3Igc2hpZnRlZC5cbiAgICAgICAgICAgICAgICAvLyBhdm9pZCAobG9uZ2VzdCAtIHN0YXJ0KSBsb25nIHdhbGtzIGlmIHRoZXJlIGFyZSBub1xuICAgICAgICAgICAgICAgIC8vIHJlZ2lzdGVyZWQgZGVzY3JpcHRvcnMuXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlzcGF0Y2hPd25Qcm9wZXJ0eUNoYW5nZShzdGFydCxkaWZmKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSYW5nZUNoYW5nZShwbHVzLCBtaW51cywgc3RhcnQpO1xuICAgICAgICAgICAgaWYgKGRpZmYpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoT3duUHJvcGVydHlDaGFuZ2UoTEVOR1RILCB0aGlzLmxlbmd0aCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBzaGlmdDoge1xuICAgICAgICB2YWx1ZTogZnVuY3Rpb24gc2hpZnQoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zcGxpY2UoMCwgMSlbMF07XG4gICAgICAgIH0sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9LFxuXG4gICAgcG9wOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBwb3AoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zcGxpY2UodGhpcy5sZW5ndGggLSAxLCAxKVswXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0sXG5cbiAgICBwdXNoOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBwdXNoKGFyZykge1xuICAgICAgICAgICAgdmFyIHN0YXJ0ID0gdGhpcy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgYWRkZWRDb3VudCA9IGFyZ3VtZW50cy5sZW5ndGgsXG4gICAgICAgICAgICAgICAgYXJnQXJyYXksXG4gICAgICAgICAgICAgICAgaGFzT3duUHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yO1xuXG4gICAgICAgICAgICBhcmdBcnJheSA9IGFkZGVkQ291bnQgPT09IDEgPyBbYXJndW1lbnRzWzBdXSA6IEFycmF5LmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG5cbiAgICAgICAgICAgIGlmKGFkZGVkQ291bnQgPiAwKSB7XG4gICAgICAgICAgICAgICAgUHJvcGVydHlDaGFuZ2VzLmRpc3BhdGNoQmVmb3JlT3duUHJvcGVydHlDaGFuZ2UodGhpcywgTEVOR1RILCBzdGFydCk7XG4gICAgICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEJlZm9yZVJhbmdlQ2hhbmdlKGFyZ0FycmF5LCBBcnJheS5lbXB0eSwgc3RhcnQpO1xuXG4gICAgICAgICAgICAgICAgaWYoaGFzT3duUHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yID0gUHJvcGVydHlDaGFuZ2VzLmhhc093blByb3BlcnR5Q2hhbmdlRGVzY3JpcHRvcih0aGlzKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9kaXNwYXRjaEJlZm9yZU93blByb3BlcnR5Q2hhbmdlKHN0YXJ0LCBhZGRlZENvdW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGFycmF5X3B1c2guYXBwbHkodGhpcyxhcmd1bWVudHMpO1xuXG4gICAgICAgICAgICBpZiAoYWRkZWRDb3VudCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZiAoaGFzT3duUHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2Rpc3BhdGNoT3duUHJvcGVydHlDaGFuZ2Uoc3RhcnQsYWRkZWRDb3VudCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSYW5nZUNoYW5nZShhcmdBcnJheSxBcnJheS5lbXB0eSwgc3RhcnQpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hPd25Qcm9wZXJ0eUNoYW5nZShMRU5HVEgsIHRoaXMubGVuZ3RoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSxcblxuICAgIHVuc2hpZnQ6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIHVuc2hpZnQoYXJnKSB7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNwbGljZSgwLCAwLCBhcmcpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB2YXIgYXJncyA9IGFycmF5X3NsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zd2FwKDAsIDAsIGFyZ3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSxcblxuICAgIGNsZWFyOiB7XG4gICAgICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnNwbGljZSgwLCB0aGlzLmxlbmd0aCk7XG4gICAgICAgIH0sXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG5cbn07XG5cbnZhciBDaGFuZ2VEaXNwYXRjaEFycmF5ID0gT2JqZWN0LmNyZWF0ZShBcnJheS5wcm90b3R5cGUsIG9ic2VydmFibGVBcnJheVByb3BlcnRpZXMpO1xuZXhwb3J0cy5vYnNlcnZhYmxlQXJyYXlQcm9wZXJ0aWVzID0gb2JzZXJ2YWJsZUFycmF5UHJvcGVydGllcztcblxudmFyIFByb3BlcnR5Q2hhbmdlcyA9IHJlcXVpcmUoXCIuL3Byb3BlcnR5LWNoYW5nZXNcIik7XG52YXIgUmFuZ2VDaGFuZ2VzID0gcmVxdWlyZShcIi4vcmFuZ2UtY2hhbmdlc1wiKTtcbnZhciBNYXBDaGFuZ2VzID0gcmVxdWlyZShcIi4vbWFwLWNoYW5nZXNcIik7XG5cbk9iamVjdC5kZWZpbmVFYWNoKEFycmF5LnByb3RvdHlwZSwgUHJvcGVydHlDaGFuZ2VzLnByb3RvdHlwZSwgZmFsc2UsIC8qY29uZmlndXJhYmxlKi90cnVlLCAvKmVudW1lcmFibGUqLyBmYWxzZSwgLyp3cml0YWJsZSovdHJ1ZSk7XG5PYmplY3QuZGVmaW5lRWFjaChBcnJheS5wcm90b3R5cGUsIFJhbmdlQ2hhbmdlcy5wcm90b3R5cGUsIGZhbHNlLCAvKmNvbmZpZ3VyYWJsZSovdHJ1ZSwgLyplbnVtZXJhYmxlKi8gZmFsc2UsIC8qd3JpdGFibGUqL3RydWUpO1xuT2JqZWN0LmRlZmluZUVhY2goQXJyYXkucHJvdG90eXBlLCBNYXBDaGFuZ2VzLnByb3RvdHlwZSwgZmFsc2UsIC8qY29uZmlndXJhYmxlKi90cnVlLCAvKmVudW1lcmFibGUqLyBmYWxzZSwgLyp3cml0YWJsZSovdHJ1ZSk7XG4iXX0=