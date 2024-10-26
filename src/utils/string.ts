export function trimText(content: string) {
  if (typeof content === 'string') return content.trim();
  return content;
}

/**
 * Checks if the provided string is a valid email address.
 *
 * @param email - The string to validate as an email address.
 * @returns True if the string is a valid email address, otherwise false.
 *
 * @example
 * ```typescript
 * const email1 = "example@example.com";
 * const email2 = "invalid-email.com";
 *
 * console.log(isValidEmail(email1)); // true
 * console.log(isValidEmail(email2)); // false
 * ```
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
