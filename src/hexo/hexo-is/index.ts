import Hexo from "hexo";
import hexoLog from "hexo-log";
import pkg from "./package.json";
import * as fs from "fs";
import util from "util";
import path from "path";
import is from "./is";
const log = hexoLog({
  debug: false,
  silent: false
});

const hexoIs = function (hexo: Hexo | Hexo.View) {
  if (typeof hexo["path"] != "undefined") {
    //console.log("using property path");
    //hexoIsDump(hexo);
    return validate(hexo);
  }
  if (typeof hexo["page"] != "undefined") {
    //console.log("using property page");
    return validate(hexo["page"]);
  }
  if (typeof hexo["url"] != "undefined") {
    //console.log("using property url");
    return validate(hexo["url"]);
  }
  //console.log(hexo["view"]);
  hexoIsDump(hexo);
  log.error("%s: hexo instance not found", pkg.name);
  return null;
};

/**
 * indicator dump only once per session
 */
let dumped = false;

/**
 * Dump variable to file
 * @param toDump
 */
function hexoIsDump(toDump: any) {
  if (dumped) return;
  dumped = true;
  const dump = util.inspect(toDump);
  const loc = path.join("tmp/hexo-is/dump.txt");
  if (!fs.existsSync(path.dirname(loc))) {
    fs.mkdirSync(path.dirname(loc), { recursive: true });
  }
  fs.writeFileSync(loc, dump);
  log.log(`${pkg.name}: dump saved to: ${path.resolve(loc)}`);
}

function validate(pathx: any) {
  const indexTest = {
    archive: Boolean(pathx.archive),
    tag: Boolean(pathx.tag),
    category: Boolean(pathx.category),
    post: Boolean(pathx.__post),
    page: Boolean(pathx.__page),
    home: Boolean(pathx.__index)
  };
  //console.log(indexTest);
  if (typeof pathx.path === "string") {
    //console.log(pathx);
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
  return indexTest;
}

export default hexoIs;
