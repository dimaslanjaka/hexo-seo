import logger from "../log";
import { memoize } from "underscore";

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
