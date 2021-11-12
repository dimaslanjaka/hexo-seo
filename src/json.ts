/**
 * JSON.parse with fallback value
 * @param json
 * @param fallback
 * @returns
 */
export function parse(json: string, fallback?: any) {
  try {
    return JSON.parse(json);
  } catch (e) {
    return fallback;
  }
}

export function stringify(object: object) {
  return JSON.stringify(object);
}
