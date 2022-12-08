/// test generate

const Hexo = require("hexo");
const config = require("./config");

(async function () {
  const hexo = new Hexo(config.base);
  await hexo.init();
  await hexo.load();
})();
