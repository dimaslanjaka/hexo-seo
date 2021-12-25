"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringify = exports.parse = void 0;
/**
 * JSON.parse with fallback value
 * @param json
 * @param fallback
 * @returns
 */
function parse(json, fallback) {
    try {
        return JSON.parse(json);
    }
    catch (e) {
        return fallback;
    }
}
exports.parse = parse;
function stringify(object) {
    return JSON.stringify(object);
}
exports.stringify = stringify;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoianNvbi5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsic3JjL2pzb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUE7Ozs7O0dBS0c7QUFDSCxTQUFnQixLQUFLLENBQUMsSUFBWSxFQUFFLFFBQWM7SUFDaEQsSUFBSTtRQUNGLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN6QjtJQUFDLE9BQU8sQ0FBQyxFQUFFO1FBQ1YsT0FBTyxRQUFRLENBQUM7S0FDakI7QUFDSCxDQUFDO0FBTkQsc0JBTUM7QUFFRCxTQUFnQixTQUFTLENBQUMsTUFBYztJQUN0QyxPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDaEMsQ0FBQztBQUZELDhCQUVDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBKU09OLnBhcnNlIHdpdGggZmFsbGJhY2sgdmFsdWVcbiAqIEBwYXJhbSBqc29uXG4gKiBAcGFyYW0gZmFsbGJhY2tcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZShqc29uOiBzdHJpbmcsIGZhbGxiYWNrPzogYW55KSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIEpTT04ucGFyc2UoanNvbik7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsbGJhY2s7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHN0cmluZ2lmeShvYmplY3Q6IG9iamVjdCkge1xuICByZXR1cm4gSlNPTi5zdHJpbmdpZnkob2JqZWN0KTtcbn1cbiJdfQ==