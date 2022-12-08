declare module 'rimraf' {
  import fs from 'fs';
  declare const assert: any;
  declare const path: any;
  declare let glob: undefined;
  declare const defaultGlobOpts: {
    nosort: boolean;
    silent: boolean;
  };
  declare let timeout: number;
  declare const isWindows: boolean;
  declare const defaults: (options: any) => void;
  declare const rimraf: {
    (directory: string, fslib: typeof fs | Record<string, any>, callback: (...args: any) => any): any;
    /**
     * Synchronous rimraf
     */
    sync: (directory: string, fslib: typeof fs | Record<string, any>) => void;
  };
  declare const rimraf_: (
    directory: string,
    fslib: typeof fs | Record<string, any>,
    callback: (...args: any) => any
  ) => void;
  declare const fixWinEPERM: (
    directory: string,
    fslib: typeof fs | Record<string, any>,
    er: any,
    callback: (...args: any) => any
  ) => void;
  declare const fixWinEPERMSync: (directory: string, fslib: typeof fs | Record<string, any>, er: any) => void;
  declare const rmdir: (
    directory: string,
    fslib: typeof fs | Record<string, any>,
    originalEr: any,
    callback: (...args: any) => any
  ) => void;
  declare const rmkids: (
    directory: string,
    fslib: typeof fs | Record<string, any>,
    callback: (...args: any) => any
  ) => void;
  declare const rimrafSync: (directory: string, fslib: typeof fs | Record<string, any>) => void;
  declare const rmdirSync: (directory: string, fslib: typeof fs | Record<string, any>, originalEr: any) => void;
  declare const rmkidsSync: (directory: string, fslib: typeof fs | Record<string, any>) => any;
  export default rimraf;
}
