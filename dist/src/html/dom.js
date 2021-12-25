"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextPartialHtml = exports.parseJSDOM = exports._JSDOM = void 0;
const jsdom_1 = require("jsdom");
class _JSDOM {
    constructor(str, options) {
        this.dom = new jsdom_1.JSDOM(str, options);
        this.window = this.dom.window;
        this.document = this.dom.window.document;
    }
    /**
     * Get JSDOM instances
     */
    getDom() {
        return this.dom;
    }
    /**
     * Transform html string to Node
     * @param html
     * @returns
     */
    toNode(html) {
        return getTextPartialHtml(html, this.options);
    }
    /**
     * serializing html / fix invalid html
     * @returns serialized html
     */
    serialize() {
        return this.dom.serialize();
    }
    /**
     * Return Modified html (without serialization)
     */
    toString() {
        return this.document.documentElement.outerHTML;
    }
}
exports._JSDOM = _JSDOM;
let dom;
function parseJSDOM(text) {
    dom = new _JSDOM(text);
    return dom;
}
exports.parseJSDOM = parseJSDOM;
/**
 * Get text from partial html
 * @param text
 * @param options
 * @returns
 */
function getTextPartialHtml(text, options) {
    dom = new _JSDOM(`<div id="parseJSDOM">${text}</div>`, options);
    const document = dom.window.document;
    return document.querySelector("div#parseJSDOM").textContent;
}
exports.getTextPartialHtml = getTextPartialHtml;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJzcmMvaHRtbC9kb20udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsaUNBQW9FO0FBRXBFLE1BQWEsTUFBTTtJQUtqQixZQUFZLEdBQXFCLEVBQUUsT0FBNEI7UUFDN0QsSUFBSSxDQUFDLEdBQUcsR0FBRyxJQUFJLGFBQUssQ0FBQyxHQUFHLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQztRQUM5QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztJQUMzQyxDQUFDO0lBQ0Q7O09BRUc7SUFDSCxNQUFNO1FBQ0osT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDO0lBQ2xCLENBQUM7SUFDRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLElBQVk7UUFDakIsT0FBTyxrQkFBa0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDRDs7O09BR0c7SUFDSCxTQUFTO1FBQ1AsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFDRDs7T0FFRztJQUNILFFBQVE7UUFDTixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsZUFBZSxDQUFDLFNBQVMsQ0FBQztJQUNqRCxDQUFDO0NBQ0Y7QUFyQ0Qsd0JBcUNDO0FBRUQsSUFBSSxHQUFXLENBQUM7QUFDaEIsU0FBZ0IsVUFBVSxDQUFDLElBQVk7SUFDckMsR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3ZCLE9BQU8sR0FBRyxDQUFDO0FBQ2IsQ0FBQztBQUhELGdDQUdDO0FBRUQ7Ozs7O0dBS0c7QUFDSCxTQUFnQixrQkFBa0IsQ0FDaEMsSUFBWSxFQUNaLE9BQWtDO0lBRWxDLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyx3QkFBd0IsSUFBSSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUM7SUFDaEUsTUFBTSxRQUFRLEdBQWEsR0FBRyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7SUFDL0MsT0FBTyxRQUFRLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLENBQUMsV0FBVyxDQUFDO0FBQzlELENBQUM7QUFQRCxnREFPQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBqc2RvbSwgeyBDb25zdHJ1Y3Rvck9wdGlvbnMsIERPTVdpbmRvdywgSlNET00gfSBmcm9tIFwianNkb21cIjtcblxuZXhwb3J0IGNsYXNzIF9KU0RPTSB7XG4gIHByaXZhdGUgZG9tOiBKU0RPTTtcbiAgZG9jdW1lbnQ6IERvY3VtZW50O1xuICB3aW5kb3c6IERPTVdpbmRvdztcbiAgb3B0aW9uczogQ29uc3RydWN0b3JPcHRpb25zO1xuICBjb25zdHJ1Y3RvcihzdHI/OiBzdHJpbmcgfCBCdWZmZXIsIG9wdGlvbnM/OiBDb25zdHJ1Y3Rvck9wdGlvbnMpIHtcbiAgICB0aGlzLmRvbSA9IG5ldyBKU0RPTShzdHIsIG9wdGlvbnMpO1xuICAgIHRoaXMud2luZG93ID0gdGhpcy5kb20ud2luZG93O1xuICAgIHRoaXMuZG9jdW1lbnQgPSB0aGlzLmRvbS53aW5kb3cuZG9jdW1lbnQ7XG4gIH1cbiAgLyoqXG4gICAqIEdldCBKU0RPTSBpbnN0YW5jZXNcbiAgICovXG4gIGdldERvbSgpIHtcbiAgICByZXR1cm4gdGhpcy5kb207XG4gIH1cbiAgLyoqXG4gICAqIFRyYW5zZm9ybSBodG1sIHN0cmluZyB0byBOb2RlXG4gICAqIEBwYXJhbSBodG1sXG4gICAqIEByZXR1cm5zXG4gICAqL1xuICB0b05vZGUoaHRtbDogc3RyaW5nKSB7XG4gICAgcmV0dXJuIGdldFRleHRQYXJ0aWFsSHRtbChodG1sLCB0aGlzLm9wdGlvbnMpO1xuICB9XG4gIC8qKlxuICAgKiBzZXJpYWxpemluZyBodG1sIC8gZml4IGludmFsaWQgaHRtbFxuICAgKiBAcmV0dXJucyBzZXJpYWxpemVkIGh0bWxcbiAgICovXG4gIHNlcmlhbGl6ZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmRvbS5zZXJpYWxpemUoKTtcbiAgfVxuICAvKipcbiAgICogUmV0dXJuIE1vZGlmaWVkIGh0bWwgKHdpdGhvdXQgc2VyaWFsaXphdGlvbilcbiAgICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLmRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5vdXRlckhUTUw7XG4gIH1cbn1cblxubGV0IGRvbTogX0pTRE9NO1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlSlNET00odGV4dDogc3RyaW5nKSB7XG4gIGRvbSA9IG5ldyBfSlNET00odGV4dCk7XG4gIHJldHVybiBkb207XG59XG5cbi8qKlxuICogR2V0IHRleHQgZnJvbSBwYXJ0aWFsIGh0bWxcbiAqIEBwYXJhbSB0ZXh0XG4gKiBAcGFyYW0gb3B0aW9uc1xuICogQHJldHVybnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFRleHRQYXJ0aWFsSHRtbChcbiAgdGV4dDogc3RyaW5nLFxuICBvcHRpb25zPzoganNkb20uQ29uc3RydWN0b3JPcHRpb25zXG4pIHtcbiAgZG9tID0gbmV3IF9KU0RPTShgPGRpdiBpZD1cInBhcnNlSlNET01cIj4ke3RleHR9PC9kaXY+YCwgb3B0aW9ucyk7XG4gIGNvbnN0IGRvY3VtZW50OiBEb2N1bWVudCA9IGRvbS53aW5kb3cuZG9jdW1lbnQ7XG4gIHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiZGl2I3BhcnNlSlNET01cIikudGV4dENvbnRlbnQ7XG59XG4iXX0=