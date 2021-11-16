/* global hexo */

"use strict";
import Hexo from "hexo";
import seoJs from "./minifier/js";
import seoCss from "./minifier/css";
import seoHtml from "./minifier/html";
import minimist from "minimist";
import getConfig from "./config";
import serveStatic from "serve-static";
import path from "path";
import fixMeta from "./html/meta";

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
  hexo.config.seo = getConfig(hexo);
  if (typeof hexo.config.seo == "undefined") return;
  hexo.extend.filter.register("server_middleware", function (app) {
    // Main routes
    app.use(
      hexo.config.root + "hexo-seo/",
      serveStatic(path.join(__dirname, "../source"))
    );
  });
  hexo.extend.filter.register("after_render:js", seoJs);
  hexo.extend.filter.register("after_render:css", seoCss);
  hexo.extend.filter.register("after_render:html", fixMeta);
  //hexo.extend.filter.register("after_generate", seoImage);
  //hexo.extend.filter.register("after_generate", testAfterGenerate);
  //hexo.extend.filter.register("after_render:html", testAfterRenderHtml);
}
