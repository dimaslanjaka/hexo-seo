"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove_array_item_from = exports.array_unique = exports.array_remove_empties = void 0;
/**
 * remove empties from array
 * @param arr
 * @returns
 */
function array_remove_empties(arr) {
    return arr.filter(function (item) {
        if (typeof item === 'string')
            return item.length > 0;
        if (Array.isArray(item))
            return item.length > 0;
        return true;
    });
}
exports.array_remove_empties = array_remove_empties;
/**
 * Array unique
 * @param arrays
 */
function array_unique(arrays) {
    return arrays.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
    });
}
exports.array_unique = array_unique;
/**
 * Remove array item from another array
 * @param myArray
 * @param toRemove
 * @returns
 */
function remove_array_item_from(myArray, toRemove) {
    return myArray.filter(function (el) { return !toRemove.includes(el); });
}
exports.remove_array_item_from = remove_array_item_from;
