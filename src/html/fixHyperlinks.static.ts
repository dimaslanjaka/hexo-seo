import { isValidHttpUrl } from 'sbg-utility';
import parseUrl from 'url-parse';
import { array_unique, remove_array_item_from } from '../utils/array';
import { _JSDOM } from './dom';
import { HexoSeo } from './schema/article';
import { formatAnchorText, hyperlinkOptions, isExternal } from './types';

export default function (dom: _JSDOM, HSconfig: hyperlinkOptions, _data: HexoSeo) {
  const a = dom.document.querySelectorAll('a[href]');
  if (a.length) {
    a.forEach((el: HTMLAnchorElement) => {
      const href = el.href;
      // only process anchor start with https?, otherwise abadoned
      if (isValidHttpUrl(href)) {
        const parseHref = parseUrl(href);
        let rels = el.getAttribute('rel') ? el.getAttribute('rel').split(' ') : [];

        const external = isExternal(parseHref, hexo);
        rels = identifyRels(el, external, HSconfig);
        el.setAttribute('rel', rels.join(' '));
      }
      // set anchor title
      const aTitle = el.getAttribute('title');
      if (!aTitle || aTitle.length < 1) {
        let textContent: string;
        if (!el.textContent || el.textContent.length < 1) {
          textContent = hexo.config.title;
        } else {
          textContent = el.textContent;
        }
        el.setAttribute('title', formatAnchorText(textContent));
      }
    });
  }
}

export function identifyRels(
  el: HTMLAnchorElement | import('node-html-parser').HTMLElement,
  external: boolean,
  HSconfig: hyperlinkOptions
) {
  let rels: string[] = [];
  const externalArr = ['nofollow', 'noopener', 'noreferer', 'noreferrer', 'external'];
  const internalArr = ['internal', 'follow', 'bookmark'];
  // if external link, assign external rel attributes and remove items from internal attributes if exists, and will do the opposite if the internal link
  const newRels = array_unique(rels);
  if (external) {
    rels = remove_array_item_from(newRels.concat(externalArr), internalArr);
    if (typeof HSconfig.blank == 'boolean' && HSconfig.blank) {
      el.setAttribute('target', '_blank');
    }
  } else {
    rels = remove_array_item_from(newRels.concat(internalArr), externalArr);
  }
  return rels;
}
