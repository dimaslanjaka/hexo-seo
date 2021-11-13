import logger from "../log";
import { memoize } from "underscore";

const IsValidImage = function (url, callback) {
  $("<img>", {
    src: url,
    error: function () {
      callback(url, false);
    },
    load: function () {
      callback(url, true);
    }
  });
};

const CallbackFunction = function (url, isValid) {
  if (isValid) {
    logger.log(url + " is valid image");
    //do whatever logic you want
  } else {
    logger.log(url + " is invalid image");
    //do whatever logic you want
  }
};

/**
 * is local image
 */
export const isLocalImage = memoize((url: string) => {
  const regex = /^http?s/gs;
  return regex.test(url);
});

/**
 * Broken image fix
 * @param img
 */
export default function (img: string) {}
