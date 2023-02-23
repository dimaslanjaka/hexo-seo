import log from '../log';

//const fns1: Array<(data?: string) => void> = [];
const fns: { [key: string]: (data?: string) => void }[] = [];

/**
 * Handler function on process exit
 * @param options
 * @param exitCode
 */
function exitHandler(options, exitCode) {
  Object.keys(fns).forEach((key) => {
    log.log(`executing function key: ${key}`);
    fns[key]();
  });
  if (options.cleanup) log.log(`clean exit(${exitCode})`);
  if (options.exit) process.exit();
}

let triggered;
/**
 * Bind functions to exit handler
 * @param key
 * @param fn
 */
function bindProcessExit(key: string, fn: () => void): void {
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

export default bindProcessExit;
