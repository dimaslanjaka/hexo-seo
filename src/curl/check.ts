import { curly } from "node-libcurl";
import logger from "../log";
//import Promise from "bluebird";

/**
 * Check if url is exists
 */
const checkUrl = async function (url: string | URL) {
  try {
    const { statusCode, data, headers } = await curly.get(url.toString());
    logger.log(url, statusCode);
    return statusCode < 400 || statusCode >= 500 || statusCode === 200;
  } catch (e) {
    return false;
  }
};

export default checkUrl;
