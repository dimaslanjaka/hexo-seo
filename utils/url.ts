export function isValidUrlPattern(url: string): boolean {
  try {
    if (new URL(url).hostname) return true;
  } catch (e) {
    return false;
  }
  return false;
}
