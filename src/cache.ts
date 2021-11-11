import md5File from "md5-file";

export default class {
  caches = {};

  md5Cache = {};

  set(key: string, value: any) {
    return this.setCache(key, value);
  }

  setCache(key: string, value: any) {
    this.caches[key] = value;
  }

  get(key: string, fallback?: any) {
    return this.getCache(key, fallback);
  }

  getCache(key: string, fallback?: any) {
    return this.caches[key] || fallback;
  }

  async isFileChanged(filePath: string) {
    try {
      const hash1 = await md5File(filePath);
      const hash = this.md5Cache[filePath];
      this.md5Cache[filePath] = hash1;
      if (!hash) {
        return true;
      }
      if (hash === hash1) {
        return false;
      }
      return true;
    } catch (err) {
      return true;
    }
  }
}
