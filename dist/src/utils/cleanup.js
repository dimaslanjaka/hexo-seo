"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.stdin.resume(); //so the program will not close instantly
var fns1 = [];
var fns = [];
function exitHandler(options, exitCode) {
    fns.concat(fns1).map(function (fn) {
        fn();
    });
    if (options.cleanup)
        console.log("clean");
    if (exitCode || exitCode === 0)
        console.log(exitCode);
    if (options.exit)
        process.exit();
}
//do something when app is closing
process.on("exit", exitHandler.bind(null, { cleanup: true }));
//catches ctrl+c event
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
// catches "kill pid" (for example: nodemon restart)
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
//catches uncaught exceptions
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
function bindProcessExit(key, fn) {
    fns[key] = fn;
}
exports.default = bindProcessExit;
