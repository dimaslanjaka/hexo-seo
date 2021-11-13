import Hexo from "hexo";
import hexoIs from "hexo-is";
import pkg from "./package.json";
import hexoLog from "hexo-log";
const log = hexoLog({
  debug: false,
  silent: false
});

export interface HexoAuthorObject {
  [key: string]: string;
  name?: string;
  nick?: string;
  url?: string;
  link?: string;
}

export type HexoAuthor = string | HexoAuthorObject;

const getAuthor = function (hexo: Hexo | Hexo.View) {
  if (
    hexoIs(hexo).archive ||
    hexoIs(hexo).category ||
    hexoIs(hexo).home ||
    hexoIs(hexo).tag
  ) {
    if (typeof hexo["config"] != "undefined") {
      return resolveAuthor(hexo["config"]);
    }
  }

  return resolveAuthor(hexo);
};

function resolveAuthor(config: any): HexoAuthor {
  if (typeof config["author"] == "object") {
    return config["author"];
  }
  log.error("%s cannot resolve author", pkg.name);
}

export default getAuthor;
