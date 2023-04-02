export function isValidUrlPattern(url: string): boolean {
  try {
    if (new URL(url).hostname) return true;
  } catch (e) {
    return false;
  }
  return false;
}

export function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}
