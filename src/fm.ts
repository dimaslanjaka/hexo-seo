import * as fs from "fs";
import * as path from "path";
import crypto from "crypto";
import "js-prototypes";

/**
 * Temp folder
 */
export const tmpFolder = path.join(process.cwd(), "tmp");
export const buildFolder = path.join(process.cwd(), "build/hexo-seo");

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
  autocreate = undefined
): Buffer | string {
  resolveFile(filePath);
  if (autocreate && !fs.existsSync(filePath)) {
    if (typeof autocreate === "boolean") {
      writeFile(filePath, "");
    } else if (autocreate) {
      let text;
      if (Array.isArray(autocreate) || typeof autocreate === "object") {
        text = JSON.stringify(autocreate);
      }
      writeFile(filePath, text);
    }
    return autocreate;
  }
  return fs.readFileSync(filePath, options);
}

const BUFFER_SIZE = 8192;

export function md5FileSync(path) {
  const fd = fs.openSync(path, "r");
  const hash = crypto.createHash("md5");
  const buffer = Buffer.alloc(BUFFER_SIZE);

  try {
    let bytesRead;

    do {
      bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE, null);
      hash.update(buffer.slice(0, bytesRead));
    } while (bytesRead === BUFFER_SIZE);
  } finally {
    fs.closeSync(fd);
  }

  return hash.digest("hex");
}

export function md5File(path) {
  return new Promise((resolve, reject) => {
    const output = crypto.createHash("md5");
    const input = fs.createReadStream(path);

    input.on("error", (err) => {
      reject(err);
    });

    output.once("readable", () => {
      resolve(output.read().toString("hex"));
    });

    input.pipe(output);
  });
}

/**
 * Read Dir
 * @param folder
 * @returns
 */
export function readDir(folder) {
  return fs.readdirSync(folder).map((file) => {
    return path.join(folder, file);
  });
}
