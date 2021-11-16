/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const hexoSeoInit = require("./dist/src");

if (typeof hexo !== "undefined") {
  try {
    hexoSeoInit(hexo);
  } catch (e) {
    throw new Error(e);
  }
}
