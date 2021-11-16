/* global hexo */

"use strict";
import Hexo from "hexo";
import seoJs from "./minifier/js";
import seoCss from "./minifier/css";
import cheerio from "cheerio";
import minimist from "minimist";
import getConfig from "./config";
import serveStatic from "serve-static";
import path from "path";
import fixMeta from "./html/meta";
import { HexoSeo } from "./html/schema/article";
import fixHyperlinks from "./html/hyperlink";

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
  if (typeof hexo.config.seo == "undefined") {
    console.error("ERROR", "seo options not found");
    return;
  }
  hexo.config.seo = getConfig(hexo);
  hexo.extend.filter.register("server_middleware", function (app) {
    // Main routes
    app.use(
      hexo.config.root + "hexo-seo/",
      serveStatic(path.join(__dirname, "../source"))
    );
  });
  hexo.extend.filter.register("after_render:js", seoJs);
  hexo.extend.filter.register("after_render:css", seoCss);

  const anchorfix = fixHyperlinks.bind(hexo);
  const metafix = fixMeta.bind(hexo);
  const fixSeoHtml = async (str: string, data: HexoSeo) => {
    // parse html start
    let $ = cheerio.load(str);
    // check image start
    //$ = await seoImage.bind(this)($, hexo);
    // filter external links and optimize seo
    $ = anchorfix($, hexo);
    // fix meta
    $ = metafix($, data);
    // set modified html
    str = $.html();
    return str;
  };

  hexo.extend.filter.register("after_render:html", fixSeoHtml);
  //hexo.extend.filter.register("after_generate", seoImage);
  //hexo.extend.filter.register("after_generate", testAfterGenerate);
  //hexo.extend.filter.register("after_render:html", testAfterRenderHtml);
}
