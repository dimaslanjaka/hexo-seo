/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable global-require */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global hexo */

const path = require("path");
const fs = require("fs");
const argv = require("minimist")(process.argv.slice(2));

// --development
const arg = typeof argv["development"] == "boolean" && argv["development"];

// set NODE_ENV = "development"
const env =
  process.env.NODE_ENV &&
  process.env.NODE_ENV.toString().toLowerCase() === "development";

// define is development
const isDev = arg || env;

if (typeof hexo !== "undefined") {
  global.hexo = hexo;
  if (!isDev && fs.existsSync(path.join(__dirname, "dist"))) {
    require("./index.prod");
  } else {
    require("./index.dev");
  }
}
