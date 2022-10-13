/**
 * remove empties from array
 * @param arr
 * @returns
 */
export function array_remove_empties<T extends any[]>(arr: T) {
  return arr.filter((item) => {
    if (typeof item === "string") return item.length > 0;
    if (Array.isArray(item)) return item.length > 0;
    return true;
  });
}

/**
 * Array unique
 * @param arrays
 */
export function array_unique<T extends any[]>(arrays: T) {
  return arrays.filter(function (item, pos, self) {
    return self.indexOf(item) == pos;
  }) as T;
}

export function remove_array_item_from<T extends any[]>(myArray: T, toRemove: T) {
  return myArray.filter((ar) => !toRemove.find((rm) => rm.name === ar.name && ar.place === rm.place)) as T;
}
