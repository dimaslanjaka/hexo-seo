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
     * Add function to postpone, the functions will be executed every 5 items added
     */
    scheduler.postpone = function (key, value) {
        functions["postpone-" + key] = value;
        scheduler.postponeCounter += 1;
        if (scheduler.postponeCounter == 5) {
            scheduler.executeAll();
            scheduler.postponeCounter = 0;
        }
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
            console.log("executing", key);
            functions[key]();
        });
        scheduler.clearArray(functions);
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
    scheduler.postponeCounter = 0;
    return scheduler;
}());
exports.default = scheduler;
