"use strict";
/** SCHEDULER JOB **/
/*** Postpone executing functions ***/
Object.defineProperty(exports, "__esModule", { value: true });
var functions = [];
var scheduler = /** @class */ (function () {
    function scheduler() {
    }
    scheduler.add = function (key, value) {
        functions[key] = value;
    };
    scheduler.execute = function (key) {
        if (typeof functions[key] == "function") {
            functions[key]();
        }
        else {
            console.error("function with key: " + key + " is not function");
        }
    };
    scheduler.executeAll = function () {
        Object.keys(functions).forEach(function (key) {
            functions[key]();
        });
    };
    return scheduler;
}());
exports.default = scheduler;
