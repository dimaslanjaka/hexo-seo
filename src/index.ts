/* global hexo */

("use strict");

import Hexo from "hexo";
import jsmin from "./minifier/js";

export default function (hexo: Hexo) {
  hexo.extend.filter.register("after_render:js", jsmin);
}

/*
  hexo.extend.filter.register("after_render:js", filter.optimizeJS);
  */
