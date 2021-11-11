import assign from "object-assign";

export default function (hexo) {
  const defaultOpt = {};
  if (typeof hexo.config.seo !== "object") return defaultOpt;
  return assign(hexo.config.seo, defaultOpt);
}
