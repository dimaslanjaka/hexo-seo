/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable global-require */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global hexo */
//require("ts-node").register(require("./tsconfig.json"));

const path = require("path");
const fs = require("fs");

if (fs.existsSync(path.join(__dirname, "dist"))) {
  require("./dist/index");
} else {
  require("ts-node").register({ project: "tsconfig.json" });
  require("./src/index").default(hexo);
}
