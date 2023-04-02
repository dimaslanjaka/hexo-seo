/* eslint-disable global-require */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global hexo */
//require("dotenv").config();

/*
const path = require("path");
const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));

// --development
const arg = typeof argv["development"] == "boolean" && argv["development"];

// set NODE_ENV = "development"
const env = process.env.NODE_ENV && /dev/i.test(process.env.NODE_ENV);

// define is development
const isDev = arg || env;
// console.log("hexo-seo init", { isDev });
*/

if (typeof hexo !== 'undefined') {
  global.hexo = hexo;
  require('./index.prod');
  /*if (!isDev && fs.existsSync(path.join(__dirname, "dist"))) {
    require("./index.prod");
  } else {
    require("./index.dev");
  }*/
}
