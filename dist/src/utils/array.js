"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.array_remove_empties = array_remove_empties;
exports.array_unique = array_unique;
exports.remove_array_item_from = remove_array_item_from;
/**
 * remove empties from array
 * @param arr
 * @returns
 */
function array_remove_empties(arr) {
    return arr.filter((item) => {
        if (typeof item === 'string')
            return item.length > 0;
        if (Array.isArray(item))
            return item.length > 0;
        return true;
    });
}
/**
 * Array unique
 * @param arrays
 */
function array_unique(arrays) {
    return arrays.filter(function (item, pos, self) {
        return self.indexOf(item) == pos;
    });
}
/**
 * Remove array item from another array
 * @param myArray
 * @param toRemove
 * @returns
 */
function remove_array_item_from(myArray, toRemove) {
    return myArray.filter((el) => !toRemove.includes(el));
}
