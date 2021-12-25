"use strict";
/*
    Copyright (c) 2016, Montage Studio Inc. All Rights Reserved.
    3-Clause BSD License
    https://github.com/montagejs/montage/blob/master/LICENSE.md
*/
var Map = require("../_map");
var ObjectChangeDescriptor = module.exports.ObjectChangeDescriptor = function ObjectChangeDescriptor(name) {
    this.name = name;
    this.isActive = false;
    this._willChangeListeners = null;
    this._changeListeners = null;
    return this;
};
Object.defineProperties(ObjectChangeDescriptor.prototype, {
    name: {
        value: null,
        writable: true
    },
    isActive: {
        value: false,
        writable: true
    },
    _willChangeListeners: {
        value: null,
        writable: true
    },
    willChangeListeners: {
        get: function () {
            return this._willChangeListeners || (this._willChangeListeners = new this.willChangeListenersRecordConstructor(this.name));
        }
    },
    _changeListeners: {
        value: null,
        writable: true
    },
    changeListeners: {
        get: function () {
            return this._changeListeners || (this._changeListeners = new this.changeListenersRecordConstructor(this.name));
        }
    },
    changeListenersRecordConstructor: {
        value: ChangeListenersRecord,
        writable: true
    },
    willChangeListenersRecordConstructor: {
        value: WillChangeListenersRecord,
        writable: true
    }
});
var ListenerGhost = module.exports.ListenerGhost = Object.create(null);
var ChangeListenerSpecificHandlerMethodName = new Map();
module.exports.ChangeListenersRecord = ChangeListenersRecord;
function ChangeListenersRecord(name) {
    var specificHandlerMethodName = ChangeListenerSpecificHandlerMethodName.get(name);
    if (!specificHandlerMethodName) {
        specificHandlerMethodName = "handle";
        specificHandlerMethodName += name;
        specificHandlerMethodName += "Change";
        ChangeListenerSpecificHandlerMethodName.set(name, specificHandlerMethodName);
    }
    this._current = null;
    this._current = null;
    this.specificHandlerMethodName = specificHandlerMethodName;
    return this;
}
Object.defineProperties(ChangeListenersRecord.prototype, {
    _current: {
        value: null,
        writable: true
    },
    current: {
        get: function () {
            // if(this._current) {
            //     console.log(this.constructor.name," with ",this._current.length," listeners: ", this._current);
            // }
            return this._current;
            //return this._current || (this._current = []);
        },
        set: function (value) {
            this._current = value;
        }
    },
    ListenerGhost: {
        value: ListenerGhost,
        writable: true
    },
    ghostCount: {
        value: 0,
        writable: true
    },
    maxListenerGhostRatio: {
        value: 0.3,
        writable: true
    },
    listenerGhostFilter: {
        value: function listenerGhostFilter(value) {
            return value !== this.ListenerGhost;
        }
    },
    removeCurrentGostListenersIfNeeded: {
        value: function () {
            if (this._current && this.ghostCount / this._current.length > this.maxListenerGhostRatio) {
                this.ghostCount = 0;
                this._current = this._current.filter(this.listenerGhostFilter, this);
            }
            return this._current;
        }
    },
    dispatchBeforeChange: {
        value: false,
        writable: true
    },
    genericHandlerMethodName: {
        value: "handlePropertyChange",
        writable: true
    }
});
module.exports.WillChangeListenersRecord = WillChangeListenersRecord;
var WillChangeListenerSpecificHandlerMethodName = new Map();
function WillChangeListenersRecord(name) {
    var specificHandlerMethodName = WillChangeListenerSpecificHandlerMethodName.get(name);
    if (!specificHandlerMethodName) {
        specificHandlerMethodName = "handle";
        specificHandlerMethodName += name;
        specificHandlerMethodName += "WillChange";
        WillChangeListenerSpecificHandlerMethodName.set(name, specificHandlerMethodName);
    }
    this.specificHandlerMethodName = specificHandlerMethodName;
    return this;
}
WillChangeListenersRecord.prototype = new ChangeListenersRecord();
WillChangeListenersRecord.prototype.constructor = WillChangeListenersRecord;
WillChangeListenersRecord.prototype.genericHandlerMethodName = "handlePropertyWillChange";
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hhbmdlLWRlc2NyaXB0b3IuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2pzLXByb3RvdHlwZXMvcGFja2FnZXMvY29sbGVjdGlvbnMvbGlzdGVuL2NoYW5nZS1kZXNjcmlwdG9yLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTs7OztFQUlFO0FBRUYsSUFBSSxHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBRTdCLElBQUksc0JBQXNCLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxzQkFBc0IsR0FBRyxTQUFTLHNCQUFzQixDQUFDLElBQUk7SUFDckcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7SUFDakIsSUFBSSxDQUFDLFFBQVEsR0FBRyxLQUFLLENBQUM7SUFDdEIsSUFBSSxDQUFDLG9CQUFvQixHQUFHLElBQUksQ0FBQztJQUNqQyxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO0lBQ2hDLE9BQU8sSUFBSSxDQUFDO0FBQ2IsQ0FBQyxDQUFBO0FBRUQsTUFBTSxDQUFDLGdCQUFnQixDQUFDLHNCQUFzQixDQUFDLFNBQVMsRUFBQztJQUNyRCxJQUFJLEVBQUU7UUFDUixLQUFLLEVBQUMsSUFBSTtRQUNWLFFBQVEsRUFBRSxJQUFJO0tBQ2Q7SUFDRSxRQUFRLEVBQUU7UUFDWixLQUFLLEVBQUMsS0FBSztRQUNYLFFBQVEsRUFBRSxJQUFJO0tBQ2Q7SUFDRCxvQkFBb0IsRUFBRTtRQUNyQixLQUFLLEVBQUMsSUFBSTtRQUNWLFFBQVEsRUFBRSxJQUFJO0tBQ2Q7SUFDRCxtQkFBbUIsRUFBRTtRQUNwQixHQUFHLEVBQUU7WUFDSixPQUFPLElBQUksQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxJQUFJLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUM1SCxDQUFDO0tBQ0Q7SUFDRCxnQkFBZ0Is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LElBQUksQ0FBQyxDQUFDO2FBQ3ZFO1lBQ0QsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3pCLENBQUM7S0FDSjtJQUNELG9CQUFvQixFQUFFO1FBQ2xCLEtBQUssRUFBRSxLQUFLO1FBQ1osUUFBUSxFQUFFLElBQUk7S0FDakI7SUFDRCx3QkFBd0IsRUFBRTtRQUM1QixLQUFLLEVBQUUsc0JBQXNCO1FBQ3ZCLFFBQVEsRUFBRSxJQUFJO0tBQ3BCO0NBQ0QsQ0FBQyxDQUFDO0FBRUgsTUFBTSxDQUFDLE9BQU8sQ0FBQyx5QkFBeUIsR0FBRyx5QkFBeUIsQ0FBQztBQUNyRSxJQUFJLDJDQUEyQyxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDNUQsU0FBUyx5QkFBeUIsQ0FBQyxJQUFJO0lBQ25DLElBQUkseUJBQXlCLEdBQUcsMkNBQTJDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3RGLElBQUcsQ0FBQyx5QkFBeUIsRUFBRTtRQUMzQix5QkFBeUIsR0FBRyxRQUFRLENBQUM7UUFDckMseUJBQXlCLElBQUksSUFBSSxDQUFDO1FBQ2xDLHlCQUF5QixJQUFJLFlBQVksQ0FBQztRQUMxQywyQ0FBMkMsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFDLHlCQUF5QixDQUFDLENBQUM7S0FDbkY7SUFDRCxJQUFJLENBQUMseUJBQXlCLEdBQUcseUJBQXlCLENBQUM7SUFDOUQsT0FBTyxJQUFJLENBQUM7QUFDYixDQUFDO0FBQ0QseUJBQXlCLENBQUMsU0FBUyxHQUFHLElBQUkscUJBQXFCLEVBQUUsQ0FBQztBQUNsRSx5QkFBeUIsQ0FBQyxTQUFTLENBQUMsV0FBVyxHQUFHLHlCQUF5QixDQUFDO0FBQzVFLHlCQUF5QixDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsR0FBRywwQkFBMEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG4gICAgQ29weXJpZ2h0IChjKSAyMDE2LCBNb250YWdlIFN0dWRpbyBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gICAgMy1DbGF1c2UgQlNEIExpY2Vuc2VcbiAgICBodHRwczovL2dpdGh1Yi5jb20vbW9udGFnZWpzL21vbnRhZ2UvYmxvYi9tYXN0ZXIvTElDRU5TRS5tZFxuKi9cblxudmFyIE1hcCA9IHJlcXVpcmUoXCIuLi9fbWFwXCIpO1xuXG52YXIgT2JqZWN0Q2hhbmdlRGVzY3JpcHRvciA9IG1vZHVsZS5leHBvcnRzLk9iamVjdENoYW5nZURlc2NyaXB0b3IgPSBmdW5jdGlvbiBPYmplY3RDaGFuZ2VEZXNjcmlwdG9yKG5hbWUpIHtcbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMuaXNBY3RpdmUgPSBmYWxzZTtcbiAgICB0aGlzLl93aWxsQ2hhbmdlTGlzdGVuZXJzID0gbnVsbDtcbiAgICB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMgPSBudWxsO1xuXHRyZXR1cm4gdGhpcztcbn1cblxuT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoT2JqZWN0Q2hhbmdlRGVzY3JpcHRvci5wcm90b3R5cGUse1xuICAgIG5hbWU6IHtcblx0XHR2YWx1ZTpudWxsLFxuXHRcdHdyaXRhYmxlOiB0cnVlXG5cdH0sXG4gICAgaXNBY3RpdmU6IHtcblx0XHR2YWx1ZTpmYWxzZSxcblx0XHR3cml0YWJsZTogdHJ1ZVxuXHR9LFxuXHRfd2lsbENoYW5nZUxpc3RlbmVyczoge1xuXHRcdHZhbHVlOm51bGwsXG5cdFx0d3JpdGFibGU6IHRydWVcblx0fSxcblx0d2lsbENoYW5nZUxpc3RlbmVyczoge1xuXHRcdGdldDogZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gdGhpcy5fd2lsbENoYW5nZUxpc3RlbmVycyB8fCAodGhpcy5fd2lsbENoYW5nZUxpc3RlbmVycyA9IG5ldyB0aGlzLndpbGxDaGFuZ2VMaXN0ZW5lcnNSZWNvcmRDb25zdHJ1Y3Rvcih0aGlzLm5hbWUpKTtcblx0XHR9XG5cdH0sXG5cdF9jaGFuZ2VMaXN0ZW5lcnM6IHtcblx0XHR2YWx1ZTpudWxsLFxuXHRcdHdyaXRhYmxlOiB0cnVlXG5cdH0sXG4gICAgY2hhbmdlTGlzdGVuZXJzOiB7XG5cdFx0Z2V0OiBmdW5jdGlvbigpIHtcblx0XHRcdHJldHVybiB0aGlzLl9jaGFuZ2VMaXN0ZW5lcnMgfHwgKHRoaXMuX2NoYW5nZUxpc3RlbmVycyA9IG5ldyB0aGlzLmNoYW5nZUxpc3RlbmVyc1JlY29yZENvbnN0cnVjdG9yKHRoaXMubmFtZSkpO1xuXHRcdH1cblx0fSxcbiAgICBjaGFuZ2VMaXN0ZW5lcnNSZWNvcmRDb25zdHJ1Y3Rvcjoge1xuICAgICAgICB2YWx1ZTogQ2hhbmdlTGlzdGVuZXJzUmVjb3JkLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgd2lsbENoYW5nZUxpc3RlbmVyc1JlY29yZENvbnN0cnVjdG9yOiB7XG4gICAgICAgIHZhbHVlOiBXaWxsQ2hhbmdlTGlzdGVuZXJzUmVjb3JkLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH1cblxufSk7XG5cbnZhciBMaXN0ZW5lckdob3N0ID0gbW9kdWxlLmV4cG9ydHMuTGlzdGVuZXJHaG9zdCA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG52YXIgQ2hhbmdlTGlzdGVuZXJTcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lID0gbmV3IE1hcCgpO1xuXG4gbW9kdWxlLmV4cG9ydHMuQ2hhbmdlTGlzdGVuZXJzUmVjb3JkID0gQ2hhbmdlTGlzdGVuZXJzUmVjb3JkO1xuZnVuY3Rpb24gQ2hhbmdlTGlzdGVuZXJzUmVjb3JkKG5hbWUpIHtcbiAgICB2YXIgc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSA9IENoYW5nZUxpc3RlbmVyU3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZS5nZXQobmFtZSk7XG4gICAgaWYoIXNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUpIHtcbiAgICAgICAgc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSA9IFwiaGFuZGxlXCI7XG4gICAgICAgIHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUgKz0gbmFtZTtcbiAgICAgICAgc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSArPSBcIkNoYW5nZVwiO1xuICAgICAgICBDaGFuZ2VMaXN0ZW5lclNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUuc2V0KG5hbWUsc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSk7XG4gICAgfVxuICAgIHRoaXMuX2N1cnJlbnQgPSBudWxsO1xuICAgIHRoaXMuX2N1cnJlbnQgPSBudWxsO1xuICAgIHRoaXMuc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSA9IHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWU7XG4gICAgcmV0dXJuIHRoaXM7XG59XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKENoYW5nZUxpc3RlbmVyc1JlY29yZC5wcm90b3R5cGUse1xuICAgIF9jdXJyZW50OiB7XG5cdFx0dmFsdWU6IG51bGwsXG5cdFx0d3JpdGFibGU6IHRydWVcblx0fSxcblx0Y3VycmVudDoge1xuXHRcdGdldDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyBpZih0aGlzLl9jdXJyZW50KSB7XG4gICAgICAgICAgICAvLyAgICAgY29uc29sZS5sb2codGhpcy5jb25zdHJ1Y3Rvci5uYW1lLFwiIHdpdGggXCIsdGhpcy5fY3VycmVudC5sZW5ndGgsXCIgbGlzdGVuZXJzOiBcIiwgdGhpcy5fY3VycmVudCk7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudDtcbiAgICAgICAgICAgIC8vcmV0dXJuIHRoaXMuX2N1cnJlbnQgfHwgKHRoaXMuX2N1cnJlbnQgPSBbXSk7XG5cdFx0fSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5fY3VycmVudCA9IHZhbHVlO1xuICAgICAgICB9XG5cdH0sXG4gICAgTGlzdGVuZXJHaG9zdDoge1xuICAgICAgICB2YWx1ZTpMaXN0ZW5lckdob3N0LFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgZ2hvc3RDb3VudDoge1xuICAgICAgICB2YWx1ZTowLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgbWF4TGlzdGVuZXJHaG9zdFJhdGlvOiB7XG4gICAgICAgIHZhbHVlOjAuMyxcbiAgICAgICAgd3JpdGFibGU6IHRydWVcbiAgICB9LFxuICAgIGxpc3RlbmVyR2hvc3RGaWx0ZXI6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIGxpc3RlbmVyR2hvc3RGaWx0ZXIodmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWUgIT09IHRoaXMuTGlzdGVuZXJHaG9zdDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHJlbW92ZUN1cnJlbnRHb3N0TGlzdGVuZXJzSWZOZWVkZWQ6IHtcbiAgICAgICAgdmFsdWU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYodGhpcy5fY3VycmVudCAmJiB0aGlzLmdob3N0Q291bnQvdGhpcy5fY3VycmVudC5sZW5ndGg+dGhpcy5tYXhMaXN0ZW5lckdob3N0UmF0aW8pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdob3N0Q291bnQgPSAwO1xuICAgICAgICAgICAgICAgIHRoaXMuX2N1cnJlbnQgPSB0aGlzLl9jdXJyZW50LmZpbHRlcih0aGlzLmxpc3RlbmVyR2hvc3RGaWx0ZXIsdGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fY3VycmVudDtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZGlzcGF0Y2hCZWZvcmVDaGFuZ2U6IHtcbiAgICAgICAgdmFsdWU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgIH0sXG4gICAgZ2VuZXJpY0hhbmRsZXJNZXRob2ROYW1lOiB7XG5cdFx0dmFsdWU6IFwiaGFuZGxlUHJvcGVydHlDaGFuZ2VcIixcbiAgICAgICAgd3JpdGFibGU6IHRydWVcblx0fVxufSk7XG5cbm1vZHVsZS5leHBvcnRzLldpbGxDaGFuZ2VMaXN0ZW5lcnNSZWNvcmQgPSBXaWxsQ2hhbmdlTGlzdGVuZXJzUmVjb3JkO1xudmFyIFdpbGxDaGFuZ2VMaXN0ZW5lclNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUgPSBuZXcgTWFwKCk7XG5mdW5jdGlvbiBXaWxsQ2hhbmdlTGlzdGVuZXJzUmVjb3JkKG5hbWUpIHtcbiAgICB2YXIgc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSA9IFdpbGxDaGFuZ2VMaXN0ZW5lclNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUuZ2V0KG5hbWUpO1xuICAgIGlmKCFzcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lKSB7XG4gICAgICAgIHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUgPSBcImhhbmRsZVwiO1xuICAgICAgICBzcGVjaWZpY0hhbmRsZXJNZXRob2ROYW1lICs9IG5hbWU7XG4gICAgICAgIHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUgKz0gXCJXaWxsQ2hhbmdlXCI7XG4gICAgICAgIFdpbGxDaGFuZ2VMaXN0ZW5lclNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWUuc2V0KG5hbWUsc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSk7XG4gICAgfVxuICAgIHRoaXMuc3BlY2lmaWNIYW5kbGVyTWV0aG9kTmFtZSA9IHNwZWNpZmljSGFuZGxlck1ldGhvZE5hbWU7XG5cdHJldHVybiB0aGlzO1xufVxuV2lsbENoYW5nZUxpc3RlbmVyc1JlY29yZC5wcm90b3R5cGUgPSBuZXcgQ2hhbmdlTGlzdGVuZXJzUmVjb3JkKCk7XG5XaWxsQ2hhbmdlTGlzdGVuZXJzUmVjb3JkLnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFdpbGxDaGFuZ2VMaXN0ZW5lcnNSZWNvcmQ7XG5XaWxsQ2hhbmdlTGlzdGVuZXJzUmVjb3JkLnByb3RvdHlwZS5nZW5lcmljSGFuZGxlck1ldGhvZE5hbWUgPSBcImhhbmRsZVByb3BlcnR5V2lsbENoYW5nZVwiO1xuIl19