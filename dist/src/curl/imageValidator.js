"use strict";
var node_libcurl_1 = require("node-libcurl");
var imageValidator = /** @class */ (function () {
    function imageValidator() {
    }
    /**
     * validate image url
     * @param url
     * @returns
     */
    imageValidator.validate = function (url) {
        return this.isValid(url);
    };
    /**
     * validate image url
     * @param url
     * @returns
     */
    imageValidator.isValid = function (url) {
        if (/^https?/gs.test(url)) {
            try {
                return node_libcurl_1.curly.get(url.toString()).then(function (res) {
                    var statusCode = res.statusCode;
                    var validStatusCode = statusCode < 400 || statusCode >= 500 || statusCode === 200;
                    if (validStatusCode) {
                        if (typeof res.headers[0] == "object") {
                            var headers = res.headers[0];
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
    };
    imageValidator.db = {};
    return imageValidator;
}());
module.exports = imageValidator;
