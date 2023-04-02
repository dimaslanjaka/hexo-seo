"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = __importDefault(require("../log"));
//const fns1: Array<(data?: string) => void> = [];
var fns = [];
/**
 * Handler function on process exit
 * @param options
 * @param exitCode
 */
function exitHandler(options, exitCode) {
    Object.keys(fns).forEach(function (key) {
        log_1.default.log("executing function key: ".concat(key));
        fns[key]();
    });
    if (options.cleanup)
        log_1.default.log("clean exit(".concat(exitCode, ")"));
    if (options.exit)
        process.exit();
}
var triggered;
/**
 * Bind functions to exit handler
 * @param key
 * @param fn
 */
function bindProcessExit(key, fn) {
    fns[key] = fn;
    // trigger once
    if (!triggered) {
        triggered = true;
        triggerProcess();
    }
}
// trigger process Bindings
function triggerProcess() {
    //do something when app is closing
    process.on('exit', exitHandler.bind(null, { cleanup: true }));
    //catches ctrl+c event
    process.on('SIGINT', exitHandler.bind(null, { exit: true }));
    // catches "kill pid" (for example: nodemon restart)
    process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
    process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));
    //catches uncaught exceptions
    process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
}
exports.default = bindProcessExit;
