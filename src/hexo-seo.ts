/* global hexo */

"use strict";
import Hexo from "hexo";
import seoJs from "./minifier/js";
import seoCss from "./minifier/css";
import cheerio, { Cheerio, Element } from "cheerio";
import minimist from "minimist";
import getConfig from "./config";
import serveStatic from "serve-static";
import path from "path";
import fixMeta from "./html/meta";
import { HexoSeo } from "./html/schema/article";
import fixHyperlinks from "./html/hyperlink";
import seoImage from "./img";
import checkUrl from "./curl/check";
import Promise from "bluebird";
import logger from "./log";

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
  hexo.extend.filter.register("server_middleware", function (app) {
    // Main routes
    app.use(
      hexo.config.root + "hexo-seo/",
      serveStatic(path.join(__dirname, "../source"))
    );
  });

  // minify javascripts
  hexo.extend.filter.register("after_render:js", seoJs);
  // minify css
  hexo.extend.filter.register("after_render:css", seoCss);

  /*
  // bind hexo instance
  const anchorfix: typeof fixHyperlinks = fixHyperlinks.bind(hexo);
  const metafix: typeof fixMeta = fixMeta.bind(hexo);
  const imagefix: typeof seoImage = seoImage.bind(hexo);

  // fix seo function
  const fixSeoHtml = async (str: string, data: HexoSeo) => {
    // parse html start
    let $ = cheerio.load(str);
    // check image start
    //$ = await imagefix($, hexo);
    str = await imagefix(str, data);
    // filter external links and optimize seo
    $ = anchorfix($, hexo);
    // fix meta
    $ = metafix($, data);
    // set modified html
    str = $.html();
    return str;
  };

  hexo.extend.filter.register("after_render:html", fixSeoHtml);
  */

  // fix external link
  hexo.extend.filter.register("after_render:html", fixHyperlinks);
  // fix schema meta
  hexo.extend.filter.register("after_render:html", fixMeta);
  // test image fix
  hexo.extend.filter.register(
    "after_render:html",
    function (this: Hexo, content: string, data: HexoSeo) {
      const $ = cheerio.load(content);
      const config = getConfig(this).img;
      const title = data.title;
      const images: Cheerio<Element>[] = [];
      $("img").each((i, el) => {
        const img = $(el);
        const img_alt = img.attr("alt");
        const img_title = img.attr("title");
        const img_itemprop = img.attr("itemprop");
        if (!img_alt || img_alt.trim().length === 0) {
          img.attr("alt", title);
        }
        if (!img_title || img_title.trim().length === 0) {
          img.attr("title", title);
        }
        if (!img_itemprop || img_itemprop.trim().length === 0) {
          img.attr("itemprop", "image");
        }
        if (
          img.attr("src") &&
          img.attr("src").length > 0 &&
          /^https?:\/\//gs.test(img.attr("src"))
        )
          images.push(img);
      });

      const fixBrokenImg = function (img: Cheerio<Element>) {
        const img_src = img.attr("src");
        return checkUrl(img_src).then((isWorking) => {
          const new_img_src = config.default.toString();
          if (!isWorking) {
            img.attr("src", new_img_src);
            img.attr("src-original", img_src);
            logger.log("%s is broken, replaced with %s", img_src, new_img_src);
          }
          return img;
        });
      };

      return Promise.all(images)
        .map(fixBrokenImg)
        .catch(() => {})
        .then(() => {
          return $.html();
        });
    }
  );

  //hexo.extend.filter.register("after_generate", minHtml);
  //hexo.extend.filter.register("after_generate", testAfterGenerate);
  //hexo.extend.filter.register("after_render:html", testAfterRenderHtml);
}
