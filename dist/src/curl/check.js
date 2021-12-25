"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_libcurl_1 = require("node-libcurl");
const cache_1 = require("../cache");
const index_1 = require("../index");
const bluebird_1 = __importDefault(require("bluebird"));
const cache = new cache_1.CacheFile("curl");
/**
 * Check if url is exists
 */
const checkUrl = function (url) {
    const isChanged = cache.isFileChanged(url.toString());
    const defaultReturn = {
        result: false,
        statusCode: null,
        data: null,
        headers: null
    };
    if (index_1.isDev || isChanged) {
        try {
            return bluebird_1.default.resolve(node_libcurl_1.curly.get(url.toString())).then((response) => {
                const statusCode = response.statusCode;
                const data = response.data;
                const headers = response.headers;
                const result = statusCode < 400 || statusCode >= 500 || statusCode === 200;
                cache.set(url.toString(), { result, statusCode, data, headers });
                return { result, statusCode, data, headers };
            });
        }
        catch (e) {
            return defaultReturn;
        }
    }
    return cache.get(url.toString(), defaultReturn);
};
exports.default = checkUrl;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2suanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInNyYy9jdXJsL2NoZWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQUEsK0NBQXFDO0FBRXJDLG9DQUFxQztBQUNyQyxvQ0FBaUM7QUFDakMsd0RBQStCO0FBRS9CLE1BQU0sS0FBSyxHQUFHLElBQUksaUJBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNwQzs7R0FFRztBQUNILE1BQU0sUUFBUSxHQUFHLFVBQVUsR0FBaUI7SUFDMUMsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztJQUN0RCxNQUFNLGFBQWEsR0FBRztRQUNwQixNQUFNLEVBQUUsS0FBSztRQUNiLFVBQVUsRUFBRSxJQUFJO1FBQ2hCLElBQUksRUFBRSxJQUFJO1FBQ1YsT0FBTyxFQUFFLElBQUk7S0FDZCxDQUFDO0lBQ0YsSUFBSSxhQUFLLElBQUksU0FBUyxFQUFFO1FBQ3RCLElBQUk7WUFDRixPQUFPLGtCQUFPLENBQUMsT0FBTyxDQUFDLG9CQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ2xFLE1BQU0sVUFBVSxHQUFHLFFBQVEsQ0FBQyxVQUFVLENBQUM7Z0JBQ3ZDLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUM7Z0JBQzNCLE1BQU0sT0FBTyxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUM7Z0JBQ2pDLE1BQU0sTUFBTSxHQUNWLFVBQVUsR0FBRyxHQUFHLElBQUksVUFBVSxJQUFJLEdBQUcsSUFBSSxVQUFVLEtBQUssR0FBRyxDQUFDO2dCQUM5RCxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7Z0JBQ2pFLE9BQU8sRUFBRSxNQUFNLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsQ0FBQztZQUMvQyxDQUFDLENBQUMsQ0FBQztTQUNKO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDVixPQUFPLGFBQWEsQ0FBQztTQUN0QjtLQUNGO0lBRUQsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsRUFBRSxhQUFhLENBQXlCLENBQUM7QUFDMUUsQ0FBQyxDQUFDO0FBRUYsa0JBQWUsUUFBUSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY3VybHkgfSBmcm9tIFwibm9kZS1saWJjdXJsXCI7XG5pbXBvcnQgbG9nZ2VyIGZyb20gXCIuLi9sb2dcIjtcbmltcG9ydCB7IENhY2hlRmlsZSB9IGZyb20gXCIuLi9jYWNoZVwiO1xuaW1wb3J0IHsgaXNEZXYgfSBmcm9tIFwiLi4vaW5kZXhcIjtcbmltcG9ydCBQcm9taXNlIGZyb20gXCJibHVlYmlyZFwiO1xuXG5jb25zdCBjYWNoZSA9IG5ldyBDYWNoZUZpbGUoXCJjdXJsXCIpO1xuLyoqXG4gKiBDaGVjayBpZiB1cmwgaXMgZXhpc3RzXG4gKi9cbmNvbnN0IGNoZWNrVXJsID0gZnVuY3Rpb24gKHVybDogc3RyaW5nIHwgVVJMKSB7XG4gIGNvbnN0IGlzQ2hhbmdlZCA9IGNhY2hlLmlzRmlsZUNoYW5nZWQodXJsLnRvU3RyaW5nKCkpO1xuICBjb25zdCBkZWZhdWx0UmV0dXJuID0ge1xuICAgIHJlc3VsdDogZmFsc2UsXG4gICAgc3RhdHVzQ29kZTogbnVsbCxcbiAgICBkYXRhOiBudWxsLFxuICAgIGhlYWRlcnM6IG51bGxcbiAgfTtcbiAgaWYgKGlzRGV2IHx8IGlzQ2hhbmdlZCkge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKGN1cmx5LmdldCh1cmwudG9TdHJpbmcoKSkpLnRoZW4oKHJlc3BvbnNlKSA9PiB7XG4gICAgICAgIGNvbnN0IHN0YXR1c0NvZGUgPSByZXNwb25zZS5zdGF0dXNDb2RlO1xuICAgICAgICBjb25zdCBkYXRhID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgY29uc3QgaGVhZGVycyA9IHJlc3BvbnNlLmhlYWRlcnM7XG4gICAgICAgIGNvbnN0IHJlc3VsdCA9XG4gICAgICAgICAgc3RhdHVzQ29kZSA8IDQwMCB8fCBzdGF0dXNDb2RlID49IDUwMCB8fCBzdGF0dXNDb2RlID09PSAyMDA7XG4gICAgICAgIGNhY2hlLnNldCh1cmwudG9TdHJpbmcoKSwgeyByZXN1bHQsIHN0YXR1c0NvZGUsIGRhdGEsIGhlYWRlcnMgfSk7XG4gICAgICAgIHJldHVybiB7IHJlc3VsdCwgc3RhdHVzQ29kZSwgZGF0YSwgaGVhZGVycyB9O1xuICAgICAgfSk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgcmV0dXJuIGRlZmF1bHRSZXR1cm47XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNhY2hlLmdldCh1cmwudG9TdHJpbmcoKSwgZGVmYXVsdFJldHVybikgYXMgdHlwZW9mIGRlZmF1bHRSZXR1cm47XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjaGVja1VybDtcbiJdfQ==