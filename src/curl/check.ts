import { curly } from "node-libcurl";
import logger from "../log";
import { CacheFile } from "../cache";
import { isDev } from "../index";

const cache = new CacheFile("curl");
/**
 * Check if url is exists
 */
const checkUrl = async function (url: string | URL) {
  const isChanged = cache.isFileChanged(url.toString());
  if (isDev || isChanged) {
    try {
      const { statusCode, data, headers } = await curly.get(url.toString());
      logger.log(url, statusCode);
      const result =
        statusCode < 400 || statusCode >= 500 || statusCode === 200;
      cache.set(url.toString(), [result, statusCode, data, headers]);
      return result;
    } catch (e) {
      return false;
    }
  }
  return cache.get(url.toString())[0] as boolean;
};

export default checkUrl;
