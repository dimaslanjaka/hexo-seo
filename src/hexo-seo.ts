/* global hexo */

"use strict";
import Hexo from "hexo";
import jsmin from "./minifier/js";
import cssmin from "./minifier/css";
import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

// --development
const arg = typeof argv["development"] == "boolean" && argv["development"];

// set NODE_ENV = "development"
const env =
  process.env.NODE_ENV &&
  process.env.NODE_ENV.toString().toLowerCase() === "development";

// define is development
export const isDev = arg || env;

export default function (hexo: Hexo) {
  if (typeof hexo.config.seo != "object") {
    hexo.config.seo = {};
  }
  hexo.extend.filter.register("after_render:js", jsmin);
  hexo.extend.filter.register("after_render:css", cssmin);
}
