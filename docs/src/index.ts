"use strict";

import Hexo from "hexo";
import seoJs from "./minifier/js";
import seoCss from "./minifier/css";
import minimist from "minimist";
import rimraf from "rimraf";
import pkg from "../package.json";
import { buildFolder, tmpFolder } from "./fm";
import htmlIndex from "./html/index";
import bindProcessExit from "./utils/cleanup";
import scheduler from "./scheduler";
import log from "./log";
import getConfig from "./config";

const argv = minimist(process.argv.slice(2));

// --development
const arg = typeof argv["development"] == "boolean" && argv["development"];

// set NODE_ENV = "development"
const env = process.env.NODE_ENV && process.env.NODE_ENV.toString().toLowerCase() === "development";

// define is development
export const isDev = arg || env;

// core
export default function (hexo: Hexo) {
  // return if hexo-seo configuration unavailable
  if (typeof hexo.config.seo == "undefined") {
    log.error("seo options not found");
    return;
  }

  let hexoCmd: string;
  if (hexo.env.args._ && hexo.env.args._.length > 0) {
    for (let i = 0; i < hexo.env.args._.length; i++) {
      if (hexo.env.args._[i] == "s" || hexo.env.args._[i] == "server") {
        hexoCmd = "server";
        break;
      }
      if (hexo.env.args._[i] == "d" || hexo.env.args._[i] == "deploy") {
        hexoCmd = "deploy";
        break;
      }
      if (hexo.env.args._[i] == "g" || hexo.env.args._[i] == "generate") {
        hexoCmd = "generate";
        break;
      }
      if (hexo.env.args._[i] == "clean") {
        hexoCmd = "clean";
        break;
      }
    }
  }

  // clean build and temp folder on `hexo clean`
  if (hexoCmd && hexoCmd == "clean") {
    console.log("%s cleaning build and temp folder", pkg.name);
    rimraf(tmpFolder, function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("cleaned", tmpFolder);
      }
    });
    rimraf(buildFolder, function (err) {
      if (err) {
        console.error(err);
      } else {
        console.log("cleaned", buildFolder);
      }
    });
    return;
  }
  // execute scheduled functions before process exit
  if (hexoCmd && hexoCmd != "clean") {
    bindProcessExit("scheduler_on_exit", function () {
      log.log("executing scheduled functions");
      scheduler.executeAll();
    });
  }

  // bind configuration
  hexo.config.seo = getConfig(hexo);

  // minify javascripts
  hexo.extend.filter.register("after_render:js", seoJs);
  // minify css
  hexo.extend.filter.register("after_render:css", seoCss);
  // all in one html fixer
  hexo.extend.filter.register("after_render:html", htmlIndex);
}
