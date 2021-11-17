/* eslint-disable import/extensions */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global hexo */

const index = require("./dist/src");
hexo.log.debug("hexo-seo running on production mode");
if (typeof index.default == "function") {
  index.default(hexo);
}
