"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkBrokenImg = exports.isLocalImage = void 0;
const cheerio_1 = __importDefault(require("cheerio"));
const config_1 = __importDefault(require("../config"));
const check_1 = __importDefault(require("../curl/check"));
const bluebird_1 = __importDefault(require("bluebird"));
const cache_1 = require("../cache");
const cache = new cache_1.CacheFile("img-broken");
/**
 * is local image
 */
const isLocalImage = (url) => {
    if (!url)
        return false;
    const regex = /^https?/gs;
    return regex.test(url);
};
exports.isLocalImage = isLocalImage;
const new_src = {
    original: null,
    resolved: null,
    success: false
};
/**
 * check broken image with caching strategy
 * @param src
 * @param defaultImg
 * @returns
 */
const checkBrokenImg = function (src, defaultImg = "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Wikipedia_Hello_World_Graphic.svg/2560px-Wikipedia_Hello_World_Graphic.svg.png") {
    new_src.original = src;
    new_src.resolved = src;
    const cached = cache.getCache(src, null);
    if (!cached) {
        return bluebird_1.default.resolve((0, check_1.default)(src)).then((isWorking) => {
            // fix image redirect
            if ((isWorking.statusCode == 302 || isWorking.statusCode == 301) &&
                isWorking.headers[0] &&
                isWorking.headers[0].location) {
                return (0, exports.checkBrokenImg)(isWorking.headers[0].location, defaultImg);
            }
            new_src.success = isWorking.result;
            if (!isWorking) {
                // image is broken, replace with default broken image fallback
                new_src.resolved = defaultImg; //config.default.toString();
            }
            cache.setCache(src, new_src);
            return new_src;
        });
    }
    return bluebird_1.default.any([cached]).then((srcx) => {
        return srcx;
    });
};
exports.checkBrokenImg = checkBrokenImg;
/**
 * Broken image fix
 * @param img
 */
function default_1(content, data) {
    const path0 = data.path;
    const isChanged = cache.isFileChanged(path0);
    if (isChanged) {
        const $ = cheerio_1.default.load(content);
        const config = (0, config_1.default)(this).img;
        const title = data.title;
        const images = [];
        $("img").each((i, el) => {
            const img = $(el);
            const img_src = img.attr("src");
            if (img_src && img_src.trim().length > 0 && /^https?:\/\//gs.test(img_src)) {
                images.push(img);
            }
        });
        const fixBrokenImg = function (img) {
            const img_src = img.attr("src");
            const img_check = (0, exports.checkBrokenImg)(img_src, config.default.toString());
            return img_check.then((chk) => {
                img.attr("src", chk.resolved);
                img.attr("src-original", chk.original);
                return img;
            });
        };
        return (bluebird_1.default.all(images)
            .map(fixBrokenImg)
            //.catch(() => { })
            .then(() => {
            content = $.html();
            cache.setCache(path0, content);
            return content;
        }));
    }
    else {
        const gCache = cache.getCache(path0);
        return bluebird_1.default.any(gCache).then((content) => {
            return content;
        });
    }
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJva2VuLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJzcmMvaW1nL2Jyb2tlbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFFQSxzREFBb0Q7QUFFcEQsdURBQWtDO0FBQ2xDLDBEQUFxQztBQUNyQyx3REFBK0I7QUFDL0Isb0NBQXFDO0FBRXJDLE1BQU0sS0FBSyxHQUFHLElBQUksaUJBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUUxQzs7R0FFRztBQUNJLE1BQU0sWUFBWSxHQUFHLENBQUMsR0FBVyxFQUFFLEVBQUU7SUFDMUMsSUFBSSxDQUFDLEdBQUc7UUFBRSxPQUFPLEtBQUssQ0FBQztJQUN2QixNQUFNLEtBQUssR0FBRyxXQUFXLENBQUM7SUFDMUIsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ3pCLENBQUMsQ0FBQztBQUpXLFFBQUEsWUFBWSxnQkFJdkI7QUFFRixNQUFNLE9BQU8sR0FBRztJQUNkLFFBQVEsRUFBRSxJQUFJO0lBQ2QsUUFBUSxFQUFFLElBQUk7SUFDZCxPQUFPLEVBQUUsS0FBSztDQUNmLENBQUM7QUFFRjs7Ozs7R0FLRztBQUNJLE1BQU0sY0FBYyxHQUFHLFVBQzVCLEdBQVcsRUFDWCxVQUFVLEdBQUcsMElBQTBJO0lBRXZKLE9BQU8sQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLE9BQU8sQ0FBQyxRQUFRLEdBQUcsR0FBRyxDQUFDO0lBQ3ZCLE1BQU0sTUFBTSxHQUFtQixLQUFLLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUN6RCxJQUFJLENBQUMsTUFBTSxFQUFFO1FBQ1gsT0FBTyxrQkFBTyxDQUFDLE9BQU8sQ0FBQyxJQUFBLGVBQVEsRUFBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO1lBQ3ZELHFCQUFxQjtZQUNyQixJQUNFLENBQUMsU0FBUyxDQUFDLFVBQVUsSUFB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bEIsbUJBQW1CO2FBQ2xCLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDVCxPQUFPLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ25CLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1lBQy9CLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUNMLENBQUM7S0FDSDtTQUFNO1FBQ0wsTUFBTSxNQUFNLEdBQVcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM3QyxPQUFPLGtCQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQzFDLE9BQU8sT0FBTyxDQUFDO1FBQ2pCLENBQUMsQ0FBQyxDQUFDO0tBQ0o7QUFDSCxDQUFDO0FBMUNELDRCQTBDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBsb2dnZXIgZnJvbSBcIi4uL2xvZ1wiO1xuaW1wb3J0IHsgSGV4b1NlbyB9IGZyb20gXCIuLi9odG1sL3NjaGVtYS9hcnRpY2xlXCI7XG5pbXBvcnQgY2hlZXJpbywgeyBDaGVlcmlvLCBFbGVtZW50IH0gZnJvbSBcImNoZWVyaW9cIjtcbmltcG9ydCBIZXhvIGZyb20gXCJoZXhvXCI7XG5pbXBvcnQgZ2V0Q29uZmlnIGZyb20gXCIuLi9jb25maWdcIjtcbmltcG9ydCBjaGVja1VybCBmcm9tIFwiLi4vY3VybC9jaGVja1wiO1xuaW1wb3J0IFByb21pc2UgZnJvbSBcImJsdWViaXJkXCI7XG5pbXBvcnQgeyBDYWNoZUZpbGUgfSBmcm9tIFwiLi4vY2FjaGVcIjtcblxuY29uc3QgY2FjaGUgPSBuZXcgQ2FjaGVGaWxlKFwiaW1nLWJyb2tlblwiKTtcblxuLyoqXG4gKiBpcyBsb2NhbCBpbWFnZVxuICovXG5leHBvcnQgY29uc3QgaXNMb2NhbEltYWdlID0gKHVybDogc3RyaW5nKSA9PiB7XG4gIGlmICghdXJsKSByZXR1cm4gZmFsc2U7XG4gIGNvbnN0IHJlZ2V4ID0gL15odHRwcz8vZ3M7XG4gIHJldHVybiByZWdleC50ZXN0KHVybCk7XG59O1xuXG5jb25zdCBuZXdfc3JjID0ge1xuICBvcmlnaW5hbDogbnVsbCxcbiAgcmVzb2x2ZWQ6IG51bGwsXG4gIHN1Y2Nlc3M6IGZhbHNlXG59O1xuXG4vKipcbiAqIGNoZWNrIGJyb2tlbiBpbWFnZSB3aXRoIGNhY2hpbmcgc3RyYXRlZ3lcbiAqIEBwYXJhbSBzcmNcbiAqIEBwYXJhbSBkZWZhdWx0SW1nXG4gKiBAcmV0dXJuc1xuICovXG5leHBvcnQgY29uc3QgY2hlY2tCcm9rZW5JbWcgPSBmdW5jdGlvbiAoXG4gIHNyYzogc3RyaW5nLFxuICBkZWZhdWx0SW1nID0gXCJodHRwczovL3VwbG9hZC53aWtpbWVkaWEub3JnL3dpa2lwZWRpYS9jb21tb25zL3RodW1iLzgvODYvV2lraXBlZGlhX0hlbGxvX1dvcmxkX0dyYXBoaWMuc3ZnLzI1NjBweC1XaWtpcGVkaWFfSGVsbG9fV29ybGRfR3JhcGhpYy5zdmcucG5nXCJcbik6IFByb21pc2U8dHlwZW9mIG5ld19zcmM+IHtcbiAgbmV3X3NyYy5vcmlnaW5hbCA9IHNyYztcbiAgbmV3X3NyYy5yZXNvbHZlZCA9IHNyYztcbiAgY29uc3QgY2FjaGVkOiB0eXBlb2YgbmV3X3NyYyA9IGNhY2hlLmdldENhY2hlKHNyYywgbnVsbCk7XG4gIGlmICghY2FjaGVkKSB7XG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShjaGVja1VybChzcmMpKS50aGVuKChpc1dvcmtpbmcpID0+IHtcbiAgICAgIC8vIGZpeCBpbWFnZSByZWRpcmVjdFxuICAgICAgaWYgKFxuICAgICAgICAoaXNXb3JraW5nLnN0YXR1c0NvZGUgPT0gMzAyIHx8IGlzV29ya2luZy5zdGF0dXNDb2RlID09IDMwMSkgJiZcbiAgICAgICAgaXNXb3JraW5nLmhlYWRlcnNbMF0gJiZcbiAgICAgICAgaXNXb3JraW5nLmhlYWRlcnNbMF0ubG9jYXRpb25cbiAgICAgICkge1xuICAgICAgICByZXR1cm4gY2hlY2tCcm9rZW5JbWcoaXNXb3JraW5nLmhlYWRlcnNbMF0ubG9jYXRpb24sIGRlZmF1bHRJbWcpO1xuICAgICAgfVxuXG4gICAgICBuZXdfc3JjLnN1Y2Nlc3MgPSBpc1dvcmtpbmcucmVzdWx0O1xuXG4gICAgICBpZiAoIWlzV29ya2luZykge1xuICAgICAgICAvLyBpbWFnZSBpcyBicm9rZW4sIHJlcGxhY2Ugd2l0aCBkZWZhdWx0IGJyb2tlbiBpbWFnZSBmYWxsYmFja1xuICAgICAgICBuZXdfc3JjLnJlc29sdmVkID0gZGVmYXVsdEltZzsgLy9jb25maWcuZGVmYXVsdC50b1N0cmluZygpO1xuICAgICAgfVxuXG4gICAgICBjYWNoZS5zZXRDYWNoZShzcmMsIG5ld19zcmMpO1xuICAgICAgcmV0dXJuIG5ld19zcmM7XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gUHJvbWlzZS5hbnkoW2NhY2hlZF0pLnRoZW4oKHNyY3gpID0+IHtcbiAgICByZXR1cm4gc3JjeDtcbiAgfSk7XG59O1xuXG4vKipcbiAqIEJyb2tlbiBpbWFnZSBmaXhcbiAqIEBwYXJhbSBpbWdcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKHRoaXM6IEhleG8sIGNvbnRlbnQ6IHN0cmluZywgZGF0YTogSGV4b1Nlbykge1xuICBjb25zdCBwYXRoMCA9IGRhdGEucGF0aDtcbiAgY29uc3QgaXNDaGFuZ2VkID0gY2FjaGUuaXNGaWxlQ2hhbmdlZChwYXRoMCk7XG4gIGlmIChpc0NoYW5nZWQpIHtcbiAgICBjb25zdCAkID0gY2hlZXJpby5sb2FkKGNvbnRlbnQpO1xuICAgIGNvbnN0IGNvbmZpZyA9IGdldENvbmZpZyh0aGlzKS5pbWc7XG4gICAgY29uc3QgdGl0bGUgPSBkYXRhLnRpdGxlO1xuICAgIGNvbnN0IGltYWdlczogQ2hlZXJpbzxFbGVtZW50PltdID0gW107XG4gICAgJChcImltZ1wiKS5lYWNoKChpLCBlbCkgPT4ge1xuICAgICAgY29uc3QgaW1nID0gJChlbCk7XG4gICAgICBjb25zdCBpbWdfc3JjID0gaW1nLmF0dHIoXCJzcmNcIik7XG4gICAgICBpZiAoaW1nX3NyYyAmJiBpbWdfc3JjLnRyaW0oKS5sZW5ndGggPiAwICYmIC9eaHR0cHM/OlxcL1xcLy9ncy50ZXN0KGltZ19zcmMpKSB7XG4gICAgICAgIGltYWdlcy5wdXNoKGltZyk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICBjb25zdCBmaXhCcm9rZW5JbWcgPSBmdW5jdGlvbiAoaW1nOiBDaGVlcmlvPEVsZW1lbnQ+KSB7XG4gICAgICBjb25zdCBpbWdfc3JjID0gaW1nLmF0dHIoXCJzcmNcIik7XG4gICAgICBjb25zdCBpbWdfY2hlY2sgPSBjaGVja0Jyb2tlbkltZyhpbWdfc3JjLCBjb25maWcuZGVmYXVsdC50b1N0cmluZygpKTtcbiAgICAgIHJldHVybiBpbWdfY2hlY2sudGhlbigoY2hrKSA9PiB7XG4gICAgICAgIGltZy5hdHRyKFwic3JjXCIsIGNoay5yZXNvbHZlZCk7XG4gICAgICAgIGltZy5hdHRyKFwic3JjLW9yaWdpbmFsXCIsIGNoay5vcmlnaW5hbCk7XG4gICAgICAgIHJldHVybiBpbWc7XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIFByb21pc2UuYWxsKGltYWdlcylcbiAgICAgICAgLm1hcChmaXhCcm9rZW5JbWcpXG4gICAgICAgIC8vLmNhdGNoKCgpID0+IHsgfSlcbiAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIGNvbnRlbnQgPSAkLmh0bWwoKTtcbiAgICAgICAgICBjYWNoZS5zZXRDYWNoZShwYXRoMCwgY29udGVudCk7XG4gICAgICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgICAgIH0pXG4gICAgKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBnQ2FjaGU6IHN0cmluZyA9IGNhY2hlLmdldENhY2hlKHBhdGgwKTtcbiAgICByZXR1cm4gUHJvbWlzZS5hbnkoZ0NhY2hlKS50aGVuKChjb250ZW50KSA9PiB7XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KTtcbiAgfVxufVxuIl19