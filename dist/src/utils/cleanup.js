"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_1 = __importDefault(require("../log"));
//const fns1: Array<(data?: string) => void> = [];
const fns = [];
/**
 * Handler function on process exit
 * @param options
 * @param exitCode
 */
function exitHandler(options, exitCode) {
    Object.keys(fns).forEach((key) => {
        log_1.default.log(`executing function key: ${key}`);
        fns[key]();
    });
    if (options.cleanup)
        log_1.default.log(`clean exit(${exitCode})`);
    if (options.exit)
        process.exit();
}
let triggered;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW51cC5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsic3JjL3V0aWxzL2NsZWFudXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxpREFBeUI7QUFFekIsa0RBQWtEO0FBQ2xELE1BQU0sR0FBRyxHQUFpRCxFQUFFLENBQUM7QUFFN0Q7Ozs7R0FJRztBQUNILFNBQVMsV0FBVyxDQUFDLE9BQU8sRUFBRSxRQUFRO0lBQ3BDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7UUFDL0IsYUFBRyxDQUFDLEdBQUcsQ0FBQywyQkFBMkIsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUMxQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQztJQUNiLENBQUMsQ0FBQyxDQUFDO0lBQ0gsSUFBSSxPQUFPLENBQUMsT0FBTztRQUFFLGFBQUcsQ0FBQyxHQUFHLENBQUMsY0FBYyxRQUFRLEdBQUcsQ0FBQyxDQUFDO0lBQ3hELElBQUksT0FBTyxDQUFDLElBQUk7UUFBRSxPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDbkMsQ0FBQztBQUVELElBQUksU0FBUyxDQUFDO0FBQ2Q7Ozs7R0FJRztBQUNILFNBQVMsZUFBZSxDQUFDLEdBQVcsRUFBRSxFQUFjO0lBQ2xELEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLENBQUM7SUFDZCxlQUFlO0lBQ2YsSUFBSSxDQUFDLFNBQVMsRUFBRTtRQUNkLFNBQVMsR0FBRyxJQUFJLENBQUM7UUFDakIsY0FBYyxFQUFFLENBQUM7S0FDbEI7QUFDSCxDQUFDO0FBRUQsMkJBQTJCO0FBQzNCLFNBQVMsY0FBYztJQUNyQixrQ0FBa0M7SUFDbEMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxNQUFNLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTlELHNCQUFzQjtJQUN0QixPQUFPLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFN0Qsb0RBQW9EO0lBQ3BELE9BQU8sQ0FBQyxFQUFFLENBQUMsU0FBUyxFQUFFLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM5RCxPQUFPLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFFOUQsNkJBQTZCO0lBQzdCLE9BQU8sQ0FBQyxFQUFFLENBQUMsbUJBQW1CLEVBQUUsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQzFFLENBQUM7QUFFRCxrQkFBZSxlQUFlLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbG9nIGZyb20gXCIuLi9sb2dcIjtcblxuLy9jb25zdCBmbnMxOiBBcnJheTwoZGF0YT86IHN0cmluZykgPT4gdm9pZD4gPSBbXTtcbmNvbnN0IGZuczogeyBba2V5OiBzdHJpbmddOiAoZGF0YT86IHN0cmluZykgPT4gdm9pZCB9W10gPSBbXTtcblxuLyoqXG4gKiBIYW5kbGVyIGZ1bmN0aW9uIG9uIHByb2Nlc3MgZXhpdFxuICogQHBhcmFtIG9wdGlvbnNcbiAqIEBwYXJhbSBleGl0Q29kZVxuICovXG5mdW5jdGlvbiBleGl0SGFuZGxlcihvcHRpb25zLCBleGl0Q29kZSkge1xuICBPYmplY3Qua2V5cyhmbnMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgIGxvZy5sb2coYGV4ZWN1dGluZyBmdW5jdGlvbiBrZXk6ICR7a2V5fWApO1xuICAgIGZuc1trZXldKCk7XG4gIH0pO1xuICBpZiAob3B0aW9ucy5jbGVhbnVwKSBsb2cubG9nKGBjbGVhbiBleGl0KCR7ZXhpdENvZGV9KWApO1xuICBpZiAob3B0aW9ucy5leGl0KSBwcm9jZXNzLmV4aXQoKTtcbn1cblxubGV0IHRyaWdnZXJlZDtcbi8qKlxuICogQmluZCBmdW5jdGlvbnMgdG8gZXhpdCBoYW5kbGVyXG4gKiBAcGFyYW0ga2V5XG4gKiBAcGFyYW0gZm5cbiAqL1xuZnVuY3Rpb24gYmluZFByb2Nlc3NFeGl0KGtleTogc3RyaW5nLCBmbjogKCkgPT4gdm9pZCk6IHZvaWQge1xuICBmbnNba2V5XSA9IGZuO1xuICAvLyB0cmlnZ2VyIG9uY2VcbiAgaWYgKCF0cmlnZ2VyZWQpIHtcbiAgICB0cmlnZ2VyZWQgPSB0cnVlO1xuICAgIHRyaWdnZXJQcm9jZXNzKCk7XG4gIH1cbn1cblxuLy8gdHJpZ2dlciBwcm9jZXNzIEJpbmRpbmdzXG5mdW5jdGlvbiB0cmlnZ2VyUHJvY2VzcygpIHtcbiAgLy9kbyBzb21ldGhpbmcgd2hlbiBhcHAgaXMgY2xvc2luZ1xuICBwcm9jZXNzLm9uKFwiZXhpdFwiLCBleGl0SGFuZGxlci5iaW5kKG51bGwsIHsgY2xlYW51cDogdHJ1ZSB9KSk7XG5cbiAgLy9jYXRjaGVzIGN0cmwrYyBldmVudFxuICBwcm9jZXNzLm9uKFwiU0lHSU5UXCIsIGV4aXRIYW5kbGVyLmJpbmQobnVsbCwgeyBleGl0OiB0cnVlIH0pKTtcblxuICAvLyBjYXRjaGVzIFwia2lsbCBwaWRcIiAoZm9yIGV4YW1wbGU6IG5vZGVtb24gcmVzdGFydClcbiAgcHJvY2Vzcy5vbihcIlNJR1VTUjFcIiwgZXhpdEhhbmRsZXIuYmluZChudWxsLCB7IGV4aXQ6IHRydWUgfSkpO1xuICBwcm9jZXNzLm9uKFwiU0lHVVNSMlwiLCBleGl0SGFuZGxlci5iaW5kKG51bGwsIHsgZXhpdDogdHJ1ZSB9KSk7XG5cbiAgLy9jYXRjaGVzIHVuY2F1Z2h0IGV4Y2VwdGlvbnNcbiAgcHJvY2Vzcy5vbihcInVuY2F1Z2h0RXhjZXB0aW9uXCIsIGV4aXRIYW5kbGVyLmJpbmQobnVsbCwgeyBleGl0OiB0cnVlIH0pKTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgYmluZFByb2Nlc3NFeGl0O1xuIl19