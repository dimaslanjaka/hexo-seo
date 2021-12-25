"use strict";
//TODO:
// Remove Dict and use native Map as much as possible here
//Use ObjectChangeDescriptor to avoid creating useless arrays and benefit from similar gains made in property-changes
var WeakMap = require("../weak-map"), Map = require("../_map"), ChangeDescriptor = require("./change-descriptor"), ObjectChangeDescriptor = ChangeDescriptor.ObjectChangeDescriptor, ChangeListenersRecord = ChangeDescriptor.ChangeListenersRecord, ListenerGhost = ChangeDescriptor.ListenerGhost;
var rangeChangeDescriptors = new WeakMap(); // {isActive, willChangeListeners, changeListeners}
//
function RangeChangeDescriptor(name) {
    this.name = name;
    this.isActive = false;
    this._willChangeListeners = null;
    this._changeListeners = null;
}
;
RangeChangeDescriptor.prototype = new ObjectChangeDescriptor();
RangeChangeDescriptor.prototype.constructor = RangeChangeDescriptor;
RangeChangeDescriptor.prototype.changeListenersRecordConstructor = RangeChangeListenersRecord;
RangeChangeDescriptor.prototype.willChangeListenersRecordConstructor = RangeWillChangeListenersRecord;
Object.defineProperty(RangeChangeDescriptor.prototype, "active", {
    get: function () {
        return this._active || (this._active = this._current ? this._current.slice() : []);
    }
});
var RangeChangeListenersSpecificHandlerMethodName = new Map();
function RangeChangeListenersRecord(name) {
    var specificHandlerMethodName = RangeChangeListenersSpecificHandlerMethodName.get(name);
    if (!specificHandlerMethodName) {
        specificHandlerMethodName = "handle";
        specificHandlerMethodName += name.slice(0, 1).toUpperCase();
        specificHandlerMethodName += name.slice(1);
        specificHandlerMethodName += "RangeChange";
        RangeChangeListenersSpecificHandlerMethodName.set(name, specificHandlerMethodName);
    }
    this.specificHandlerMethodName = specificHandlerMethodName;
    return this;
}
RangeChangeListenersRecord.prototype = new ChangeListenersRecord();
RangeChangeListenersRecord.prototype.constructor = RangeChangeListenersRecord;
var RangeWillChangeListenersSpecificHandlerMethodName = new Map();
function RangeWillChangeListenersRecord(name) {
    var specificHandlerMethodName = RangeWillChangeListenersSpecificHandlerMethodName.get(name);
    if (!specificHandlerMethodName) {
        specificHandlerMethodName = "handle";
        specificHandlerMethodName += name.slice(0, 1).toUpperCase();
        specificHandlerMethodName += name.slice(1);
        specificHandlerMethodName += "RangeWillChange";
        RangeWillChangeListenersSpecificHandlerMethodName.set(name, specificHandlerMethodName);
    }
    this.specificHandlerMethodName = specificHandlerMethodName;
    return this;
}
RangeWillChangeListenersRecord.prototype = new ChangeListenersRecord();
RangeWillChangeListenersRecord.prototype.constructor = RangeWillChangeListenersRecord;
module.exports = RangeChanges;
function RangeChanges() {
    throw new Error("Can't construct. RangeChanges is a mixin.");
}
RangeChanges.prototype.getAllRangeChangeDescriptors = function () {
    if (!rangeChangeDescriptors.has(this)) {
        rangeChangeDescriptors.set(this, new Map());
    }
    return rangeChangeDescriptors.get(this);
};
RangeChanges.prototype.getRangeChangeDescriptor = function (token) {
    var tokenChangeDescriptors = this.getAllRangeChangeDescriptors();
    token = token || "";
    if (!tokenChangeDescriptors.has(token)) {
        tokenChangeDescriptors.set(token, new RangeChangeDescriptor(token));
    }
    return tokenChangeDescriptors.get(token);
};
var ObjectsDispatchesRangeChanges = new WeakMap(), dispatchesRangeChangesGetter = function () {
    return ObjectsDispatchesRangeChanges.get(this);
}, dispatchesRangeChangesSetter = function (value) {
    return ObjectsDispatchesRangeChanges.set(this, value);
}, dispatchesChangesMethodName = "dispatchesRangeChanges", dispatchesChangesPropertyDescriptor = {
    get: dispatchesRangeChangesGetter,
    set: dispatchesRangeChangesSetter,
    configurable: true,
    enumerable: false
};
RangeChanges.prototype.addRangeChangeListener = function addRangeChangeListener(listener, token, beforeChange) {
    // a concession for objects like Array that are not inherently observable
    if (!this.isObservable && this.makeObservable) {
        this.makeObservable();
    }
    var descriptor = this.getRangeChangeDescriptor(token);
    var listeners;
    if (beforeChange) {
        listeners = descriptor.willChangeListeners;
    }
    else {
        listeners = descriptor.changeListeners;
    }
    // even if already registered
    if (!listeners._current) {
        listeners._current = listener;
    }
    else if (!Array.isArray(listeners._current)) {
        listeners._current = [listeners._current, listener];
    }
    else {
        listeners._current.push(listener);
    }
    if (Object.getOwnPropertyDescriptor((this.__proto__ || Object.getPrototypeOf(this)), dispatchesChangesMethodName) === void 0) {
        Object.defineProperty((this.__proto__ || Object.getPrototypeOf(this)), dispatchesChangesMethodName, dispatchesChangesPropertyDescriptor);
    }
    this.dispatchesRangeChanges = true;
    var self = this;
    return function cancelRangeChangeListener() {
        if (!self) {
            // TODO throw new Error("Range change listener " + JSON.stringify(token) + " has already been canceled");
            return;
        }
        self.removeRangeChangeListener(listener, token, beforeChange);
        self = null;
    };
};
RangeChanges.prototype.removeRangeChangeListener = function (listener, token, beforeChange) {
    var descriptor = this.getRangeChangeDescriptor(token);
    var listeners;
    if (beforeChange) {
        listeners = descriptor._willChangeListeners;
    }
    else {
        listeners = descriptor._changeListeners;
    }
    if (listeners._current) {
        if (listeners._current === listener) {
            listeners._current = null;
        }
        else {
            var index = listeners._current.lastIndexOf(listener);
            if (index === -1) {
                throw new Error("Can't remove range change listener: does not exist: token " + JSON.stringify(token));
            }
            else {
                if (descriptor.isActive) {
                    listeners.ghostCount = listeners.ghostCount + 1;
                    listeners._current[index] = ListenerGhost;
                }
                else {
                    listeners._current.spliceOne(index);
                }
            }
        }
    }
};
RangeChanges.prototype.dispatchRangeChange = function (plus, minus, index, beforeChange) {
    var descriptors = this.getAllRangeChangeDescriptors(), descriptor, mapIter = descriptors.values(), listeners, tokenName, i, countI, listener, currentListeners, Ghost;
    descriptors.dispatchBeforeChange = beforeChange;
    while (descriptor = mapIter.next().value) {
        if (descriptor.isActive) {
            return;
        }
        // before or after
        listeners = beforeChange ? descriptor._willChangeListeners : descriptor._changeListeners;
        if (listeners && listeners._current) {
            tokenName = listeners.specificHandlerMethodName;
            if (Array.isArray(listeners._current)) {
                if (listeners._current.length) {
                    // notably, defaults to "handleRangeChange" or "handleRangeWillChange"
                    // if token is "" (the default)
                    descriptor.isActive = true;
                    // dispatch each listener
                    try {
                        //removeGostListenersIfNeeded returns listeners.current or a new filtered one when conditions are met
                        currentListeners = listeners.removeCurrentGostListenersIfNeeded();
                        Ghost = ListenerGhost;
                        for (i = 0, countI = currentListeners.length; i < countI; i++) {
                            if ((listener = currentListeners[i]) !== Ghost) {
                                if (listener[tokenName]) {
                                    listener[tokenName](plus, minus, index, this, beforeChange);
                                }
                                else if (listener.call) {
                                    listener.call(this, plus, minus, index, this, beforeChange);
                                }
                                else {
                                    throw new Error("Handler " + listener + " has no method " + tokenName + " and is not callable");
                                }
                            }
                        }
                    }
                    finally {
                        descriptor.isActive = false;
                    }
                }
            }
            else {
                descriptor.isActive = true;
                // dispatch each listener
                try {
                    listener = listeners._current;
                    if (listener[tokenName]) {
                        listener[tokenName](plus, minus, index, this, beforeChange);
                    }
                    else if (listener.call) {
                        listener.call(this, plus, minus, index, this, beforeChange);
                    }
                    else {
                        throw new Error("Handler " + listener + " has no method " + tokenName + " and is not callable");
                    }
                }
                finally {
                    descriptor.isActive = false;
                }
            }
        }
    }
};
RangeChanges.prototype.addBeforeRangeChangeListener = function (listener, token) {
    return this.addRangeChangeListener(listener, token, true);
};
RangeChanges.prototype.removeBeforeRangeChangeListener = function (listener, token) {
    return this.removeRangeChangeListener(listener, token, true);
};
RangeChanges.prototype.dispatchBeforeRangeChange = function (plus, minus, index) {
    return this.dispatchRangeChange(plus, minus, index, true);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UtY2hhbmdlcy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvanMtcHJvdG90eXBlcy9wYWNrYWdlcy9jb2xsZWN0aW9ucy9saXN0ZW4vcmFuZ2UtY2hhbmdlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFFYixPQUFPO0FBQ1AsMERBQTBEO0FBQzFELHFIQUFxSDtBQUdySCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLEVBQ2hDLEdBQUcsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLEVBQ3hCLGdCQUFnQixHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsQ0FBQyxFQUNqRCxzQkFBc0IsR0FBRyxnQkFBZ0IsQ0FBQyxzQkFBc0IsRUFDaEUscUJBQXFCLEdBQUcsZ0JBQWdCLENBQUMscUJBQXFCLEVBQzlELGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxhQUFhLENBQUM7QUFFbkQsSUFBSSxzQkFBc0IsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDLENBQUMsbURBQW1EO0FBRy9GLEVBQUU7QUFDRixTQUFTLHFCQUFxQixDQUFDLElBQUk7SUFDL0IsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDdEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztJQUNqQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0FBQ2pDLENBQUM7QUFBQSxDQUFDO0FBRUYscUJBQXFCLENBQUMsU0FBUyxHQUFHLElBQUksc0JBQXNCLEVBQUUsQ0FBQztBQUMvRCxxQkFBcUIsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLHFCQUFxQixDQUFDO0FBRXBFLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxnQ0FBZ0MsR0FBRywwQkFBMEIsQ0FBQztBQUM5RixxQkFBcUIsQ0FBQyxTQUFTLENBQUMsb0NBQW9DLEdBQUcsOEJBQThC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Q25HO2lCQUNKO3dCQUFTO29CQUNOLFVBQVUsQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO2lCQUMvQjthQUVKO1NBQ0o7S0FFSjtBQUNMLENBQUMsQ0FBQztBQUVGLFlBQVksQ0FBQyxTQUFTLENBQUMsNEJBQTRCLEdBQUcsVUFBVSxRQUFRLEVBQUUsS0FBSztJQUMzRSxPQUFPLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzlELENBQUMsQ0FBQztBQUVGLFlBQVksQ0FBQyxTQUFTLENBQUMsK0JBQStCLEdBQUcsVUFBVSxRQUFRLEVBQUUsS0FBSztJQUM5RSxPQUFPLElBQUksQ0FBQyx5QkFBeUIsQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ2pFLENBQUMsQ0FBQztBQUVGLFlBQVksQ0FBQyxTQUFTLENBQUMseUJBQXlCLEdBQUcsVUFBVSxJQUFJLEVBQUUsS0FBSyxFQUFFLEtBQUs7SUFDM0UsT0FBTyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDOUQsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8vVE9ETzpcbi8vIFJlbW92ZSBEaWN0IGFuZCB1c2UgbmF0aXZlIE1hcCBhcyBtdWNoIGFzIHBvc3NpYmxlIGhlcmVcbi8vVXNlIE9iamVjdENoYW5nZURlc2NyaXB0b3IgdG8gYXZvaWQgY3JlYXRpbmcgdXNlbGVzcyBhcnJheXMgYW5kIGJlbmVmaXQgZnJvbSBzaW1pbGFyIGdhaW5zIG1hZGUgaW4gcHJvcGVydHktY2hhbmdlc1xuXG5cbnZhciBXZWFrTWFwID0gcmVxdWlyZShcIi4uL3dlYWstbWFwXCIpLFxuICAgIE1hcCA9IHJlcXVpcmUoXCIuLi9fbWFwXCIpLFxuICAgIENoYW5nZURlc2NyaXB0b3IgPSByZXF1aXJlKFwiLi9jaGFuZ2UtZGVzY3JpcHRvclwiKSxcbiAgICBPYmplY3RDaGFuZ2VEZXNjcmlwdG9yID0gQ2hhbmdlRGVzY3JpcHRvci5PYmplY3RDaGFuZ2VEZXNjcmlwdG9yLFxuICAgIENoYW5nZUxpc3RlbmVyc1JlY29yZCA9IENoYW5nZURlc2NyaXB0b3IuQ2hhbmdlTGlzdGVuZXJzUmVjb3JkLFxuICAgIExpc3RlbmVyR2hvc3QgPSBDaGFuZ2VEZXNjcmlwdG9yLkxpc3RlbmVyR2hvc3Q7XG5cbnZhciByYW5nZUNoYW5nZURlc2NyaXB0b3JzID0gbmV3IFdlYWtNYXAoKTsgLy8ge2lzQWN0aXZlLCB3aWxsQ2hhbmdlTGlzdGVuZXJzLCBjaGFuZ2VMaXN0ZW5lcnN9XG5cblxuLy9cbmZ1bmN0aW9uIFJhbmdlQ2hhbmdlRGVzY3JpcHRvcihuYW1lKSB7XG4gICAgdGhpcy5uYW1lID0gbmFtZTtcbiAgICB0aGlzLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgdGhpcy5fd2lsbENoYW5nZUxpc3RlbmVycyA9IG51bGw7XG4gICAgdGhpcy5fY2hhbmdlTGlzdGVuZXJzID0gbnVsbDtcbn07XG5cblJhbmdlQ2hhbmdlRGVzY3JpcHRvci5wcm90b3R5cGUgPSBuZXcgT2JqZWN0Q2hhbmdlRGVzY3JpcHRvcigpO1xuUmFuZ2VDaGFuZ2VEZXNjcmlwdG9yLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJhbmdlQ2hhbmdlRGVzY3JpcHRvcjtcblxuUmFuZ2VDaGFuZ2VEZXNjcmlwdG9yLnByb3RvdHlwZS5jaGFuZ2VMaXN0ZW5lcnNSZWNvcmRDb25zdHJ1Y3RvciA9IFJhbmdlQ2hhbmdlTGlzdGVuZXJzUmVjb3JkO1xuUmFuZ2VDaGFuZ2VEZXNjcmlwdG9yLnByb3RvdHlwZS53aWxsQ2hhbmdlTGlzdGVuZXJzUmVjb3JkQ29uc3RydWN0b3IgPSBSYW5nZVdpbGxDaGFuZ2VMaXN0ZW5lcnNSZWNvcmQ7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoUmFuZ2VDaGFuZ2VEZXNjcmlwdG9yLnByb3RvdHlwZSxcImFjdGl2ZVwiLHtcbiAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYWN0aXZlIHx8ICh0aGlzLl9hY3RpdmUgPSB0aGlzLl9jdXJyZW50ID8gdGhpcy5fY3VycmVudC5zbGljZSgpOltdKTtcbiAgICB9XG59KTtcblxuXG52YXIgUmFuZ2VDaGFuZ2VMaXN0ZW5lcnNTcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lID0gbmV3IE1hcCgpO1xuXG5mdW5jdGlvbiBSYW5nZUNoYW5nZUxpc3RlbmVyc1JlY29yZChuYW1lKSB7XG4gICAgdmFyIHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUgPSBSYW5nZUNoYW5nZUxpc3RlbmVyc1NwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUuZ2V0KG5hbWUpO1xuICAgIGlmKCFzcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lKSB7XG4gICAgICAgIHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUgPSBcImhhbmRsZVwiO1xuICAgICAgICBzcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lICs9IG5hbWUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSArPSBuYW1lLnNsaWNlKDEpO1xuICAgICAgICBzcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lICs9IFwiUmFuZ2VDaGFuZ2VcIjtcbiAgICAgICAgUmFuZ2VDaGFuZ2VMaXN0ZW5lcnNTcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lLnNldChuYW1lLHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUpO1xuICAgIH1cbiAgICB0aGlzLnNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUgPSBzcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lO1xuXHRyZXR1cm4gdGhpcztcbn1cblJhbmdlQ2hhbmdlTGlzdGVuZXJzUmVjb3JkLnByb3RvdHlwZSA9IG5ldyBDaGFuZ2VMaXN0ZW5lcnNSZWNvcmQoKTtcblJhbmdlQ2hhbmdlTGlzdGVuZXJzUmVjb3JkLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJhbmdlQ2hhbmdlTGlzdGVuZXJzUmVjb3JkO1xuXG52YXIgUmFuZ2VXaWxsQ2hhbmdlTGlzdGVuZXJzU3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSA9IG5ldyBNYXAoKTtcblxuZnVuY3Rpb24gUmFuZ2VXaWxsQ2hhbmdlTGlzdGVuZXJzUmVjb3JkKG5hbWUpIHtcbiAgICB2YXIgc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSA9IFJhbmdlV2lsbENoYW5nZUxpc3RlbmVyc1NwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUuZ2V0KG5hbWUpO1xuICAgIGlmKCFzcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lKSB7XG4gICAgICAgIHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUgPSBcImhhbmRsZVwiO1xuICAgICAgICBzcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lICs9IG5hbWUuc2xpY2UoMCwgMSkudG9VcHBlckNhc2UoKTtcbiAgICAgICAgc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSArPSBuYW1lLnNsaWNlKDEpO1xuICAgICAgICBzcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lICs9IFwiUmFuZ2VXaWxsQ2hhbmdlXCI7XG4gICAgICAgIFJhbmdlV2lsbENoYW5nZUxpc3RlbmVyc1NwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUuc2V0KG5hbWUsc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSk7XG4gICAgfVxuICAgIHRoaXMuc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSA9IHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWU7XG4gICAgcmV0dXJuIHRoaXM7XG59XG5SYW5nZVdpbGxDaGFuZ2VMaXN0ZW5lcnNSZWNvcmQucHJvdG90eXBlID0gbmV3IENoYW5nZUxpc3RlbmVyc1JlY29yZCgpO1xuUmFuZ2VXaWxsQ2hhbmdlTGlzdGVuZXJzUmVjb3JkLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJhbmdlV2lsbENoYW5nZUxpc3RlbmVyc1JlY29yZDtcblxubW9kdWxlLmV4cG9ydHMgPSBSYW5nZUNoYW5nZXM7XG5mdW5jdGlvbiBSYW5nZUNoYW5nZXMoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY29uc3RydWN0LiBSYW5nZUNoYW5nZXMgaXMgYSBtaXhpbi5cIik7XG59XG5cblJhbmdlQ2hhbmdlcy5wcm90b3R5cGUuZ2V0QWxsUmFuZ2VDaGFuZ2VEZXNjcmlwdG9ycyA9IGZ1bmN0aW9uICgpIHtcbiAgICBpZiAoIXJhbmdlQ2hhbmdlRGVzY3JpcHRvcnMuaGFzKHRoaXMpKSB7XG4gICAgICAgIHJhbmdlQ2hhbmdlRGVzY3JpcHRvcnMuc2V0KHRoaXMsIG5ldyBNYXAoKSk7XG4gICAgfVxuICAgIHJldHVybiByYW5nZUNoYW5nZURlc2NyaXB0b3JzLmdldCh0aGlzKTtcbn07XG5cblJhbmdlQ2hhbmdlcy5wcm90b3R5cGUuZ2V0UmFuZ2VDaGFuZ2VEZXNjcmlwdG9yID0gZnVuY3Rpb24gKHRva2VuKSB7XG4gICAgdmFyIHRva2VuQ2hhbmdlRGVzY3JpcHRvcnMgPSB0aGlzLmdldEFsbFJhbmdlQ2hhbmdlRGVzY3JpcHRvcnMoKTtcbiAgICB0b2tlbiA9IHRva2VuIHx8IFwiXCI7XG4gICAgaWYgKCF0b2tlbkNoYW5nZURlc2NyaXB0b3JzLmhhcyh0b2tlbikpIHtcbiAgICAgICAgdG9rZW5DaGFuZ2VEZXNjcmlwdG9ycy5zZXQodG9rZW4sIG5ldyBSYW5nZUNoYW5nZURlc2NyaXB0b3IodG9rZW4pKTtcbiAgICB9XG4gICAgcmV0dXJuIHRva2VuQ2hhbmdlRGVzY3JpcHRvcnMuZ2V0KHRva2VuKTtcbn07XG5cbnZhciBPYmplY3RzRGlzcGF0Y2hlc1JhbmdlQ2hhbmdlcyA9IG5ldyBXZWFrTWFwKCksXG4gICAgZGlzcGF0Y2hlc1JhbmdlQ2hhbmdlc0dldHRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0c0Rpc3BhdGNoZXNSYW5nZUNoYW5nZXMuZ2V0KHRoaXMpO1xuICAgIH0sXG4gICAgZGlzcGF0Y2hlc1JhbmdlQ2hhbmdlc1NldHRlciA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBPYmplY3RzRGlzcGF0Y2hlc1JhbmdlQ2hhbmdlcy5zZXQodGhpcyx2YWx1ZSk7XG4gICAgfSxcbiAgICBkaXNwYXRjaGVzQ2hhbmdlc01ldGhvZE5hbWUgPSBcImRpc3BhdGNoZXNSYW5nZUNoYW5nZXNcIixcbiAgICBkaXNwYXRjaGVzQ2hhbmdlc1Byb3BlcnR5RGVzY3JpcHRvciA9IHtcbiAgICAgICAgZ2V0OiBkaXNwYXRjaGVzUmFuZ2VDaGFuZ2VzR2V0dGVyLFxuICAgICAgICBzZXQ6IGRpc3BhdGNoZXNSYW5nZUNoYW5nZXNTZXR0ZXIsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2VcbiAgICB9O1xuXG5SYW5nZUNoYW5nZXMucHJvdG90eXBlLmFkZFJhbmdlQ2hhbmdlTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRSYW5nZUNoYW5nZUxpc3RlbmVyKGxpc3RlbmVyLCB0b2tlbiwgYmVmb3JlQ2hhbmdlKSB7XG4gICAgLy8gYSBjb25jZXNzaW9uIGZvciBvYmplY3RzIGxpa2UgQXJyYXkgdGhhdCBhcmUgbm90IGluaGVyZW50bHkgb2JzZXJ2YWJsZVxuICAgIGlmICghdGhpcy5pc09ic2VydmFibGUgJiYgdGhpcy5tYWtlT2JzZXJ2YWJsZSkge1xuICAgICAgICB0aGlzLm1ha2VPYnNlcnZhYmxlKCk7XG4gICAgfVxuXG4gICAgdmFyIGRlc2NyaXB0b3IgPSB0aGlzLmdldFJhbmdlQ2hhbmdlRGVzY3JpcHRvcih0b2tlbik7XG5cbiAgICB2YXIgbGlzdGVuZXJzO1xuICAgIGlmIChiZWZvcmVDaGFuZ2UpIHtcbiAgICAgICAgbGlzdGVuZXJzID0gZGVzY3JpcHRvci53aWxsQ2hhbmdlTGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxpc3RlbmVycyA9IGRlc2NyaXB0b3IuY2hhbmdlTGlzdGVuZXJzO1xuICAgIH1cblxuICAgIC8vIGV2ZW4gaWYgYWxyZWFkeSByZWdpc3RlcmVkXG4gICAgaWYoIWxpc3RlbmVycy5fY3VycmVudCkge1xuICAgICAgICBsaXN0ZW5lcnMuX2N1cnJlbnQgPSBsaXN0ZW5lcjtcbiAgICB9XG4gICAgZWxzZSBpZighQXJyYXkuaXNBcnJheShsaXN0ZW5lcnMuX2N1cnJlbnQpKSB7XG4gICAgICAgIGxpc3RlbmVycy5fY3VycmVudCA9IFtsaXN0ZW5lcnMuX2N1cnJlbnQsbGlzdGVuZXJdXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsaXN0ZW5lcnMuX2N1cnJlbnQucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgaWYoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcigodGhpcy5fX3Byb3RvX198fE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKSksZGlzcGF0Y2hlc0NoYW5nZXNNZXRob2ROYW1lKSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgodGhpcy5fX3Byb3RvX198fE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKSksIGRpc3BhdGNoZXNDaGFuZ2VzTWV0aG9kTmFtZSwgZGlzcGF0Y2hlc0NoYW5nZXNQcm9wZXJ0eURlc2NyaXB0b3IpO1xuICAgIH1cbiAgICB0aGlzLmRpc3BhdGNoZXNSYW5nZUNoYW5nZXMgPSB0cnVlO1xuXG4gICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgIHJldHVybiBmdW5jdGlvbiBjYW5jZWxSYW5nZUNoYW5nZUxpc3RlbmVyKCkge1xuICAgICAgICBpZiAoIXNlbGYpIHtcbiAgICAgICAgICAgIC8vIFRPRE8gdGhyb3cgbmV3IEVycm9yKFwiUmFuZ2UgY2hhbmdlIGxpc3RlbmVyIFwiICsgSlNPTi5zdHJpbmdpZnkodG9rZW4pICsgXCIgaGFzIGFscmVhZHkgYmVlbiBjYW5jZWxlZFwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLnJlbW92ZVJhbmdlQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXIsIHRva2VuLCBiZWZvcmVDaGFuZ2UpO1xuICAgICAgICBzZWxmID0gbnVsbDtcbiAgICB9O1xufTtcblxuXG5SYW5nZUNoYW5nZXMucHJvdG90eXBlLnJlbW92ZVJhbmdlQ2hhbmdlTGlzdGVuZXIgPSBmdW5jdGlvbiAobGlzdGVuZXIsIHRva2VuLCBiZWZvcmVDaGFuZ2UpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IHRoaXMuZ2V0UmFuZ2VDaGFuZ2VEZXNjcmlwdG9yKHRva2VuKTtcblxuICAgIHZhciBsaXN0ZW5lcnM7XG4gICAgaWYgKGJlZm9yZUNoYW5nZSkge1xuICAgICAgICBsaXN0ZW5lcnMgPSBkZXNjcmlwdG9yLl93aWxsQ2hhbmdlTGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxpc3RlbmVycyA9IGRlc2NyaXB0b3IuX2NoYW5nZUxpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZihsaXN0ZW5lcnMuX2N1cnJlbnQpIHtcbiAgICAgICAgaWYobGlzdGVuZXJzLl9jdXJyZW50ID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgbGlzdGVuZXJzLl9jdXJyZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGxpc3RlbmVycy5fY3VycmVudC5sYXN0SW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgcmVtb3ZlIHJhbmdlIGNoYW5nZSBsaXN0ZW5lcjogZG9lcyBub3QgZXhpc3Q6IHRva2VuIFwiICsgSlNPTi5zdHJpbmdpZnkodG9rZW4pKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGlmKGRlc2NyaXB0b3IuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzLmdob3N0Q291bnQgPSBsaXN0ZW5lcnMuZ2hvc3RDb3VudCsxXG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVycy5fY3VycmVudFtpbmRleF09TGlzdGVuZXJHaG9zdFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzLl9jdXJyZW50LnNwbGljZU9uZShpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59O1xuXG5SYW5nZUNoYW5nZXMucHJvdG90eXBlLmRpc3BhdGNoUmFuZ2VDaGFuZ2UgPSBmdW5jdGlvbiAocGx1cywgbWludXMsIGluZGV4LCBiZWZvcmVDaGFuZ2UpIHtcbiAgICB2YXIgZGVzY3JpcHRvcnMgPSB0aGlzLmdldEFsbFJhbmdlQ2hhbmdlRGVzY3JpcHRvcnMoKSxcbiAgICAgICAgZGVzY3JpcHRvcixcbiAgICAgICAgbWFwSXRlciAgPSBkZXNjcmlwdG9ycy52YWx1ZXMoKSxcbiAgICAgICAgbGlzdGVuZXJzLFxuICAgICAgICB0b2tlbk5hbWUsXG4gICAgICAgIGksXG4gICAgICAgIGNvdW50SSxcbiAgICAgICAgbGlzdGVuZXIsXG4gICAgICAgIGN1cnJlbnRMaXN0ZW5lcnMsXG4gICAgICAgIEdob3N0O1xuXG4gICAgZGVzY3JpcHRvcnMuZGlzcGF0Y2hCZWZvcmVDaGFuZ2UgPSBiZWZvcmVDaGFuZ2U7XG5cbiAgICAgd2hpbGUgKGRlc2NyaXB0b3IgPSBtYXBJdGVyLm5leHQoKS52YWx1ZSkge1xuXG4gICAgICAgIGlmIChkZXNjcmlwdG9yLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBiZWZvcmUgb3IgYWZ0ZXJcbiAgICAgICAgbGlzdGVuZXJzID0gYmVmb3JlQ2hhbmdlID8gZGVzY3JpcHRvci5fd2lsbENoYW5nZUxpc3RlbmVycyA6IGRlc2NyaXB0b3IuX2NoYW5nZUxpc3RlbmVycztcbiAgICAgICAgaWYobGlzdGVuZXJzICYmIGxpc3RlbmVycy5fY3VycmVudCkge1xuICAgICAgICAgICAgdG9rZW5OYW1lID0gbGlzdGVuZXJzLnNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWU7XG4gICAgICAgICAgICBpZihBcnJheS5pc0FycmF5KGxpc3RlbmVycy5fY3VycmVudCkpIHtcbiAgICAgICAgICAgICAgICBpZihsaXN0ZW5lcnMuX2N1cnJlbnQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIG5vdGFibHksIGRlZmF1bHRzIHRvIFwiaGFuZGxlUmFuZ2VDaGFuZ2VcIiBvciBcImhhbmRsZVJhbmdlV2lsbENoYW5nZVwiXG4gICAgICAgICAgICAgICAgICAgIC8vIGlmIHRva2VuIGlzIFwiXCIgKHRoZSBkZWZhdWx0KVxuXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IuaXNBY3RpdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAvLyBkaXNwYXRjaCBlYWNoIGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9yZW1vdmVHb3N0TGlzdGVuZXJzSWZOZWVkZWQgcmV0dXJucyBsaXN0ZW5lcnMuY3VycmVudCBvciBhIG5ldyBmaWx0ZXJlZCBvbmUgd2hlbiBjb25kaXRpb25zIGFyZSBtZXRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjdXJyZW50TGlzdGVuZXJzID0gbGlzdGVuZXJzLnJlbW92ZUN1cnJlbnRHb3N0TGlzdGVuZXJzSWZOZWVkZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBHaG9zdCA9IExpc3RlbmVyR2hvc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IoaT0wLCBjb3VudEkgPSBjdXJyZW50TGlzdGVuZXJzLmxlbmd0aDtpPGNvdW50STtpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoKGxpc3RlbmVyID0gY3VycmVudExpc3RlbmVyc1tpXSkgIT09IEdob3N0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lclt0b2tlbk5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lclt0b2tlbk5hbWVdKHBsdXMsIG1pbnVzLCBpbmRleCwgdGhpcywgYmVmb3JlQ2hhbmdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsaXN0ZW5lci5jYWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5jYWxsKHRoaXMsIHBsdXMsIG1pbnVzLCBpbmRleCwgdGhpcywgYmVmb3JlQ2hhbmdlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkhhbmRsZXIgXCIgKyBsaXN0ZW5lciArIFwiIGhhcyBubyBtZXRob2QgXCIgKyB0b2tlbk5hbWUgKyBcIiBhbmQgaXMgbm90IGNhbGxhYmxlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvci5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvci5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gZGlzcGF0Y2ggZWFjaCBsaXN0ZW5lclxuICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyID0gbGlzdGVuZXJzLl9jdXJyZW50O1xuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXJbdG9rZW5OYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJbdG9rZW5OYW1lXShwbHVzLCBtaW51cywgaW5kZXgsIHRoaXMsIGJlZm9yZUNoYW5nZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAobGlzdGVuZXIuY2FsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIuY2FsbCh0aGlzLCBwbHVzLCBtaW51cywgaW5kZXgsIHRoaXMsIGJlZm9yZUNoYW5nZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJIYW5kbGVyIFwiICsgbGlzdGVuZXIgKyBcIiBoYXMgbm8gbWV0aG9kIFwiICsgdG9rZW5OYW1lICsgXCIgYW5kIGlzIG5vdCBjYWxsYWJsZVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxufTtcblxuUmFuZ2VDaGFuZ2VzLnByb3RvdHlwZS5hZGRCZWZvcmVSYW5nZUNoYW5nZUxpc3RlbmVyID0gZnVuY3Rpb24gKGxpc3RlbmVyLCB0b2tlbikge1xuICAgIHJldHVybiB0aGlzLmFkZFJhbmdlQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXIsIHRva2VuLCB0cnVlKTtcbn07XG5cblJhbmdlQ2hhbmdlcy5wcm90b3R5cGUucmVtb3ZlQmVmb3JlUmFuZ2VDaGFuZ2VMaXN0ZW5lciA9IGZ1bmN0aW9uIChsaXN0ZW5lciwgdG9rZW4pIHtcbiAgICByZXR1cm4gdGhpcy5yZW1vdmVSYW5nZUNoYW5nZUxpc3RlbmVyKGxpc3RlbmVyLCB0b2tlbiwgdHJ1ZSk7XG59O1xuXG5SYW5nZUNoYW5nZXMucHJvdG90eXBlLmRpc3BhdGNoQmVmb3JlUmFuZ2VDaGFuZ2UgPSBmdW5jdGlvbiAocGx1cywgbWludXMsIGluZGV4KSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hSYW5nZUNoYW5nZShwbHVzLCBtaW51cywgaW5kZXgsIHRydWUpO1xufTtcbiJdfQ==