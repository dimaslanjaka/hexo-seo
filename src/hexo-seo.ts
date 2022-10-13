"use strict";

import { existsSync, rmdirSync } from "fs";
import Hexo from "hexo";
import minimist from "minimist";
import pkg from "../package.json";
import getConfig from "./config";
import { buildFolder, tmpFolder } from "./fm";
import HexoSeoHtml from "./html";
import log from "./log";
import HexoSeoCss from "./minifier/css";
import HexoSeoJs from "./minifier/js";
import scheduler from "./scheduler";
import bindProcessExit from "./utils/cleanup";

const argv = minimist(process.argv.slice(2));

// --development
const arg = typeof argv["development"] == "boolean" && argv["development"];

// set NODE_ENV = "development"
const env = process.env.NODE_ENV && process.env.NODE_ENV.toString().toLowerCase() === "development";

// define is development
export const isDev = arg || env;

// core
export default function HexoSeo(hexo: Hexo) {
  //console.log("hexo-seo starting", { dev: env });
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
    if (existsSync(tmpFolder)) rmdirSync(tmpFolder, { recursive: true });
    if (existsSync(buildFolder)) rmdirSync(buildFolder, { recursive: true });
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
  hexo.extend.filter.register("after_render:js", HexoSeoJs);
  // minify css
  hexo.extend.filter.register("after_render:css", HexoSeoCss);
  // all in one html fixer
  hexo.extend.filter.register("after_render:html", HexoSeoHtml);
}
