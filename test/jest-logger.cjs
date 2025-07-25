/**
 * JestLogger
 * Simple logger for Jest tests that writes logs to file and memory.
 *
 * @module JestLogger
 */
const fs = require('fs-extra');
const path = require('upath');
const util = require('util');
const moment = require('moment-timezone');

/**
 * JestLogger class for structured logging in Jest tests.
 *
 * @class
 * @param {string} [filename='jest-logger'] - Log filename (without extension).
 * @param {boolean} [reset=true] - Whether to reset the log file on creation.
 */
class JestLogger {
  constructor(filename = 'jest-logger', reset = true) {
    /**
     * In-memory log entries
     * @type {Array<{type: string, message: string, timestamp: string}>}
     */
    this.logs = [];
    /**
     * Absolute path to log file
     * @type {string}
     */
    this.logFilePath = path.join(__dirname, '../tmp/output-shell', filename + '.log');
    // Ensure directory exists
    fs.ensureDirSync(path.dirname(this.logFilePath));
    if (reset) {
      this.resetLog();
    }
  }

  /**
   * Log a message with type 'log'.
   * @param {...any} messages - Messages to log.
   */
  log(...messages) {
    this._writeLog('log', ...messages);
  }

  /**
   * Log a message with type 'info'.
   * @param {...any} messages - Messages to log.
   */
  info(...messages) {
    this._writeLog('info', ...messages);
  }

  /**
   * Log a message with type 'warn'.
   * @param {...any} messages - Messages to log.
   */
  warn(...messages) {
    this._writeLog('warn', ...messages);
  }

  /**
   * Log a message with type 'error'.
   * @param {...any} messages - Messages to log.
   */
  error(...messages) {
    this._writeLog('error', ...messages);
  }

  /**
   * Get all in-memory log entries.
   * @returns {Array<{type: string, message: string, timestamp: string}>}
   */
  getLogs() {
    return this.logs;
  }

  /**
   * Reset the log file and in-memory logs.
   */
  resetLog() {
    this.logs = [];
    const ts = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    fs.writeFileSync(this.logFilePath, 'Reset at ' + ts + '\n\n');
  }

  /**
   * Internal method to write a log entry.
   * @private
   * @param {string} type - Log type.
   * @param {...any} messages - Messages to log.
   */
  _writeLog(type, ...messages) {
    const timestamp = moment().format('YYYY-MM-DDTHH:mm:ssZ');
    const message = messages
      .map((m) => (typeof m === 'object' ? util.inspect(m, { depth: 4, colors: false, compact: true }) : String(m)))
      .join(' ');
    const entry = { type, message, timestamp };
    this.logs.push(entry);
    const logLine = `[${type}][${timestamp}]\n${message}\n\n`;
    fs.appendFileSync(this.logFilePath, logLine);
  }
}

module.exports = JestLogger;
