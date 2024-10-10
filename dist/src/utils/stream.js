"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStream = isStream;
exports.isWritableStream = isWritableStream;
exports.isReadableStream = isReadableStream;
exports.isDuplexStream = isDuplexStream;
exports.isTransformStream = isTransformStream;
exports.streamToString = streamToString;
exports.streamToArray = streamToArray;
const bluebird_1 = __importDefault(require("bluebird"));
function isStream(stream) {
    return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
}
function isWritableStream(stream) {
    return (isStream(stream) &&
        stream.writable !== false &&
        typeof stream._write === 'function' &&
        typeof stream._writableState === 'object');
}
function isReadableStream(stream) {
    return (isStream(stream) &&
        stream.readable !== false &&
        typeof stream._read === 'function' &&
        typeof stream._readableState === 'object');
}
function isDuplexStream(stream) {
    return isWritableStream(stream) && isReadableStream(stream);
}
function isTransformStream(stream) {
    return isDuplexStream(stream) && typeof stream._transform === 'function';
}
function streamToString(stream) {
    return new bluebird_1.default((resolve, _reject) => {
        const chunks = [];
        stream.on('data', (chunk) => {
            chunks.push(chunk.toString());
        });
        stream.on('end', () => {
            resolve(chunks.join(''));
        });
    });
}
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
    let deferred;
    if (!isReadableStream(self))
        deferred = bluebird_1.default.resolve([]);
    else
        deferred = new bluebird_1.default(function (resolve, reject) {
            // stream is already ended
            if (!isReadableStream(self))
                return resolve([]);
            let arr = [];
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
