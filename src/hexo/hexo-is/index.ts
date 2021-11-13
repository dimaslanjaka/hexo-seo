import Hexo from "hexo";
import hexoLog from "hexo-log";
import pkg from "./package.json";
const log = hexoLog({
  debug: false,
  silent: false
});

const hexoIs = function (hexo: Hexo | Hexo.View) {
  if (typeof hexo["path"] === "string") {
    return validate(hexo["path"]);
  }
  if (typeof hexo["page"] != "undefined") {
    return validate(hexo["page"]);
  }
  log.error("%s hexo instance not found", pkg.name);
  return null;
};

function validate(pathx: any) {
  if (typeof pathx.path === "string") {
    pathx = pathx.path;
  }

  if (typeof pathx == "string") {
    pathx = pathx.replace(/^\//, "");
    //console.log(pathx);
    return {
      archive: /archive?s\//gs.test(pathx),
      tag: /tag?s\//gs.test(pathx),
      category: /category|categories\//gs.test(pathx)
    };
  }

  // https://github.com/hexojs/hexo/blob/master/lib/plugins/helper/is.js
  return {
    archive: Boolean(pathx.archive),
    tag: Boolean(pathx.tag),
    category: Boolean(pathx.category),
    post: Boolean(pathx.__post),
    page: Boolean(pathx.__page),
    home: Boolean(pathx.__index)
  };
}

export default hexoIs;
