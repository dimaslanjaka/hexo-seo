"use strict";
//process.stdin.resume(); //so the program will not close instantly
Object.defineProperty(exports, "__esModule", { value: true });
//const fns1: Array<(data?: string) => void> = [];
var fns = [];
/**
 * Handler function on process exit
 * @param options
 * @param exitCode
 */
function exitHandler(options, exitCode) {
    Object.keys(fns).forEach(function (key) {
        console.log("executing function key: " + key);
        fns[key]();
    });
    if (options.cleanup)
        console.log("clean");
    if (exitCode || exitCode === 0)
        console.log(exitCode);
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
    process.on("exit", exitHandler.bind(null, { cleanup: true }));
    //catches ctrl+c event
    process.on("SIGINT", exitHandler.bind(null, { exit: true }));
    // catches "kill pid" (for example: nodemon restart)
    process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
    process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
    //catches uncaught exceptions
    process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
}
exports.default = bindProcessExit;
