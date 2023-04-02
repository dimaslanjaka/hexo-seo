import { _JSDOM } from '../html/dom';
import { HexoSeo } from '../html/schema/article';
import { imgOptions } from './index.old';
import { checkBrokenImg } from '../img/broken';
import logger from '../log';
import pkg from '../../package.json';
import Promise from 'bluebird';

export default function (dom: _JSDOM, HSconfig: imgOptions, data: HexoSeo) {
  const images = dom.document.querySelectorAll('img');
  for (let index = 0; index < images.length; index++) {
    const img = images.item(index);
    const src = img.getAttribute('src');

    if (src) {
      if (/^https?:\/\//.test(src) && src.length > 0) {
        return checkBrokenImg(src).then((check) => {
          if (typeof check == 'object' && !check.success) {
            logger.log('%s(IMG:broken) fixing %s', pkg.name, [src, check.resolved]);
            img.setAttribute('src', check.resolved);
            img.setAttribute('src-ori', check.original);
          }
        });
      }
    }
  }
  return Promise.resolve();
}
