/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable global-require */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global hexo */
//require("dotenv").config();
var path = require("path");
var fs = require("fs");
var argv = require("minimist")(process.argv.slice(2));
// --development
var arg = typeof argv["development"] == "boolean" && argv["development"];
// set NODE_ENV = "development"
var env = process.env.NODE_ENV &&
    process.env.NODE_ENV.toString().toLowerCase() === "development";
// define is development
var isDev = arg || env;
if (typeof hexo !== "undefined") {
    global.hexo = hexo;
    if (!isDev && fs.existsSync(path.join(__dirname, "dist"))) {
        require("./index.prod");
    }
    else {
        require("./index.dev");
    }
}
