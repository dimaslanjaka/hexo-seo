import Promise from 'bluebird';
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
    const chunks: Record<string, any> = [];
    stream.on('data', (chunk) => {
      chunks.push(chunk.toString());
    });
    stream.on('end', () => {
      resolve(chunks.join(''));
    });
  });
}

export function streamToArray(
  self: Stream,
  done?: {
    (arg0: any, arg1: string[]): void;
    (error: any): void | PromiseLike<void>;
    (arg0: any, arg1: string[]): any;
  }
) {
  if (!self) {
    // no arguments, meaning stream = this
    self = this;
  } else if (typeof self === 'function') {
    // stream = this, callback passed
    done = self;
    self = this;
  }

  let deferred: Promise<string[]>;
  if (!isReadableStream(self)) deferred = Promise.resolve([]);
  else
    deferred = new Promise(function (resolve, reject) {
      // stream is already ended
      if (!isReadableStream(self)) return resolve([]);

      let arr = [];

      self.on('data', onData);
      self.on('end', onEnd);
      self.on('error', onEnd);
      self.on('close', onClose);

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
