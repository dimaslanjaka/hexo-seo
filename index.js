/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global hexo */
//require("ts-node").register(require("./tsconfig.json"));
require("ts-node").register({ project: "tsconfig.json" });
require("./src/index").default(hexo);
