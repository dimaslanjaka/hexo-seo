"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_libcurl_1 = require("node-libcurl");
var curlTest = new node_libcurl_1.Curl();
var terminate = curlTest.close.bind(curlTest);
curlTest.setOpt(node_libcurl_1.Curl.option.URL, "https://reqres.in/api/users");
curlTest.on("end", function (statusCode, data, headers) {
    console.info("Status code " + statusCode);
    console.info("***");
    console.info("Our response: " + data);
    console.info("***");
    console.info("Length: " + data.length);
    console.info("***");
    console.info("Total time taken: " + this.getInfo("TOTAL_TIME"));
    this.close();
});
curlTest.on("error", terminate);
curlTest.perform();
