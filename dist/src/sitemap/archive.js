"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestFromArrayDates = void 0;
const moment_1 = __importDefault(require("moment"));
function getCategoryTags(hexo) {
    const groups = ["categories", "tags"];
    const locals = hexo.locals;
    const groupfilter = {
        tags: [],
        categories: []
    };
    if (!locals) {
        return groupfilter;
    }
    groups.map((group) => {
        const lastModifiedObject = locals.get(group).map((items) => {
            if (items.posts) {
                const archives = items;
                const posts = archives.posts;
                const latest = getLatestFromArrayDates(posts.map((post) => {
                    return post.updated.toDate();
                }));
                const permalink = new URL(hexo.config.url);
                permalink.pathname = archives.path;
                return {
                    permalink: permalink.toString(),
                    name: archives.name,
                    latest: (0, moment_1.default)(latest).format("YYYY-MM-DDTHH:mm:ssZ")
                };
            }
        });
        groupfilter[group] = lastModifiedObject;
    });
    return groupfilter;
}
/**
 * get latest date from array of date
 * @param arr
 * @returns
 */
function getLatestFromArrayDates(arr) {
    return new Date(Math.max.apply(null, arr.map(function (e) {
        return e instanceof Date ? e : (0, moment_1.default)(e).toDate();
    })));
}
exports.getLatestFromArrayDates = getLatestFromArrayDates;
exports.default = getCategoryTags;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjaGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsic3JjL3NpdGVtYXAvYXJjaGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFDQSxvREFBNEI7QUFXNUIsU0FBUyxlQUFlLENBQUMsSUFBVTtJQUNqQyxNQUFNLE1BQU0sR0FBRyxDQUFDLFlBQVksRUFBRSxNQUFNLENBQUMsQ0FBQztJQUN0QyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQzNCLE1BQU0sV0FBVyxHQUF1QjtRQUN0QyxJQUFJLEVBQUUsRUFBRTtRQUNSLFVBQVUsRUFBRSxFQUFFO0tBQ2YsQ0FBQztJQUNGLElBQUksQ0FBQyxNQUFNLEVBQUU7UUFDWCxPQUFPLFdBQVcsQ0FBQztLQUNwQjtJQUNELE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRTtRQUNuQixNQUFNLGtCQUFrQixHQUFtRCxNQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUssRUFBRSxFQUFFO1lBQzFHLElBQUksS0FBSyxDQUFDLEtBQUssRUFBRTtnQkFDZixNQUFNLFFBQVEsR0FBMkMsS0FBSyxDQUFDO2dCQUMvRCxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO2dCQUM3QixNQUFNLE1BQU0sR0FBRyx1QkFBdUIsQ0FDcEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO29CQUNqQixPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQy9CLENBQUMsQ0FBQyxDQUNILENBQUM7Z0JBQ0YsTUFBTSxTQUFTLEdBQUcsSUFBSSxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDM0MsU0FBUyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO2dCQUVuQyxPQUEyQjtvQkFDekIsU0FBUyxFQUFFLFNBQVMsQ0FBQyxRQUFRLEVBQUU7b0JBQy9CLElBQUksRUFBRSxRQUFRLENBQUMsSUFBSTtvQkFDbkIsTUFBTSxFQUFFLElBQUEsZ0JBQU0sRUFBQyxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsc0JBQXNCLENBQUM7aUJBQ3RELENBQUM7YUFDSDtRQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0gsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLGtCQUFrQixDQUFDO0lBQzFDLENBQUMsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxXQUFXLENBQUM7QUFDckIsQ0FBQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQix1QkFBdUIsQ0FBQyxHQUFzQjtJQUM1RCxPQUFPLElBQUksSUFBSSxDQUNiLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUNaLElBQUksRUFDSixHQUFHLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBZ0I7UUFDaEMsT0FBTyxDQUFDLFlBQVksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUEsZ0JBQU0sRUFBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztJQUNwRCxDQUFDLENBQUMsQ0FDSCxDQUNGLENBQUM7QUFDSixDQUFDO0FBVEQsMERBU0M7QUFFRCxrQkFBZSxlQUFlLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgSGV4bywgeyBNb2RlbCB9IGZyb20gXCJoZXhvXCI7XG5pbXBvcnQgbW9tZW50IGZyb20gXCJtb21lbnRcIjtcblxuaW50ZXJmYWNlIG9iamVjdENhdGVnb3J5VGFncyB7XG4gIHBlcm1hbGluazogc3RyaW5nO1xuICBuYW1lOiBzdHJpbmc7XG4gIGxhdGVzdDogc3RyaW5nO1xufVxuaW50ZXJmYWNlIHJldHVybkNhdGVnb3J5VGFncyB7XG4gIHRhZ3M6IG9iamVjdENhdGVnb3J5VGFnc1tdO1xuICBjYXRlZ29yaWVzOiBvYmplY3RDYXRlZ29yeVRhZ3NbXTtcbn1cbmZ1bmN0aW9uIGdldENhdGVnb3J5VGFncyhoZXhvOiBIZXhvKSB7XG4gIGNvbnN0IGdyb3VwcyA9IFtcImNhdGVnb3JpZXNcIiwgXCJ0YWdzXCJdO1xuICBjb25zdCBsb2NhbHMgPSBoZXhvLmxvY2FscztcbiAgY29uc3QgZ3JvdXBmaWx0ZXI6IHJldHVybkNhdGVnb3J5VGFncyA9IHtcbiAgICB0YWdzOiBbXSxcbiAgICBjYXRlZ29yaWVzOiBbXVxuICB9O1xuICBpZiAoIWxvY2Fscykge1xuICAgIHJldHVybiBncm91cGZpbHRlcjtcbiAgfVxuICBncm91cHMubWFwKChncm91cCkgPT4ge1xuICAgIGNvbnN0IGxhc3RNb2RpZmllZE9iamVjdCA9ICg8TW9kZWw8SGV4by5Mb2NhbHMuQ2F0ZWdvcnkgfCBIZXhvLkxvY2Fscy5UYWc+PmxvY2Fscy5nZXQoZ3JvdXApKS5tYXAoKGl0ZW1zKSA9PiB7XG4gICAgICBpZiAoaXRlbXMucG9zdHMpIHtcbiAgICAgICAgY29uc3QgYXJjaGl2ZXMgPSA8SGV4by5Mb2NhbHMuQ2F0ZWdvcnkgfCBIZXhvLkxvY2Fscy5UYWc+aXRlbXM7XG4gICAgICAgIGNvbnN0IHBvc3RzID0gYXJjaGl2ZXMucG9zdHM7XG4gICAgICAgIGNvbnN0IGxhdGVzdCA9IGdldExhdGVzdEZyb21BcnJheURhdGVzKFxuICAgICAgICAgIHBvc3RzLm1hcCgocG9zdCkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHBvc3QudXBkYXRlZC50b0RhdGUoKTtcbiAgICAgICAgICB9KVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBwZXJtYWxpbmsgPSBuZXcgVVJMKGhleG8uY29uZmlnLnVybCk7XG4gICAgICAgIHBlcm1hbGluay5wYXRobmFtZSA9IGFyY2hpdmVzLnBhdGg7XG5cbiAgICAgICAgcmV0dXJuIDxvYmplY3RDYXRlZ29yeVRhZ3M+e1xuICAgICAgICAgIHBlcm1hbGluazogcGVybWFsaW5rLnRvU3RyaW5nKCksXG4gICAgICAgICAgbmFtZTogYXJjaGl2ZXMubmFtZSxcbiAgICAgICAgICBsYXRlc3Q6IG1vbWVudChsYXRlc3QpLmZvcm1hdChcIllZWVktTU0tRERUSEg6bW06c3NaXCIpXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSk7XG4gICAgZ3JvdXBmaWx0ZXJbZ3JvdXBdID0gbGFzdE1vZGlmaWVkT2JqZWN0O1xuICB9KTtcbiAgcmV0dXJuIGdyb3VwZmlsdGVyO1xufVxuXG4vKipcbiAqIGdldCBsYXRlc3QgZGF0ZSBmcm9tIGFycmF5IG9mIGRhdGVcbiAqIEBwYXJhbSBhcnJcbiAqIEByZXR1cm5zXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMYXRlc3RGcm9tQXJyYXlEYXRlcyhhcnI6IHN0cmluZ1tdIHwgRGF0ZVtdKSB7XG4gIHJldHVybiBuZXcgRGF0ZShcbiAgICBNYXRoLm1heC5hcHBseShcbiAgICAgIG51bGwsXG4gICAgICBhcnIubWFwKGZ1bmN0aW9uIChlOiBzdHJpbmcgfCBEYXRlKSB7XG4gICAgICAgIHJldHVybiBlIGluc3RhbmNlb2YgRGF0ZSA/IGUgOiBtb21lbnQoZSkudG9EYXRlKCk7XG4gICAgICB9KVxuICAgIClcbiAgKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgZ2V0Q2F0ZWdvcnlUYWdzO1xuIl19