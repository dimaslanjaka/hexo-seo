import { curly } from "node-libcurl";
//import Promise from "bluebird";

/**
 * Check if url is exists
 */
const checkUrl = async function (url: string | URL) {
  try {
    const { statusCode, data, headers } = await curly.get(url.toString());
    return statusCode < 400 || statusCode >= 500 || statusCode === 200;
  } catch (e) {
    return false;
  }
};

export = checkUrl;
