'use strict';

import ansiColors from 'ansi-colors';
import CleanCSS from 'clean-css';
import Hexo from 'hexo';
import { HexoLocalsData } from 'hexo/dist/hexo/locals-d';
import pkg from '../../package.json';
import Cache from '../cache';
import getConfig from '../config';
import log from '../log';
import { isIgnore } from '../utils';

export type cssMinifyOptions = CleanCSS.Options & {
  enable?: boolean;
  exclude?: string[];
};

const cache = new Cache();

export default async function HexoSeoCss(this: Hexo, str: string, data: HexoLocalsData) {
  const path0 = data.path;
  const isChanged = await cache.isFileChanged(path0);
  const useCache = this.config.seo.cache;

  if (isChanged || !useCache) {
    log.log(
      '%s is changed %s',
      path0,
      isChanged ? ansiColors.red(String(isChanged)) : ansiColors.green(String(isChanged))
    );
    // if original file is changed, re-minify css
    const hexo: Hexo = this;
    const options = getConfig(hexo).css;
    // if option css is false, return original content
    if (typeof options == 'boolean' && !options) return str;
    const exclude = typeof options.exclude == 'object' ? options.exclude : [];

    if (path0 && exclude && exclude.length > 0) {
      const ignored = isIgnore(path0, exclude);
      log.log(
        '%s(CSS:exclude) %s %s %s',
        pkg.name,
        ignored ? ansiColors.red(String(ignored)) : ansiColors.green(String(ignored)),
        path0,
        exclude.join(', ')
      );
      if (ignored) return str;
    }

    if (typeof options == 'object') {
      try {
        const { styles } = await new CleanCSS(<any>options).minify(str);
        const saved = (((str.length - styles.length) / str.length) * 100).toFixed(2);
        log.log('%s(CSS): %s [%s saved]', pkg.name, path0, saved + '%');
        str = styles;
        cache.set(path0, str);
      } catch (err) {
        log.log('%d(CSS) %s %s', pkg.name, path0 + ansiColors.redBright('failed'));
        log.error(err);
      }
    }
  } else {
    log.log('%s(CSS) cached [%s]', pkg.name, path0.replace(this.base_dir, ''));
    str = cache.get(path0, '');
  }

  return str;
}
