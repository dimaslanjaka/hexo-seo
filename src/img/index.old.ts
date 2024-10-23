import * as cheerio from 'cheerio';
import Hexo from 'hexo';
import { minimatch } from 'minimatch';
import { Stream } from 'stream';
import getConfig from '../config';
import logger from '../log';
import { isIgnore } from '../utils';
import { streamToArray } from '../utils/stream';

export interface imgOptions {
  /**
   * exclude image patterns from optimization
   */
  exclude?: string[];
  /**
   * replace broken images with default ones
   */
  broken?: boolean | { string: string }[];
  /**
   * default image fallback
   */
  default?: string | Buffer;
  onerror?: 'serverside' | 'clientside';
}

export default async function (this: Hexo) {
  const hexo = this;
  const route = hexo.route;
  const options = getConfig(hexo).img;
  // Filter routes to select all html files.
  const routes = route.list().filter(function (path0) {
    let choose = minimatch(path0, '**/*.{htm,html}', { nocase: true });
    if (typeof options == 'object' && typeof options.exclude != 'undefined') {
      choose = choose && !isIgnore(path0, options.exclude);
    }
    if (typeof hexo.config.skip_render != 'undefined') {
      // _config.yml skip_render https://hexo.io/docs/configuration.html#Directory
      choose = choose && !isIgnore(path0, hexo.config.skip_render);
    }
    return choose;
  });

  const processor = (stream: Stream) => {
    streamToArray(stream)
      .then((arr) => {
        return arr.join('');
      })
      .then((str) => {
        try {
          //dump("after_generate.txt", str);
          //logger.log(typeof str, "str");
          const $ = cheerio.load(str);
          const title = $('title').text();
          $('img').map(function (i, img) {
            // fix image alt
            const alt = $(img).attr('alt');
            if (!alt || alt.trim().length === 0) {
              $(img).attr('alt', title);
            }
            //const src = $(img).attr("src");
          });
        } catch (e) {
          logger.error(e);
        }

        return str;
      });
  };

  /*return bPromise.map(routes, (path0) => {
    const stream = route.get(path0);
    return processor(stream);
  });*/

  return routes.map((path0) => {
    const stream = route.get(path0);
    return processor(stream);
  });
}
