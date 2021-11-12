/* global hexo */

"use strict";
import Hexo from "hexo";
import jsmin from "./minifier/js";
import cssmin from "./minifier/css";
import minimist from "minimist";
import getConfig, { seoOptions } from "./config";

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
  const config: seoOptions = hexo.config;
  if (typeof config.seo != "object") {
    config.seo = getConfig(hexo);
  }

  hexo.extend.filter.register("after_render:js", jsmin);
  hexo.extend.filter.register("after_render:css", cssmin);
}
