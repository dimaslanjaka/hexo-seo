import * as fs from "fs";
import * as path from "path";

/**
 * resolve dirname of file
 * @param filePath
 * @returns
 */
export function resolveFile(filePath: string): string {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }
  return filePath;
}

/**
 * write file nested path
 * @param filePath
 */
export function writeFile(filePath: string, content: string) {
  resolveFile(filePath);
  fs.writeFileSync(filePath, content);
}

/**
 * read file nested path
 * @param filePath
 * @param options
 * @returns
 */
export function readFile(
  filePath: string,
  options?: {
    encoding?:
      | "ascii"
      | "utf8"
      | "utf-8"
      | "utf16le"
      | "ucs2"
      | "ucs-2"
      | "base64"
      | "base64url"
      | "latin1"
      | "binary"
      | "hex"
      | null
      | undefined;
    flag?: string | undefined;
  } | null,
  autocreate?: boolean | undefined
) {
  resolveFile(filePath);
  if (autocreate && !fs.existsSync(filePath)) {
    writeFile(filePath, "");
  }
  return fs.readFileSync(filePath, options);
}
