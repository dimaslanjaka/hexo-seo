process.stdin.resume(); //so the program will not close instantly

function exitHandler(options?, exitCode = 0) {
  if (typeof options == "function") options();
  if (typeof options == "object" && options.cleanup)
    console.log("process exiting");
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (typeof options == "object" && options.exit) process.exit();
}

function bindProcessExit(fn: () => void): void {
  //do something when app is closing
  process.on("exit", exitHandler.bind(fn, { cleanup: true }));

  //catches ctrl+c event
  process.on("SIGINT", exitHandler.bind(fn, { exit: true }));

  // catches "kill pid" (for example: nodemon restart)
  process.on("SIGUSR1", exitHandler.bind(fn, { exit: true }));
  process.on("SIGUSR2", exitHandler.bind(fn, { exit: true }));

  //catches uncaught exceptions
  process.on("uncaughtException", exitHandler.bind(fn, { exit: true }));
}

export default bindProcessExit;
