export = CacheStream;
declare class CacheStream extends Transform {
  constructor();
  _cache: any[];
  _transform(chunk: any, enc: any, callback: any): void;
  getCache(): Buffer;
}
import { Transform } from 'stream';
//# sourceMappingURL=cache_stream.d.ts.map
