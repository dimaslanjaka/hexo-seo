if (typeof document != "undefined") {
    Document.prototype.listen = function <K extends keyof DocumentEventMap>(
        eventType: K,
        listener: (this: Document, ev: DocumentEventMap[K]) => any,
        options = {}
    ) {
        if ((<Document>this).addEventListener) {
            (<Document>this).addEventListener(eventType, listener, options);
        } else if ((<Document>this).attachEvent) {
            (<Document>this).attachEvent("on" + eventType, listener, options);
        }
    };
}
