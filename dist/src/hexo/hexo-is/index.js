"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hexoIsDump = void 0;
const hexo_log_1 = __importDefault(require("hexo-log"));
const package_json_1 = __importDefault(require("./package.json"));
const fs = __importStar(require("fs"));
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
const is_1 = __importDefault(require("./is"));
const log = (0, hexo_log_1.default)({
    debug: false,
    silent: false
});
/**
 * @example
 * // run inside plugin or theme event
 * import hexoIs from 'hexo-is';
 * const hexo = this;
 * console.log(hexoIs(hexo)); // object or string
 * @param hexo
 * @returns
 */
const hexoIs = function (hexo) {
    if (typeof hexo["page"] != "undefined")
        return (0, is_1.default)(hexo);
    if (typeof hexo["type"] != "undefined") {
        const ix = (0, is_1.default)(hexo);
        if (typeof ix[hexo["type"]] != "undefined")
            ix[hexo["type"]] = true;
        return ix;
    }
};
/**
 * Dump variable to file
 * @param toDump
 */
function hexoIsDump(toDump, name = "") {
    if (name.length > 0)
        name = "-" + name;
    const dump = util_1.default.inspect(toDump, { showHidden: true, depth: null });
    const loc = path_1.default.join("tmp/hexo-is/dump" + name + ".txt");
    if (!fs.existsSync(path_1.default.dirname(loc))) {
        fs.mkdirSync(path_1.default.dirname(loc), { recursive: true });
    }
    fs.writeFileSync(loc, dump);
    log.log(`${package_json_1.default.name}: dump saved to: ${path_1.default.resolve(loc)}`);
}
exports.hexoIsDump = hexoIsDump;
exports.default = hexoIs;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInNyYy9oZXhvL2hleG8taXMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBLHdEQUErQjtBQUMvQixrRUFBaUM7QUFDakMsdUNBQXlCO0FBQ3pCLGdEQUF3QjtBQUN4QixnREFBd0I7QUFDeEIsOENBQXNCO0FBQ3RCLE1BQU0sR0FBRyxHQUFHLElBQUEsa0JBQU8sRUFBQztJQUNsQixLQUFLLEVBQUUsS0FBSztJQUNaLE1BQU0sRUFBRSxLQUFLO0NBQ2QsQ0FBQyxDQUFDO0FBRUg7Ozs7Ozs7O0dBUUc7QUFDSCxNQUFNLE1BQU0sR0FBRyxVQUFVLElBQXVDO0lBQzlELElBQUksT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksV0FBVztRQUFFLE9BQU8sSUFBQSxZQUFFLEVBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEQsSUFBSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxXQUFXLEVBQUU7UUFDdEMsTUFBTSxFQUFFLEdBQUcsSUFBQSxZQUFFLEVBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEIsSUFBSSxPQUFPLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxXQUFXO1lBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztRQUNwRSxPQUFPLEVBQUUsQ0FBQztLQUNYO0FBQ0gsQ0FBQyxDQUFDO0FBRUY7OztHQUdHO0FBQ0gsU0FBZ0IsVUFBVSxDQUFDLE1BQVcsRUFBRSxJQUFJLEdBQUcsRUFBRTtJQUMvQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQztRQUFFLElBQUksR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDO0lBQ3ZDLE1BQU0sSUFBSSxHQUFHLGNBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUNyRSxNQUFNLEdBQUcsR0FBRyxjQUFJLENBQUMsSUFBSSxDQUFDLGtCQUFrQixHQUFHLElBQUksR0FBRyxNQUFNLENBQUMsQ0FBQztJQUMxRCxJQUFJLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxjQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUU7UUFDckMsRUFBRSxDQUFDLFNBQVMsQ0FBQyxjQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7S0FDdEQ7SUFDRCxFQUFFLENBQUMsYUFBYSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUM1QixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsc0JBQUcsQ0FBQyxJQUFJLG9CQUFvQixjQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztBQUM5RCxDQUFDO0FBVEQsZ0NBU0M7QUFFRCxrQkFBZSxNQUFNLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBwcmVmZXItcmVzdC1wYXJhbXMgKi9cbmltcG9ydCBIZXhvLCB7IFRlbXBsYXRlTG9jYWxzIH0gZnJvbSBcImhleG9cIjtcbmltcG9ydCBoZXhvTG9nIGZyb20gXCJoZXhvLWxvZ1wiO1xuaW1wb3J0IHBrZyBmcm9tIFwiLi9wYWNrYWdlLmpzb25cIjtcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHV0aWwgZnJvbSBcInV0aWxcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgaXMgZnJvbSBcIi4vaXNcIjtcbmNvbnN0IGxvZyA9IGhleG9Mb2coe1xuICBkZWJ1ZzogZmFsc2UsXG4gIHNpbGVudDogZmFsc2Vcbn0pO1xuXG4vKipcbiAqIEBleGFtcGxlXG4gKiAvLyBydW4gaW5zaWRlIHBsdWdpbiBvciB0aGVtZSBldmVudFxuICogaW1wb3J0IGhleG9JcyBmcm9tICdoZXhvLWlzJztcbiAqIGNvbnN0IGhleG8gPSB0aGlzO1xuICogY29uc29sZS5sb2coaGV4b0lzKGhleG8pKTsgLy8gb2JqZWN0IG9yIHN0cmluZ1xuICogQHBhcmFtIGhleG9cbiAqIEByZXR1cm5zXG4gKi9cbmNvbnN0IGhleG9JcyA9IGZ1bmN0aW9uIChoZXhvOiBIZXhvIHwgSGV4by5WaWV3IHwgVGVtcGxhdGVMb2NhbHMpIHtcbiAgaWYgKHR5cGVvZiBoZXhvW1wicGFnZVwiXSAhPSBcInVuZGVmaW5lZFwiKSByZXR1cm4gaXMoaGV4byk7XG4gIGlmICh0eXBlb2YgaGV4b1tcInR5cGVcIl0gIT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNvbnN0IGl4ID0gaXMoaGV4byk7XG4gICAgaWYgKHR5cGVvZiBpeFtoZXhvW1widHlwZVwiXV0gIT0gXCJ1bmRlZmluZWRcIikgaXhbaGV4b1tcInR5cGVcIl1dID0gdHJ1ZTtcbiAgICByZXR1cm4gaXg7XG4gIH1cbn07XG5cbi8qKlxuICogRHVtcCB2YXJpYWJsZSB0byBmaWxlXG4gKiBAcGFyYW0gdG9EdW1wXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBoZXhvSXNEdW1wKHRvRHVtcDogYW55LCBuYW1lID0gXCJcIikge1xuICBpZiAobmFtZS5sZW5ndGggPiAwKSBuYW1lID0gXCItXCIgKyBuYW1lO1xuICBjb25zdCBkdW1wID0gdXRpbC5pbnNwZWN0KHRvRHVtcCwgeyBzaG93SGlkZGVuOiB0cnVlLCBkZXB0aDogbnVsbCB9KTtcbiAgY29uc3QgbG9jID0gcGF0aC5qb2luKFwidG1wL2hleG8taXMvZHVtcFwiICsgbmFtZSArIFwiLnR4dFwiKTtcbiAgaWYgKCFmcy5leGlzdHNTeW5jKHBhdGguZGlybmFtZShsb2MpKSkge1xuICAgIGZzLm1rZGlyU3luYyhwYXRoLmRpcm5hbWUobG9jKSwgeyByZWN1cnNpdmU6IHRydWUgfSk7XG4gIH1cbiAgZnMud3JpdGVGaWxlU3luYyhsb2MsIGR1bXApO1xuICBsb2cubG9nKGAke3BrZy5uYW1lfTogZHVtcCBzYXZlZCB0bzogJHtwYXRoLnJlc29sdmUobG9jKX1gKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgaGV4b0lzO1xuIl19