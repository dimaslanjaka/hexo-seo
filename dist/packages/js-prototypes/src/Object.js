"use strict";
/* eslint-disable no-prototype-builtins */
/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="Object.d.ts" />
Object.size = function (obj) {
    let size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key))
            size++;
    }
    return size;
};
Object.child = function (str, callback) {
    const self = this;
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
    const self = this;
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
    for (const key in this) {
        //callback.call(scope, key, this[key]);
        callback.call(this[key]);
    }
};
Object.isEmpty = function () {
    return this.length === 0;
};
Object.replaceKeyFrom = function (anotherObj) {
    return Object.entries(this).reduce((op, [key, value]) => {
        const newKey = anotherObj[key];
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
    const result = {};
    for (const prop in arg1) {
        if (arg1.hasOwnProperty(prop)) {
            // error when using --strictNullChecks
            result[prop] = arg1[prop];
        }
    }
    for (const prop in arg2) {
        if (arg2.hasOwnProperty(prop)) {
            // error when using --strictNullChecks
            result[prop] = arg2[prop];
        }
    }
    return result;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiT2JqZWN0LmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9qcy1wcm90b3R5cGVzL3NyYy9PYmplY3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBDQUEwQztBQUMxQyw4REFBOEQ7QUFDOUQsb0NBQW9DO0FBRXBDLE1BQU0sQ0FBQyxJQUFJLEdBQUcsVUFBVSxHQUFHO0lBQ3pCLElBQUksSUFBSSxHQUFHLENBQUMsRUFDVixHQUFRLENBQUM7SUFDWCxLQUFLLEdBQUcsSUFBSSxHQUFHLEVBQUU7UUFDZixJQUFJLEdBQUcsQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDO1lBQUUsSUFBSSxFQUFFLENBQUM7S0FDckM7SUFDRCxPQUFPLElBQUksQ0FBQztBQUNkLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxLQUFLLEdBQUcsVUFBVSxHQUFHLEVBQUUsUUFBUTtJQUNwQyxNQUFNLElBQUksR0FBVyxJQUFJLENBQUM7SUFDMUIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQzVCLElBQUksT0FBTyxRQUFRLElBQUksVUFBVSxFQUFFO1lBQ2pDLE9BQU8sUUFBUSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1NBQzVCO2FBQU07WUFDTCxPQUFPLElBQUksQ0FBQztTQUNiO0tBQ0Y7U0FBTTtRQUNMLE9BQU8sU0FBUyxDQUFDO0tBQ2xCO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLEdBQUcsR0FBRyxVQUFVLEdBQUcsRUFBRSxXQUFXO0lBQ3JDLE1BQU0sSUFBSSxHQUFRLElBQUksQ0FBQztJQUN2QixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUU7UUFDNUIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7S0FDbEI7U0FBTTtRQUNMLE9BQU8sV0FBVyxDQUFDO0tBQ3BCO0FBQ0gsQ0FBQyxDQUFDO0FBRUYsTUFBTSxDQUFDLEdBQUcsR0FBRyxVQUFVLEdBQW9CO0lBQ3pDLE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNsQyxDQUFDLENBQUM7QUFFRixNQUFNLENBQUMsSUFBSSxHQUFHLFVBQVUsUUFBUTtJQUM5QixLQUFLLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRTtRQUN0Qix1Q0FBdUM7UUFDdkMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztLQUMxQjtBQUNILENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDZixPQUFPLElBQUksQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDO0FBQzNCLENBQUMsQ0FBQztBQUVGLE1BQU0sQ0FBQyxjQUFjLEdBQUcsVUFBVSxVQUFVO0lBQzFDLE9BQU8sTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxHQUFHLEVBQUUsS0FBSyxDQUFDLEVBQUUsRUFBRTtRQUN0RCxNQUFNLE1BQU0sR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsRUFBRSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsR0FBRyxLQUFLLENBQUM7UUFDMUIsT0FBTyxFQUFFLENBQUM7SUFDWixDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDUDs7Ozs7OztPQU9HO0FBQ0wsQ0FBQyxDQUFDO0FBRUY7Ozs7R0FJRztBQUNILFNBQVMsV0FBVyxDQUFDLEdBQXlCO0lBQzVDLE9BQU8sTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUM7U0FDcEIsR0FBRyxDQUFDLFVBQVUsQ0FBQztRQUNkLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hCLENBQUMsQ0FBQztTQUNELElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNmLENBQUM7QUFFRDs7Ozs7R0FLRztBQUNILFNBQVMsYUFBYSxDQUdwQixJQUFRLEVBQUUsSUFBUTtJQUNsQixNQUFNLE1BQU0sR0FBcUIsRUFBRSxDQUFDO0lBQ3BDLEtBQUssTUFBTSxJQUFJLElBQUksSUFBSSxFQUFFO1FBQ3ZCLElBQUksSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUM3QixzQ0FBc0M7WUFDckMsTUFBYSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNuQztLQUNGO0lBQ0QsS0FBSyxNQUFNLElBQUksSUFBSSxJQUFJLEVBQUU7UUFDdkIsSUFBSSxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQzdCLHNDQUFzQztZQUNyQyxNQUFhLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25DO0tBQ0Y7SUFDRCxPQUFPLE1BQWlCLENBQUM7QUFDM0IsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvdHlwZS1idWlsdGlucyAqL1xuLyogZXNsaW50LWRpc2FibGUgQHR5cGVzY3JpcHQtZXNsaW50L3RyaXBsZS1zbGFzaC1yZWZlcmVuY2UgKi9cbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJPYmplY3QuZC50c1wiIC8+XG5cbk9iamVjdC5zaXplID0gZnVuY3Rpb24gKG9iaikge1xuICBsZXQgc2l6ZSA9IDAsXG4gICAga2V5OiBhbnk7XG4gIGZvciAoa2V5IGluIG9iaikge1xuICAgIGlmIChvYmouaGFzT3duUHJvcGVydHkoa2V5KSkgc2l6ZSsrO1xuICB9XG4gIHJldHVybiBzaXplO1xufTtcblxuT2JqZWN0LmNoaWxkID0gZnVuY3Rpb24gKHN0ciwgY2FsbGJhY2spIHtcbiAgY29uc3Qgc2VsZjogb2JqZWN0ID0gdGhpcztcbiAgaWYgKHNlbGYuaGFzT3duUHJvcGVydHkoc3RyKSkge1xuICAgIGlmICh0eXBlb2YgY2FsbGJhY2sgPT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soc2VsZltzdHJdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cbn07XG5cbk9iamVjdC5hbHQgPSBmdW5jdGlvbiAoc3RyLCBhbHRlcm5hdGl2ZSkge1xuICBjb25zdCBzZWxmOiBhbnkgPSB0aGlzO1xuICBpZiAoc2VsZi5oYXNPd25Qcm9wZXJ0eShzdHIpKSB7XG4gICAgcmV0dXJuIHNlbGZbc3RyXTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYWx0ZXJuYXRpdmU7XG4gIH1cbn07XG5cbk9iamVjdC5oYXMgPSBmdW5jdGlvbiAoc3RyOiBzdHJpbmcgfCBudW1iZXIpIHtcbiAgcmV0dXJuIHRoaXMuaGFzT3duUHJvcGVydHkoc3RyKTtcbn07XG5cbk9iamVjdC5lYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIGZvciAoY29uc3Qga2V5IGluIHRoaXMpIHtcbiAgICAvL2NhbGxiYWNrLmNhbGwoc2NvcGUsIGtleSwgdGhpc1trZXldKTtcbiAgICBjYWxsYmFjay5jYWxsKHRoaXNba2V5XSk7XG4gIH1cbn07XG5cbk9iamVjdC5pc0VtcHR5ID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5sZW5ndGggPT09IDA7XG59O1xuXG5PYmplY3QucmVwbGFjZUtleUZyb20gPSBmdW5jdGlvbiAoYW5vdGhlck9iaikge1xuICByZXR1cm4gT2JqZWN0LmVudHJpZXModGhpcykucmVkdWNlKChvcCwgW2tleSwgdmFsdWVdKSA9PiB7XG4gICAgY29uc3QgbmV3S2V5ID0gYW5vdGhlck9ialtrZXldO1xuICAgIG9wW25ld0tleSB8fCBrZXldID0gdmFsdWU7XG4gICAgcmV0dXJuIG9wO1xuICB9LCB7fSk7XG4gIC8qaWYgKHR5cGVvZiBhbm90aGVyT2JqID09ICdvYmplY3QnKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gYW5vdGhlck9iaikge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhbm90aGVyT2JqLCBrZXkpKSB7XG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSBhbm90aGVyT2JqW2tleV07XG4gICAgICAgIGRlZltrZXldID0gZWxlbWVudDtcbiAgICAgIH1cbiAgICB9XG4gIH0qL1xufTtcblxuLyoqXG4gKiBKb2luIG9iamVjdCB0byBzZXBhcmF0ZWQgc3RyaW5nXG4gKiBAcGFyYW0gb2JqIE9iamVjdFxuICogQHJldHVybnMgSm9pbmVkIHN0cmluZ1xuICovXG5mdW5jdGlvbiBvYmplY3Rfam9pbihvYmo6IFJlY29yZDxhbnksIHVua25vd24+KSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhvYmopXG4gICAgLm1hcChmdW5jdGlvbiAoaykge1xuICAgICAgcmV0dXJuIG9ialtrXTtcbiAgICB9KVxuICAgIC5qb2luKFwiLFwiKTtcbn1cblxuLyoqXG4gKiBFeHRlbmQgT2JqZWN0XG4gKiBAcGFyYW0gYXJnMVxuICogQHBhcmFtIGFyZzJcbiAqIEByZXR1cm5zXG4gKi9cbmZ1bmN0aW9uIGV4dGVuZF9vYmplY3Q8XG4gIFQxIGV4dGVuZHMgUmVjb3JkPGFueSwgdW5rbm93bj4sXG4gIFQyIGV4dGVuZHMgUmVjb3JkPGFueSwgdW5rbm93bj5cbj4oYXJnMTogVDEsIGFyZzI6IFQyKTogVDEgJiBUMiB7XG4gIGNvbnN0IHJlc3VsdDogUGFydGlhbDxUMSAmIFQyPiA9IHt9O1xuICBmb3IgKGNvbnN0IHByb3AgaW4gYXJnMSkge1xuICAgIGlmIChhcmcxLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAvLyBlcnJvciB3aGVuIHVzaW5nIC0tc3RyaWN0TnVsbENoZWNrc1xuICAgICAgKHJlc3VsdCBhcyBUMSlbcHJvcF0gPSBhcmcxW3Byb3BdO1xuICAgIH1cbiAgfVxuICBmb3IgKGNvbnN0IHByb3AgaW4gYXJnMikge1xuICAgIGlmIChhcmcyLmhhc093blByb3BlcnR5KHByb3ApKSB7XG4gICAgICAvLyBlcnJvciB3aGVuIHVzaW5nIC0tc3RyaWN0TnVsbENoZWNrc1xuICAgICAgKHJlc3VsdCBhcyBUMilbcHJvcF0gPSBhcmcyW3Byb3BdO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0IGFzIFQxICYgVDI7XG59XG4iXX0=