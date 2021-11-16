/* eslint-disable radix */
/* eslint-disable no-throw-literal */
/**
 * Version Parser
 */
var versionParser = /** @class */ (function () {
    /**
     * Version Parser Constructor
     * @param {string} str
     */
    function versionParser(str) {
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
    versionParser.prototype.parseVersion = function (str) {
        if (typeof str !== "string") {
            //return false;
            throw "argument required string, found " + typeof str;
        }
        var arr = str.split(".");
        // parse int or default to 0
        this.result.major = parseInt(arr[0]) || 0;
        this.result.minor = parseInt(arr[1]) || 0;
        this.result.build = parseInt(arr[2]) || 0;
        return this.result;
    };
    versionParser.prototype.toString = function () {
        return this.result.major + "." + this.result.minor + "." + this.result.build;
    };
    return versionParser;
}());
module.exports = versionParser;
