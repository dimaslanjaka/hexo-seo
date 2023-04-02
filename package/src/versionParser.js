/* eslint-disable radix */
/* eslint-disable no-throw-literal */

/**
 * Version Parser
 */
class versionParser {
  result = {
    major: 0,
    minor: 0,
    build: 0
  };

  /**
   * Version Parser Constructor
   * @param {string} str
   */
  constructor(str) {
    if (typeof str === 'string') this.parseVersion(str);
  }

  /**
   * Parse Version String
   * @param {string} str
   * @returns
   */
  parseVersion(str) {
    if (typeof str !== 'string') {
      //return false;
      throw `argument required string, found ${typeof str}`;
    }
    const arr = str.split('.');

    // parse int or default to 0
    this.result.major = parseInt(arr[0]) || 0;
    this.result.minor = parseInt(arr[1]) || 0;
    this.result.build = parseInt(arr[2]) || 0;
    return this.result;
  }

  toString() {
    return `${this.result.major}.${this.result.minor}.${this.result.build}`;
  }
}

module.exports = versionParser;
