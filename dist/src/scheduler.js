"use strict";
/** SCHEDULER JOB **/
/*** Postpone executing functions ***/
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var log_1 = __importDefault(require("./log"));
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
            log_1["default"].error("function with key: ".concat(key, " is not function"));
        }
    };
    /**
     * Execute all function lists
     */
    scheduler.executeAll = function () {
        Object.keys(functions).forEach(function (key) {
            log_1["default"].log("executing", key);
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
exports["default"] = scheduler;
