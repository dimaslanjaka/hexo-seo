/**
 * Bind functions to exit handler
 * @param key
 * @param fn
 */
declare function bindProcessExit(key: string, fn: () => void): void;
export default bindProcessExit;
