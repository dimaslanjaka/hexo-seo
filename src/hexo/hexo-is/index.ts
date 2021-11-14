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
  return is(hexo);
};

/**
 * indicator dump only once per session
 */
let dumped = false;

/**
 * Dump variable to file
 * @param toDump
 */
export function hexoIsDump(toDump: any) {
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

export default hexoIs;
