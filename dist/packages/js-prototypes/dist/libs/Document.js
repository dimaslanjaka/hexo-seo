if (typeof document != "undefined") {
    Document.prototype.listen = function (eventType, listener, options) {
        if (options === void 0) { options = {}; }
        if (this.addEventListener) {
            this.addEventListener(eventType, listener, options);
        }
        else if (this.attachEvent) {
            this.attachEvent("on" + eventType, listener, options);
        }
    };
}
