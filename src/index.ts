/* global hexo */

"use strict";

import Hexo from "hexo";
import seoJs from "./minifier/js";
import seoCss from "./minifier/css";
import minimist from "minimist";
import getConfig from "./config";
import fixSchema from "./html/fixSchema";
import fixHyperlinks from "./html/hyperlink";
import { usingJSDOM } from "./img/fixAttributes";
import minHtml from "./minifier/html";

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
  // return if hexo-seo configuration unavailable
  if (typeof hexo.config.seo == "undefined") {
    console.error("ERROR", "seo options not found");
    return;
  }

  // bind configuration
  hexo.config.seo = getConfig(hexo);

  // register source to hexo middleware
  // hexo-seo available in server http://localhost:4000/hexo-seo
  /*hexo.extend.filter.register("server_middleware", function (app) {
    // Main routes
    app.use(hexo.config.root, serveStatic(path.join(__dirname, "../source")));
  });*/

  // minify javascripts
  hexo.extend.filter.register("after_render:js", seoJs);
  // minify css
  hexo.extend.filter.register("after_render:css", seoCss);
  // fix external link
  hexo.extend.filter.register("after_render:html", fixHyperlinks);
  // fix schema meta
  hexo.extend.filter.register("after_render:html", fixSchema);
  // test image fix
  hexo.extend.filter.register("after_render:html", usingJSDOM);
  // minify html on production mode
  //hexo.extend.filter.register("after_generate", minHtml);
}
