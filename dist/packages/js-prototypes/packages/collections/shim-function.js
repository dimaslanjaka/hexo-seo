"use strict";
module.exports = Function;
/**
    A utility to reduce unnecessary allocations of <code>function () {}</code>
    in its many colorful variations.  It does nothing and returns
    <code>undefined</code> thus makes a suitable default in some circumstances.

    @function external:Function.noop
*/
Function.noop = function () {
};
/**
    A utility to reduce unnecessary allocations of <code>function (x) {return
    x}</code> in its many colorful but ultimately wasteful parameter name
    variations.

    @function external:Function.identity
    @param {Any} any value
    @returns {Any} that value
*/
Function.identity = function (value) {
    return value;
};
/**
    A utility for creating a comparator function for a particular aspect of a
    figurative class of objects.

    @function external:Function.by
    @param {Function} relation A function that accepts a value and returns a
    corresponding value to use as a representative when sorting that object.
    @param {Function} compare an alternate comparator for comparing the
    represented values.  The default is <code>Object.compare</code>, which
    does a deep, type-sensitive, polymorphic comparison.
    @returns {Function} a comparator that has been annotated with
    <code>by</code> and <code>compare</code> properties so
    <code>sorted</code> can perform a transform that reduces the need to call
    <code>by</code> on each sorted object to just once.
 */
Function.by = function (by, compare) {
    compare = compare || Object.compare;
    by = by || Function.identity;
    var compareBy = function (a, b) {
        return compare(by(a), by(b));
    };
    compareBy.compare = compare;
    compareBy.by = by;
    return compareBy;
};
// TODO document
Function.get = function (key) {
    return function (object) {
        return Object.get(object, key);
    };
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpbS1mdW5jdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvanMtcHJvdG90eXBlcy9wYWNrYWdlcy9jb2xsZWN0aW9ucy9zaGltLWZ1bmN0aW9uLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxNQUFNLENBQUMsT0FBTyxHQUFHLFFBQVEsQ0FBQztBQUUxQjs7Ozs7O0VBTUU7QUFDRixRQUFRLENBQUMsSUFBSSxHQUFHO0FBQ2hCLENBQUMsQ0FBQztBQUVGOzs7Ozs7OztFQVFFO0FBQ0YsUUFBUSxDQUFDLFFBQVEsR0FBRyxVQUFVLEtBQUs7SUFDL0IsT0FBTyxLQUFLLENBQUM7QUFDakIsQ0FBQyxDQUFDO0FBRUY7Ozs7Ozs7Ozs7Ozs7O0dBY0c7QUFDSCxRQUFRLENBQUMsRUFBRSxHQUFHLFVBQVUsRUFBRSxFQUFHLE9BQU87SUFDaEMsT0FBTyxHQUFHLE9BQU8sSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ3BDLEVBQUUsR0FBRyxFQUFFLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQztJQUM3QixJQUFJLFNBQVMsR0FBRyxVQUFVLENBQUMsRUFBRSxDQUFDO1FBQzFCLE9BQU8sT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNqQyxDQUFDLENBQUM7SUFDRixTQUFTLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztJQUM1QixTQUFTLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUNsQixPQUFPLFNBQVMsQ0FBQztBQUNyQixDQUFDLENBQUM7QUFFRixnQkFBZ0I7QUFDaEIsUUFBUSxDQUFDLEdBQUcsR0FBRyxVQUFVLEdBQUc7SUFDeEIsT0FBTyxVQUFVLE1BQU07UUFDbkIsT0FBTyxNQUFNLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztJQUNuQyxDQUFDLENBQUM7QUFDTixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbm1vZHVsZS5leHBvcnRzID0gRnVuY3Rpb247XG5cbi8qKlxuICAgIEEgdXRpbGl0eSB0byByZWR1Y2UgdW5uZWNlc3NhcnkgYWxsb2NhdGlvbnMgb2YgPGNvZGU+ZnVuY3Rpb24gKCkge308L2NvZGU+XG4gICAgaW4gaXRzIG1hbnkgY29sb3JmdWwgdmFyaWF0aW9ucy4gIEl0IGRvZXMgbm90aGluZyBhbmQgcmV0dXJuc1xuICAgIDxjb2RlPnVuZGVmaW5lZDwvY29kZT4gdGh1cyBtYWtlcyBhIHN1aXRhYmxlIGRlZmF1bHQgaW4gc29tZSBjaXJjdW1zdGFuY2VzLlxuXG4gICAgQGZ1bmN0aW9uIGV4dGVybmFsOkZ1bmN0aW9uLm5vb3BcbiovXG5GdW5jdGlvbi5ub29wID0gZnVuY3Rpb24gKCkge1xufTtcblxuLyoqXG4gICAgQSB1dGlsaXR5IHRvIHJlZHVjZSB1bm5lY2Vzc2FyeSBhbGxvY2F0aW9ucyBvZiA8Y29kZT5mdW5jdGlvbiAoeCkge3JldHVyblxuICAgIHh9PC9jb2RlPiBpbiBpdHMgbWFueSBjb2xvcmZ1bCBidXQgdWx0aW1hdGVseSB3YXN0ZWZ1bCBwYXJhbWV0ZXIgbmFtZVxuICAgIHZhcmlhdGlvbnMuXG5cbiAgICBAZnVuY3Rpb24gZXh0ZXJuYWw6RnVuY3Rpb24uaWRlbnRpdHlcbiAgICBAcGFyYW0ge0FueX0gYW55IHZhbHVlXG4gICAgQHJldHVybnMge0FueX0gdGhhdCB2YWx1ZVxuKi9cbkZ1bmN0aW9uLmlkZW50aXR5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xufTtcblxuLyoqXG4gICAgQSB1dGlsaXR5IGZvciBjcmVhdGluZyBhIGNvbXBhcmF0b3IgZnVuY3Rpb24gZm9yIGEgcGFydGljdWxhciBhc3BlY3Qgb2YgYVxuICAgIGZpZ3VyYXRpdmUgY2xhc3Mgb2Ygb2JqZWN0cy5cblxuICAgIEBmdW5jdGlvbiBleHRlcm5hbDpGdW5jdGlvbi5ieVxuICAgIEBwYXJhbSB7RnVuY3Rpb259IHJlbGF0aW9uIEEgZnVuY3Rpb24gdGhhdCBhY2NlcHRzIGEgdmFsdWUgYW5kIHJldHVybnMgYVxuICAgIGNvcnJlc3BvbmRpbmcgdmFsdWUgdG8gdXNlIGFzIGEgcmVwcmVzZW50YXRpdmUgd2hlbiBzb3J0aW5nIHRoYXQgb2JqZWN0LlxuICAgIEBwYXJhbSB7RnVuY3Rpb259IGNvbXBhcmUgYW4gYWx0ZXJuYXRlIGNvbXBhcmF0b3IgZm9yIGNvbXBhcmluZyB0aGVcbiAgICByZXByZXNlbnRlZCB2YWx1ZXMuICBUaGUgZGVmYXVsdCBpcyA8Y29kZT5PYmplY3QuY29tcGFyZTwvY29kZT4sIHdoaWNoXG4gICAgZG9lcyBhIGRlZXAsIHR5cGUtc2Vuc2l0aXZlLCBwb2x5bW9ycGhpYyBjb21wYXJpc29uLlxuICAgIEByZXR1cm5zIHtGdW5jdGlvbn0gYSBjb21wYXJhdG9yIHRoYXQgaGFzIGJlZW4gYW5ub3RhdGVkIHdpdGhcbiAgICA8Y29kZT5ieTwvY29kZT4gYW5kIDxjb2RlPmNvbXBhcmU8L2NvZGU+IHByb3BlcnRpZXMgc29cbiAgICA8Y29kZT5zb3J0ZWQ8L2NvZGU+IGNhbiBwZXJmb3JtIGEgdHJhbnNmb3JtIHRoYXQgcmVkdWNlcyB0aGUgbmVlZCB0byBjYWxsXG4gICAgPGNvZGU+Ynk8L2NvZGU+IG9uIGVhY2ggc29ydGVkIG9iamVjdCB0byBqdXN0IG9uY2UuXG4gKi9cbkZ1bmN0aW9uLmJ5ID0gZnVuY3Rpb24gKGJ5ICwgY29tcGFyZSkge1xuICAgIGNvbXBhcmUgPSBjb21wYXJlIHx8IE9iamVjdC5jb21wYXJlO1xuICAgIGJ5ID0gYnkgfHwgRnVuY3Rpb24uaWRlbnRpdHk7XG4gICAgdmFyIGNvbXBhcmVCeSA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBjb21wYXJlKGJ5KGEpLCBieShiKSk7XG4gICAgfTtcbiAgICBjb21wYXJlQnkuY29tcGFyZSA9IGNvbXBhcmU7XG4gICAgY29tcGFyZUJ5LmJ5ID0gYnk7XG4gICAgcmV0dXJuIGNvbXBhcmVCeTtcbn07XG5cbi8vIFRPRE8gZG9jdW1lbnRcbkZ1bmN0aW9uLmdldCA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKG9iamVjdCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmdldChvYmplY3QsIGtleSk7XG4gICAgfTtcbn07XG5cbiJdfQ==