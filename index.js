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
  if (!isDev && fs.existsSync(path.join(__dirname, "dist"))) {
    // dont run compiled script on development
    hexo.log.debug("hexo-seo running on production mode");
    const index = require("./dist/src/index");
    if (typeof index.hexoSeoCore == "function") {
      index.hexoSeoCore(hexo);
    } else {
      hexo.log.error("Cannot find compiled hexo-seo plugin");
    }
  } else {
    // only run this plugin with hexo instance declared
    hexo.log.debug("hexo-seo running on development mode");
    require("ts-node").register({
      projectSearchDir: __dirname.toString(),
      project: "tsconfig.json"
    });
    require("./src/hexo-seo").default(hexo);
  }
}
