var crypto = require('crypto');
var fs = require('fs');
var Promise = require('bluebird');
var memoize = require('underscore').memoize;
var BUFFER_SIZE = 8192;
function md5FileSync(path) {
    var fd = fs.openSync(path, 'r');
    var hash = crypto.createHash('md5');
    var buffer = Buffer.alloc(BUFFER_SIZE);
    try {
        var bytesRead = void 0;
        do {
            bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE);
            hash.update(buffer.slice(0, bytesRead));
        } while (bytesRead === BUFFER_SIZE);
    }
    finally {
        fs.closeSync(fd);
    }
    return hash.digest('hex');
}
function md5File(path) {
    return new Promise(function (resolve, reject) {
        var output = crypto.createHash('md5');
        var input = fs.createReadStream(path);
        input.on('error', function (err) {
            reject(err);
        });
        output.once('readable', function () {
            resolve(output.read().toString('hex'));
        });
        input.pipe(output);
    });
}
/**
 * MD5
 */
var md5 = memoize(
/**
 * MD5
 * @param {string} data
 * @returns
 */
function (data) {
    return crypto.createHash('md5').update(data).digest('hex');
});
module.exports = md5File;
module.exports.sync = md5FileSync;
module.exports.md5 = md5;
