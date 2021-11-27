/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
/* eslint-disable global-require */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
/* global hexo */
hexo.log.debug("hexo-seo running on development mode");
require("ts-node").register({
    projectSearchDir: __dirname.toString(),
    project: "tsconfig.json"
});
require("./src").default(hexo);
