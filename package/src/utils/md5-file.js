const crypto = require('crypto');
const fs = require('fs');
const Promise = require('bluebird');
const { memoize } = require('underscore');

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
