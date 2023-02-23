import parseUrl from 'url-parse';
import getConfig from '../config';
import Hexo from 'hexo';

export interface hyperlinkOptions {
  enable: boolean;
  blank: boolean;
  /**
   * Allow external link to be dofollowed
   * insert hostname or full url
   */
  allow?: string[];
}

export function formatAnchorText(text: string) {
  return text.replace(/['"]/gm, '');
}

/**
 * is url external link
 * @param url
 * @param hexo
 * @returns
 */
export function isExternal(url: ReturnType<typeof parseUrl>, hexo: Hexo): boolean {
  const site = typeof parseUrl(hexo.config.url).hostname == 'string' ? parseUrl(hexo.config.url).hostname : null;
  const cases = typeof url.hostname == 'string' ? url.hostname.trim() : null;
  const config = getConfig(hexo);
  const allowed = Array.isArray(config.links.allow) ? config.links.allow : [];
  const hosts = config.host;

  // if url hostname empty, its internal
  if (!cases) return false;
  // if url hostname same with site hostname, its internal
  if (cases == site) return false;
  // if arrays contains url hostname, its internal and allowed to follow
  if (hosts.includes(cases) || allowed.includes(cases)) return false;

  /*if (cases.includes("manajemen")) {
    logger.log({ site: site, cases: cases, allowed: allowed, hosts: hosts });
  }*/

  return true;
}
