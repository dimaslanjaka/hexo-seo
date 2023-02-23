import Promise from 'bluebird';
import { Objek } from '../utils';
import { Stream } from 'stream';

export function isStream(stream) {
  return stream !== null && typeof stream === 'object' && typeof stream.pipe === 'function';
}

export function isWritableStream(stream) {
  return (
    isStream(stream) &&
    stream.writable !== false &&
    typeof stream._write === 'function' &&
    typeof stream._writableState === 'object'
  );
}

export function isReadableStream(stream) {
  return (
    isStream(stream) &&
    stream.readable !== false &&
    typeof stream._read === 'function' &&
    typeof stream._readableState === 'object'
  );
}

export function isDuplexStream(stream) {
  return isWritableStream(stream) && isReadableStream(stream);
}

export function isTransformStream(stream) {
  return isDuplexStream(stream) && typeof stream._transform === 'function';
}

export function streamToString(stream: Stream) {
  return new Promise((resolve, _reject) => {
    const chunks: Objek = [];
    stream.on('data', (chunk) => {
      chunks.push(chunk.toString());
    });
    stream.on('end', () => {
      resolve(chunks.join(''));
    });
  });
}

export function streamToArray(
  stream: Stream,
  done?: {
    (arg0: any, arg1: string[]): void;
    (error: any): void | PromiseLike<void>;
    (arg0: any, arg1: string[]): any;
  }
) {
  if (!stream) {
    // no arguments, meaning stream = this
    stream = this;
  } else if (typeof stream === 'function') {
    // stream = this, callback passed
    done = stream;
    stream = this;
  }

  let deferred: Promise<string[]>;
  if (!isReadableStream(stream)) deferred = Promise.resolve([]);
  else
    deferred = new Promise(function (resolve, reject) {
      // stream is already ended
      if (!isReadableStream(stream)) return resolve([]);

      let arr = [];

      stream.on('data', onData);
      stream.on('end', onEnd);
      stream.on('error', onEnd);
      stream.on('close', onClose);

      function onData(doc) {
        arr.push(doc);
      }

      function onEnd(err) {
        if (err) reject(err);
        else resolve(arr);
        cleanup();
      }

      function onClose() {
        resolve(arr);
        cleanup();
      }

      function cleanup() {
        arr = null;
        stream.removeListener('data', onData);
        stream.removeListener('end', onEnd);
        stream.removeListener('error', onEnd);
        stream.removeListener('close', onClose);
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
