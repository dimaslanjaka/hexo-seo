/* global hexo */
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDev = void 0;
var js_1 = __importDefault(require("./minifier/js"));
var css_1 = __importDefault(require("./minifier/css"));
var cheerio_1 = __importDefault(require("cheerio"));
var minimist_1 = __importDefault(require("minimist"));
var config_1 = __importDefault(require("./config"));
var serve_static_1 = __importDefault(require("serve-static"));
var path_1 = __importDefault(require("path"));
var meta_1 = __importDefault(require("./html/meta"));
var hyperlink_1 = __importDefault(require("./html/hyperlink"));
var check_1 = __importDefault(require("./curl/check"));
var bluebird_1 = __importDefault(require("bluebird"));
var log_1 = __importDefault(require("./log"));
var argv = (0, minimist_1.default)(process.argv.slice(2));
// --development
var arg = typeof argv["development"] == "boolean" && argv["development"];
// set NODE_ENV = "development"
var env = process.env.NODE_ENV &&
    process.env.NODE_ENV.toString().toLowerCase() === "development";
// define is development
exports.isDev = arg || env;
function default_1(hexo) {
    // return if hexo-seo configuration unavailable
    if (typeof hexo.config.seo == "undefined") {
        console.error("ERROR", "seo options not found");
        return;
    }
    // bind configuration
    hexo.config.seo = (0, config_1.default)(hexo);
    // register source to hexo middleware
    // hexo-seo available in server http://localhost:4000/hexo-seo
    hexo.extend.filter.register("server_middleware", function (app) {
        // Main routes
        app.use(hexo.config.root + "hexo-seo/", (0, serve_static_1.default)(path_1.default.join(__dirname, "../source")));
    });
    // minify javascripts
    hexo.extend.filter.register("after_render:js", js_1.default);
    // minify css
    hexo.extend.filter.register("after_render:css", css_1.default);
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
    hexo.extend.filter.register("after_render:html", hyperlink_1.default);
    // fix schema meta
    hexo.extend.filter.register("after_render:html", meta_1.default);
    // test image fix
    hexo.extend.filter.register("after_render:html", function (content, data) {
        var $ = cheerio_1.default.load(content);
        var config = (0, config_1.default)(this).img;
        var title = data.title;
        var images = [];
        $("img").each(function (i, el) {
            var img = $(el);
            var img_alt = img.attr("alt");
            var img_title = img.attr("title");
            var img_itemprop = img.attr("itemprop");
            if (!img_alt || img_alt.trim().length === 0) {
                img.attr("alt", title);
            }
            if (!img_title || img_title.trim().length === 0) {
                img.attr("title", title);
            }
            if (!img_itemprop || img_itemprop.trim().length === 0) {
                img.attr("itemprop", "image");
            }
            if (img.attr("src") &&
                img.attr("src").length > 0 &&
                /^https?:\/\//gs.test(img.attr("src")))
                images.push(img);
        });
        var fixBrokenImg = function (img) {
            var img_src = img.attr("src");
            return (0, check_1.default)(img_src).then(function (isWorking) {
                var new_img_src = config.default.toString();
                if (!isWorking) {
                    img.attr("src", new_img_src);
                    img.attr("src-original", img_src);
                    log_1.default.log("%s is broken, replaced with %s", img_src, new_img_src);
                }
                return img;
            });
        };
        return bluebird_1.default.all(images)
            .map(fixBrokenImg)
            .catch(function () { })
            .then(function () {
            return $.html();
        });
    });
    //hexo.extend.filter.register("after_generate", minHtml);
    //hexo.extend.filter.register("after_generate", testAfterGenerate);
    //hexo.extend.filter.register("after_render:html", testAfterRenderHtml);
}
exports.default = default_1;
