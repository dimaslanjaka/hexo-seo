/* global hexo */

"use strict";

import Hexo from "hexo";
import seoJs from "./minifier/js";
import seoCss from "./minifier/css";
import minimist from "minimist";
import { usingJSDOM } from "./img/fixAttributes";
import fixHyperlinks from "./html/hyperlink";
import fixSchema from "./html/fixSchema";
import fixInvalid from "./html/fixInvalid";
import minHtml from "./minifier/html";
import rimraf from "rimraf";
import { buildFolder, tmpFolder } from "./fm";
import scheduler from "./scheduler";
import bindProcessExit from "./utils/cleanup";

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

  let hexoCmd: string;
  if (hexo.env.args._ && hexo.env.args._.length > 0) {
    for (let i = 0; i < hexo.env.args._.length; i++) {
      if (hexo.env.args._[i] == "s" || hexo.env.args._[i] == "server")
        hexoCmd = "server";
      if (hexo.env.args._[i] == "d" || hexo.env.args._[i] == "deploy")
        hexoCmd = "deploy";
      if (hexo.env.args._[i] == "g" || hexo.env.args._[i] == "generate")
        hexoCmd = "generate";
      if (hexo.env.args._[i] == "clean") hexoCmd = "clean";
    }
  }

  // clean build and temp folder on `hexo clean`
  if (hexoCmd && hexoCmd == "clean") {
    rimraf.sync(tmpFolder);
    rimraf.sync(buildFolder);
  }

  // bind configuration
  // hexo.config.seo = getConfig(hexo);

  // minify javascripts
  hexo.extend.filter.register("after_render:js", seoJs);
  // minify css
  hexo.extend.filter.register("after_render:css", seoCss);
  // fix external link
  hexo.extend.filter.register("after_render:html", fixHyperlinks);
  // fix image attributes
  hexo.extend.filter.register("after_render:html", usingJSDOM);
  // fix schema meta
  hexo.extend.filter.register("after_render:html", fixSchema);
  // fix invalid link[/.js, /.css]
  hexo.extend.filter.register("after_render:html", fixInvalid);
  // minify html
  //hexo.extend.filter.register("after_generate", minHtml);

  // execute scheduled functions before process exit
  if (hexoCmd && hexoCmd != "clean") {
    bindProcessExit("scheduler_on_exit", function () {
      console.log("executing scheduled functions");
      scheduler.executeAll();
    });
  }

  // register source to hexo middleware
  // hexo-seo available in server http://localhost:4000/hexo-seo
  /*hexo.extend.filter.register("server_middleware", function (app) {
    // Main routes
    app.use(hexo.config.root, serveStatic(path.join(__dirname, "../source")));
  });*/
}
