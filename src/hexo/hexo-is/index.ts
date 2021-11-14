/* eslint-disable prefer-rest-params */
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

/**
 * @example
 * // run inside plugin or theme event
 * import hexoIs from 'hexo-is';
 * const hexo = this;
 * console.log(hexoIs(hexo));
 * @param hexo
 * @returns
 */
const hexoIs = function (hexo: Hexo | Hexo.View) {
  if (typeof hexo["page"] != "undefined") return is(hexo);

  /*
  if (typeof hexo["locals"] != "undefined") {
    hexoIsDump(hexo["locals"]["page"], "locals");
  }
  */

  if (typeof hexo["extend"] != "undefined") {
    const filter = hexo["extend"]["filter"];
    //filter.register("after_render:html", dumper);
    //hexoIsDump(filter["store"]["_after_html_render"], "filter");
  }
};

function dumper() {
  hexoIsDump(arguments, "arg");
}

/**
 * Dump variable to file
 * @param toDump
 */
export function hexoIsDump(toDump: any, name = "") {
  if (name.length > 0) name = "-" + name;
  const dump = util.inspect(toDump, { showHidden: true, depth: null });
  const loc = path.join("tmp/hexo-is/dump" + name + ".txt");
  if (!fs.existsSync(path.dirname(loc))) {
    fs.mkdirSync(path.dirname(loc), { recursive: true });
  }
  fs.writeFileSync(loc, dump);
  log.log(`${pkg.name}: dump saved to: ${path.resolve(loc)}`);
}

export default hexoIs;
