"use strict";
var WeakMap = require("../weak-map"), Map = require("../_map"), ChangeDescriptor = require("./change-descriptor"), ObjectChangeDescriptor = ChangeDescriptor.ObjectChangeDescriptor, ChangeListenersRecord = ChangeDescriptor.ChangeListenersRecord, ListenerGhost = ChangeDescriptor.ListenerGhost;
module.exports = MapChanges;
function MapChanges() {
    throw new Error("Can't construct. MapChanges is a mixin.");
}
var object_owns = Object.prototype.hasOwnProperty;
/*
    Object map change descriptors carry information necessary for adding,
    removing, dispatching, and shorting events to listeners for map changes
    for a particular key on a particular object.  These descriptors are used
    here for shallow map changes.

    {
        willChangeListeners:Array(Fgunction)
        changeListeners:Array(Function)
    }
*/
var mapChangeDescriptors = new WeakMap();
function MapChangeDescriptor(name) {
    this.name = name;
    this.isActive = false;
    this._willChangeListeners = null;
    this._changeListeners = null;
}
;
MapChangeDescriptor.prototype = new ObjectChangeDescriptor();
MapChangeDescriptor.prototype.constructor = MapChangeDescriptor;
MapChangeDescriptor.prototype.changeListenersRecordConstructor = MapChangeListenersRecord;
MapChangeDescriptor.prototype.willChangeListenersRecordConstructor = MapWillChangeListenersRecord;
var MapChangeListenersSpecificHandlerMethodName = new Map();
function MapChangeListenersRecord(name) {
    var specificHandlerMethodName = MapChangeListenersSpecificHandlerMethodName.get(name);
    if (!specificHandlerMethodName) {
        specificHandlerMethodName = "handle";
        specificHandlerMethodName += name.slice(0, 1).toUpperCase();
        specificHandlerMethodName += name.slice(1);
        specificHandlerMethodName += "MapChange";
        MapChangeListenersSpecificHandlerMethodName.set(name, specificHandlerMethodName);
    }
    this.specificHandlerMethodName = specificHandlerMethodName;
    return this;
}
MapChangeListenersRecord.prototype = new ChangeListenersRecord();
MapChangeListenersRecord.prototype.constructor = MapChangeListenersRecord;
MapChangeListenersRecord.prototype.genericHandlerMethodName = "handleMapChange";
var MapWillChangeListenersSpecificHandlerMethodName = new Map();
function MapWillChangeListenersRecord(name) {
    var specificHandlerMethodName = MapWillChangeListenersSpecificHandlerMethodName.get(name);
    if (!specificHandlerMethodName) {
        specificHandlerMethodName = "handle";
        specificHandlerMethodName += name.slice(0, 1).toUpperCase();
        specificHandlerMethodName += name.slice(1);
        specificHandlerMethodName += "MapWillChange";
        MapWillChangeListenersSpecificHandlerMethodName.set(name, specificHandlerMethodName);
    }
    this.specificHandlerMethodName = specificHandlerMethodName;
    return this;
}
MapWillChangeListenersRecord.prototype = new ChangeListenersRecord();
MapWillChangeListenersRecord.prototype.constructor = MapWillChangeListenersRecord;
MapWillChangeListenersRecord.prototype.genericHandlerMethodName = "handleMapWillChange";
MapChanges.prototype.getAllMapChangeDescriptors = function () {
    if (!mapChangeDescriptors.has(this)) {
        mapChangeDescriptors.set(this, new Map());
    }
    return mapChangeDescriptors.get(this);
};
MapChanges.prototype.getMapChangeDescriptor = function (token) {
    var tokenChangeDescriptors = this.getAllMapChangeDescriptors();
    token = token || "";
    if (!tokenChangeDescriptors.has(token)) {
        tokenChangeDescriptors.set(token, new MapChangeDescriptor(token));
    }
    return tokenChangeDescriptors.get(token);
};
var ObjectsDispatchesMapChanges = new WeakMap(), dispatchesMapChangesGetter = function () {
    return ObjectsDispatchesMapChanges.get(this);
}, dispatchesMapChangesSetter = function (value) {
    return ObjectsDispatchesMapChanges.set(this, value);
}, dispatchesChangesMethodName = "dispatchesMapChanges", dispatchesChangesPropertyDescriptor = {
    get: dispatchesMapChangesGetter,
    set: dispatchesMapChangesSetter,
    configurable: true,
    enumerable: false
};
MapChanges.prototype.addMapChangeListener = function addMapChangeListener(listener, token, beforeChange) {
    //console.log("this:",this," addMapChangeListener(",listener,",",token,",",beforeChange);
    if (!this.isObservable && this.makeObservable) {
        // for Array
        this.makeObservable();
    }
    var descriptor = this.getMapChangeDescriptor(token);
    var listeners;
    if (beforeChange) {
        listeners = descriptor.willChangeListeners;
    }
    else {
        listeners = descriptor.changeListeners;
    }
    // console.log("addMapChangeListener()",listener, token);
    //console.log("this:",this," addMapChangeListener()  listeners._current is ",listeners._current);
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
    this.dispatchesMapChanges = true;
    var self = this;
    return function cancelMapChangeListener() {
        if (!self) {
            // TODO throw new Error("Can't remove map change listener again");
            return;
        }
        self.removeMapChangeListener(listener, token, beforeChange);
        self = null;
    };
};
MapChanges.prototype.removeMapChangeListener = function (listener, token, beforeChange) {
    var descriptor = this.getMapChangeDescriptor(token);
    var listeners;
    if (beforeChange) {
        listeners = descriptor.willChangeListeners;
    }
    else {
        listeners = descriptor.changeListeners;
    }
    if (listeners._current) {
        if (listeners._current === listener) {
            listeners._current = null;
        }
        else {
            var index = listeners._current.lastIndexOf(listener);
            if (index === -1) {
                throw new Error("Can't remove map change listener: does not exist: token " + JSON.stringify(token));
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
MapChanges.prototype.dispatchMapChange = function (key, value, beforeChange) {
    var descriptors = this.getAllMapChangeDescriptors(), Ghost = ListenerGhost;
    descriptors.forEach(function (descriptor, token) {
        if (descriptor.isActive) {
            return;
        }
        var listeners = beforeChange ? descriptor.willChangeListeners : descriptor.changeListeners;
        if (listeners && listeners._current) {
            var tokenName = listeners.specificHandlerMethodName;
            if (Array.isArray(listeners._current)) {
                if (listeners._current.length) {
                    //removeGostListenersIfNeeded returns listeners.current or a new filtered one when conditions are met
                    var currentListeners = listeners.removeCurrentGostListenersIfNeeded(), i, countI, listener;
                    descriptor.isActive = true;
                    try {
                        for (i = 0, countI = currentListeners.length; i < countI; i++) {
                            // dispatch to each listener
                            if ((listener = currentListeners[i]) !== Ghost) {
                                if (listener[tokenName]) {
                                    listener[tokenName](value, key, this);
                                }
                                else if (listener.call) {
                                    listener.call(listener, value, key, this);
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
                        listener[tokenName](value, key, this);
                    }
                    else if (listener.call) {
                        listener.call(listener, value, key, this);
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
    }, this);
};
MapChanges.prototype.addBeforeMapChangeListener = function (listener, token) {
    return this.addMapChangeListener(listener, token, true);
};
MapChanges.prototype.removeBeforeMapChangeListener = function (listener, token) {
    return this.removeMapChangeListener(listener, token, true);
};
MapChanges.prototype.dispatchBeforeMapChange = function (key, value) {
    return this.dispatchMapChange(key, value, true);
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWNoYW5nZXMuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2pzLXByb3RvdHlwZXMvcGFja2FnZXMvY29sbGVjdGlvbnMvbGlzdGVuL21hcC1jaGFuZ2VzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUViLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFDaEMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsRUFDeEIsZ0JBQWdCLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLEVBQ2pELHNCQUFzQixHQUFHLGdCQUFnQixDQUFDLHNCQUFzQixFQUNoRSxxQkFBcUIsR0FBRyxnQkFBZ0IsQ0FBQyxxQkFBcUIsRUFDOUQsYUFBYSxHQUFHLGdCQUFnQixDQUFDLGFBQWEsQ0FBQztBQUVuRCxNQUFNLENBQUMsT0FBTyxHQUFHLFVBQVUsQ0FBQztBQUM1QixTQUFTLFVBQVU7SUFDZixNQUFNLElBQUksS0FBSyxDQUFDLHlDQUF5QyxDQUFDLENBQUM7QUFDL0QsQ0FBQztBQUVELElBQUksV0FBVyxHQUFHLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO0FBRWxEOzs7Ozs7Ozs7O0VBVUU7QUFFRixJQUFJLG9CQUFvQixHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFFekMsU0FBUyxtQkFBbUIsQ0FBQyxJQUFJO0lBQzdCLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2pCLElBQUksQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLENBQUM7SUFDakMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztBQUNqQyxDQUFDO0FBQUEsQ0FBQztBQUVGLG1CQUFtQixDQUFDLFNBQVMsR0FBRyxJQUFJLHNCQUFzQixFQUFFLENBQUM7QUFDN0QsbUJBQW1CLENBQUMsU0FBUyxDQUFDLFdBQVcsR0FB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LENBQUM7QUFDL0QsQ0FBQyxDQUFDO0FBRUYsVUFBVSxDQUFDLFNBQVMsQ0FBQyx1QkFBdUIsR0FBRyxVQUFVLEdBQUcsRUFBRSxLQUFLO0lBQy9ELE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDcEQsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBXZWFrTWFwID0gcmVxdWlyZShcIi4uL3dlYWstbWFwXCIpLFxuICAgIE1hcCA9IHJlcXVpcmUoXCIuLi9fbWFwXCIpLFxuICAgIENoYW5nZURlc2NyaXB0b3IgPSByZXF1aXJlKFwiLi9jaGFuZ2UtZGVzY3JpcHRvclwiKSxcbiAgICBPYmplY3RDaGFuZ2VEZXNjcmlwdG9yID0gQ2hhbmdlRGVzY3JpcHRvci5PYmplY3RDaGFuZ2VEZXNjcmlwdG9yLFxuICAgIENoYW5nZUxpc3RlbmVyc1JlY29yZCA9IENoYW5nZURlc2NyaXB0b3IuQ2hhbmdlTGlzdGVuZXJzUmVjb3JkLFxuICAgIExpc3RlbmVyR2hvc3QgPSBDaGFuZ2VEZXNjcmlwdG9yLkxpc3RlbmVyR2hvc3Q7XG5cbm1vZHVsZS5leHBvcnRzID0gTWFwQ2hhbmdlcztcbmZ1bmN0aW9uIE1hcENoYW5nZXMoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgY29uc3RydWN0LiBNYXBDaGFuZ2VzIGlzIGEgbWl4aW4uXCIpO1xufVxuXG52YXIgb2JqZWN0X293bnMgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xuXG4vKlxuICAgIE9iamVjdCBtYXAgY2hhbmdlIGRlc2NyaXB0b3JzIGNhcnJ5IGluZm9ybWF0aW9uIG5lY2Vzc2FyeSBmb3IgYWRkaW5nLFxuICAgIHJlbW92aW5nLCBkaXNwYXRjaGluZywgYW5kIHNob3J0aW5nIGV2ZW50cyB0byBsaXN0ZW5lcnMgZm9yIG1hcCBjaGFuZ2VzXG4gICAgZm9yIGEgcGFydGljdWxhciBrZXkgb24gYSBwYXJ0aWN1bGFyIG9iamVjdC4gIFRoZXNlIGRlc2NyaXB0b3JzIGFyZSB1c2VkXG4gICAgaGVyZSBmb3Igc2hhbGxvdyBtYXAgY2hhbmdlcy5cblxuICAgIHtcbiAgICAgICAgd2lsbENoYW5nZUxpc3RlbmVyczpBcnJheShGZ3VuY3Rpb24pXG4gICAgICAgIGNoYW5nZUxpc3RlbmVyczpBcnJheShGdW5jdGlvbilcbiAgICB9XG4qL1xuXG52YXIgbWFwQ2hhbmdlRGVzY3JpcHRvcnMgPSBuZXcgV2Vha01hcCgpO1xuXG5mdW5jdGlvbiBNYXBDaGFuZ2VEZXNjcmlwdG9yKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLl93aWxsQ2hhbmdlTGlzdGVuZXJzID0gbnVsbDtcbiAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMgPSBudWxsO1xufTtcblxuTWFwQ2hhbmdlRGVzY3JpcHRvci5wcm90b3R5cGUgPSBuZXcgT2JqZWN0Q2hhbmdlRGVzY3JpcHRvcigpO1xuTWFwQ2hhbmdlRGVzY3JpcHRvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBNYXBDaGFuZ2VEZXNjcmlwdG9yO1xuXG5NYXBDaGFuZ2VEZXNjcmlwdG9yLnByb3RvdHlwZS5jaGFuZ2VMaXN0ZW5lcnNSZWNvcmRDb25zdHJ1Y3RvciA9IE1hcENoYW5nZUxpc3RlbmVyc1JlY29yZDtcbk1hcENoYW5nZURlc2NyaXB0b3IucHJvdG90eXBlLndpbGxDaGFuZ2VMaXN0ZW5lcnNSZWNvcmRDb25zdHJ1Y3RvciA9IE1hcFdpbGxDaGFuZ2VMaXN0ZW5lcnNSZWNvcmQ7XG5cbnZhciBNYXBDaGFuZ2VMaXN0ZW5lcnNTcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lID0gbmV3IE1hcCgpO1xuXG5mdW5jdGlvbiBNYXBDaGFuZ2VMaXN0ZW5lcnNSZWNvcmQobmFtZSkge1xuICAgIHZhciBzcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lID0gTWFwQ2hhbmdlTGlzdGVuZXJzU3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZS5nZXQobmFtZSk7XG4gICAgaWYoIXNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUpIHtcbiAgICAgICAgc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSA9IFwiaGFuZGxlXCI7XG4gICAgICAgIHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUgKz0gbmFtZS5zbGljZSgwLCAxKS50b1VwcGVyQ2FzZSgpO1xuICAgICAgICBzcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lICs9IG5hbWUuc2xpY2UoMSk7XG4gICAgICAgIHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUgKz0gXCJNYXBDaGFuZ2VcIjtcbiAgICAgICAgTWFwQ2hhbmdlTGlzdGVuZXJzU3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZS5zZXQobmFtZSxzcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lKTtcbiAgICB9XG4gICAgdGhpcy5zcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lID0gc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZTtcblx0cmV0dXJuIHRoaXM7XG59XG5NYXBDaGFuZ2VMaXN0ZW5lcnNSZWNvcmQucHJvdG90eXBlID0gbmV3IENoYW5nZUxpc3RlbmVyc1JlY29yZCgpO1xuTWFwQ2hhbmdlTGlzdGVuZXJzUmVjb3JkLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IE1hcENoYW5nZUxpc3RlbmVyc1JlY29yZDtcbk1hcENoYW5nZUxpc3RlbmVyc1JlY29yZC5wcm90b3R5cGUuZ2VuZXJpY0hhbmRsZXJNZXRob2ROYW1lID0gXCJoYW5kbGVNYXBDaGFuZ2VcIjtcblxudmFyIE1hcFdpbGxDaGFuZ2VMaXN0ZW5lcnNTcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lID0gbmV3IE1hcCgpO1xuXG5mdW5jdGlvbiBNYXBXaWxsQ2hhbmdlTGlzdGVuZXJzUmVjb3JkKG5hbWUpIHtcbiAgICB2YXIgc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSA9IE1hcFdpbGxDaGFuZ2VMaXN0ZW5lcnNTcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lLmdldChuYW1lKTtcbiAgICBpZighc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSkge1xuICAgICAgICBzcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lID0gXCJoYW5kbGVcIjtcbiAgICAgICAgc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSArPSBuYW1lLnNsaWNlKDAsIDEpLnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUgKz0gbmFtZS5zbGljZSgxKTtcbiAgICAgICAgc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSArPSBcIk1hcFdpbGxDaGFuZ2VcIjtcbiAgICAgICAgTWFwV2lsbENoYW5nZUxpc3RlbmVyc1NwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUuc2V0KG5hbWUsc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSk7XG4gICAgfVxuICAgIHRoaXMuc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSA9IHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWU7XG4gICAgcmV0dXJuIHRoaXM7XG59XG5NYXBXaWxsQ2hhbmdlTGlzdGVuZXJzUmVjb3JkLnByb3RvdHlwZSA9IG5ldyBDaGFuZ2VMaXN0ZW5lcnNSZWNvcmQoKTtcbk1hcFdpbGxDaGFuZ2VMaXN0ZW5lcnNSZWNvcmQucHJvdG90eXBlLmNvbnN0cnVjdG9yID0gTWFwV2lsbENoYW5nZUxpc3RlbmVyc1JlY29yZDtcbk1hcFdpbGxDaGFuZ2VMaXN0ZW5lcnNSZWNvcmQucHJvdG90eXBlLmdlbmVyaWNIYW5kbGVyTWV0aG9kTmFtZSA9IFwiaGFuZGxlTWFwV2lsbENoYW5nZVwiO1xuXG5cbk1hcENoYW5nZXMucHJvdG90eXBlLmdldEFsbE1hcENoYW5nZURlc2NyaXB0b3JzID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghbWFwQ2hhbmdlRGVzY3JpcHRvcnMuaGFzKHRoaXMpKSB7XG4gICAgICAgIG1hcENoYW5nZURlc2NyaXB0b3JzLnNldCh0aGlzLCBuZXcgTWFwKCkpO1xuICAgIH1cbiAgICByZXR1cm4gbWFwQ2hhbmdlRGVzY3JpcHRvcnMuZ2V0KHRoaXMpO1xufTtcblxuTWFwQ2hhbmdlcy5wcm90b3R5cGUuZ2V0TWFwQ2hhbmdlRGVzY3JpcHRvciA9IGZ1bmN0aW9uICh0b2tlbikge1xuICAgIHZhciB0b2tlbkNoYW5nZURlc2NyaXB0b3JzID0gdGhpcy5nZXRBbGxNYXBDaGFuZ2VEZXNjcmlwdG9ycygpO1xuICAgIHRva2VuID0gdG9rZW4gfHwgXCJcIjtcbiAgICBpZiAoIXRva2VuQ2hhbmdlRGVzY3JpcHRvcnMuaGFzKHRva2VuKSkge1xuICAgICAgICB0b2tlbkNoYW5nZURlc2NyaXB0b3JzLnNldCh0b2tlbiwgbmV3IE1hcENoYW5nZURlc2NyaXB0b3IodG9rZW4pKTtcbiAgICB9XG4gICAgcmV0dXJuIHRva2VuQ2hhbmdlRGVzY3JpcHRvcnMuZ2V0KHRva2VuKTtcbn07XG5cbnZhciBPYmplY3RzRGlzcGF0Y2hlc01hcENoYW5nZXMgPSBuZXcgV2Vha01hcCgpLFxuICAgIGRpc3BhdGNoZXNNYXBDaGFuZ2VzR2V0dGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBPYmplY3RzRGlzcGF0Y2hlc01hcENoYW5nZXMuZ2V0KHRoaXMpO1xuICAgIH0sXG4gICAgZGlzcGF0Y2hlc01hcENoYW5nZXNTZXR0ZXIgPSBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICByZXR1cm4gT2JqZWN0c0Rpc3BhdGNoZXNNYXBDaGFuZ2VzLnNldCh0aGlzLHZhbHVlKTtcbiAgICB9LFxuICAgIGRpc3BhdGNoZXNDaGFuZ2VzTWV0aG9kTmFtZSA9IFwiZGlzcGF0Y2hlc01hcENoYW5nZXNcIixcbiAgICBkaXNwYXRjaGVzQ2hhbmdlc1Byb3BlcnR5RGVzY3JpcHRvciA9IHtcbiAgICAgICAgZ2V0OiBkaXNwYXRjaGVzTWFwQ2hhbmdlc0dldHRlcixcbiAgICAgICAgc2V0OiBkaXNwYXRjaGVzTWFwQ2hhbmdlc1NldHRlcixcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgIH07XG5cbk1hcENoYW5nZXMucHJvdG90eXBlLmFkZE1hcENoYW5nZUxpc3RlbmVyID0gZnVuY3Rpb24gYWRkTWFwQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXIsIHRva2VuLCBiZWZvcmVDaGFuZ2UpIHtcbiAgICAvL2NvbnNvbGUubG9nKFwidGhpczpcIix0aGlzLFwiIGFkZE1hcENoYW5nZUxpc3RlbmVyKFwiLGxpc3RlbmVyLFwiLFwiLHRva2VuLFwiLFwiLGJlZm9yZUNoYW5nZSk7XG5cbiAgICBpZiAoIXRoaXMuaXNPYnNlcnZhYmxlICYmIHRoaXMubWFrZU9ic2VydmFibGUpIHtcbiAgICAgICAgLy8gZm9yIEFycmF5XG4gICAgICAgIHRoaXMubWFrZU9ic2VydmFibGUoKTtcbiAgICB9XG4gICAgdmFyIGRlc2NyaXB0b3IgPSB0aGlzLmdldE1hcENoYW5nZURlc2NyaXB0b3IodG9rZW4pO1xuICAgIHZhciBsaXN0ZW5lcnM7XG4gICAgaWYgKGJlZm9yZUNoYW5nZSkge1xuICAgICAgICBsaXN0ZW5lcnMgPSBkZXNjcmlwdG9yLndpbGxDaGFuZ2VMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbGlzdGVuZXJzID0gZGVzY3JpcHRvci5jaGFuZ2VMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgLy8gY29uc29sZS5sb2coXCJhZGRNYXBDaGFuZ2VMaXN0ZW5lcigpXCIsbGlzdGVuZXIsIHRva2VuKTtcbiAgICAvL2NvbnNvbGUubG9nKFwidGhpczpcIix0aGlzLFwiIGFkZE1hcENoYW5nZUxpc3RlbmVyKCkgIGxpc3RlbmVycy5fY3VycmVudCBpcyBcIixsaXN0ZW5lcnMuX2N1cnJlbnQpO1xuXG4gICAgaWYoIWxpc3RlbmVycy5fY3VycmVudCkge1xuICAgICAgICBsaXN0ZW5lcnMuX2N1cnJlbnQgPSBsaXN0ZW5lcjtcbiAgICB9XG4gICAgZWxzZSBpZighQXJyYXkuaXNBcnJheShsaXN0ZW5lcnMuX2N1cnJlbnQpKSB7XG4gICAgICAgIGxpc3RlbmVycy5fY3VycmVudCA9IFtsaXN0ZW5lcnMuX2N1cnJlbnQsbGlzdGVuZXJdXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsaXN0ZW5lcnMuX2N1cnJlbnQucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgaWYoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcigodGhpcy5fX3Byb3RvX198fE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKSksZGlzcGF0Y2hlc0NoYW5nZXNNZXRob2ROYW1lKSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSgodGhpcy5fX3Byb3RvX198fE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKSksIGRpc3BhdGNoZXNDaGFuZ2VzTWV0aG9kTmFtZSwgZGlzcGF0Y2hlc0NoYW5nZXNQcm9wZXJ0eURlc2NyaXB0b3IpO1xuICAgIH1cbiAgICB0aGlzLmRpc3BhdGNoZXNNYXBDaGFuZ2VzID0gdHJ1ZTtcblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gZnVuY3Rpb24gY2FuY2VsTWFwQ2hhbmdlTGlzdGVuZXIoKSB7XG4gICAgICAgIGlmICghc2VsZikge1xuICAgICAgICAgICAgLy8gVE9ETyB0aHJvdyBuZXcgRXJyb3IoXCJDYW4ndCByZW1vdmUgbWFwIGNoYW5nZSBsaXN0ZW5lciBhZ2FpblwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBzZWxmLnJlbW92ZU1hcENoYW5nZUxpc3RlbmVyKGxpc3RlbmVyLCB0b2tlbiwgYmVmb3JlQ2hhbmdlKTtcbiAgICAgICAgc2VsZiA9IG51bGw7XG4gICAgfTtcbn07XG5cbk1hcENoYW5nZXMucHJvdG90eXBlLnJlbW92ZU1hcENoYW5nZUxpc3RlbmVyID0gZnVuY3Rpb24gKGxpc3RlbmVyLCB0b2tlbiwgYmVmb3JlQ2hhbmdlKSB7XG4gICAgdmFyIGRlc2NyaXB0b3IgPSB0aGlzLmdldE1hcENoYW5nZURlc2NyaXB0b3IodG9rZW4pO1xuXG4gICAgdmFyIGxpc3RlbmVycztcbiAgICBpZiAoYmVmb3JlQ2hhbmdlKSB7XG4gICAgICAgIGxpc3RlbmVycyA9IGRlc2NyaXB0b3Iud2lsbENoYW5nZUxpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgICBsaXN0ZW5lcnMgPSBkZXNjcmlwdG9yLmNoYW5nZUxpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZihsaXN0ZW5lcnMuX2N1cnJlbnQpIHtcbiAgICAgICAgaWYobGlzdGVuZXJzLl9jdXJyZW50ID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgbGlzdGVuZXJzLl9jdXJyZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGxpc3RlbmVycy5fY3VycmVudC5sYXN0SW5kZXhPZihsaXN0ZW5lcik7XG4gICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ2FuJ3QgcmVtb3ZlIG1hcCBjaGFuZ2UgbGlzdGVuZXI6IGRvZXMgbm90IGV4aXN0OiB0b2tlbiBcIiArIEpTT04uc3RyaW5naWZ5KHRva2VuKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZihkZXNjcmlwdG9yLmlzQWN0aXZlKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVycy5naG9zdENvdW50ID0gbGlzdGVuZXJzLmdob3N0Q291bnQrMVxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnMuX2N1cnJlbnRbaW5kZXhdPUxpc3RlbmVyR2hvc3RcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVycy5fY3VycmVudC5zcGxpY2VPbmUoaW5kZXgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG59O1xuXG5NYXBDaGFuZ2VzLnByb3RvdHlwZS5kaXNwYXRjaE1hcENoYW5nZSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlLCBiZWZvcmVDaGFuZ2UpIHtcbiAgICB2YXIgZGVzY3JpcHRvcnMgPSB0aGlzLmdldEFsbE1hcENoYW5nZURlc2NyaXB0b3JzKCksXG4gICAgICAgIEdob3N0ID0gTGlzdGVuZXJHaG9zdDtcblxuICAgIGRlc2NyaXB0b3JzLmZvckVhY2goZnVuY3Rpb24gKGRlc2NyaXB0b3IsIHRva2VuKSB7XG5cbiAgICAgICAgaWYgKGRlc2NyaXB0b3IuaXNBY3RpdmUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSBiZWZvcmVDaGFuZ2UgPyBkZXNjcmlwdG9yLndpbGxDaGFuZ2VMaXN0ZW5lcnMgOiBkZXNjcmlwdG9yLmNoYW5nZUxpc3RlbmVycztcbiAgICAgICAgaWYobGlzdGVuZXJzICYmIGxpc3RlbmVycy5fY3VycmVudCkge1xuXG4gICAgICAgICAgICB2YXIgdG9rZW5OYW1lID0gbGlzdGVuZXJzLnNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWU7XG4gICAgICAgICAgICBpZihBcnJheS5pc0FycmF5KGxpc3RlbmVycy5fY3VycmVudCkpIHtcbiAgICAgICAgICAgICAgICBpZihsaXN0ZW5lcnMuX2N1cnJlbnQubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vcmVtb3ZlR29zdExpc3RlbmVyc0lmTmVlZGVkIHJldHVybnMgbGlzdGVuZXJzLmN1cnJlbnQgb3IgYSBuZXcgZmlsdGVyZWQgb25lIHdoZW4gY29uZGl0aW9ucyBhcmUgbWV0XG4gICAgICAgICAgICAgICAgICAgIHZhciBjdXJyZW50TGlzdGVuZXJzID0gbGlzdGVuZXJzLnJlbW92ZUN1cnJlbnRHb3N0TGlzdGVuZXJzSWZOZWVkZWQoKSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGksIGNvdW50SSwgbGlzdGVuZXI7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IuaXNBY3RpdmUgPSB0cnVlO1xuXG4gICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IoaT0wLCBjb3VudEkgPSBjdXJyZW50TGlzdGVuZXJzLmxlbmd0aDtpPGNvdW50STtpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBkaXNwYXRjaCB0byBlYWNoIGxpc3RlbmVyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKChsaXN0ZW5lciA9IGN1cnJlbnRMaXN0ZW5lcnNbaV0pICE9PSBHaG9zdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXJbdG9rZW5OYW1lXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJbdG9rZW5OYW1lXSh2YWx1ZSwga2V5LCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChsaXN0ZW5lci5jYWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5jYWxsKGxpc3RlbmVyLCB2YWx1ZSwga2V5LCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkhhbmRsZXIgXCIgKyBsaXN0ZW5lciArIFwiIGhhcyBubyBtZXRob2QgXCIgKyB0b2tlbk5hbWUgKyBcIiBhbmQgaXMgbm90IGNhbGxhYmxlXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvci5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZGVzY3JpcHRvci5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgLy8gZGlzcGF0Y2ggZWFjaCBsaXN0ZW5lclxuXG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBsaXN0ZW5lcnMuX2N1cnJlbnQ7XG4gICAgICAgICAgICAgICAgICAgIGlmIChsaXN0ZW5lclt0b2tlbk5hbWVdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lclt0b2tlbk5hbWVdKHZhbHVlLCBrZXksIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGxpc3RlbmVyLmNhbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmNhbGwobGlzdGVuZXIsIHZhbHVlLCBrZXksIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSGFuZGxlciBcIiArIGxpc3RlbmVyICsgXCIgaGFzIG5vIG1ldGhvZCBcIiArIHRva2VuTmFtZSArIFwiIGFuZCBpcyBub3QgY2FsbGFibGVcIik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IGZpbmFsbHkge1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0sIHRoaXMpO1xufTtcblxuTWFwQ2hhbmdlcy5wcm90b3R5cGUuYWRkQmVmb3JlTWFwQ2hhbmdlTGlzdGVuZXIgPSBmdW5jdGlvbiAobGlzdGVuZXIsIHRva2VuKSB7XG4gICAgcmV0dXJuIHRoaXMuYWRkTWFwQ2hhbmdlTGlzdGVuZXIobGlzdGVuZXIsIHRva2VuLCB0cnVlKTtcbn07XG5cbk1hcENoYW5nZXMucHJvdG90eXBlLnJlbW92ZUJlZm9yZU1hcENoYW5nZUxpc3RlbmVyID0gZnVuY3Rpb24gKGxpc3RlbmVyLCB0b2tlbikge1xuICAgIHJldHVybiB0aGlzLnJlbW92ZU1hcENoYW5nZUxpc3RlbmVyKGxpc3RlbmVyLCB0b2tlbiwgdHJ1ZSk7XG59O1xuXG5NYXBDaGFuZ2VzLnByb3RvdHlwZS5kaXNwYXRjaEJlZm9yZU1hcENoYW5nZSA9IGZ1bmN0aW9uIChrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIHRoaXMuZGlzcGF0Y2hNYXBDaGFuZ2Uoa2V5LCB2YWx1ZSwgdHJ1ZSk7XG59O1xuIl19