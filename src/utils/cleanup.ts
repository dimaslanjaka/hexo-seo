process.stdin.resume(); //so the program will not close instantly

let fns1: Array<(data?: string) => void>;
let fns: ((data?: string) => void)[];
function exitHandler(options, exitCode) {
  fns.concat(fns1).map((fn) => {
    fn();
  });
  if (options.cleanup) console.log("clean");
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
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

function bindProcessExit(key: string, fn: () => void): void {
  fns[key] = fn;
}

export default bindProcessExit;
