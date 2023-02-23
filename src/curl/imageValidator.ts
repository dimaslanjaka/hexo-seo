import { curly } from 'node-libcurl';

class imageValidator {
  /**
   * validate image url
   * @param url
   * @returns
   */
  static validate(url: string) {
    return this.isValid(url);
  }
  static db = {};
  /**
   * validate image url
   * @param url
   * @returns
   */
  static isValid(url: string) {
    if (/^https?/gs.test(url)) {
      try {
        return curly.get(url.toString()).then((res) => {
          const statusCode = res.statusCode;
          const validStatusCode = statusCode < 400 || statusCode >= 500 || statusCode === 200;
          if (validStatusCode) {
            if (typeof res.headers[0] == 'object') {
              const headers = res.headers[0];
              if (typeof headers['Content-Type'] == 'string') {
                if (headers['Content-Type'].includes('images/')) return true;
              }
            }
          }
        });
      } catch (e) {
        return false;
      }
    }
    return false;
  }
}

export = imageValidator;
