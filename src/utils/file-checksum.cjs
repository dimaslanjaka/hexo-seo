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

/**
 * Calculate a checksum for files/folders matching given patterns.
 * @param {Object} config
 * @param {string[]} config.patterns - Glob patterns to include
 * @param {string[]} [config.ignore] - Glob patterns to ignore (default: defaultIgnorePatterns)
 * @returns {string} sha256 checksum
 */
function checksum(config) {
  if (!config || !Array.isArray(config.patterns)) {
    throw new Error('checksum: config.patterns (array) is required');
  }
  const defaultIgnorePatterns = [
    '**/node_modules/**',
    '**/.git/**',
    '**/.cache/**',
    '**/coverage/**',
    '**/dist/**',
    '**/build/**',
    '**/tmp/**',
    '**/temp/**',
    '**/logs/**',
    '**/*.log'
  ];
  const ignore = Array.isArray(config.ignore) ? config.ignore : defaultIgnorePatterns;
  const allFiles = new Set();

  for (const pattern of config.patterns) {
    const matches = glob.sync(pattern, { nodir: false, ignore });

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
