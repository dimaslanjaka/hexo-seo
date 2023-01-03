/// install

const { existsSync } = require("fs");
const { rm } = require("fs/promises");
const Hexo = require("hexo");
const { spawn } = require("hexo-util");
const { join } = require("path");
const config = require("./config");

(async function () {
  if (existsSync(join(config.base, "node_modules/hexo-seo"))) {
    await rm(join(config.base, "node_modules/hexo-seo"), { recursive: true, force: true });
  }
  await spawn("npm", ["install", "file:./../../release/hexo-seo.tgz"], {
    cwd: config.base
  });
  const hexo = new Hexo(config.base);
  await hexo.init();
  await hexo.load();
  await hexo.call("clean");
  await hexo.call("generate");
})();
