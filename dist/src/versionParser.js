"use strict";
/* eslint-disable radix */
/* eslint-disable no-throw-literal */
/**
 * Version Parser
 */
class versionParser {
    /**
     * Version Parser Constructor
     * @param {string} str
     */
    constructor(str) {
        this.result = {
            major: 0,
            minor: 0,
            build: 0
        };
        if (typeof str === "string")
            this.parseVersion(str);
    }
    /**
     * Parse Version String
     * @param {string} str
     * @returns
     */
    parseVersion(str) {
        if (typeof str !== "string") {
            //return false;
            throw `argument required string, found ${typeof str}`;
        }
        const arr = str.split(".");
        // parse int or default to 0
        this.result.major = parseInt(arr[0]) || 0;
        this.result.minor = parseInt(arr[1]) || 0;
        this.result.build = parseInt(arr[2]) || 0;
        return this.result;
    }
    toString() {
        return `${this.result.major}.${this.result.minor}.${this.result.build}`;
    }
}
module.exports = versionParser;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmVyc2lvblBhcnNlci5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsic3JjL3ZlcnNpb25QYXJzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLDBCQUEwQjtBQUMxQixxQ0FBcUM7QUFFckM7O0dBRUc7QUFDSCxNQUFNLGFBQWE7SUFPakI7OztPQUdHO0lBQ0gsWUFBWSxHQUFHO1FBVmYsV0FBTSxHQUFHO1lBQ1AsS0FBSyxFQUFFLENBQUM7WUFDUixLQUFLLEVBQUUsQ0FBQztZQUNSLEtBQUssRUFBRSxDQUFDO1NBQ1QsQ0FBQztRQU9BLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUTtZQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVEOzs7O09BSUc7SUFDSCxZQUFZLENBQUMsR0FBRztRQUNkLElBQUksT0FBTyxHQUFHLEtBQUssUUFBUSxFQUFFO1lBQzNCLGVBQWU7WUFDZixNQUFNLG1DQUFtQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1NBQ3ZEO1FBQ0QsTUFBTSxHQUFHLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUUzQiw0QkFBNEI7UUFDNUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDMUMsT0FBTyxJQUFJLENBQUMsTUFBTSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxRQUFRO1FBQ04sT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDMUUsQ0FBQztDQUNGO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxhQUFhLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSByYWRpeCAqL1xuLyogZXNsaW50LWRpc2FibGUgbm8tdGhyb3ctbGl0ZXJhbCAqL1xuXG4vKipcbiAqIFZlcnNpb24gUGFyc2VyXG4gKi9cbmNsYXNzIHZlcnNpb25QYXJzZXIge1xuICByZXN1bHQgPSB7XG4gICAgbWFqb3I6IDAsXG4gICAgbWlub3I6IDAsXG4gICAgYnVpbGQ6IDBcbiAgfTtcblxuICAvKipcbiAgICogVmVyc2lvbiBQYXJzZXIgQ29uc3RydWN0b3JcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICAgKi9cbiAgY29uc3RydWN0b3Ioc3RyKSB7XG4gICAgaWYgKHR5cGVvZiBzdHIgPT09IFwic3RyaW5nXCIpIHRoaXMucGFyc2VWZXJzaW9uKHN0cik7XG4gIH1cblxuICAvKipcbiAgICogUGFyc2UgVmVyc2lvbiBTdHJpbmdcbiAgICogQHBhcmFtIHtzdHJpbmd9IHN0clxuICAgKiBAcmV0dXJuc1xuICAgKi9cbiAgcGFyc2VWZXJzaW9uKHN0cikge1xuICAgIGlmICh0eXBlb2Ygc3RyICE9PSBcInN0cmluZ1wiKSB7XG4gICAgICAvL3JldHVybiBmYWxzZTtcbiAgICAgIHRocm93IGBhcmd1bWVudCByZXF1aXJlZCBzdHJpbmcsIGZvdW5kICR7dHlwZW9mIHN0cn1gO1xuICAgIH1cbiAgICBjb25zdCBhcnIgPSBzdHIuc3BsaXQoXCIuXCIpO1xuXG4gICAgLy8gcGFyc2UgaW50IG9yIGRlZmF1bHQgdG8gMFxuICAgIHRoaXMucmVzdWx0Lm1ham9yID0gcGFyc2VJbnQoYXJyWzBdKSB8fCAwO1xuICAgIHRoaXMucmVzdWx0Lm1pbm9yID0gcGFyc2VJbnQoYXJyWzFdKSB8fCAwO1xuICAgIHRoaXMucmVzdWx0LmJ1aWxkID0gcGFyc2VJbnQoYXJyWzJdKSB8fCAwO1xuICAgIHJldHVybiB0aGlzLnJlc3VsdDtcbiAgfVxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgJHt0aGlzLnJlc3VsdC5tYWpvcn0uJHt0aGlzLnJlc3VsdC5taW5vcn0uJHt0aGlzLnJlc3VsdC5idWlsZH1gO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdmVyc2lvblBhcnNlcjtcbiJdfQ==