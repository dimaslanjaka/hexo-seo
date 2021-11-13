import { CheerioAPI } from "cheerio";
import Hexo from "hexo";

export default function ($: CheerioAPI, hexo: Hexo) {
  const metas = $("meta");
  metas.each((i, el) => {
    const meta = $(el);
  });
  return $;
}
