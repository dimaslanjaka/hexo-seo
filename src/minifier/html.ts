"use strict";
import { minify, Options as htmlMinifyOptions } from "html-minifier-terser";
import Hexo from "hexo";
import { isIgnore } from "../utils";
import getConfig from "../config";
import bluebird from "bluebird";
import minimatch from "minimatch";
import pkg from "../../package.json";
import { streamToArray } from "../utils/stream";
import logger from "../log";

export interface MinifyOptions extends htmlMinifyOptions {
  fix?: boolean;
  /**
   * Array of exclude patterns to exclude from minifying
   */
  exclude: string[];
}

const minHtml = function (this: Hexo) {
  const hexo = this;
  const options: MinifyOptions = getConfig(hexo).html;
  // if option html is false, return
  if (typeof options == "boolean" && !options) return;
  const route = hexo.route;
  // Filter routes to select all html files.
  const routes = route.list().filter(function (path0) {
    let choose = minimatch(path0, "**/*.{htm,html}", { nocase: true });
    if (typeof options.exclude != "undefined") {
      choose = choose && !isIgnore(path0, options.exclude);
    }
    if (typeof hexo.config.skip_render != "undefined") {
      // _config.yml skip_render https://hexo.io/docs/configuration.html#Directory
      choose = choose && !isIgnore(path0, hexo.config.skip_render);
    }
    return choose;
  });

  return bluebird.all(routes).map((path0) => {
    //const str = await minify(str, options);
    // Retrieve and concatenate buffers.
    const stream = route.get(path0);
    return streamToArray(stream)
      .then((buff) => {
        return buff.join("");
      })
      .then((str) => {
        return minify(str, options).then((result) => {
          const len0 = result.length;
          const saved = len0
            ? (((len0 - result.length) / len0) * 100).toFixed(2)
            : 0;
          logger.log("%s(HTML): %s [ %s saved]", pkg.name, path0, saved + "%");
          route.set(path0, result);
          return result;
        });
      });
  });
};

export default minHtml;
