/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const hexoSeoInit = require("./dist/src/index");

if (typeof hexo !== "undefined") {
  try {
    hexoSeoInit.default(hexo);
  } catch (e) {
    throw new Error(e);
  }
}
