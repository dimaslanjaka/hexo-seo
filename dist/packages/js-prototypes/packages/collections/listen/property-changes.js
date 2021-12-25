"use strict";
/*
    Based in part on observable arrays from Motorola Mobility’s Montage
    Copyright (c) 2012, Motorola Mobility LLC. All Rights Reserved.
    3-Clause BSD License
    https://github.com/motorola-mobility/montage/blob/master/LICENSE.md
*/
/*
    This module is responsible for observing changes to owned properties of
    objects and changes to the content of arrays caused by method calls.
    The interface for observing array content changes establishes the methods
    necessary for any collection with observable content.
*/
// objectHasOwnProperty.call(myObject, key) will be used instead of
// myObject.hasOwnProperty(key) to allow myObject have defined
// a own property called "hasOwnProperty".
var objectHasOwnProperty = Object.prototype.hasOwnProperty;
// Object property descriptors carry information necessary for adding,
// removing, dispatching, and shorting events to listeners for property changes
// for a particular key on a particular object.  These descriptors are used
// here for shallow property changes.  The current listeners are the ones
// modified by add and remove own property change listener methods.  During
// property change dispatch, we capture a snapshot of the current listeners in
// the active change listeners array.  The descriptor also keeps a memo of the
// corresponding handler method names.
//
// {
//     willChangeListeners:{current, active:Array<Function>, ...method names}
//     changeListeners:{current, active:Array<Function>, ...method names}
// }
// Maybe remove entries from this table if the corresponding object no longer
// has any property change listeners for any key.  However, the cost of
// book-keeping is probably not warranted since it would be rare for an
// observed object to no longer be observed unless it was about to be disposed
// of or reused as an observable.  The only benefit would be in avoiding bulk
// calls to dispatchOwnPropertyChange events on objects that have no listeners.
//  To observe shallow property changes for a particular key of a particular
//  object, we install a property descriptor on the object that overrides the previous
//  descriptor.  The overridden descriptors are stored in this weak map.  The
//  weak map associates an object with another object that maps property names
//  to property descriptors.
//
//  object.__overriddenPropertyDescriptors__[key]
//
//  We retain the old descriptor for various purposes.  For one, if the property
//  is no longer being observed by anyone, we revert the property descriptor to
//  the original.  For "value" descriptors, we store the actual value of the
//  descriptor on the overridden descriptor, so when the property is reverted, it
//  retains the most recently set value.  For "get" and "set" descriptors,
//  we observe then forward "get" and "set" operations to the original descriptor.
module.exports = PropertyChanges;
function PropertyChanges() {
    throw new Error("This is an abstract interface. Mix it. Don't construct it");
}
require("../shim");
var Map = require("../_map");
var WeakMap = require("../weak-map");
var ChangeDescriptor = require("./change-descriptor"), ObjectChangeDescriptor = ChangeDescriptor.ObjectChangeDescriptor, ListenerGhost = ChangeDescriptor.ListenerGhost;
PropertyChanges.debug = true;
var ObjectsPropertyChangeListeners = new WeakMap();
var ObjectChangeDescriptorName = new Map();
PropertyChanges.ObjectChangeDescriptor = function () {
};
PropertyChanges.prototype.getOwnPropertyChangeDescriptor = function (key) {
    var objectPropertyChangeDescriptors = ObjectsPropertyChangeListeners.get(this), keyChangeDescriptor;
    if (!objectPropertyChangeDescriptors) {
        objectPropertyChangeDescriptors = Object.create(null);
        ObjectsPropertyChangeListeners.set(this, objectPropertyChangeDescriptors);
    }
    if ((keyChangeDescriptor = objectPropertyChangeDescriptors[key]) === void 0) {
        var propertyName = ObjectChangeDescriptorName.get(key);
        if (!propertyName) {
            propertyName = String(key);
            propertyName = propertyName && propertyName[0].toUpperCase() + propertyName.slice(1);
            ObjectChangeDescriptorName.set(key, propertyName);
        }
        return objectPropertyChangeDescriptors[key] = new ObjectChangeDescriptor(propertyName);
    }
    else
        return keyChangeDescriptor;
};
PropertyChanges.prototype.hasOwnPropertyChangeDescriptor = function (key) {
    var objectPropertyChangeDescriptors = ObjectsPropertyChangeListeners.get(this);
    if (!objectPropertyChangeDescriptors) {
        return false;
    }
    if (!key) {
        return true;
    }
    if (objectPropertyChangeDescriptors[key] === void 0) {
        return false;
    }
    return true;
};
PropertyChanges.prototype.addOwnPropertyChangeListener = function (key, listener, beforeChange) {
    if (this.makeObservable && !this.isObservable) {
        this.makeObservable(); // particularly for observable arrays, for
        // their length property
    }
    var descriptor = PropertyChanges.getOwnPropertyChangeDescriptor(this, key), listeners = beforeChange ? descriptor.willChangeListeners : descriptor.changeListeners;
    PropertyChanges.makePropertyObservable(this, key);
    if (!listeners._current) {
        listeners._current = listener;
    }
    else if (!Array.isArray(listeners._current)) {
        listeners._current = [listeners._current, listener];
    }
    else {
        listeners._current.push(listener);
    }
    var self = this;
    return function cancelOwnPropertyChangeListener() {
        PropertyChanges.removeOwnPropertyChangeListener(self, key, listener, beforeChange);
        self = null;
    };
};
PropertyChanges.prototype.addBeforeOwnPropertyChangeListener = function (key, listener) {
    return PropertyChanges.addOwnPropertyChangeListener(this, key, listener, true);
};
PropertyChanges.prototype.removeOwnPropertyChangeListener = function removeOwnPropertyChangeListener(key, listener, beforeChange) {
    var descriptor = PropertyChanges.getOwnPropertyChangeDescriptor(this, key);
    var listeners;
    if (beforeChange) {
        listeners = descriptor._willChangeListeners;
    }
    else {
        listeners = descriptor._changeListeners;
    }
    if (listeners) {
        if (listeners._current) {
            if (listeners._current === listener) {
                listeners._current = null;
            }
            else {
                var index = listeners._current.lastIndexOf(listener);
                if (index === -1) {
                    throw new Error("Can't remove property change listener: does not exist: property name" + JSON.stringify(key));
                }
                if (descriptor.isActive) {
                    listeners.ghostCount = listeners.ghostCount + 1;
                    listeners._current[index] = removeOwnPropertyChangeListener.ListenerGhost;
                }
                else {
                    listeners._current.spliceOne(index);
                }
            }
        }
    }
};
PropertyChanges.prototype.removeOwnPropertyChangeListener.ListenerGhost = ListenerGhost;
PropertyChanges.prototype.removeBeforeOwnPropertyChangeListener = function (key, listener) {
    return PropertyChanges.removeOwnPropertyChangeListener(this, key, listener, true);
};
PropertyChanges.prototype.dispatchOwnPropertyChange = function dispatchOwnPropertyChange(key, value, beforeChange) {
    var descriptor = PropertyChanges.getOwnPropertyChangeDescriptor(this, key), listeners;
    if (!descriptor.isActive) {
        descriptor.isActive = true;
        listeners = beforeChange ? descriptor._willChangeListeners : descriptor._changeListeners;
        try {
            dispatchOwnPropertyChange.dispatchEach(listeners, key, value, this);
        }
        finally {
            descriptor.isActive = false;
        }
    }
};
PropertyChanges.prototype.dispatchOwnPropertyChange.dispatchEach = dispatchEach;
function dispatchEach(listeners, key, value, object) {
    if (listeners && listeners._current) {
        // copy snapshot of current listeners to active listeners
        var current, listener, i, countI, thisp, specificHandlerMethodName = listeners.specificHandlerMethodName, genericHandlerMethodName = listeners.genericHandlerMethodName, Ghost = ListenerGhost;
        if (Array.isArray(listeners._current)) {
            //removeGostListenersIfNeeded returns listeners.current or a new filtered one when conditions are met
            current = listeners.removeCurrentGostListenersIfNeeded();
            //We use a for to guarantee we won't dispatch to listeners that would be added after we started
            for (i = 0, countI = current.length; i < countI; i++) {
                if ((thisp = current[i]) !== Ghost) {
                    //This is fixing the issue causing a regression in Montage's repetition
                    listener = (thisp[specificHandlerMethodName] ||
                        thisp[genericHandlerMethodName] ||
                        thisp);
                    if (!listener.call) {
                        throw new Error("No event listener for " + listeners.specificHandlerName + " or " + listeners.genericHandlerName + " or call on " + listener);
                    }
                    listener.call(thisp, value, key, object);
                }
            }
        }
        else {
            thisp = listeners._current;
            listener = (thisp[specificHandlerMethodName] ||
                thisp[genericHandlerMethodName] ||
                thisp);
            if (!listener.call) {
                throw new Error("No event listener for " + listeners.specificHandlerName + " or " + listeners.genericHandlerName + " or call on " + listener);
            }
            listener.call(thisp, value, key, object);
        }
    }
}
dispatchEach.ListenerGhost = ListenerGhost;
PropertyChanges.prototype.dispatchBeforeOwnPropertyChange = function (key, listener) {
    return PropertyChanges.dispatchOwnPropertyChange(this, key, listener, true);
};
var ObjectsOverriddenPropertyDescriptors = new WeakMap(), Objects__state__ = new WeakMap(), propertyListener = {
    get: void 0,
    set: void 0,
    configurable: true,
    enumerable: false
};
PropertyChanges.prototype.makePropertyObservable = function (key) {
    // arrays are special.  we do not support direct setting of properties
    // on an array.  instead, call .set(index, value).  this is observable.
    // 'length' property is observable for all mutating methods because
    // our overrides explicitly dispatch that change.
    var overriddenPropertyDescriptors = ObjectsOverriddenPropertyDescriptors.get(this);
    if (overriddenPropertyDescriptors && overriddenPropertyDescriptors.get(key) !== void 0) {
        // if we have already recorded an overridden property descriptor,
        // we have already installed the observer, so short-here
        return;
    }
    // memoize overridden property descriptor table
    if (!overriddenPropertyDescriptors) {
        if (Array.isArray(this)) {
            return;
        }
        if (!Object.isExtensible(this)) {
            throw new Error("Can't make property " + JSON.stringify(key) + " observable on " + this + " because object is not extensible");
        }
        overriddenPropertyDescriptors = new Map();
        ObjectsOverriddenPropertyDescriptors.set(this, overriddenPropertyDescriptors);
    }
    // var state = Objects__state__.get(this);
    // if (typeof state !== "object") {
    //     Objects__state__.set(this,(state = {}));
    // }
    // state[key] = this[key];
    // walk up the prototype chain to find a property descriptor for
    // the property name
    var overriddenDescriptor;
    var attached = this;
    do {
        overriddenDescriptor = Object.getOwnPropertyDescriptor(attached, key);
        if (overriddenDescriptor) {
            break;
        }
        attached = Object.getPrototypeOf(attached);
    } while (attached);
    // or default to an undefined value
    if (!overriddenDescriptor) {
        overriddenDescriptor = {
            value: void 0,
            enumerable: true,
            writable: true,
            configurable: true
        };
    }
    else {
        if (!overriddenDescriptor.configurable) {
            return;
        }
        if (!overriddenDescriptor.writable && !overriddenDescriptor.set) {
            return;
        }
    }
    // memoize the descriptor so we know not to install another layer,
    // and so we can reuse the overridden descriptor when uninstalling
    overriddenPropertyDescriptors.set(key, overriddenDescriptor);
    // TODO reflect current value on a displayed property
    // in both of these new descriptor variants, we reuse the overridden
    // descriptor to either store the current value or apply getters
    // and setters.  this is handy since we can reuse the overridden
    // descriptor if we uninstall the observer.  We even preserve the
    // assignment semantics, where we get the value from up the
    // prototype chain, and set as an owned property.
    if ('value' in overriddenDescriptor) {
        propertyListener.get = function dispatchingGetter() {
            return dispatchingGetter.overriddenDescriptor.value;
        };
        propertyListener.set = function dispatchingSetter(value) {
            var descriptor, isActive, overriddenDescriptor = dispatchingSetter.overriddenDescriptor;
            if (value !== overriddenDescriptor.value) {
                if (!(isActive = (descriptor = dispatchingSetter.descriptor).isActive)) {
                    descriptor.isActive = true;
                    try {
                        dispatchingSetter.dispatchEach(descriptor._willChangeListeners, dispatchingSetter.key, overriddenDescriptor.value, this);
                    }
                    finally { }
                }
                overriddenDescriptor.value = value;
                if (!isActive) {
                    try {
                        dispatchingSetter.dispatchEach(descriptor._changeListeners, dispatchingSetter.key, value, this);
                    }
                    finally {
                        descriptor.isActive = false;
                    }
                }
            }
        };
        propertyListener.set.dispatchEach = dispatchEach;
        propertyListener.set.key = key;
        propertyListener.get.overriddenDescriptor = propertyListener.set.overriddenDescriptor = overriddenDescriptor;
        propertyListener.set.descriptor = ObjectsPropertyChangeListeners.get(this)[key];
        propertyListener.enumerable = overriddenDescriptor.enumerable;
        propertyListener.configurable = true;
    }
    else { // 'get' or 'set', but not necessarily both
        propertyListener.get = overriddenDescriptor.get;
        propertyListener.set = function dispatchingSetter() {
            var formerValue = dispatchingSetter.overriddenGetter.call(this), descriptor, isActive, newValue;
            if (arguments.length === 1) {
                dispatchingSetter.overriddenSetter.call(this, arguments[0]);
            }
            else if (arguments.length === 2) {
                dispatchingSetter.overriddenSetter.call(this, arguments[0], arguments[1]);
            }
            else {
                dispatchingSetter.overriddenSetter.apply(this, arguments);
            }
            if ((newValue = dispatchingSetter.overriddenGetter.call(this)) !== formerValue) {
                descriptor = dispatchingSetter.descriptor;
                if (!(isActive = descriptor.isActive)) {
                    descriptor.isActive = true;
                    try {
                        dispatchingSetter.dispatchEach(descriptor._willChangeListeners, key, formerValue, this);
                    }
                    finally { }
                }
                if (!isActive) {
                    try {
                        dispatchingSetter.dispatchEach(descriptor._changeListeners, key, newValue, this);
                    }
                    finally {
                        descriptor.isActive = false;
                    }
                }
            }
        };
        propertyListener.enumerable = overriddenDescriptor.enumerable;
        propertyListener.configurable = true;
        propertyListener.set.dispatchEach = dispatchEach;
        propertyListener.set.overriddenSetter = overriddenDescriptor.set;
        propertyListener.set.overriddenGetter = overriddenDescriptor.get;
        propertyListener.set.descriptor = ObjectsPropertyChangeListeners.get(this)[key];
    }
    Object.defineProperty(this, key, propertyListener);
};
// constructor functions
PropertyChanges.getOwnPropertyChangeDescriptor = function (object, key) {
    if (object.getOwnPropertyChangeDescriptor) {
        return object.getOwnPropertyChangeDescriptor(key);
    }
    else {
        return PropertyChanges.prototype.getOwnPropertyChangeDescriptor.call(object, key);
    }
};
PropertyChanges.hasOwnPropertyChangeDescriptor = function (object, key) {
    if (object.hasOwnPropertyChangeDescriptor) {
        return object.hasOwnPropertyChangeDescriptor(key);
    }
    else {
        return PropertyChanges.prototype.hasOwnPropertyChangeDescriptor.call(object, key);
    }
};
PropertyChanges.addOwnPropertyChangeListener = function (object, key, listener, beforeChange) {
    if (Object.isObject(object)) {
        return object.addOwnPropertyChangeListener
            ? object.addOwnPropertyChangeListener(key, listener, beforeChange)
            : this.prototype.addOwnPropertyChangeListener.call(object, key, listener, beforeChange);
    }
};
PropertyChanges.removeOwnPropertyChangeListener = function (object, key, listener, beforeChange) {
    if (!Object.isObject(object)) {
    }
    else if (object.removeOwnPropertyChangeListener) {
        return object.removeOwnPropertyChangeListener(key, listener, beforeChange);
    }
    else {
        return PropertyChanges.prototype.removeOwnPropertyChangeListener.call(object, key, listener, beforeChange);
    }
};
PropertyChanges.dispatchOwnPropertyChange = function (object, key, value, beforeChange) {
    if (!Object.isObject(object)) {
    }
    else if (object.dispatchOwnPropertyChange) {
        return object.dispatchOwnPropertyChange(key, value, beforeChange);
    }
    else {
        return PropertyChanges.prototype.dispatchOwnPropertyChange.call(object, key, value, beforeChange);
    }
};
PropertyChanges.addBeforeOwnPropertyChangeListener = function (object, key, listener) {
    return PropertyChanges.addOwnPropertyChangeListener(object, key, listener, true);
};
PropertyChanges.removeBeforeOwnPropertyChangeListener = function (object, key, listener) {
    return PropertyChanges.removeOwnPropertyChangeListener(object, key, listener, true);
};
PropertyChanges.dispatchBeforeOwnPropertyChange = function (object, key, value) {
    return PropertyChanges.dispatchOwnPropertyChange(object, key, value, true);
};
PropertyChanges.makePropertyObservable = function (object, key) {
    if (object.makePropertyObservable) {
        return object.makePropertyObservable(key);
    }
    else {
        return PropertyChanges.prototype.makePropertyObservable.call(object, key);
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvcGVydHktY2hhbmdlcy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvanMtcHJvdG90eXBlcy9wYWNrYWdlcy9jb2xsZWN0aW9ucy9saXN0ZW4vcHJvcGVydHktY2hhbmdlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7Ozs7O0VBS0U7QUFFRjs7Ozs7RUFLRTtBQUlGLG1FQUFtRTtBQUNuRSw4REFBOEQ7QUFDOUQsMENBQTBDO0FBRTFDLElBQUksb0JBQW9CLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUM7QUFFM0Qsc0VBQXNFO0FBQ3RFLCtFQUErRTtBQUMvRSwyRUFBMkU7QUFDM0UseUVBQXlFO0FBQ3pFLDJFQUEyRTtBQUMzRSw4RUFBOEU7QUFDOUUsOEVBQThFO0FBQzlFLHNDQUFzQztBQUN0QyxFQUFFO0FBQ0YsSUFBSTtBQUNKLDZFQUE2RTtBQUM3RSx5RUFBeUU7QUFDekUsSUFBSTtBQUVKLDZFQUE2RTtBQUM3RSx1RUFBdUU7QUFDdkUsdUVBQXVFO0FBQ3ZFLDhFQUE4RTtBQUM5RSw2RUFBNkU7QUFDN0UsK0VBQStFO0FBRS9FLDRFQUE0RTtBQUM1RSxzRkFBc0Y7QUFDdEYsNkVBQTZFO0FBQzdFLDhFQUE4RTtBQUM5RSw0QkFBNEI7QUFDNUIsRUFBRTtBQUNGLGlEQUFpRDtBQUNqRCxFQUFFO0FBQ0YsZ0ZBQWdGO0FBQ2hGLCtFQUErRTtBQUMvRSw0RUFBNEU7QUFDNUUsaUZBQWlGO0FBQ2pGLDBFQUEwRTtBQUMxRSxrRkFBa0Y7QUFFbEYsTUFBTSxDQUFDLE9BQU8sR0FBRyxlQUFlLENBQUM7QUFFakMsU0FBUyxlQUFlO0lBQ3BCLE1BQU0sSUFBSSxLQUFLLENBQUMsMkRBQTJELENBQUMsQ0FBQztBQUNqRixDQUFDO0FBRUQsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ25CLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUM3QixJQUFJLE9BQU8s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QzFFLE9BQU8sZUFBZSxDQUFDLHlCQUF5QixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUUsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQy9FLENBQUMsQ0FBQztBQUVGLGVBQWUsQ0FBQyxzQkFBc0IsR0FBRyxVQUFVLE1BQU0sRUFBRSxHQUFHO0lBQzFELElBQUksTUFBTSxDQUFDLHNCQUFzQixFQUFFO1FBQy9CLE9BQU8sTUFBTSxDQUFDLHNCQUFzQixDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQzdDO1NBQU07UUFDSCxPQUFPLGVBQWUsQ0FBQyxTQUFTLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztLQUM3RTtBQUNMLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gICAgQmFzZWQgaW4gcGFydCBvbiBvYnNlcnZhYmxlIGFycmF5cyBmcm9tIE1vdG9yb2xhIE1vYmlsaXR54oCZcyBNb250YWdlXG4gICAgQ29weXJpZ2h0IChjKSAyMDEyLCBNb3Rvcm9sYSBNb2JpbGl0eSBMTEMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gICAgMy1DbGF1c2UgQlNEIExpY2Vuc2VcbiAgICBodHRwczovL2dpdGh1Yi5jb20vbW90b3JvbGEtbW9iaWxpdHkvbW9udGFnZS9ibG9iL21hc3Rlci9MSUNFTlNFLm1kXG4qL1xuXG4vKlxuICAgIFRoaXMgbW9kdWxlIGlzIHJlc3BvbnNpYmxlIGZvciBvYnNlcnZpbmcgY2hhbmdlcyB0byBvd25lZCBwcm9wZXJ0aWVzIG9mXG4gICAgb2JqZWN0cyBhbmQgY2hhbmdlcyB0byB0aGUgY29udGVudCBvZiBhcnJheXMgY2F1c2VkIGJ5IG1ldGhvZCBjYWxscy5cbiAgICBUaGUgaW50ZXJmYWNlIGZvciBvYnNlcnZpbmcgYXJyYXkgY29udGVudCBjaGFuZ2VzIGVzdGFibGlzaGVzIHRoZSBtZXRob2RzXG4gICAgbmVjZXNzYXJ5IGZvciBhbnkgY29sbGVjdGlvbiB3aXRoIG9ic2VydmFibGUgY29udGVudC5cbiovXG5cblxuXG4vLyBvYmplY3RIYXNPd25Qcm9wZXJ0eS5jYWxsKG15T2JqZWN0LCBrZXkpIHdpbGwgYmUgdXNlZCBpbnN0ZWFkIG9mXG4vLyBteU9iamVjdC5oYXNPd25Qcm9wZXJ0eShrZXkpIHRvIGFsbG93IG15T2JqZWN0IGhhdmUgZGVmaW5lZFxuLy8gYSBvd24gcHJvcGVydHkgY2FsbGVkIFwiaGFzT3duUHJvcGVydHlcIi5cblxudmFyIG9iamVjdEhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcblxuLy8gT2JqZWN0IHByb3BlcnR5IGRlc2NyaXB0b3JzIGNhcnJ5IGluZm9ybWF0aW9uIG5lY2Vzc2FyeSBmb3IgYWRkaW5nLFxuLy8gcmVtb3ZpbmcsIGRpc3BhdGNoaW5nLCBhbmQgc2hvcnRpbmcgZXZlbnRzIHRvIGxpc3RlbmVycyBmb3IgcHJvcGVydHkgY2hhbmdlc1xuLy8gZm9yIGEgcGFydGljdWxhciBrZXkgb24gYSBwYXJ0aWN1bGFyIG9iamVjdC4gIFRoZXNlIGRlc2NyaXB0b3JzIGFyZSB1c2VkXG4vLyBoZXJlIGZvciBzaGFsbG93IHByb3BlcnR5IGNoYW5nZXMuICBUaGUgY3VycmVudCBsaXN0ZW5lcnMgYXJlIHRoZSBvbmVzXG4vLyBtb2RpZmllZCBieSBhZGQgYW5kIHJlbW92ZSBvd24gcHJvcGVydHkgY2hhbmdlIGxpc3RlbmVyIG1ldGhvZHMuICBEdXJpbmdcbi8vIHByb3BlcnR5IGNoYW5nZSBkaXNwYXRjaCwgd2UgY2FwdHVyZSBhIHNuYXBzaG90IG9mIHRoZSBjdXJyZW50IGxpc3RlbmVycyBpblxuLy8gdGhlIGFjdGl2ZSBjaGFuZ2UgbGlzdGVuZXJzIGFycmF5LiAgVGhlIGRlc2NyaXB0b3IgYWxzbyBrZWVwcyBhIG1lbW8gb2YgdGhlXG4vLyBjb3JyZXNwb25kaW5nIGhhbmRsZXIgbWV0aG9kIG5hbWVzLlxuLy9cbi8vIHtcbi8vICAgICB3aWxsQ2hhbmdlTGlzdGVuZXJzOntjdXJyZW50LCBhY3RpdmU6QXJyYXk8RnVuY3Rpb24+LCAuLi5tZXRob2QgbmFtZXN9XG4vLyAgICAgY2hhbmdlTGlzdGVuZXJzOntjdXJyZW50LCBhY3RpdmU6QXJyYXk8RnVuY3Rpb24+LCAuLi5tZXRob2QgbmFtZXN9XG4vLyB9XG5cbi8vIE1heWJlIHJlbW92ZSBlbnRyaWVzIGZyb20gdGhpcyB0YWJsZSBpZiB0aGUgY29ycmVzcG9uZGluZyBvYmplY3Qgbm8gbG9uZ2VyXG4vLyBoYXMgYW55IHByb3BlcnR5IGNoYW5nZSBsaXN0ZW5lcnMgZm9yIGFueSBrZXkuICBIb3dldmVyLCB0aGUgY29zdCBvZlxuLy8gYm9vay1rZWVwaW5nIGlzIHByb2JhYmx5IG5vdCB3YXJyYW50ZWQgc2luY2UgaXQgd291bGQgYmUgcmFyZSBmb3IgYW5cbi8vIG9ic2VydmVkIG9iamVjdCB0byBubyBsb25nZXIgYmUgb2JzZXJ2ZWQgdW5sZXNzIGl0IHdhcyBhYm91dCB0byBiZSBkaXNwb3NlZFxuLy8gb2Ygb3IgcmV1c2VkIGFzIGFuIG9ic2VydmFibGUuICBUaGUgb25seSBiZW5lZml0IHdvdWxkIGJlIGluIGF2b2lkaW5nIGJ1bGtcbi8vIGNhbGxzIHRvIGRpc3BhdGNoT3duUHJvcGVydHlDaGFuZ2UgZXZlbnRzIG9uIG9iamVjdHMgdGhhdCBoYXZlIG5vIGxpc3RlbmVycy5cblxuLy8gIFRvIG9ic2VydmUgc2hhbGxvdyBwcm9wZXJ0eSBjaGFuZ2VzIGZvciBhIHBhcnRpY3VsYXIga2V5IG9mIGEgcGFydGljdWxhclxuLy8gIG9iamVjdCwgd2UgaW5zdGFsbCBhIHByb3BlcnR5IGRlc2NyaXB0b3Igb24gdGhlIG9iamVjdCB0aGF0IG92ZXJyaWRlcyB0aGUgcHJldmlvdXNcbi8vICBkZXNjcmlwdG9yLiAgVGhlIG92ZXJyaWRkZW4gZGVzY3JpcHRvcnMgYXJlIHN0b3JlZCBpbiB0aGlzIHdlYWsgbWFwLiAgVGhlXG4vLyAgd2VhayBtYXAgYXNzb2NpYXRlcyBhbiBvYmplY3Qgd2l0aCBhbm90aGVyIG9iamVjdCB0aGF0IG1hcHMgcHJvcGVydHkgbmFtZXNcbi8vICB0byBwcm9wZXJ0eSBkZXNjcmlwdG9ycy5cbi8vXG4vLyAgb2JqZWN0Ll9fb3ZlcnJpZGRlblByb3BlcnR5RGVzY3JpcHRvcnNfX1trZXldXG4vL1xuLy8gIFdlIHJldGFpbiB0aGUgb2xkIGRlc2NyaXB0b3IgZm9yIHZhcmlvdXMgcHVycG9zZXMuICBGb3Igb25lLCBpZiB0aGUgcHJvcGVydHlcbi8vICBpcyBubyBsb25nZXIgYmVpbmcgb2JzZXJ2ZWQgYnkgYW55b25lLCB3ZSByZXZlcnQgdGhlIHByb3BlcnR5IGRlc2NyaXB0b3IgdG9cbi8vICB0aGUgb3JpZ2luYWwuICBGb3IgXCJ2YWx1ZVwiIGRlc2NyaXB0b3JzLCB3ZSBzdG9yZSB0aGUgYWN0dWFsIHZhbHVlIG9mIHRoZVxuLy8gIGRlc2NyaXB0b3Igb24gdGhlIG92ZXJyaWRkZW4gZGVzY3JpcHRvciwgc28gd2hlbiB0aGUgcHJvcGVydHkgaXMgcmV2ZXJ0ZWQsIGl0XG4vLyAgcmV0YWlucyB0aGUgbW9zdCByZWNlbnRseSBzZXQgdmFsdWUuICBGb3IgXCJnZXRcIiBhbmQgXCJzZXRcIiBkZXNjcmlwdG9ycyxcbi8vICB3ZSBvYnNlcnZlIHRoZW4gZm9yd2FyZCBcImdldFwiIGFuZCBcInNldFwiIG9wZXJhdGlvbnMgdG8gdGhlIG9yaWdpbmFsIGRlc2NyaXB0b3IuXG5cbm1vZHVsZS5leHBvcnRzID0gUHJvcGVydHlDaGFuZ2VzO1xuXG5mdW5jdGlvbiBQcm9wZXJ0eUNoYW5nZXMoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBpcyBhbiBhYnN0cmFjdCBpbnRlcmZhY2UuIE1peCBpdC4gRG9uJ3QgY29uc3RydWN0IGl0XCIpO1xufVxuXG5yZXF1aXJlKFwiLi4vc2hpbVwiKTtcbnZhciBNYXAgPSByZXF1aXJlKFwiLi4vX21hcFwiKTtcbnZhciBXZWFrTWFwID0gcmVxdWlyZShcIi4uL3dlYWstbWFwXCIpO1xudmFyIENoYW5nZURlc2NyaXB0b3IgPSByZXF1aXJlKFwiLi9jaGFuZ2UtZGVzY3JpcHRvclwiKSxcbiAgICBPYmplY3RDaGFuZ2VEZXNjcmlwdG9yID0gQ2hhbmdlRGVzY3JpcHRvci5PYmplY3RDaGFuZ2VEZXNjcmlwdG9yLFxuICAgIExpc3RlbmVyR2hvc3QgPSBDaGFuZ2VEZXNjcmlwdG9yLkxpc3RlbmVyR2hvc3Q7XG5cblByb3BlcnR5Q2hhbmdlcy5kZWJ1ZyA9IHRydWU7XG5cbnZhciBPYmplY3RzUHJvcGVydHlDaGFuZ2VMaXN0ZW5lcnMgPSBuZXcgV2Vha01hcCgpO1xuXG52YXIgT2JqZWN0Q2hhbmdlRGVzY3JpcHRvck5hbWUgPSBuZXcgTWFwKCk7XG5cblByb3BlcnR5Q2hhbmdlcy5PYmplY3RDaGFuZ2VEZXNjcmlwdG9yID0gZnVuY3Rpb24oKSB7XG5cbn1cblxuUHJvcGVydHlDaGFuZ2VzLnByb3RvdHlwZS5nZXRPd25Qcm9wZXJ0eUNoYW5nZURlc2NyaXB0b3IgPSBmdW5jdGlvbiAoa2V5KSB7XG4gICAgdmFyIG9iamVjdFByb3BlcnR5Q2hhbmdlRGVzY3JpcHRvcnMgPSBPYmplY3RzUHJvcGVydHlDaGFuZ2VMaXN0ZW5lcnMuZ2V0KHRoaXMpLCBrZXlDaGFuZ2VEZXNjcmlwdG9yO1xuICAgIGlmICghb2JqZWN0UHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9ycykge1xuICAgICAgICBvYmplY3RQcm9wZXJ0eUNoYW5nZURlc2NyaXB0b3JzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgT2JqZWN0c1Byb3BlcnR5Q2hhbmdlTGlzdGVuZXJzLnNldCh0aGlzLG9iamVjdFByb3BlcnR5Q2hhbmdlRGVzY3JpcHRvcnMpO1xuICAgIH1cbiAgICBpZiAoIChrZXlDaGFuZ2VEZXNjcmlwdG9yID0gb2JqZWN0UHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yc1trZXldKSA9PT0gdm9pZCAwKSB7XG4gICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBPYmplY3RDaGFuZ2VEZXNjcmlwdG9yTmFtZS5nZXQoa2V5KTtcbiAgICAgICAgaWYoIXByb3BlcnR5TmFtZSkge1xuICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gU3RyaW5nKGtleSk7XG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUgJiYgcHJvcGVydHlOYW1lWzBdLnRvVXBwZXJDYXNlKCkgKyBwcm9wZXJ0eU5hbWUuc2xpY2UoMSk7XG4gICAgICAgICAgICBPYmplY3RDaGFuZ2VEZXNjcmlwdG9yTmFtZS5zZXQoa2V5LHByb3BlcnR5TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG9iamVjdFByb3BlcnR5Q2hhbmdlRGVzY3JpcHRvcnNba2V5XSA9IG5ldyBPYmplY3RDaGFuZ2VEZXNjcmlwdG9yKHByb3BlcnR5TmFtZSk7XG4gICAgfVxuICAgIGVsc2UgcmV0dXJuIGtleUNoYW5nZURlc2NyaXB0b3I7XG59O1xuXG5Qcm9wZXJ0eUNoYW5nZXMucHJvdG90eXBlLmhhc093blByb3BlcnR5Q2hhbmdlRGVzY3JpcHRvciA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICB2YXIgb2JqZWN0UHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9ycyA9IE9iamVjdHNQcm9wZXJ0eUNoYW5nZUxpc3RlbmVycy5nZXQodGhpcyk7XG4gICAgaWYgKCFvYmplY3RQcm9wZXJ0eUNoYW5nZURlc2NyaXB0b3JzKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKCFrZXkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGlmIChvYmplY3RQcm9wZXJ0eUNoYW5nZURlc2NyaXB0b3JzW2tleV0gPT09IHZvaWQgMCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiB0cnVlO1xufTtcblxuUHJvcGVydHlDaGFuZ2VzLnByb3RvdHlwZS5hZGRPd25Qcm9wZXJ0eUNoYW5nZUxpc3RlbmVyID0gZnVuY3Rpb24gKGtleSwgbGlzdGVuZXIsIGJlZm9yZUNoYW5nZSkge1xuICAgIGlmICh0aGlzLm1ha2VPYnNlcnZhYmxlICYmICF0aGlzLmlzT2JzZXJ2YWJsZSkge1xuICAgICAgICB0aGlzLm1ha2VPYnNlcnZhYmxlKCk7IC8vIHBhcnRpY3VsYXJseSBmb3Igb2JzZXJ2YWJsZSBhcnJheXMsIGZvclxuICAgICAgICAvLyB0aGVpciBsZW5ndGggcHJvcGVydHlcbiAgICB9XG4gICAgdmFyIGRlc2NyaXB0b3IgPSBQcm9wZXJ0eUNoYW5nZXMuZ2V0T3duUHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yKHRoaXMsIGtleSksXG4gICAgICAgIGxpc3RlbmVycyA9IGJlZm9yZUNoYW5nZSA/IGRlc2NyaXB0b3Iud2lsbENoYW5nZUxpc3RlbmVycyA6IGRlc2NyaXB0b3IuY2hhbmdlTGlzdGVuZXJzO1xuXG4gICAgUHJvcGVydHlDaGFuZ2VzLm1ha2VQcm9wZXJ0eU9ic2VydmFibGUodGhpcywga2V5KTtcblxuICAgIGlmKCFsaXN0ZW5lcnMuX2N1cnJlbnQpIHtcbiAgICAgICAgbGlzdGVuZXJzLl9jdXJyZW50ID0gbGlzdGVuZXI7XG4gICAgfVxuICAgIGVsc2UgaWYoIUFycmF5LmlzQXJyYXkobGlzdGVuZXJzLl9jdXJyZW50KSkge1xuICAgICAgICBsaXN0ZW5lcnMuX2N1cnJlbnQgPSBbbGlzdGVuZXJzLl9jdXJyZW50LGxpc3RlbmVyXVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgbGlzdGVuZXJzLl9jdXJyZW50LnB1c2gobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIHZhciBzZWxmID0gdGhpcztcbiAgICByZXR1cm4gZnVuY3Rpb24gY2FuY2VsT3duUHJvcGVydHlDaGFuZ2VMaXN0ZW5lcigpIHtcbiAgICAgICAgUHJvcGVydHlDaGFuZ2VzLnJlbW92ZU93blByb3BlcnR5Q2hhbmdlTGlzdGVuZXIoc2VsZiwga2V5LCBsaXN0ZW5lciwgYmVmb3JlQ2hhbmdlKTtcbiAgICAgICAgc2VsZiA9IG51bGw7XG4gICAgfTtcbn07XG5cblByb3BlcnR5Q2hhbmdlcy5wcm90b3R5cGUuYWRkQmVmb3JlT3duUHJvcGVydHlDaGFuZ2VMaXN0ZW5lciA9IGZ1bmN0aW9uIChrZXksIGxpc3RlbmVyKSB7XG4gICAgcmV0dXJuIFByb3BlcnR5Q2hhbmdlcy5hZGRPd25Qcm9wZXJ0eUNoYW5nZUxpc3RlbmVyKHRoaXMsIGtleSwgbGlzdGVuZXIsIHRydWUpO1xufTtcblxuUHJvcGVydHlDaGFuZ2VzLnByb3RvdHlwZS5yZW1vdmVPd25Qcm9wZXJ0eUNoYW5nZUxpc3RlbmVyID0gZnVuY3Rpb24gcmVtb3ZlT3duUHJvcGVydHlDaGFuZ2VMaXN0ZW5lcihrZXksIGxpc3RlbmVyLCBiZWZvcmVDaGFuZ2UpIHtcbiAgICB2YXIgZGVzY3JpcHRvciA9IFByb3BlcnR5Q2hhbmdlcy5nZXRPd25Qcm9wZXJ0eUNoYW5nZURlc2NyaXB0b3IodGhpcywga2V5KTtcblxuICAgIHZhciBsaXN0ZW5lcnM7XG4gICAgaWYgKGJlZm9yZUNoYW5nZSkge1xuICAgICAgICBsaXN0ZW5lcnMgPSBkZXNjcmlwdG9yLl93aWxsQ2hhbmdlTGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIGxpc3RlbmVycyA9IGRlc2NyaXB0b3IuX2NoYW5nZUxpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZihsaXN0ZW5lcnMpIHtcbiAgICAgICAgaWYobGlzdGVuZXJzLl9jdXJyZW50KSB7XG4gICAgICAgICAgICBpZihsaXN0ZW5lcnMuX2N1cnJlbnQgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzLl9jdXJyZW50ID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gbGlzdGVuZXJzLl9jdXJyZW50Lmxhc3RJbmRleE9mKGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IHJlbW92ZSBwcm9wZXJ0eSBjaGFuZ2UgbGlzdGVuZXI6IGRvZXMgbm90IGV4aXN0OiBwcm9wZXJ0eSBuYW1lXCIgKyBKU09OLnN0cmluZ2lmeShrZXkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoZGVzY3JpcHRvci5pc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcnMuZ2hvc3RDb3VudCA9IGxpc3RlbmVycy5naG9zdENvdW50KzE7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVycy5fY3VycmVudFtpbmRleF09cmVtb3ZlT3duUHJvcGVydHlDaGFuZ2VMaXN0ZW5lci5MaXN0ZW5lckdob3N0O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzLl9jdXJyZW50LnNwbGljZU9uZShpbmRleCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufTtcblByb3BlcnR5Q2hhbmdlcy5wcm90b3R5cGUucmVtb3ZlT3duUHJvcGVydHlDaGFuZ2VMaXN0ZW5lci5MaXN0ZW5lckdob3N0ID0gTGlzdGVuZXJHaG9zdDtcblxuUHJvcGVydHlDaGFuZ2VzLnByb3RvdHlwZS5yZW1vdmVCZWZvcmVPd25Qcm9wZXJ0eUNoYW5nZUxpc3RlbmVyID0gZnVuY3Rpb24gKGtleSwgbGlzdGVuZXIpIHtcbiAgICByZXR1cm4gUHJvcGVydHlDaGFuZ2VzLnJlbW92ZU93blByb3BlcnR5Q2hhbmdlTGlzdGVuZXIodGhpcywga2V5LCBsaXN0ZW5lciwgdHJ1ZSk7XG59O1xuXG5Qcm9wZXJ0eUNoYW5nZXMucHJvdG90eXBlLmRpc3BhdGNoT3duUHJvcGVydHlDaGFuZ2UgPSBmdW5jdGlvbiBkaXNwYXRjaE93blByb3BlcnR5Q2hhbmdlKGtleSwgdmFsdWUsIGJlZm9yZUNoYW5nZSkge1xuICAgIHZhciBkZXNjcmlwdG9yID0gUHJvcGVydHlDaGFuZ2VzLmdldE93blByb3BlcnR5Q2hhbmdlRGVzY3JpcHRvcih0aGlzLCBrZXkpLFxuICAgICAgICBsaXN0ZW5lcnM7XG5cbiAgICBpZiAoIWRlc2NyaXB0b3IuaXNBY3RpdmUpIHtcbiAgICAgICAgZGVzY3JpcHRvci5pc0FjdGl2ZSA9IHRydWU7XG4gICAgICAgIGxpc3RlbmVycyA9IGJlZm9yZUNoYW5nZSA/IGRlc2NyaXB0b3IuX3dpbGxDaGFuZ2VMaXN0ZW5lcnM6IGRlc2NyaXB0b3IuX2NoYW5nZUxpc3RlbmVycztcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGRpc3BhdGNoT3duUHJvcGVydHlDaGFuZ2UuZGlzcGF0Y2hFYWNoKGxpc3RlbmVycywga2V5LCB2YWx1ZSwgdGhpcyk7XG4gICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICBkZXNjcmlwdG9yLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG59O1xuUHJvcGVydHlDaGFuZ2VzLnByb3RvdHlwZS5kaXNwYXRjaE93blByb3BlcnR5Q2hhbmdlLmRpc3BhdGNoRWFjaCA9IGRpc3BhdGNoRWFjaDtcblxuZnVuY3Rpb24gZGlzcGF0Y2hFYWNoKGxpc3RlbmVycywga2V5LCB2YWx1ZSwgb2JqZWN0KSB7XG4gICAgaWYobGlzdGVuZXJzICYmIGxpc3RlbmVycy5fY3VycmVudCkge1xuICAgICAgICAvLyBjb3B5IHNuYXBzaG90IG9mIGN1cnJlbnQgbGlzdGVuZXJzIHRvIGFjdGl2ZSBsaXN0ZW5lcnNcbiAgICAgICAgdmFyIGN1cnJlbnQsXG4gICAgICAgICAgICBsaXN0ZW5lcixcbiAgICAgICAgICAgIGksXG4gICAgICAgICAgICBjb3VudEksXG4gICAgICAgICAgICB0aGlzcCxcbiAgICAgICAgICAgIHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUgPSBsaXN0ZW5lcnMuc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSxcbiAgICAgICAgICAgIGdlbmVyaWNIYW5kbGVyTWV0aG9kTmFtZSA9IGxpc3RlbmVycy5nZW5lcmljSGFuZGxlck1ldGhvZE5hbWUsXG4gICAgICAgICAgICBHaG9zdCA9IExpc3RlbmVyR2hvc3Q7XG5cbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShsaXN0ZW5lcnMuX2N1cnJlbnQpKSB7XG4gICAgICAgICAgICAvL3JlbW92ZUdvc3RMaXN0ZW5lcnNJZk5lZWRlZCByZXR1cm5zIGxpc3RlbmVycy5jdXJyZW50IG9yIGEgbmV3IGZpbHRlcmVkIG9uZSB3aGVuIGNvbmRpdGlvbnMgYXJlIG1ldFxuICAgICAgICAgICAgY3VycmVudCA9IGxpc3RlbmVycy5yZW1vdmVDdXJyZW50R29zdExpc3RlbmVyc0lmTmVlZGVkKCk7XG4gICAgICAgICAgICAvL1dlIHVzZSBhIGZvciB0byBndWFyYW50ZWUgd2Ugd29uJ3QgZGlzcGF0Y2ggdG8gbGlzdGVuZXJzIHRoYXQgd291bGQgYmUgYWRkZWQgYWZ0ZXIgd2Ugc3RhcnRlZFxuICAgICAgICAgICAgZm9yKGk9MCwgY291bnRJID0gY3VycmVudC5sZW5ndGg7aTxjb3VudEk7aSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKCh0aGlzcCA9IGN1cnJlbnRbaV0pICE9PSBHaG9zdCkge1xuICAgICAgICAgICAgICAgICAgICAvL1RoaXMgaXMgZml4aW5nIHRoZSBpc3N1ZSBjYXVzaW5nIGEgcmVncmVzc2lvbiBpbiBNb250YWdlJ3MgcmVwZXRpdGlvblxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lciA9IChcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXNwW3NwZWNpZmljSGFuZGxlck1ldGhvZE5hbWVdIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzcFtnZW5lcmljSGFuZGxlck1ldGhvZE5hbWVdIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzcFxuICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWxpc3RlbmVyLmNhbGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIGV2ZW50IGxpc3RlbmVyIGZvciBcIiArIGxpc3RlbmVycy5zcGVjaWZpY0hhbmRsZXJOYW1lICsgXCIgb3IgXCIgKyBsaXN0ZW5lcnMuZ2VuZXJpY0hhbmRsZXJOYW1lICsgXCIgb3IgY2FsbCBvbiBcIiArIGxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lci5jYWxsKHRoaXNwLCB2YWx1ZSwga2V5LCBvYmplY3QpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXNwID0gbGlzdGVuZXJzLl9jdXJyZW50O1xuICAgICAgICAgICAgbGlzdGVuZXIgPSAoXG4gICAgICAgICAgICAgICAgdGhpc3Bbc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZV0gfHxcbiAgICAgICAgICAgICAgICB0aGlzcFtnZW5lcmljSGFuZGxlck1ldGhvZE5hbWVdIHx8XG4gICAgICAgICAgICAgICAgdGhpc3BcbiAgICAgICAgICAgICk7XG4gICAgICAgICAgICBpZiAoIWxpc3RlbmVyLmNhbGwpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBldmVudCBsaXN0ZW5lciBmb3IgXCIgKyBsaXN0ZW5lcnMuc3BlY2lmaWNIYW5kbGVyTmFtZSArIFwiIG9yIFwiICsgbGlzdGVuZXJzLmdlbmVyaWNIYW5kbGVyTmFtZSArIFwiIG9yIGNhbGwgb24gXCIgKyBsaXN0ZW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsaXN0ZW5lci5jYWxsKHRoaXNwLCB2YWx1ZSwga2V5LCBvYmplY3QpO1xuICAgICAgICB9XG5cbiAgICB9XG59XG5cbmRpc3BhdGNoRWFjaC5MaXN0ZW5lckdob3N0ID0gTGlzdGVuZXJHaG9zdDtcblxuXG5Qcm9wZXJ0eUNoYW5nZXMucHJvdG90eXBlLmRpc3BhdGNoQmVmb3JlT3duUHJvcGVydHlDaGFuZ2UgPSBmdW5jdGlvbiAoa2V5LCBsaXN0ZW5lcikge1xuICAgIHJldHVybiBQcm9wZXJ0eUNoYW5nZXMuZGlzcGF0Y2hPd25Qcm9wZXJ0eUNoYW5nZSh0aGlzLCBrZXksIGxpc3RlbmVyLCB0cnVlKTtcbn07XG5cbnZhciBPYmplY3RzT3ZlcnJpZGRlblByb3BlcnR5RGVzY3JpcHRvcnMgPSBuZXcgV2Vha01hcCgpLFxuICAgIE9iamVjdHNfX3N0YXRlX18gPSBuZXcgV2Vha01hcCgpLFxuICAgIHByb3BlcnR5TGlzdGVuZXIgPSB7XG4gICAgICAgIGdldDogdm9pZCAwLFxuICAgICAgICBzZXQ6IHZvaWQgMCxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICBlbnVtZXJhYmxlOiBmYWxzZVxuICAgIH07XG5cblByb3BlcnR5Q2hhbmdlcy5wcm90b3R5cGUubWFrZVByb3BlcnR5T2JzZXJ2YWJsZSA9IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAvLyBhcnJheXMgYXJlIHNwZWNpYWwuICB3ZSBkbyBub3Qgc3VwcG9ydCBkaXJlY3Qgc2V0dGluZyBvZiBwcm9wZXJ0aWVzXG4gICAgLy8gb24gYW4gYXJyYXkuICBpbnN0ZWFkLCBjYWxsIC5zZXQoaW5kZXgsIHZhbHVlKS4gIHRoaXMgaXMgb2JzZXJ2YWJsZS5cbiAgICAvLyAnbGVuZ3RoJyBwcm9wZXJ0eSBpcyBvYnNlcnZhYmxlIGZvciBhbGwgbXV0YXRpbmcgbWV0aG9kcyBiZWNhdXNlXG4gICAgLy8gb3VyIG92ZXJyaWRlcyBleHBsaWNpdGx5IGRpc3BhdGNoIHRoYXQgY2hhbmdlLlxuXG5cbiAgICB2YXIgb3ZlcnJpZGRlblByb3BlcnR5RGVzY3JpcHRvcnMgPSBPYmplY3RzT3ZlcnJpZGRlblByb3BlcnR5RGVzY3JpcHRvcnMuZ2V0KHRoaXMpO1xuICAgIGlmIChvdmVycmlkZGVuUHJvcGVydHlEZXNjcmlwdG9ycyAmJiBvdmVycmlkZGVuUHJvcGVydHlEZXNjcmlwdG9ycy5nZXQoa2V5KSAhPT0gdm9pZCAwKSB7XG4gICAgICAgIC8vIGlmIHdlIGhhdmUgYWxyZWFkeSByZWNvcmRlZCBhbiBvdmVycmlkZGVuIHByb3BlcnR5IGRlc2NyaXB0b3IsXG4gICAgICAgIC8vIHdlIGhhdmUgYWxyZWFkeSBpbnN0YWxsZWQgdGhlIG9ic2VydmVyLCBzbyBzaG9ydC1oZXJlXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBtZW1vaXplIG92ZXJyaWRkZW4gcHJvcGVydHkgZGVzY3JpcHRvciB0YWJsZVxuICAgIGlmICghb3ZlcnJpZGRlblByb3BlcnR5RGVzY3JpcHRvcnMpIHtcbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIU9iamVjdC5pc0V4dGVuc2libGUodGhpcykpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbid0IG1ha2UgcHJvcGVydHkgXCIgKyBKU09OLnN0cmluZ2lmeShrZXkpICsgXCIgb2JzZXJ2YWJsZSBvbiBcIiArIHRoaXMgKyBcIiBiZWNhdXNlIG9iamVjdCBpcyBub3QgZXh0ZW5zaWJsZVwiKTtcbiAgICAgICAgfVxuICAgICAgICBvdmVycmlkZGVuUHJvcGVydHlEZXNjcmlwdG9ycyA9IG5ldyBNYXAoKTtcbiAgICAgICAgT2JqZWN0c092ZXJyaWRkZW5Qcm9wZXJ0eURlc2NyaXB0b3JzLnNldCh0aGlzLG92ZXJyaWRkZW5Qcm9wZXJ0eURlc2NyaXB0b3JzKTtcbiAgICB9XG5cbiAgICAvLyB2YXIgc3RhdGUgPSBPYmplY3RzX19zdGF0ZV9fLmdldCh0aGlzKTtcbiAgICAvLyBpZiAodHlwZW9mIHN0YXRlICE9PSBcIm9iamVjdFwiKSB7XG4gICAgLy8gICAgIE9iamVjdHNfX3N0YXRlX18uc2V0KHRoaXMsKHN0YXRlID0ge30pKTtcbiAgICAvLyB9XG4gICAgLy8gc3RhdGVba2V5XSA9IHRoaXNba2V5XTtcblxuXG5cbiAgICAvLyB3YWxrIHVwIHRoZSBwcm90b3R5cGUgY2hhaW4gdG8gZmluZCBhIHByb3BlcnR5IGRlc2NyaXB0b3IgZm9yXG4gICAgLy8gdGhlIHByb3BlcnR5IG5hbWVcbiAgICB2YXIgb3ZlcnJpZGRlbkRlc2NyaXB0b3I7XG4gICAgdmFyIGF0dGFjaGVkID0gdGhpcztcbiAgICBkbyB7XG4gICAgICAgIG92ZXJyaWRkZW5EZXNjcmlwdG9yID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihhdHRhY2hlZCwga2V5KTtcbiAgICAgICAgaWYgKG92ZXJyaWRkZW5EZXNjcmlwdG9yKSB7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBhdHRhY2hlZCA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihhdHRhY2hlZCk7XG4gICAgfSB3aGlsZSAoYXR0YWNoZWQpO1xuICAgIC8vIG9yIGRlZmF1bHQgdG8gYW4gdW5kZWZpbmVkIHZhbHVlXG4gICAgaWYgKCFvdmVycmlkZGVuRGVzY3JpcHRvcikge1xuICAgICAgICBvdmVycmlkZGVuRGVzY3JpcHRvciA9IHtcbiAgICAgICAgICAgIHZhbHVlOiB2b2lkIDAsXG4gICAgICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoIW92ZXJyaWRkZW5EZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICghb3ZlcnJpZGRlbkRlc2NyaXB0b3Iud3JpdGFibGUgJiYgIW92ZXJyaWRkZW5EZXNjcmlwdG9yLnNldCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gbWVtb2l6ZSB0aGUgZGVzY3JpcHRvciBzbyB3ZSBrbm93IG5vdCB0byBpbnN0YWxsIGFub3RoZXIgbGF5ZXIsXG4gICAgLy8gYW5kIHNvIHdlIGNhbiByZXVzZSB0aGUgb3ZlcnJpZGRlbiBkZXNjcmlwdG9yIHdoZW4gdW5pbnN0YWxsaW5nXG4gICAgb3ZlcnJpZGRlblByb3BlcnR5RGVzY3JpcHRvcnMuc2V0KGtleSxvdmVycmlkZGVuRGVzY3JpcHRvcik7XG5cblxuICAgIC8vIFRPRE8gcmVmbGVjdCBjdXJyZW50IHZhbHVlIG9uIGEgZGlzcGxheWVkIHByb3BlcnR5XG5cbiAgICAvLyBpbiBib3RoIG9mIHRoZXNlIG5ldyBkZXNjcmlwdG9yIHZhcmlhbnRzLCB3ZSByZXVzZSB0aGUgb3ZlcnJpZGRlblxuICAgIC8vIGRlc2NyaXB0b3IgdG8gZWl0aGVyIHN0b3JlIHRoZSBjdXJyZW50IHZhbHVlIG9yIGFwcGx5IGdldHRlcnNcbiAgICAvLyBhbmQgc2V0dGVycy4gIHRoaXMgaXMgaGFuZHkgc2luY2Ugd2UgY2FuIHJldXNlIHRoZSBvdmVycmlkZGVuXG4gICAgLy8gZGVzY3JpcHRvciBpZiB3ZSB1bmluc3RhbGwgdGhlIG9ic2VydmVyLiAgV2UgZXZlbiBwcmVzZXJ2ZSB0aGVcbiAgICAvLyBhc3NpZ25tZW50IHNlbWFudGljcywgd2hlcmUgd2UgZ2V0IHRoZSB2YWx1ZSBmcm9tIHVwIHRoZVxuICAgIC8vIHByb3RvdHlwZSBjaGFpbiwgYW5kIHNldCBhcyBhbiBvd25lZCBwcm9wZXJ0eS5cbiAgICBpZiAoJ3ZhbHVlJyBpbiBvdmVycmlkZGVuRGVzY3JpcHRvcikge1xuICAgICAgICBwcm9wZXJ0eUxpc3RlbmVyLmdldCA9IGZ1bmN0aW9uIGRpc3BhdGNoaW5nR2V0dGVyKCkge1xuICAgICAgICAgICAgcmV0dXJuIGRpc3BhdGNoaW5nR2V0dGVyLm92ZXJyaWRkZW5EZXNjcmlwdG9yLnZhbHVlO1xuICAgICAgICB9O1xuICAgICAgICBwcm9wZXJ0eUxpc3RlbmVyLnNldCA9IGZ1bmN0aW9uIGRpc3BhdGNoaW5nU2V0dGVyKHZhbHVlKSB7XG4gICAgICAgICAgICB2YXIgZGVzY3JpcHRvcixcbiAgICAgICAgICAgICAgICBpc0FjdGl2ZSxcbiAgICAgICAgICAgICAgICBvdmVycmlkZGVuRGVzY3JpcHRvciA9IGRpc3BhdGNoaW5nU2V0dGVyLm92ZXJyaWRkZW5EZXNjcmlwdG9yO1xuXG4gICAgICAgICAgICBpZiAodmFsdWUgIT09IG92ZXJyaWRkZW5EZXNjcmlwdG9yLnZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCEoaXNBY3RpdmUgPSAoZGVzY3JpcHRvciA9IGRpc3BhdGNoaW5nU2V0dGVyLmRlc2NyaXB0b3IpLmlzQWN0aXZlKSkge1xuICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoaW5nU2V0dGVyLmRpc3BhdGNoRWFjaChkZXNjcmlwdG9yLl93aWxsQ2hhbmdlTGlzdGVuZXJzLCBkaXNwYXRjaGluZ1NldHRlci5rZXksIG92ZXJyaWRkZW5EZXNjcmlwdG9yLnZhbHVlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgfSBmaW5hbGx5IHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG92ZXJyaWRkZW5EZXNjcmlwdG9yLnZhbHVlID0gdmFsdWU7XG4gICAgICAgICAgICAgICAgaWYgKCFpc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2hpbmdTZXR0ZXIuZGlzcGF0Y2hFYWNoKGRlc2NyaXB0b3IuX2NoYW5nZUxpc3RlbmVycywgZGlzcGF0Y2hpbmdTZXR0ZXIua2V5LCB2YWx1ZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLmlzQWN0aXZlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICAgIHByb3BlcnR5TGlzdGVuZXIuc2V0LmRpc3BhdGNoRWFjaCA9IGRpc3BhdGNoRWFjaDtcbiAgICAgICAgcHJvcGVydHlMaXN0ZW5lci5zZXQua2V5ID0ga2V5O1xuICAgICAgICBwcm9wZXJ0eUxpc3RlbmVyLmdldC5vdmVycmlkZGVuRGVzY3JpcHRvciA9IHByb3BlcnR5TGlzdGVuZXIuc2V0Lm92ZXJyaWRkZW5EZXNjcmlwdG9yID0gb3ZlcnJpZGRlbkRlc2NyaXB0b3I7XG4gICAgICAgIHByb3BlcnR5TGlzdGVuZXIuc2V0LmRlc2NyaXB0b3IgPSBPYmplY3RzUHJvcGVydHlDaGFuZ2VMaXN0ZW5lcnMuZ2V0KHRoaXMpW2tleV07XG5cbiAgICAgICAgcHJvcGVydHlMaXN0ZW5lci5lbnVtZXJhYmxlID0gb3ZlcnJpZGRlbkRlc2NyaXB0b3IuZW51bWVyYWJsZTtcblxuICAgICAgICBwcm9wZXJ0eUxpc3RlbmVyLmNvbmZpZ3VyYWJsZSA9IHRydWVcblxuICAgIH0gZWxzZSB7IC8vICdnZXQnIG9yICdzZXQnLCBidXQgbm90IG5lY2Vzc2FyaWx5IGJvdGhcbiAgICAgICAgICAgIHByb3BlcnR5TGlzdGVuZXIuZ2V0ID0gb3ZlcnJpZGRlbkRlc2NyaXB0b3IuZ2V0O1xuICAgICAgICAgICAgcHJvcGVydHlMaXN0ZW5lci5zZXQgPSBmdW5jdGlvbiBkaXNwYXRjaGluZ1NldHRlcigpIHtcbiAgICAgICAgICAgICAgICB2YXIgZm9ybWVyVmFsdWUgPSBkaXNwYXRjaGluZ1NldHRlci5vdmVycmlkZGVuR2V0dGVyLmNhbGwodGhpcyksXG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IsXG4gICAgICAgICAgICAgICAgICAgIGlzQWN0aXZlLFxuICAgICAgICAgICAgICAgICAgICBuZXdWYWx1ZTtcblxuXG4gICAgICAgICAgICAgICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoaW5nU2V0dGVyLm92ZXJyaWRkZW5TZXR0ZXIuY2FsbCh0aGlzLGFyZ3VtZW50c1swXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaGluZ1NldHRlci5vdmVycmlkZGVuU2V0dGVyLmNhbGwodGhpcyxhcmd1bWVudHNbMF0sYXJndW1lbnRzWzFdKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc3BhdGNoaW5nU2V0dGVyLm92ZXJyaWRkZW5TZXR0ZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgaWYgKChuZXdWYWx1ZSA9IGRpc3BhdGNoaW5nU2V0dGVyLm92ZXJyaWRkZW5HZXR0ZXIuY2FsbCh0aGlzKSkgIT09IGZvcm1lclZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgIGRlc2NyaXB0b3IgPSBkaXNwYXRjaGluZ1NldHRlci5kZXNjcmlwdG9yO1xuICAgICAgICAgICAgICAgICAgICBpZiAoIShpc0FjdGl2ZSA9IGRlc2NyaXB0b3IuaXNBY3RpdmUpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkZXNjcmlwdG9yLmlzQWN0aXZlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGlzcGF0Y2hpbmdTZXR0ZXIuZGlzcGF0Y2hFYWNoKGRlc2NyaXB0b3IuX3dpbGxDaGFuZ2VMaXN0ZW5lcnMsIGtleSwgZm9ybWVyVmFsdWUsIHRoaXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBmaW5hbGx5IHt9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0FjdGl2ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXNwYXRjaGluZ1NldHRlci5kaXNwYXRjaEVhY2goZGVzY3JpcHRvci5fY2hhbmdlTGlzdGVuZXJzLCBrZXksIG5ld1ZhbHVlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZmluYWxseSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRvci5pc0FjdGl2ZSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHByb3BlcnR5TGlzdGVuZXIuZW51bWVyYWJsZSA9IG92ZXJyaWRkZW5EZXNjcmlwdG9yLmVudW1lcmFibGU7XG4gICAgICAgICAgICBwcm9wZXJ0eUxpc3RlbmVyLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICAgIHByb3BlcnR5TGlzdGVuZXIuc2V0LmRpc3BhdGNoRWFjaCA9IGRpc3BhdGNoRWFjaDtcbiAgICAgICAgcHJvcGVydHlMaXN0ZW5lci5zZXQub3ZlcnJpZGRlblNldHRlciA9IG92ZXJyaWRkZW5EZXNjcmlwdG9yLnNldDtcbiAgICAgICAgcHJvcGVydHlMaXN0ZW5lci5zZXQub3ZlcnJpZGRlbkdldHRlciA9IG92ZXJyaWRkZW5EZXNjcmlwdG9yLmdldDtcbiAgICAgICAgcHJvcGVydHlMaXN0ZW5lci5zZXQuZGVzY3JpcHRvciA9IE9iamVjdHNQcm9wZXJ0eUNoYW5nZUxpc3RlbmVycy5nZXQodGhpcylba2V5XTtcbiAgICB9XG5cbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcywga2V5LCBwcm9wZXJ0eUxpc3RlbmVyKTtcbn07XG5cbi8vIGNvbnN0cnVjdG9yIGZ1bmN0aW9uc1xuXG5Qcm9wZXJ0eUNoYW5nZXMuZ2V0T3duUHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yID0gZnVuY3Rpb24gKG9iamVjdCwga2V5KSB7XG4gICAgaWYgKG9iamVjdC5nZXRPd25Qcm9wZXJ0eUNoYW5nZURlc2NyaXB0b3IpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdC5nZXRPd25Qcm9wZXJ0eUNoYW5nZURlc2NyaXB0b3Ioa2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvcGVydHlDaGFuZ2VzLnByb3RvdHlwZS5nZXRPd25Qcm9wZXJ0eUNoYW5nZURlc2NyaXB0b3IuY2FsbChvYmplY3QsIGtleSk7XG4gICAgfVxufTtcblxuUHJvcGVydHlDaGFuZ2VzLmhhc093blByb3BlcnR5Q2hhbmdlRGVzY3JpcHRvciA9IGZ1bmN0aW9uIChvYmplY3QsIGtleSkge1xuICAgIGlmIChvYmplY3QuaGFzT3duUHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QuaGFzT3duUHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yKGtleSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb3BlcnR5Q2hhbmdlcy5wcm90b3R5cGUuaGFzT3duUHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yLmNhbGwob2JqZWN0LCBrZXkpO1xuICAgIH1cbn07XG5cblByb3BlcnR5Q2hhbmdlcy5hZGRPd25Qcm9wZXJ0eUNoYW5nZUxpc3RlbmVyID0gZnVuY3Rpb24gKG9iamVjdCwga2V5LCBsaXN0ZW5lciwgYmVmb3JlQ2hhbmdlKSB7XG4gICAgaWYgKE9iamVjdC5pc09iamVjdChvYmplY3QpKSB7XG4gICAgICAgIHJldHVybiBvYmplY3QuYWRkT3duUHJvcGVydHlDaGFuZ2VMaXN0ZW5lclxuICAgICAgICAgICAgPyBvYmplY3QuYWRkT3duUHJvcGVydHlDaGFuZ2VMaXN0ZW5lcihrZXksIGxpc3RlbmVyLCBiZWZvcmVDaGFuZ2UpXG4gICAgICAgICAgICA6IHRoaXMucHJvdG90eXBlLmFkZE93blByb3BlcnR5Q2hhbmdlTGlzdGVuZXIuY2FsbChvYmplY3QsIGtleSwgbGlzdGVuZXIsIGJlZm9yZUNoYW5nZSk7XG4gICAgfVxufTtcblxuUHJvcGVydHlDaGFuZ2VzLnJlbW92ZU93blByb3BlcnR5Q2hhbmdlTGlzdGVuZXIgPSBmdW5jdGlvbiAob2JqZWN0LCBrZXksIGxpc3RlbmVyLCBiZWZvcmVDaGFuZ2UpIHtcbiAgICBpZiAoIU9iamVjdC5pc09iamVjdChvYmplY3QpKSB7XG4gICAgfSBlbHNlIGlmIChvYmplY3QucmVtb3ZlT3duUHJvcGVydHlDaGFuZ2VMaXN0ZW5lcikge1xuICAgICAgICByZXR1cm4gb2JqZWN0LnJlbW92ZU93blByb3BlcnR5Q2hhbmdlTGlzdGVuZXIoa2V5LCBsaXN0ZW5lciwgYmVmb3JlQ2hhbmdlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvcGVydHlDaGFuZ2VzLnByb3RvdHlwZS5yZW1vdmVPd25Qcm9wZXJ0eUNoYW5nZUxpc3RlbmVyLmNhbGwob2JqZWN0LCBrZXksIGxpc3RlbmVyLCBiZWZvcmVDaGFuZ2UpO1xuICAgIH1cbn07XG5cblByb3BlcnR5Q2hhbmdlcy5kaXNwYXRjaE93blByb3BlcnR5Q2hhbmdlID0gZnVuY3Rpb24gKG9iamVjdCwga2V5LCB2YWx1ZSwgYmVmb3JlQ2hhbmdlKSB7XG4gICAgaWYgKCFPYmplY3QuaXNPYmplY3Qob2JqZWN0KSkge1xuICAgIH0gZWxzZSBpZiAob2JqZWN0LmRpc3BhdGNoT3duUHJvcGVydHlDaGFuZ2UpIHtcbiAgICAgICAgcmV0dXJuIG9iamVjdC5kaXNwYXRjaE93blByb3BlcnR5Q2hhbmdlKGtleSwgdmFsdWUsIGJlZm9yZUNoYW5nZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFByb3BlcnR5Q2hhbmdlcy5wcm90b3R5cGUuZGlzcGF0Y2hPd25Qcm9wZXJ0eUNoYW5nZS5jYWxsKG9iamVjdCwga2V5LCB2YWx1ZSwgYmVmb3JlQ2hhbmdlKTtcbiAgICB9XG59O1xuXG5Qcm9wZXJ0eUNoYW5nZXMuYWRkQmVmb3JlT3duUHJvcGVydHlDaGFuZ2VMaXN0ZW5lciA9IGZ1bmN0aW9uIChvYmplY3QsIGtleSwgbGlzdGVuZXIpIHtcbiAgICByZXR1cm4gUHJvcGVydHlDaGFuZ2VzLmFkZE93blByb3BlcnR5Q2hhbmdlTGlzdGVuZXIob2JqZWN0LCBrZXksIGxpc3RlbmVyLCB0cnVlKTtcbn07XG5cblByb3BlcnR5Q2hhbmdlcy5yZW1vdmVCZWZvcmVPd25Qcm9wZXJ0eUNoYW5nZUxpc3RlbmVyID0gZnVuY3Rpb24gKG9iamVjdCwga2V5LCBsaXN0ZW5lcikge1xuICAgIHJldHVybiBQcm9wZXJ0eUNoYW5nZXMucmVtb3ZlT3duUHJvcGVydHlDaGFuZ2VMaXN0ZW5lcihvYmplY3QsIGtleSwgbGlzdGVuZXIsIHRydWUpO1xufTtcblxuUHJvcGVydHlDaGFuZ2VzLmRpc3BhdGNoQmVmb3JlT3duUHJvcGVydHlDaGFuZ2UgPSBmdW5jdGlvbiAob2JqZWN0LCBrZXksIHZhbHVlKSB7XG4gICAgcmV0dXJuIFByb3BlcnR5Q2hhbmdlcy5kaXNwYXRjaE93blByb3BlcnR5Q2hhbmdlKG9iamVjdCwga2V5LCB2YWx1ZSwgdHJ1ZSk7XG59O1xuXG5Qcm9wZXJ0eUNoYW5nZXMubWFrZVByb3BlcnR5T2JzZXJ2YWJsZSA9IGZ1bmN0aW9uIChvYmplY3QsIGtleSkge1xuICAgIGlmIChvYmplY3QubWFrZVByb3BlcnR5T2JzZXJ2YWJsZSkge1xuICAgICAgICByZXR1cm4gb2JqZWN0Lm1ha2VQcm9wZXJ0eU9ic2VydmFibGUoa2V5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvcGVydHlDaGFuZ2VzLnByb3RvdHlwZS5tYWtlUHJvcGVydHlPYnNlcnZhYmxlLmNhbGwob2JqZWN0LCBrZXkpO1xuICAgIH1cbn07XG4iXX0=