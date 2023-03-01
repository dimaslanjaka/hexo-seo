"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.streamToArray = exports.streamToString = exports.isTransformStream = exports.isDuplexStream = exports.isReadableStream = exports.isWritableStream = exports.isStream = void 0;
var bluebird_1 = __importDefault(require("bluebird"));
function isStream(stream) {
    return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
}
exports.isStream = isStream;
function isWritableStream(stream) {
    return (isStream(stream) &&
        stream.writable !== false &&
        typeof stream._write === 'function' &&
        typeof stream._writableState === 'object');
}
exports.isWritableStream = isWritableStream;
function isReadableStream(stream) {
    return (isStream(stream) &&
        stream.readable !== false &&
        typeof stream._read === 'function' &&
        typeof stream._readableState === 'object');
}
exports.isReadableStream = isReadableStream;
function isDuplexStream(stream) {
    return isWritableStream(stream) && isReadableStream(stream);
}
exports.isDuplexStream = isDuplexStream;
function isTransformStream(stream) {
    return isDuplexStream(stream) && typeof stream._transform === 'function';
}
exports.isTransformStream = isTransformStream;
function streamToString(stream) {
    return new bluebird_1["default"](function (resolve, _reject) {
        var chunks = [];
        stream.on('data', function (chunk) {
            chunks.push(chunk.toString());
        });
        stream.on('end', function () {
            resolve(chunks.join(''));
        });
    });
}
exports.streamToString = streamToString;
function streamToArray(self, done) {
    if (!self) {
        // no arguments, meaning stream = this
        self = this;
    }
    else if (typeof self === 'function') {
        // stream = this, callback passed
        done = self;
        self = this;
    }
    var deferred;
    if (!isReadableStream(self))
        deferred = bluebird_1["default"].resolve([]);
    else
        deferred = new bluebird_1["default"](function (resolve, reject) {
            // stream is already ended
            if (!isReadableStream(self))
                return resolve([]);
            var arr = [];
            self.on('data', onData);
            self.on('end', onEnd);
            self.on('error', onEnd);
            self.on('close', onClose);
            function onData(doc) {
                arr.push(doc);
            }
            function onEnd(err) {
                if (err)
                    reject(err);
                else
                    resolve(arr);
                cleanup();
            }
            function onClose() {
                resolve(arr);
                cleanup();
            }
            function cleanup() {
                arr = null;
                self.removeListener('data', onData);
                self.removeListener('end', onEnd);
                self.removeListener('error', onEnd);
                self.removeListener('close', onClose);
            }
        });
    if (typeof done === 'function') {
        deferred.then(function (arr) {
            process.nextTick(function () {
                done(null, arr);
            });
        }, done);
    }
    return deferred;
}
exports.streamToArray = streamToArray;
