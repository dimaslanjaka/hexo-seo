"use strict";
const node_libcurl_1 = require("node-libcurl");
class imageValidator {
    /**
     * validate image url
     * @param url
     * @returns
     */
    static validate(url) {
        return this.isValid(url);
    }
    /**
     * validate image url
     * @param url
     * @returns
     */
    static isValid(url) {
        if (/^https?/gs.test(url)) {
            try {
                return node_libcurl_1.curly.get(url.toString()).then((res) => {
                    const statusCode = res.statusCode;
                    const validStatusCode = statusCode < 400 || statusCode >= 500 || statusCode === 200;
                    if (validStatusCode) {
                        if (typeof res.headers[0] == "object") {
                            const headers = res.headers[0];
                            if (typeof headers["Content-Type"] == "string") {
                                if (headers["Content-Type"].includes("images/"))
                                    return true;
                            }
                        }
                    }
                });
            }
            catch (e) {
                return false;
            }
        }
        return false;
    }
}
imageValidator.db = {};
module.exports = imageValidator;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2VWYWxpZGF0b3IuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInNyYy9jdXJsL2ltYWdlVmFsaWRhdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSwrQ0FBcUM7QUFFckMsTUFBTSxjQUFjO0lBQ2xCOzs7O09BSUc7SUFDSCxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQVc7UUFDekIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQzNCLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxHQUFXO1FBQ3hCLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUN6QixJQUFJO2dCQUNGLE9BQU8sb0JBQUssQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7b0JBQzVDLE1BQU0sVUFBVSxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7b0JBQ2xDLE1BQU0sZUFBZSxHQUNuQixVQUFVLEdBQUcsR0FBRyxJQUFJLFVBQVUsSUFBSSxHQUFHLElBQUksVUFBVSxLQUFLLEdBQUcsQ0FBQztvQkFDOUQsSUFBSSxlQUFlLEVBQUU7d0JBQ25CLElBQUksT0FBTyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFJLFFBQVEsRUFBRTs0QkFDckMsTUFBTSxPQUFPLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQzs0QkFDL0IsSUFBSSxPQUFPLE9BQU8sQ0FBQyxjQUFjLENBQUMsSUFBSSxRQUFRLEVBQUU7Z0NBQzlDLElBQUksT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUM7b0NBQUUsT0FBTyxJQUFJLENBQUM7NkJBQzlEO3lCQUNGO3FCQUNGO2dCQUNILENBQUMsQ0FBQyxDQUFDO2FBQ0o7WUFBQyxPQUFPLENBQUMsRUFBRTtnQkFDVixPQUFPLEtBQUssQ0FBQzthQUNkO1NBQ0Y7UUFDRCxPQUFPLEtBQUssQ0FBQztJQUNmLENBQUM7O0FBM0JNLGlCQUFFLEdBQUcsRUFBRSxDQUFDO0FBOEJqQixpQkFBUyxjQUFjLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjdXJseSB9IGZyb20gXCJub2RlLWxpYmN1cmxcIjtcblxuY2xhc3MgaW1hZ2VWYWxpZGF0b3Ige1xuICAvKipcbiAgICogdmFsaWRhdGUgaW1hZ2UgdXJsXG4gICAqIEBwYXJhbSB1cmxcbiAgICogQHJldHVybnNcbiAgICovXG4gIHN0YXRpYyB2YWxpZGF0ZSh1cmw6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmlzVmFsaWQodXJsKTtcbiAgfVxuICBzdGF0aWMgZGIgPSB7fTtcbiAgLyoqXG4gICAqIHZhbGlkYXRlIGltYWdlIHVybFxuICAgKiBAcGFyYW0gdXJsXG4gICAqIEByZXR1cm5zXG4gICAqL1xuICBzdGF0aWMgaXNWYWxpZCh1cmw6IHN0cmluZykge1xuICAgIGlmICgvXmh0dHBzPy9ncy50ZXN0KHVybCkpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiBjdXJseS5nZXQodXJsLnRvU3RyaW5nKCkpLnRoZW4oKHJlcykgPT4ge1xuICAgICAgICAgIGNvbnN0IHN0YXR1c0NvZGUgPSByZXMuc3RhdHVzQ29kZTtcbiAgICAgICAgICBjb25zdCB2YWxpZFN0YXR1c0NvZGUgPVxuICAgICAgICAgICAgc3RhdHVzQ29kZSA8IDQwMCB8fCBzdGF0dXNDb2RlID49IDUwMCB8fCBzdGF0dXNDb2RlID09PSAyMDA7XG4gICAgICAgICAgaWYgKHZhbGlkU3RhdHVzQ29kZSkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiByZXMuaGVhZGVyc1swXSA9PSBcIm9iamVjdFwiKSB7XG4gICAgICAgICAgICAgIGNvbnN0IGhlYWRlcnMgPSByZXMuaGVhZGVyc1swXTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBoZWFkZXJzW1wiQ29udGVudC1UeXBlXCJdID09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaGVhZGVyc1tcIkNvbnRlbnQtVHlwZVwiXS5pbmNsdWRlcyhcImltYWdlcy9cIikpIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0ID0gaW1hZ2VWYWxpZGF0b3I7XG4iXX0=