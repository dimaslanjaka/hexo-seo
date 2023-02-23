import Promise from 'bluebird';
import { curly } from 'node-libcurl';
import { CacheFile } from '../cache';
import { isDev } from '../hexo-seo';

const cache = new CacheFile('curl');
/**
 * Check if url is exists
 */
const checkUrl = function (url: string | URL) {
  const isChanged = cache.isFileChanged(url.toString());
  const defaultReturn = {
    result: false,
    statusCode: null,
    data: null,
    headers: null
  };
  if (isDev || isChanged) {
    try {
      return Promise.resolve(curly.get(url.toString())).then((response) => {
        const statusCode = response.statusCode;
        const data = response.data;
        const headers = response.headers;
        const result = statusCode < 400 || statusCode >= 500 || statusCode === 200;
        cache.set(url.toString(), { result, statusCode, data, headers });
        return { result, statusCode, data, headers };
      });
    } catch (e) {
      return defaultReturn;
    }
  }

  return cache.get(url.toString(), defaultReturn) as typeof defaultReturn;
};

export default checkUrl;
