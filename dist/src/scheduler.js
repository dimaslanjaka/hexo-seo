"use strict";
/** SCHEDULER JOB **/
/*** Postpone executing functions ***/
Object.defineProperty(exports, "__esModule", { value: true });
var functions = [];
var scheduler = /** @class */ (function () {
    function scheduler() {
    }
    /**
     * Add function with key to list
     * @param key
     * @param value
     */
    scheduler.add = function (key, value) {
        functions[key] = value;
    };
    /**
     * Execute functon in key and delete
     * @param key
     */
    scheduler.execute = function (key, deleteAfter) {
        if (deleteAfter === void 0) { deleteAfter = true; }
        if (typeof functions[key] == "function") {
            functions[key]();
            if (deleteAfter)
                delete functions[key];
        }
        else {
            console.error("function with key: " + key + " is not function");
        }
    };
    /**
     * Execute all function lists
     */
    scheduler.executeAll = function () {
        Object.keys(functions).forEach(function (key) {
            functions[key]();
        });
        this.clearArray(functions);
    };
    /**
     * Clear Array
     * @param array
     */
    scheduler.clearArray = function (array) {
        while (array.length) {
            array.pop();
        }
    };
    return scheduler;
}());
exports.default = scheduler;
