/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable global-require */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global hexo */
//require("ts-node").register(require("./tsconfig.json"));

const path = require("path");
const fs = require("fs");

// set NODE_ENV = "development"
const env = process.env.NODE_ENV || "production";

if (
  env.toString().toLowerCase() === "development" &&
  fs.existsSync(path.join(__dirname, "dist"))
) {
  // dont run compiled script on development
  require("./dist/index");
} else if (typeof hexo !== "undefined") {
  // only run this plugin with hexo instance declared
  require("ts-node").register({ project: "tsconfig.json" });
  require("./src/index").default(hexo);
}
