/* eslint-disable global-require */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global hexo */

hexo.log.debug("hexo-seo running on development mode");
/*require("ts-node").register({
  projectSearchDir: __dirname.toString(),
  project: "tsconfig.json"
});*/
require("ts-node").register({ transpileOnly: true });
require("./src").default(hexo);
