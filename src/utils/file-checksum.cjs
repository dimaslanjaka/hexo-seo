const crypto = require('crypto');
const fs = require('fs');
const Promise = require('bluebird');
const { memoize } = require('underscore');
const path = require('path');
const glob = require('glob');

const BUFFER_SIZE = 8192;

function md5FileSync(path) {
  const fd = fs.openSync(path, 'r');
  const hash = crypto.createHash('md5');
  const buffer = Buffer.alloc(BUFFER_SIZE);

  try {
    let bytesRead;

    do {
      bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE);
      hash.update(buffer.slice(0, bytesRead));
    } while (bytesRead === BUFFER_SIZE);
  } finally {
    fs.closeSync(fd);
  }

  return hash.digest('hex');
}

function md5File(path) {
  return new Promise((resolve, reject) => {
    const output = crypto.createHash('md5');
    const input = fs.createReadStream(path);

    input.on('error', (err) => {
      reject(err);
    });

    output.once('readable', () => {
      resolve(output.read().toString('hex'));
    });

    input.pipe(output);
  });
}

/**
 * MD5
 */
const md5 = memoize(
  /**
   * MD5
   * @param {string} data
   * @returns
   */
  (data) => {
    return crypto.createHash('md5').update(data).digest('hex');
  }
);

module.exports = md5File;
module.exports.sync = md5FileSync;
module.exports.md5 = md5;

function fileChecksum(filePath) {
  const hash = crypto.createHash('sha256');
  hash.update(fs.readFileSync(filePath));
  return hash.digest('hex');
}
module.exports.fileChecksum = fileChecksum;

function checksumFolder(dir) {
  const files = [];
  function walk(current) {
    for (const file of fs.readdirSync(current)) {
      const fullPath = path.join(current, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }
  walk(dir);
  return files;
}

module.exports.checksumFolder = checksumFolder;

function checksum(...patterns) {
  const allFiles = new Set();

  for (const pattern of patterns) {
    const matches = glob.sync(pattern, { nodir: false });

    for (const match of matches) {
      const stat = fs.statSync(match);
      if (stat.isFile()) {
        allFiles.add(path.resolve(match));
      } else if (stat.isDirectory()) {
        const folderFiles = checksumFolder(match);
        for (const f of folderFiles) {
          allFiles.add(path.resolve(f));
        }
      }
    }
  }

  const sortedFiles = [...allFiles].sort();

  const hash = crypto.createHash('sha256');
  for (const file of sortedFiles) {
    const relPath = path.relative(process.cwd(), file);
    hash.update(relPath); // include relative path for deterministic hash
    hash.update(fs.readFileSync(file));
  }

  return hash.digest('hex');
}
module.exports.checksum = checksum;
