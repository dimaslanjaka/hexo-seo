"use strict";
require("collections/listen/array-changes");
var describeRangeChanges = require("./range-changes");
describe("Array change dispatch", function () {
    // TODO (make consistent with List)
    // describeRangeChanges(Array.from);
    var array = [1, 2, 3];
    var spy;
    // the following tests all share the same initial array so they
    // are sensitive to changes in order
    it("set up listeners", function () {
        array.addBeforeOwnPropertyChangeListener("length", function (length) {
            spy("length change from", length);
        });
        array.addOwnPropertyChangeListener("length", function (length) {
            spy("length change to", length);
        });
        array.addBeforeRangeChangeListener(function (plus, minus, index) {
            spy("before content change at", index, "to add", plus.slice(), "to remove", minus.slice());
        });
        array.addRangeChangeListener(function (plus, minus, index) {
            spy("content change at", index, "added", plus.slice(), "removed", minus.slice());
        });
        array.addBeforeMapChangeListener(function (value, key) {
            spy("change at", key, "from", value);
        });
        array.addMapChangeListener(function (value, key) {
            spy("change at", key, "to", value);
        });
    });
    it("change dispatch properties should not be enumerable", function () {
        // this verifies that dispatchesRangeChanges and dispatchesMapChanges
        // are both non-enumerable, and any other properties that might get
        // added in the future.
        for (var name in array) {
            expect(isNaN(+name)).toBe(false);
        }
    });
    it("clear initial values", function () {
        spy = jasmine.createSpy();
        expect(array).toEqual([1, 2, 3]);
        array.clear();
        expect(array).toEqual([]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["length change from", 3],
            ["before content change at", 0, "to add", [], "to remove", [1, 2, 3]],
            ["change at", 0, "from", 1],
            ["change at", 1, "from", 2],
            ["change at", 2, "from", 3],
            ["change at", 0, "to", undefined],
            ["change at", 1, "to", undefined],
            ["change at", 2, "to", undefined],
            ["content change at", 0, "added", [], "removed", [1, 2, 3]],
            ["length change to", 0]
        ]);
    });
    it("push two values on empty array", function () {
        spy = jasmine.createSpy();
        expect(array).toEqual([]); // initial
        array.push(10, 20);
        expect(array).toEqual([10, 20]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["length change from", 0],
            ["before content change at", 0, "to add", [10, 20], "to remove", []],
            ["change at", 0, "from", undefined],
            ["change at", 1, "from", undefined],
            ["change at", 0, "to", 10],
            ["change at", 1, "to", 20],
            ["content change at", 0, "added", [10, 20], "removed", []],
            ["length change to", 2],
        ]);
    });
    it("pop one value", function () {
        spy = jasmine.createSpy();
        expect(array).toEqual([10, 20]);
        array.pop();
        expect(array).toEqual([10]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["length change from", 2],
            ["before content change at", 1, "to add", [], "to remove", [20]],
            ["change at", 1, "from", 20],
            ["change at", 1, "to", undefined],
            ["content change at", 1, "added", [], "removed", [20]],
            ["length change to", 1],
        ]);
    });
    it("push two values on top of existing one, with hole open for splice", function () {
        spy = jasmine.createSpy();
        expect(array).toEqual([10]);
        array.push(40, 50);
        expect(array).toEqual([10, 40, 50]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["length change from", 1],
            ["before content change at", 1, "to add", [40, 50], "to remove", []],
            ["change at", 1, "from", undefined],
            ["change at", 2, "from", undefined],
            ["change at", 1, "to", 40],
            ["change at", 2, "to", 50],
            ["content change at", 1, "added", [40, 50], "removed", []],
            ["length change to", 3]
        ]);
    });
    it("splices two values into middle", function () {
        spy = jasmine.createSpy();
        expect(array).toEqual([10, 40, 50]);
        expect(array.splice(1, 0, 20, 30)).toEqual([]);
        expect(array).toEqual([10, 20, 30, 40, 50]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["length change from", 3],
            ["before content change at", 1, "to add", [20, 30], "to remove", []],
            ["change at", 1, "from", 40],
            ["change at", 2, "from", 50],
            ["change at", 3, "from", undefined],
            ["change at", 4, "from", undefined],
            ["change at", 1, "to", 20],
            ["change at", 2, "to", 30],
            ["change at", 3, "to", 40],
            ["change at", 4, "to", 50],
            ["content change at", 1, "added", [20, 30], "removed", []],
            ["length change to", 5]
        ]);
    });
    it("pushes one value to end", function () {
        spy = jasmine.createSpy();
        expect(array).toEqual([10, 20, 30, 40, 50]);
        array.push(60);
        expect(array).toEqual([10, 20, 30, 40, 50, 60]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["length change from", 5],
            ["before content change at", 5, "to add", [60], "to remove", []],
            ["change at", 5, "from", undefined],
            ["change at", 5, "to", 60],
            ["content change at", 5, "added", [60], "removed", []],
            ["length change to", 6]
        ]);
    });
    it("splices in place", function () {
        spy = jasmine.createSpy();
        expect(array).toEqual([10, 20, 30, 40, 50, 60]);
        expect(array.splice(2, 2, "A", "B")).toEqual([30, 40]);
        expect(array).toEqual([10, 20, "A", "B", 50, 60]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            // no length change
            ["before content change at", 2, "to add", ["A", "B"], "to remove", [30, 40]],
            ["change at", 2, "from", 30],
            ["change at", 3, "from", 40],
            ["change at", 2, "to", "A"],
            ["change at", 3, "to", "B"],
            ["content change at", 2, "added", ["A", "B"], "removed", [30, 40]],
        ]);
    });
    // ---- fresh start
    it("shifts one from the beginning", function () {
        array.clear(); // start over fresh
        array.push(10, 20, 30);
        spy = jasmine.createSpy();
        expect(array).toEqual([10, 20, 30]);
        expect(array.shift()).toEqual(10);
        expect(array).toEqual([20, 30]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["length change from", 3],
            ["before content change at", 0, "to add", [], "to remove", [10]],
            ["change at", 0, "from", 10],
            ["change at", 1, "from", 20],
            ["change at", 2, "from", 30],
            ["change at", 0, "to", 20],
            ["change at", 1, "to", 30],
            ["change at", 2, "to", undefined],
            ["content change at", 0, "added", [], "removed", [10]],
            ["length change to", 2]
        ]);
    });
    it("sets new value at end", function () {
        spy = jasmine.createSpy();
        expect(array).toEqual([20, 30]);
        expect(array.set(2, 40)).toBe(true);
        expect(array).toEqual([20, 30, 40]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["length change from", 2],
            ["before content change at", 2, "to add", [40], "to remove", []],
            ["change at", 2, "from", undefined],
            ["change at", 2, "to", 40],
            ["content change at", 2, "added", [40], "removed", []],
            ["length change to", 3]
        ]);
    });
    it("sets new value at beginning", function () {
        spy = jasmine.createSpy();
        expect(array).toEqual([20, 30, 40]);
        expect(array.set(0, 10)).toBe(true);
        expect(array).toEqual([10, 30, 40]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["before content change at", 0, "to add", [10], "to remove", [20]],
            ["change at", 0, "from", 20],
            ["change at", 0, "to", 10],
            ["content change at", 0, "added", [10], "removed", [20]]
        ]);
    });
    it("splices two values outside the array range", function () {
        array.clear();
        array.push(10, 20, 30);
        spy = jasmine.createSpy();
        expect(array).toEqual([10, 20, 30]);
        expect(array.splice(4, 0, 50)).toEqual([]);
        expect(array).toEqual([10, 20, 30, 50]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["length change from", 3],
            ["before content change at", 3, "to add", [50], "to remove", []],
            ["change at", 3, "from", undefined],
            ["change at", 3, "to", 50],
            ["content change at", 3, "added", [50], "removed", []],
            ["length change to", 4]
        ]);
    });
    // ---- fresh start
    it("unshifts one to the beginning", function () {
        array.clear(); // start over fresh
        expect(array).toEqual([]);
        spy = jasmine.createSpy();
        array.unshift(30);
        expect(array).toEqual([30]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["length change from", 0],
            ["before content change at", 0, "to add", [30], "to remove", []],
            ["change at", 0, "from", undefined],
            ["change at", 0, "to", 30],
            ["content change at", 0, "added", [30], "removed", []],
            ["length change to", 1]
        ]);
    });
    it("unshifts two values on beginning of already populated array", function () {
        spy = jasmine.createSpy();
        expect(array).toEqual([30]);
        array.unshift(10, 20);
        expect(array).toEqual([10, 20, 30]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["length change from", 1],
            // added and removed values reflect the ending values, not the values at the time of the call
            ["before content change at", 0, "to add", [10, 20], "to remove", []],
            ["change at", 0, "from", 30],
            ["change at", 1, "from", undefined],
            ["change at", 2, "from", undefined],
            ["change at", 0, "to", 10],
            ["change at", 1, "to", 20],
            ["change at", 2, "to", 30],
            ["content change at", 0, "added", [10, 20], "removed", []],
            ["length change to", 3]
        ]);
    });
    it("reverses in place", function () {
        spy = jasmine.createSpy();
        expect(array).toEqual([10, 20, 30]);
        array.reverse();
        expect(array).toEqual([30, 20, 10]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["before content change at", 0, "to add", [30, 20, 10], "to remove", [10, 20, 30]],
            ["change at", 0, "from", 10],
            ["change at", 1, "from", 20],
            ["change at", 2, "from", 30],
            ["change at", 0, "to", 30],
            ["change at", 1, "to", 20],
            ["change at", 2, "to", 10],
            ["content change at", 0, "added", [30, 20, 10], "removed", [10, 20, 30]],
        ]);
    });
    it("sorts in place", function () {
        spy = jasmine.createSpy();
        expect(array).toEqual([30, 20, 10]);
        array.sort();
        expect(array).toEqual([10, 20, 30]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            // added and removed values reflect the ending values, not the values at the time of the call
            ["before content change at", 0, "to add", [30, 20, 10], "to remove", [30, 20, 10]],
            ["change at", 0, "from", 30],
            ["change at", 1, "from", 20],
            ["change at", 2, "from", 10],
            ["change at", 0, "to", 10],
            ["change at", 1, "to", 20],
            ["change at", 2, "to", 30],
            ["content change at", 0, "added", [10, 20, 30], "removed", [10, 20, 30]],
        ]);
    });
    it("deletes one value", function () {
        spy = jasmine.createSpy();
        expect(array).toEqual([10, 20, 30]);
        expect(array.delete(40)).toBe(false); // to exercise deletion of non-existing entry
        expect(array.delete(20)).toBe(true);
        expect(array).toEqual([10, 30]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["length change from", 3],
            ["before content change at", 1, "to add", [], "to remove", [20]],
            ["change at", 1, "from", 20],
            ["change at", 2, "from", 30],
            ["change at", 1, "to", 30],
            ["change at", 2, "to", undefined],
            ["content change at", 1, "added", [], "removed", [20]],
            ["length change to", 2]
        ]);
    });
    it("sets a value outside the existing range", function () {
        expect(array).toEqual([10, 30]);
        spy = jasmine.createSpy();
        expect(array.set(3, 40)).toBe(true);
        expect(array).toEqual([10, 30, , 40]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["length change from", 2],
            ["before content change at", 2, "to add", [, 40], "to remove", []],
            ["change at", 2, "from", undefined],
            ["change at", 3, "from", undefined],
            ["change at", 2, "to", undefined],
            ["change at", 3, "to", 40],
            ["content change at", 2, "added", [, 40], "removed", []],
            ["length change to", 4]
        ]);
        array.pop();
        array.pop();
    });
    it("clears all values finally", function () {
        spy = jasmine.createSpy();
        expect(array).toEqual([10, 30]);
        array.clear();
        expect(array).toEqual([]);
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            ["length change from", 2],
            ["before content change at", 0, "to add", [], "to remove", [10, 30]],
            ["change at", 0, "from", 10],
            ["change at", 1, "from", 30],
            ["change at", 0, "to", undefined],
            ["change at", 1, "to", undefined],
            ["content change at", 0, "added", [], "removed", [10, 30]],
            ["length change to", 0]
        ]);
    });
    it("removes content change listeners", function () {
        spy = jasmine.createSpy();
        // mute all listeners
        // current is now optimized to be an objet when there's only one listener vs an array when there's more than one.
        //This isn't intended to be a public API
        var descriptor = array.getOwnPropertyChangeDescriptor('length'), currentWillChangeListeners = descriptor.willChangeListeners.current, currentChangeListeners = descriptor.changeListeners.current;
        if (Array.isArray(currentWillChangeListeners)) {
            currentWillChangeListeners.forEach(function (listener) {
                array.removeBeforeOwnPropertyChangeListener('length', listener);
            });
        }
        else if (currentWillChangeListeners) {
            array.removeBeforeOwnPropertyChangeListener('length', currentWillChangeListeners);
        }
        if (Array.isArray(currentChangeListeners)) {
            currentChangeListeners.forEach(function (listener) {
                array.removeOwnPropertyChangeListener('length', listener);
            });
        }
        else if (currentChangeListeners) {
            array.removeOwnPropertyChangeListener('length', currentChangeListeners);
        }
        // current is now optimized to be an objet when there's only one listener vs an array when there's more than one.
        //This isn't intended to be a public API
        var descriptor = array.getRangeChangeDescriptor(), currentWillChangeListeners = descriptor.willChangeListeners.current, currentChangeListeners = descriptor.changeListeners.current;
        if (Array.isArray(currentWillChangeListeners)) {
            currentWillChangeListeners.forEach(function (listener) {
                array.removeBeforeRangeChangeListener(listener);
            });
        }
        else if (currentWillChangeListeners) {
            array.removeBeforeRangeChangeListener(currentWillChangeListeners);
        }
        if (Array.isArray(currentChangeListeners)) {
            currentChangeListeners.forEach(function (listener) {
                array.removeRangeChangeListener(listener);
            });
        }
        else if (currentChangeListeners) {
            array.removeRangeChangeListener(currentChangeListeners);
        }
        // current is now optimized to be an objet when there's only one listener vs an array when there's more than one.
        //This isn't intended to be a public API
        var descriptor = array.getMapChangeDescriptor(), currentWillChangeListeners = descriptor.willChangeListeners.current, currentChangeListeners = descriptor.changeListeners.current;
        if (Array.isArray(currentWillChangeListeners)) {
            currentWillChangeListeners.forEach(function (listener) {
                array.removeBeforeMapChangeListener(listener);
            });
        }
        else if (currentWillChangeListeners) {
            array.removeBeforeMapChangeListener(currentWillChangeListeners);
        }
        if (Array.isArray(currentChangeListeners)) {
            currentChangeListeners.forEach(function (listener) {
                array.removeMapChangeListener(listener);
            });
        }
        else if (currentChangeListeners) {
            array.removeMapChangeListener(currentChangeListeners);
        }
        // modify
        array.splice(0, 0, 1, 2, 3);
        // note silence
        expect(spy).not.toHaveBeenCalled();
    });
    // --------------- FIN -----------------
    it("handles cyclic content change listeners", function () {
        var foo = [];
        var bar = [];
        foo.addRangeChangeListener(function (plus, minus, index) {
            // if this is a change in response to a change in bar,
            // do not send back
            if (bar.getRangeChangeDescriptor().isActive)
                return;
            bar.splice.apply(bar, [index, minus.length].concat(plus));
        });
        bar.addRangeChangeListener(function (plus, minus, index) {
            if (foo.getRangeChangeDescriptor().isActive)
                return;
            foo.splice.apply(foo, [index, minus.length].concat(plus));
        });
        foo.push(10, 20, 30);
        expect(bar).toEqual([10, 20, 30]);
        bar.pop();
        expect(foo).toEqual([10, 20]);
    });
    it("observes length changes on arrays that are not otherwised observed", function () {
        var array = [1, 2, 3];
        var spy = jasmine.createSpy();
        array.addOwnPropertyChangeListener("length", spy);
        array.push(4);
        expect(spy).toHaveBeenCalled();
    });
    describe("splice", function () {
        var array;
        beforeEach(function () {
            array = [0, 1, 2];
            array.makeObservable();
        });
        it("handles a negative start", function () {
            var removed = array.splice(-1, 1);
            expect(removed).toEqual([2]);
            expect(array).toEqual([0, 1]);
        });
        it("handles a negative length", function () {
            var removed = array.splice(1, -1);
            expect(removed).toEqual([]);
            expect(array).toEqual([0, 1, 2]);
        });
    });
    // Disabled because it takes far too long
    xdescribe("swap", function () {
        var otherArray;
        beforeEach(function () {
            array.makeObservable();
        });
        it("should work with large arrays", function () {
            otherArray = new Array(200000);
            // Should not throw a Maximum call stack size exceeded error.
            expect(function () {
                array.swap(0, array.length, otherArray);
            }).not.toThrow();
            expect(array.length).toEqual(200000);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJyYXktY2hhbmdlcy1zcGVjLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9qcy1wcm90b3R5cGVzL3BhY2thZ2VzL2NvbGxlY3Rpb25zL3Rlc3Qvc3BlYy9saXN0ZW4vYXJyYXktY2hhbmdlcy1zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxPQUFPLENBQUMsa0NBQWtDLENBQUMsQ0FBQztBQUM1QyxJQUFJLG9CQUFvQixHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBRXRELFFBQVEsQ0FBQyx1QkFBdUIsRUFBRTtJQUU5QixtQ0FBbUM7SUFDbkMsb0NBQW9DO0lBRXBDLElBQUksS0FBSyxHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN0QixJQUFJLEdBQUcsQ0FBQztJQUVSLCtEQUErRDtJQUMvRCxvQ0FBb0M7SUFFcEMsRUFBRSxDQUFDLGtCQUFrQixFQUFFO1FBRW5CLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxRQUFRLEVBQUUsVUFBVSxNQUFNO1lBQy9ELEdBQUcsQ0FBQyxvQkFBb0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUN0QyxDQUFDLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxRQUFRLEVBQUUsVUFBVSxNQUFNO1lBQ3pELEdBQUcsQ0FBQyxrQkFBa0IsRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNwQyxDQUFDLENBQUMsQ0FBQztRQUVILEtBQUssQ0FBQyw0QkFBNEIsQ0FBQyxVQUFVLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSztZQUMzRCxHQUFHLENBQUMsMEJBQTBCLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLEVBQUUsV0FBVyxFQUFFLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQy9GLENBQUMsQ0FBQyxDQUFDO1FBRUgsS0FBSyxDQUFDLHNCQUFzQixDQUFDLFVBQVUsSUFBSSxFQUFFLEtBQUssRUFBRSxLQUFLO1lBQ3JELEdBQUcsQ0FBQyxtQkFBbUIsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLEVBQUUsRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDckYsQ0FBQyxDQUFDLENBQUM7UUFFSCxLQUFLLENBQUMsMEJBQTBCLENBQUMsVUFBVSxLQUFLLEVBQUUsR0FBRztZQUNqRCxHQUFHLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsQ0FBQyxDQUFDLENBQUM7UUFFSCxLQUFLLENBQUMsb0JBQW9CLENBQUMsVUFBVSxLQUFLLEVBQUUsR0FBRztZQUMzQyxHQUFHLENBQUMsV0FBVyxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxxREFBcUQsRUFBRTtRQUN0RCxxRUFBcUU7UUFDckUsbUVBQW1FO1FBQ25FLHVCQUF1QjtRQUN2QixLQUFLLElBQUksSUFBSSxJQUFJLEtBQUssRUFBRTtZQUNwQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDcEM7SUFDTCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxzQkFBc0IsRUFBRTtRQUN2QixHQUFHLEdBQUcsT0FBTyxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzFCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUUxQixJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3hCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1lBQ3pCLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNyRSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUMzQixDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUMzQixDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLENBQUMsQ0FBQztZQUMzQixDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQztZQUNqQyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQztZQUNqQyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLFNBQVMsQ0FBQztZQUNqQyxDQUFDLG1CQUFtQixFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDM0QsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7U0FDMUIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7UUFDakMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVTtRQUNyQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFaEMsSUFBSSxXQUFXLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN4QixDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQztZQUN6QixDQUFDLDBCQUEwQixFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsV0FBVyxFQUFFLEVBQUUsQ0FBQztZQUNwRSxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQztZQUNuQyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQVMsQ0FBQztZQUNuQyxDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUMxQixDQUFDLFdBQVcsRUFBRSxDQUFDLEVBQUUsSUFBSSxFQUFFLEVBQUUsQ0FBQztZQUMxQixDQUFDLG1CQUFtQixFQUFFLENBQUMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLEVBQUUsQ0FBQztZQUMxRCxDQUFDLGtCQUFrQixFQUFFLENBQUMsQ0FBQztTQUMxQixDQUFDLENBQUM7SUFFUCxDQUFDLENBQUMsQ0FBQztJQUVILEVBQUUsQ0FBQyxlQUFlLEVBQUU7UUFDaEIsR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDaEMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ1osTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFFNUIsSUFBSSxXQUFXLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVSxJQUFJLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFBLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN4QixDQUFDLG9CQUFvQixFQUFFLENBQUMsQ0FBQztZQUN6QixDQUFDLDBCQUEwQixFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsRUFBRSxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2hFLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDO1lBQzVCLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxDQUFDO1lBQ2pDLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDdEQsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7U0FDMUIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsbUVBQW1FLEVBQUU7UUFDcEUsR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNuQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRXBDLElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxJQUFJLE9BQU8sSUFBSSxDQUFDLElBQUksQ0FBQSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzVFLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxPQUFPLENBQUM7WUFDeEIsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUM7WUFDekIsQ0FBQywwQkFBMEIsRUFBRSxDQUFDLEVBQUUsUUFBUSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxFQUFFLENBQUM7WUFDcEUsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUM7WUFDbkMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxTQUFTLENBQUM7WUFDbkMsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7WUFDMUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxFQUFFLElBQUksRUFBRSxFQUFFLENBQUM7WUFDMUIsQ0FBQyxtQkFBbUIsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxFQUFFLENBQUM7WUFDMUQsQ0FBQyxrQkFBa0IsRUFBRSxDQUFDLENBQUM7U0FDMUIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7SUFFSCxFQUFFLENBQUMsZ0NBQWdDLEVBQUU7UUFDakMsR0FBRyxHQUFHLE9BQU8sQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUMxQixNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUU1QyxJQUFJLFdBQVcsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxVQUFVLElBQUksSUFBSSxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUEsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RSxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsT0FBTyxDQUFDO1lBQ3hCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDO1lBQ3pCLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDO1lBQ3BFLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDO1lBQzVCLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDO1lBQzVCLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDO1lBQ25DLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxDQUFDO1lBQ25DLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQzFCLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQzFCLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQzFCLENBQUMsV0FBVyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsRUFBRSxDQUFDO1lBQzFCLENBQUMsbUJBQW1CLEVBQUUsQ0FBQyxFQUFFLE9BQU8sRUFB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QztZQUMvQiw2REFBNkQ7WUFDN0QsTUFBTSxDQUFDO2dCQUNILEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLEtBQUssQ0FBQyxNQUFNLEVBQUUsVUFBVSxDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDO1lBQ2pCLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxucmVxdWlyZShcImNvbGxlY3Rpb25zL2xpc3Rlbi9hcnJheS1jaGFuZ2VzXCIpO1xudmFyIGRlc2NyaWJlUmFuZ2VDaGFuZ2VzID0gcmVxdWlyZShcIi4vcmFuZ2UtY2hhbmdlc1wiKTtcblxuZGVzY3JpYmUoXCJBcnJheSBjaGFuZ2UgZGlzcGF0Y2hcIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgLy8gVE9ETyAobWFrZSBjb25zaXN0ZW50IHdpdGggTGlzdClcbiAgICAvLyBkZXNjcmliZVJhbmdlQ2hhbmdlcyhBcnJheS5mcm9tKTtcblxuICAgIHZhciBhcnJheSA9IFsxLCAyLCAzXTtcbiAgICB2YXIgc3B5O1xuXG4gICAgLy8gdGhlIGZvbGxvd2luZyB0ZXN0cyBhbGwgc2hhcmUgdGhlIHNhbWUgaW5pdGlhbCBhcnJheSBzbyB0aGV5XG4gICAgLy8gYXJlIHNlbnNpdGl2ZSB0byBjaGFuZ2VzIGluIG9yZGVyXG5cbiAgICBpdChcInNldCB1cCBsaXN0ZW5lcnNcIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGFycmF5LmFkZEJlZm9yZU93blByb3BlcnR5Q2hhbmdlTGlzdGVuZXIoXCJsZW5ndGhcIiwgZnVuY3Rpb24gKGxlbmd0aCkge1xuICAgICAgICAgICAgc3B5KFwibGVuZ3RoIGNoYW5nZSBmcm9tXCIsIGxlbmd0aCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFycmF5LmFkZE93blByb3BlcnR5Q2hhbmdlTGlzdGVuZXIoXCJsZW5ndGhcIiwgZnVuY3Rpb24gKGxlbmd0aCkge1xuICAgICAgICAgICAgc3B5KFwibGVuZ3RoIGNoYW5nZSB0b1wiLCBsZW5ndGgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBhcnJheS5hZGRCZWZvcmVSYW5nZUNoYW5nZUxpc3RlbmVyKGZ1bmN0aW9uIChwbHVzLCBtaW51cywgaW5kZXgpIHtcbiAgICAgICAgICAgIHNweShcImJlZm9yZSBjb250ZW50IGNoYW5nZSBhdFwiLCBpbmRleCwgXCJ0byBhZGRcIiwgcGx1cy5zbGljZSgpLCBcInRvIHJlbW92ZVwiLCBtaW51cy5zbGljZSgpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXJyYXkuYWRkUmFuZ2VDaGFuZ2VMaXN0ZW5lcihmdW5jdGlvbiAocGx1cywgbWludXMsIGluZGV4KSB7XG4gICAgICAgICAgICBzcHkoXCJjb250ZW50IGNoYW5nZSBhdFwiLCBpbmRleCwgXCJhZGRlZFwiLCBwbHVzLnNsaWNlKCksIFwicmVtb3ZlZFwiLCBtaW51cy5zbGljZSgpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgYXJyYXkuYWRkQmVmb3JlTWFwQ2hhbmdlTGlzdGVuZXIoZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgICAgIHNweShcImNoYW5nZSBhdFwiLCBrZXksIFwiZnJvbVwiLCB2YWx1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGFycmF5LmFkZE1hcENoYW5nZUxpc3RlbmVyKGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICAgICAgICBzcHkoXCJjaGFuZ2UgYXRcIiwga2V5LCBcInRvXCIsIHZhbHVlKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGl0KFwiY2hhbmdlIGRpc3BhdGNoIHByb3BlcnRpZXMgc2hvdWxkIG5vdCBiZSBlbnVtZXJhYmxlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gdGhpcyB2ZXJpZmllcyB0aGF0IGRpc3BhdGNoZXNSYW5nZUNoYW5nZXMgYW5kIGRpc3BhdGNoZXNNYXBDaGFuZ2VzXG4gICAgICAgIC8vIGFyZSBib3RoIG5vbi1lbnVtZXJhYmxlLCBhbmQgYW55IG90aGVyIHByb3BlcnRpZXMgdGhhdCBtaWdodCBnZXRcbiAgICAgICAgLy8gYWRkZWQgaW4gdGhlIGZ1dHVyZS5cbiAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBhcnJheSkge1xuICAgICAgICAgICAgZXhwZWN0KGlzTmFOKCtuYW1lKSkudG9CZShmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGl0KFwiY2xlYXIgaW5pdGlhbCB2YWx1ZXNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xuICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoWzEsIDIsIDNdKTtcbiAgICAgICAgYXJyYXkuY2xlYXIoKTtcbiAgICAgICAgZXhwZWN0KGFycmF5KS50b0VxdWFsKFtdKTtcblxuICAgICAgICB2YXIgYXJnc0ZvckNhbGwgPSBzcHkuY2FsbHMuYWxsKCkubWFwKGZ1bmN0aW9uIChjYWxsKSB7IHJldHVybiBjYWxsLmFyZ3MgfSk7XG4gICAgICAgIGV4cGVjdChhcmdzRm9yQ2FsbCkudG9FcXVhbChbXG4gICAgICAgICAgICBbXCJsZW5ndGggY2hhbmdlIGZyb21cIiwgM10sXG4gICAgICAgICAgICBbXCJiZWZvcmUgY29udGVudCBjaGFuZ2UgYXRcIiwgMCwgXCJ0byBhZGRcIiwgW10sIFwidG8gcmVtb3ZlXCIsIFsxLCAyLCAzXV0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMCwgXCJmcm9tXCIsIDFdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDEsIFwiZnJvbVwiLCAyXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAyLCBcImZyb21cIiwgM10sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMCwgXCJ0b1wiLCB1bmRlZmluZWRdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDEsIFwidG9cIiwgdW5kZWZpbmVkXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAyLCBcInRvXCIsIHVuZGVmaW5lZF0sXG4gICAgICAgICAgICBbXCJjb250ZW50IGNoYW5nZSBhdFwiLCAwLCBcImFkZGVkXCIsIFtdLCBcInJlbW92ZWRcIiwgWzEsIDIsIDNdXSxcbiAgICAgICAgICAgIFtcImxlbmd0aCBjaGFuZ2UgdG9cIiwgMF1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdChcInB1c2ggdHdvIHZhbHVlcyBvbiBlbXB0eSBhcnJheVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbXSk7IC8vIGluaXRpYWxcbiAgICAgICAgYXJyYXkucHVzaCgxMCwgMjApO1xuICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoWzEwLCAyMF0pO1xuXG4gICAgICAgIHZhciBhcmdzRm9yQ2FsbCA9IHNweS5jYWxscy5hbGwoKS5tYXAoZnVuY3Rpb24gKGNhbGwpIHsgcmV0dXJuIGNhbGwuYXJncyB9KTtcbiAgICAgICAgZXhwZWN0KGFyZ3NGb3JDYWxsKS50b0VxdWFsKFtcbiAgICAgICAgICAgIFtcImxlbmd0aCBjaGFuZ2UgZnJvbVwiLCAwXSxcbiAgICAgICAgICAgIFtcImJlZm9yZSBjb250ZW50IGNoYW5nZSBhdFwiLCAwLCBcInRvIGFkZFwiLCBbMTAsIDIwXSwgXCJ0byByZW1vdmVcIiwgW11dLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDAsIFwiZnJvbVwiLCB1bmRlZmluZWRdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDEsIFwiZnJvbVwiLCB1bmRlZmluZWRdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDAsIFwidG9cIiwgMTBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDEsIFwidG9cIiwgMjBdLFxuICAgICAgICAgICAgW1wiY29udGVudCBjaGFuZ2UgYXRcIiwgMCwgXCJhZGRlZFwiLCBbMTAsIDIwXSwgXCJyZW1vdmVkXCIsIFtdXSxcbiAgICAgICAgICAgIFtcImxlbmd0aCBjaGFuZ2UgdG9cIiwgMl0sXG4gICAgICAgIF0pO1xuXG4gICAgfSk7XG5cbiAgICBpdChcInBvcCBvbmUgdmFsdWVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xuICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoWzEwLCAyMF0pO1xuICAgICAgICBhcnJheS5wb3AoKTtcbiAgICAgICAgZXhwZWN0KGFycmF5KS50b0VxdWFsKFsxMF0pO1xuICAgICAgICBcbiAgICAgICAgdmFyIGFyZ3NGb3JDYWxsID0gc3B5LmNhbGxzLmFsbCgpLm1hcChmdW5jdGlvbiAoY2FsbCkgeyByZXR1cm4gY2FsbC5hcmdzIH0pO1xuICAgICAgICBleHBlY3QoYXJnc0ZvckNhbGwpLnRvRXF1YWwoW1xuICAgICAgICAgICAgW1wibGVuZ3RoIGNoYW5nZSBmcm9tXCIsIDJdLFxuICAgICAgICAgICAgW1wiYmVmb3JlIGNvbnRlbnQgY2hhbmdlIGF0XCIsIDEsIFwidG8gYWRkXCIsIFtdLCBcInRvIHJlbW92ZVwiLCBbMjBdXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAxLCBcImZyb21cIiwgMjBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDEsIFwidG9cIiwgdW5kZWZpbmVkXSxcbiAgICAgICAgICAgIFtcImNvbnRlbnQgY2hhbmdlIGF0XCIsIDEsIFwiYWRkZWRcIiwgW10sIFwicmVtb3ZlZFwiLCBbMjBdXSxcbiAgICAgICAgICAgIFtcImxlbmd0aCBjaGFuZ2UgdG9cIiwgMV0sXG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoXCJwdXNoIHR3byB2YWx1ZXMgb24gdG9wIG9mIGV4aXN0aW5nIG9uZSwgd2l0aCBob2xlIG9wZW4gZm9yIHNwbGljZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbMTBdKTtcbiAgICAgICAgYXJyYXkucHVzaCg0MCwgNTApO1xuICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoWzEwLCA0MCwgNTBdKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBhcmdzRm9yQ2FsbCA9IHNweS5jYWxscy5hbGwoKS5tYXAoZnVuY3Rpb24gKGNhbGwpIHsgcmV0dXJuIGNhbGwuYXJncyB9KTtcbiAgICAgICAgZXhwZWN0KGFyZ3NGb3JDYWxsKS50b0VxdWFsKFtcbiAgICAgICAgICAgIFtcImxlbmd0aCBjaGFuZ2UgZnJvbVwiLCAxXSxcbiAgICAgICAgICAgIFtcImJlZm9yZSBjb250ZW50IGNoYW5nZSBhdFwiLCAxLCBcInRvIGFkZFwiLCBbNDAsIDUwXSwgXCJ0byByZW1vdmVcIiwgW11dLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDEsIFwiZnJvbVwiLCB1bmRlZmluZWRdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDIsIFwiZnJvbVwiLCB1bmRlZmluZWRdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDEsIFwidG9cIiwgNDBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDIsIFwidG9cIiwgNTBdLFxuICAgICAgICAgICAgW1wiY29udGVudCBjaGFuZ2UgYXRcIiwgMSwgXCJhZGRlZFwiLCBbNDAsIDUwXSwgXCJyZW1vdmVkXCIsIFtdXSxcbiAgICAgICAgICAgIFtcImxlbmd0aCBjaGFuZ2UgdG9cIiwgM11cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdChcInNwbGljZXMgdHdvIHZhbHVlcyBpbnRvIG1pZGRsZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbMTAsIDQwLCA1MF0pO1xuICAgICAgICBleHBlY3QoYXJyYXkuc3BsaWNlKDEsIDAsIDIwLCAzMCkpLnRvRXF1YWwoW10pO1xuICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoWzEwLCAyMCwgMzAsIDQwLCA1MF0pO1xuICAgICAgICBcbiAgICAgICAgdmFyIGFyZ3NGb3JDYWxsID0gc3B5LmNhbGxzLmFsbCgpLm1hcChmdW5jdGlvbiAoY2FsbCkgeyByZXR1cm4gY2FsbC5hcmdzIH0pO1xuICAgICAgICBleHBlY3QoYXJnc0ZvckNhbGwpLnRvRXF1YWwoW1xuICAgICAgICAgICAgW1wibGVuZ3RoIGNoYW5nZSBmcm9tXCIsIDNdLFxuICAgICAgICAgICAgW1wiYmVmb3JlIGNvbnRlbnQgY2hhbmdlIGF0XCIsIDEsIFwidG8gYWRkXCIsIFsyMCwgMzBdLCBcInRvIHJlbW92ZVwiLCBbXV0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMSwgXCJmcm9tXCIsIDQwXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAyLCBcImZyb21cIiwgNTBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDMsIFwiZnJvbVwiLCB1bmRlZmluZWRdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDQsIFwiZnJvbVwiLCB1bmRlZmluZWRdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDEsIFwidG9cIiwgMjBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDIsIFwidG9cIiwgMzBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDMsIFwidG9cIiwgNDBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDQsIFwidG9cIiwgNTBdLFxuICAgICAgICAgICAgW1wiY29udGVudCBjaGFuZ2UgYXRcIiwgMSwgXCJhZGRlZFwiLCBbMjAsIDMwXSwgXCJyZW1vdmVkXCIsIFtdXSxcbiAgICAgICAgICAgIFtcImxlbmd0aCBjaGFuZ2UgdG9cIiwgNV1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdChcInB1c2hlcyBvbmUgdmFsdWUgdG8gZW5kXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcbiAgICAgICAgZXhwZWN0KGFycmF5KS50b0VxdWFsKFsxMCwgMjAsIDMwLCA0MCwgNTBdKTtcbiAgICAgICAgYXJyYXkucHVzaCg2MCk7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbMTAsIDIwLCAzMCwgNDAsIDUwLCA2MF0pO1xuICAgICAgICBcbiAgICAgICAgdmFyIGFyZ3NGb3JDYWxsID0gc3B5LmNhbGxzLmFsbCgpLm1hcChmdW5jdGlvbiAoY2FsbCkgeyByZXR1cm4gY2FsbC5hcmdzIH0pO1xuICAgICAgICBleHBlY3QoYXJnc0ZvckNhbGwpLnRvRXF1YWwoW1xuICAgICAgICAgICAgW1wibGVuZ3RoIGNoYW5nZSBmcm9tXCIsIDVdLFxuICAgICAgICAgICAgW1wiYmVmb3JlIGNvbnRlbnQgY2hhbmdlIGF0XCIsIDUsIFwidG8gYWRkXCIsIFs2MF0sIFwidG8gcmVtb3ZlXCIsIFtdXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCA1LCBcImZyb21cIiwgdW5kZWZpbmVkXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCA1LCBcInRvXCIsIDYwXSxcbiAgICAgICAgICAgIFtcImNvbnRlbnQgY2hhbmdlIGF0XCIsIDUsIFwiYWRkZWRcIiwgWzYwXSwgXCJyZW1vdmVkXCIsIFtdXSxcbiAgICAgICAgICAgIFtcImxlbmd0aCBjaGFuZ2UgdG9cIiwgNl1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdChcInNwbGljZXMgaW4gcGxhY2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xuICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoWzEwLCAyMCwgMzAsIDQwLCA1MCwgNjBdKTtcbiAgICAgICAgZXhwZWN0KGFycmF5LnNwbGljZSgyLCAyLCBcIkFcIiwgXCJCXCIpKS50b0VxdWFsKFszMCwgNDBdKTtcbiAgICAgICAgZXhwZWN0KGFycmF5KS50b0VxdWFsKFsxMCwgMjAsIFwiQVwiLCBcIkJcIiwgNTAsIDYwXSk7XG4gICAgICAgIFxuICAgICAgICB2YXIgYXJnc0ZvckNhbGwgPSBzcHkuY2FsbHMuYWxsKCkubWFwKGZ1bmN0aW9uIChjYWxsKSB7IHJldHVybiBjYWxsLmFyZ3MgfSk7XG4gICAgICAgIGV4cGVjdChhcmdzRm9yQ2FsbCkudG9FcXVhbChbXG4gICAgICAgICAgICAvLyBubyBsZW5ndGggY2hhbmdlXG4gICAgICAgICAgICBbXCJiZWZvcmUgY29udGVudCBjaGFuZ2UgYXRcIiwgMiwgXCJ0byBhZGRcIiwgW1wiQVwiLCBcIkJcIl0sIFwidG8gcmVtb3ZlXCIsIFszMCwgNDBdXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAyLCBcImZyb21cIiwgMzBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDMsIFwiZnJvbVwiLCA0MF0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMiwgXCJ0b1wiLCBcIkFcIl0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMywgXCJ0b1wiLCBcIkJcIl0sXG4gICAgICAgICAgICBbXCJjb250ZW50IGNoYW5nZSBhdFwiLCAyLCBcImFkZGVkXCIsIFtcIkFcIiwgXCJCXCJdLCBcInJlbW92ZWRcIiwgWzMwLCA0MF1dLFxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIC8vIC0tLS0gZnJlc2ggc3RhcnRcblxuICAgIGl0KFwic2hpZnRzIG9uZSBmcm9tIHRoZSBiZWdpbm5pbmdcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBhcnJheS5jbGVhcigpOyAvLyBzdGFydCBvdmVyIGZyZXNoXG4gICAgICAgIGFycmF5LnB1c2goMTAsIDIwLCAzMCk7XG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbMTAsIDIwLCAzMF0pO1xuICAgICAgICBleHBlY3QoYXJyYXkuc2hpZnQoKSkudG9FcXVhbCgxMCk7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbMjAsIDMwXSk7XG4gICAgICAgIFxuICAgICAgICB2YXIgYXJnc0ZvckNhbGwgPSBzcHkuY2FsbHMuYWxsKCkubWFwKGZ1bmN0aW9uIChjYWxsKSB7IHJldHVybiBjYWxsLmFyZ3MgfSk7XG4gICAgICAgIGV4cGVjdChhcmdzRm9yQ2FsbCkudG9FcXVhbChbXG4gICAgICAgICAgICBbXCJsZW5ndGggY2hhbmdlIGZyb21cIiwgM10sXG4gICAgICAgICAgICBbXCJiZWZvcmUgY29udGVudCBjaGFuZ2UgYXRcIiwgMCwgXCJ0byBhZGRcIiwgW10sIFwidG8gcmVtb3ZlXCIsIFsxMF1dLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDAsIFwiZnJvbVwiLCAxMF0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMSwgXCJmcm9tXCIsIDIwXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAyLCBcImZyb21cIiwgMzBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDAsIFwidG9cIiwgMjBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDEsIFwidG9cIiwgMzBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDIsIFwidG9cIiwgdW5kZWZpbmVkXSxcbiAgICAgICAgICAgIFtcImNvbnRlbnQgY2hhbmdlIGF0XCIsIDAsIFwiYWRkZWRcIiwgW10sIFwicmVtb3ZlZFwiLCBbMTBdXSxcbiAgICAgICAgICAgIFtcImxlbmd0aCBjaGFuZ2UgdG9cIiwgMl1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdChcInNldHMgbmV3IHZhbHVlIGF0IGVuZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbMjAsIDMwXSk7XG4gICAgICAgIGV4cGVjdChhcnJheS5zZXQoMiwgNDApKS50b0JlKHRydWUpO1xuICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoWzIwLCAzMCwgNDBdKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBhcmdzRm9yQ2FsbCA9IHNweS5jYWxscy5hbGwoKS5tYXAoZnVuY3Rpb24gKGNhbGwpIHsgcmV0dXJuIGNhbGwuYXJncyB9KTtcbiAgICAgICAgZXhwZWN0KGFyZ3NGb3JDYWxsKS50b0VxdWFsKFtcbiAgICAgICAgICAgIFtcImxlbmd0aCBjaGFuZ2UgZnJvbVwiLCAyXSxcbiAgICAgICAgICAgIFtcImJlZm9yZSBjb250ZW50IGNoYW5nZSBhdFwiLCAyLCBcInRvIGFkZFwiLCBbNDBdLCBcInRvIHJlbW92ZVwiLCBbXV0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMiwgXCJmcm9tXCIsIHVuZGVmaW5lZF0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMiwgXCJ0b1wiLCA0MF0sXG4gICAgICAgICAgICBbXCJjb250ZW50IGNoYW5nZSBhdFwiLCAyLCBcImFkZGVkXCIsIFs0MF0sIFwicmVtb3ZlZFwiLCBbXV0sXG4gICAgICAgICAgICBbXCJsZW5ndGggY2hhbmdlIHRvXCIsIDNdXG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzZXRzIG5ldyB2YWx1ZSBhdCBiZWdpbm5pbmdcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xuICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoWzIwLCAzMCwgNDBdKTtcbiAgICAgICAgZXhwZWN0KGFycmF5LnNldCgwLCAxMCkpLnRvQmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbMTAsIDMwLCA0MF0pO1xuICAgICAgICBcbiAgICAgICAgdmFyIGFyZ3NGb3JDYWxsID0gc3B5LmNhbGxzLmFsbCgpLm1hcChmdW5jdGlvbiAoY2FsbCkgeyByZXR1cm4gY2FsbC5hcmdzIH0pO1xuICAgICAgICBleHBlY3QoYXJnc0ZvckNhbGwpLnRvRXF1YWwoW1xuICAgICAgICAgICAgW1wiYmVmb3JlIGNvbnRlbnQgY2hhbmdlIGF0XCIsIDAsIFwidG8gYWRkXCIsIFsxMF0sIFwidG8gcmVtb3ZlXCIsIFsyMF1dLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDAsIFwiZnJvbVwiLCAyMF0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMCwgXCJ0b1wiLCAxMF0sXG4gICAgICAgICAgICBbXCJjb250ZW50IGNoYW5nZSBhdFwiLCAwLCBcImFkZGVkXCIsIFsxMF0sIFwicmVtb3ZlZFwiLCBbMjBdXVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KFwic3BsaWNlcyB0d28gdmFsdWVzIG91dHNpZGUgdGhlIGFycmF5IHJhbmdlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgYXJyYXkuY2xlYXIoKTtcbiAgICAgICAgYXJyYXkucHVzaCgxMCwgMjAsIDMwKTtcblxuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xuICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoWzEwLCAyMCwgMzBdKTtcbiAgICAgICAgZXhwZWN0KGFycmF5LnNwbGljZSg0LCAwLCA1MCkpLnRvRXF1YWwoW10pO1xuICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoWzEwLCAyMCwgMzAsIDUwXSk7XG4gICAgICAgIFxuICAgICAgICB2YXIgYXJnc0ZvckNhbGwgPSBzcHkuY2FsbHMuYWxsKCkubWFwKGZ1bmN0aW9uIChjYWxsKSB7IHJldHVybiBjYWxsLmFyZ3MgfSk7XG4gICAgICAgIGV4cGVjdChhcmdzRm9yQ2FsbCkudG9FcXVhbChbXG4gICAgICAgICAgICBbXCJsZW5ndGggY2hhbmdlIGZyb21cIiwgM10sXG4gICAgICAgICAgICBbXCJiZWZvcmUgY29udGVudCBjaGFuZ2UgYXRcIiwgMywgXCJ0byBhZGRcIiwgWzUwXSwgXCJ0byByZW1vdmVcIiwgW11dLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDMsIFwiZnJvbVwiLCB1bmRlZmluZWRdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDMsIFwidG9cIiwgNTBdLFxuICAgICAgICAgICAgW1wiY29udGVudCBjaGFuZ2UgYXRcIiwgMywgXCJhZGRlZFwiLCBbNTBdLCBcInJlbW92ZWRcIiwgW11dLFxuICAgICAgICAgICAgW1wibGVuZ3RoIGNoYW5nZSB0b1wiLCA0XVxuICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgLy8gLS0tLSBmcmVzaCBzdGFydFxuXG4gICAgaXQoXCJ1bnNoaWZ0cyBvbmUgdG8gdGhlIGJlZ2lubmluZ1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGFycmF5LmNsZWFyKCk7IC8vIHN0YXJ0IG92ZXIgZnJlc2hcbiAgICAgICAgZXhwZWN0KGFycmF5KS50b0VxdWFsKFtdKTtcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcbiAgICAgICAgYXJyYXkudW5zaGlmdCgzMCk7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbMzBdKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBhcmdzRm9yQ2FsbCA9IHNweS5jYWxscy5hbGwoKS5tYXAoZnVuY3Rpb24gKGNhbGwpIHsgcmV0dXJuIGNhbGwuYXJncyB9KTtcbiAgICAgICAgZXhwZWN0KGFyZ3NGb3JDYWxsKS50b0VxdWFsKFtcbiAgICAgICAgICAgIFtcImxlbmd0aCBjaGFuZ2UgZnJvbVwiLCAwXSxcbiAgICAgICAgICAgIFtcImJlZm9yZSBjb250ZW50IGNoYW5nZSBhdFwiLCAwLCBcInRvIGFkZFwiLCBbMzBdLCBcInRvIHJlbW92ZVwiLCBbXV0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMCwgXCJmcm9tXCIsIHVuZGVmaW5lZF0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMCwgXCJ0b1wiLCAzMF0sXG4gICAgICAgICAgICBbXCJjb250ZW50IGNoYW5nZSBhdFwiLCAwLCBcImFkZGVkXCIsIFszMF0sIFwicmVtb3ZlZFwiLCBbXV0sXG4gICAgICAgICAgICBbXCJsZW5ndGggY2hhbmdlIHRvXCIsIDFdXG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoXCJ1bnNoaWZ0cyB0d28gdmFsdWVzIG9uIGJlZ2lubmluZyBvZiBhbHJlYWR5IHBvcHVsYXRlZCBhcnJheVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbMzBdKTtcbiAgICAgICAgYXJyYXkudW5zaGlmdCgxMCwgMjApO1xuICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoWzEwLCAyMCwgMzBdKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBhcmdzRm9yQ2FsbCA9IHNweS5jYWxscy5hbGwoKS5tYXAoZnVuY3Rpb24gKGNhbGwpIHsgcmV0dXJuIGNhbGwuYXJncyB9KTtcbiAgICAgICAgZXhwZWN0KGFyZ3NGb3JDYWxsKS50b0VxdWFsKFtcbiAgICAgICAgICAgIFtcImxlbmd0aCBjaGFuZ2UgZnJvbVwiLCAxXSxcbiAgICAgICAgICAgIC8vIGFkZGVkIGFuZCByZW1vdmVkIHZhbHVlcyByZWZsZWN0IHRoZSBlbmRpbmcgdmFsdWVzLCBub3QgdGhlIHZhbHVlcyBhdCB0aGUgdGltZSBvZiB0aGUgY2FsbFxuICAgICAgICAgICAgW1wiYmVmb3JlIGNvbnRlbnQgY2hhbmdlIGF0XCIsIDAsIFwidG8gYWRkXCIsIFsxMCwgMjBdLCBcInRvIHJlbW92ZVwiLCBbXV0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMCwgXCJmcm9tXCIsIDMwXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAxLCBcImZyb21cIiwgdW5kZWZpbmVkXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAyLCBcImZyb21cIiwgdW5kZWZpbmVkXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAwLCBcInRvXCIsIDEwXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAxLCBcInRvXCIsIDIwXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAyLCBcInRvXCIsIDMwXSxcbiAgICAgICAgICAgIFtcImNvbnRlbnQgY2hhbmdlIGF0XCIsIDAsIFwiYWRkZWRcIiwgWzEwLCAyMF0sIFwicmVtb3ZlZFwiLCBbXV0sXG4gICAgICAgICAgICBbXCJsZW5ndGggY2hhbmdlIHRvXCIsIDNdXG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoXCJyZXZlcnNlcyBpbiBwbGFjZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbMTAsIDIwLCAzMF0pO1xuICAgICAgICBhcnJheS5yZXZlcnNlKCk7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbMzAsIDIwLCAxMF0pO1xuICAgICAgICBcbiAgICAgICAgdmFyIGFyZ3NGb3JDYWxsID0gc3B5LmNhbGxzLmFsbCgpLm1hcChmdW5jdGlvbiAoY2FsbCkgeyByZXR1cm4gY2FsbC5hcmdzIH0pO1xuICAgICAgICBleHBlY3QoYXJnc0ZvckNhbGwpLnRvRXF1YWwoW1xuICAgICAgICAgICAgW1wiYmVmb3JlIGNvbnRlbnQgY2hhbmdlIGF0XCIsIDAsIFwidG8gYWRkXCIsIFszMCwgMjAsIDEwXSwgXCJ0byByZW1vdmVcIiwgWzEwLCAyMCwgMzBdXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAwLCBcImZyb21cIiwgMTBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDEsIFwiZnJvbVwiLCAyMF0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMiwgXCJmcm9tXCIsIDMwXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAwLCBcInRvXCIsIDMwXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAxLCBcInRvXCIsIDIwXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAyLCBcInRvXCIsIDEwXSxcbiAgICAgICAgICAgIFtcImNvbnRlbnQgY2hhbmdlIGF0XCIsIDAsIFwiYWRkZWRcIiwgWzMwLCAyMCwgMTBdLCBcInJlbW92ZWRcIiwgWzEwLCAyMCwgMzBdXSxcbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdChcInNvcnRzIGluIHBsYWNlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcbiAgICAgICAgZXhwZWN0KGFycmF5KS50b0VxdWFsKFszMCwgMjAsIDEwXSk7XG4gICAgICAgIGFycmF5LnNvcnQoKTtcbiAgICAgICAgZXhwZWN0KGFycmF5KS50b0VxdWFsKFsxMCwgMjAsIDMwXSk7XG4gICAgICAgIFxuICAgICAgICB2YXIgYXJnc0ZvckNhbGwgPSBzcHkuY2FsbHMuYWxsKCkubWFwKGZ1bmN0aW9uIChjYWxsKSB7IHJldHVybiBjYWxsLmFyZ3MgfSk7XG4gICAgICAgIGV4cGVjdChhcmdzRm9yQ2FsbCkudG9FcXVhbChbXG4gICAgICAgICAgICAvLyBhZGRlZCBhbmQgcmVtb3ZlZCB2YWx1ZXMgcmVmbGVjdCB0aGUgZW5kaW5nIHZhbHVlcywgbm90IHRoZSB2YWx1ZXMgYXQgdGhlIHRpbWUgb2YgdGhlIGNhbGxcbiAgICAgICAgICAgIFtcImJlZm9yZSBjb250ZW50IGNoYW5nZSBhdFwiLCAwLCBcInRvIGFkZFwiLCBbMzAsIDIwLCAxMF0sIFwidG8gcmVtb3ZlXCIsIFszMCwgMjAsIDEwXV0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMCwgXCJmcm9tXCIsIDMwXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAxLCBcImZyb21cIiwgMjBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDIsIFwiZnJvbVwiLCAxMF0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMCwgXCJ0b1wiLCAxMF0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMSwgXCJ0b1wiLCAyMF0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMiwgXCJ0b1wiLCAzMF0sXG4gICAgICAgICAgICBbXCJjb250ZW50IGNoYW5nZSBhdFwiLCAwLCBcImFkZGVkXCIsIFsxMCwgMjAsIDMwXSwgXCJyZW1vdmVkXCIsIFsxMCwgMjAsIDMwXV0sXG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoXCJkZWxldGVzIG9uZSB2YWx1ZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbMTAsIDIwLCAzMF0pO1xuICAgICAgICBleHBlY3QoYXJyYXkuZGVsZXRlKDQwKSkudG9CZShmYWxzZSk7IC8vIHRvIGV4ZXJjaXNlIGRlbGV0aW9uIG9mIG5vbi1leGlzdGluZyBlbnRyeVxuICAgICAgICBleHBlY3QoYXJyYXkuZGVsZXRlKDIwKSkudG9CZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGFycmF5KS50b0VxdWFsKFsxMCwgMzBdKTtcbiAgICAgICAgXG4gICAgICAgIHZhciBhcmdzRm9yQ2FsbCA9IHNweS5jYWxscy5hbGwoKS5tYXAoZnVuY3Rpb24gKGNhbGwpIHsgcmV0dXJuIGNhbGwuYXJncyB9KTtcbiAgICAgICAgZXhwZWN0KGFyZ3NGb3JDYWxsKS50b0VxdWFsKFtcbiAgICAgICAgICAgIFtcImxlbmd0aCBjaGFuZ2UgZnJvbVwiLCAzXSxcbiAgICAgICAgICAgIFtcImJlZm9yZSBjb250ZW50IGNoYW5nZSBhdFwiLCAxLCBcInRvIGFkZFwiLCBbXSwgXCJ0byByZW1vdmVcIiwgWzIwXV0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMSwgXCJmcm9tXCIsIDIwXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAyLCBcImZyb21cIiwgMzBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDEsIFwidG9cIiwgMzBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDIsIFwidG9cIiwgdW5kZWZpbmVkXSxcbiAgICAgICAgICAgIFtcImNvbnRlbnQgY2hhbmdlIGF0XCIsIDEsIFwiYWRkZWRcIiwgW10sIFwicmVtb3ZlZFwiLCBbMjBdXSxcbiAgICAgICAgICAgIFtcImxlbmd0aCBjaGFuZ2UgdG9cIiwgMl1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICBpdChcInNldHMgYSB2YWx1ZSBvdXRzaWRlIHRoZSBleGlzdGluZyByYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbMTAsIDMwXSk7XG4gICAgICAgIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XG4gICAgICAgIGV4cGVjdChhcnJheS5zZXQoMywgNDApKS50b0JlKHRydWUpO1xuICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoWzEwLCAzMCwgLCA0MF0pO1xuICAgICAgICBcbiAgICAgICAgdmFyIGFyZ3NGb3JDYWxsID0gc3B5LmNhbGxzLmFsbCgpLm1hcChmdW5jdGlvbiAoY2FsbCkgeyByZXR1cm4gY2FsbC5hcmdzIH0pO1xuICAgICAgICBleHBlY3QoYXJnc0ZvckNhbGwpLnRvRXF1YWwoW1xuICAgICAgICAgICAgW1wibGVuZ3RoIGNoYW5nZSBmcm9tXCIsIDJdLFxuICAgICAgICAgICAgW1wiYmVmb3JlIGNvbnRlbnQgY2hhbmdlIGF0XCIsIDIsIFwidG8gYWRkXCIsIFsgLCA0MF0sIFwidG8gcmVtb3ZlXCIsIFtdXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAyLCBcImZyb21cIiwgdW5kZWZpbmVkXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAzLCBcImZyb21cIiwgdW5kZWZpbmVkXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAyLCBcInRvXCIsIHVuZGVmaW5lZF0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMywgXCJ0b1wiLCA0MF0sXG4gICAgICAgICAgICBbXCJjb250ZW50IGNoYW5nZSBhdFwiLCAyLCBcImFkZGVkXCIsIFsgLCA0MF0sIFwicmVtb3ZlZFwiLCBbXV0sXG4gICAgICAgICAgICBbXCJsZW5ndGggY2hhbmdlIHRvXCIsIDRdXG4gICAgICAgIF0pO1xuICAgICAgICBhcnJheS5wb3AoKTtcbiAgICAgICAgYXJyYXkucG9wKCk7XG4gICAgfSk7XG5cbiAgICBpdChcImNsZWFycyBhbGwgdmFsdWVzIGZpbmFsbHlcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xuICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoWzEwLCAzMF0pO1xuICAgICAgICBhcnJheS5jbGVhcigpO1xuICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoW10pO1xuICAgICAgICBcbiAgICAgICAgdmFyIGFyZ3NGb3JDYWxsID0gc3B5LmNhbGxzLmFsbCgpLm1hcChmdW5jdGlvbiAoY2FsbCkgeyByZXR1cm4gY2FsbC5hcmdzIH0pO1xuICAgICAgICBleHBlY3QoYXJnc0ZvckNhbGwpLnRvRXF1YWwoW1xuICAgICAgICAgICAgW1wibGVuZ3RoIGNoYW5nZSBmcm9tXCIsIDJdLFxuICAgICAgICAgICAgW1wiYmVmb3JlIGNvbnRlbnQgY2hhbmdlIGF0XCIsIDAsIFwidG8gYWRkXCIsIFtdLCBcInRvIHJlbW92ZVwiLCBbMTAsIDMwXV0sXG4gICAgICAgICAgICBbXCJjaGFuZ2UgYXRcIiwgMCwgXCJmcm9tXCIsIDEwXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAxLCBcImZyb21cIiwgMzBdLFxuICAgICAgICAgICAgW1wiY2hhbmdlIGF0XCIsIDAsIFwidG9cIiwgdW5kZWZpbmVkXSxcbiAgICAgICAgICAgIFtcImNoYW5nZSBhdFwiLCAxLCBcInRvXCIsIHVuZGVmaW5lZF0sXG4gICAgICAgICAgICBbXCJjb250ZW50IGNoYW5nZSBhdFwiLCAwLCBcImFkZGVkXCIsIFtdLCBcInJlbW92ZWRcIiwgWzEwLCAzMF1dLFxuICAgICAgICAgICAgW1wibGVuZ3RoIGNoYW5nZSB0b1wiLCAwXVxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KFwicmVtb3ZlcyBjb250ZW50IGNoYW5nZSBsaXN0ZW5lcnNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xuXG4gICAgICAgIC8vIG11dGUgYWxsIGxpc3RlbmVyc1xuICAgICAgICAvLyBjdXJyZW50IGlzIG5vdyBvcHRpbWl6ZWQgdG8gYmUgYW4gb2JqZXQgd2hlbiB0aGVyZSdzIG9ubHkgb25lIGxpc3RlbmVyIHZzIGFuIGFycmF5IHdoZW4gdGhlcmUncyBtb3JlIHRoYW4gb25lLlxuICAgICAgICAvL1RoaXMgaXNuJ3QgaW50ZW5kZWQgdG8gYmUgYSBwdWJsaWMgQVBJXG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gYXJyYXkuZ2V0T3duUHJvcGVydHlDaGFuZ2VEZXNjcmlwdG9yKCdsZW5ndGgnKSxcbiAgICAgICAgICAgIGN1cnJlbnRXaWxsQ2hhbmdlTGlzdGVuZXJzID0gZGVzY3JpcHRvci53aWxsQ2hhbmdlTGlzdGVuZXJzLmN1cnJlbnQsXG4gICAgICAgICAgICBjdXJyZW50Q2hhbmdlTGlzdGVuZXJzID0gZGVzY3JpcHRvci5jaGFuZ2VMaXN0ZW5lcnMuY3VycmVudDtcblxuICAgICAgICBpZihBcnJheS5pc0FycmF5KGN1cnJlbnRXaWxsQ2hhbmdlTGlzdGVuZXJzKSkge1xuICAgICAgICAgICAgY3VycmVudFdpbGxDaGFuZ2VMaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBhcnJheS5yZW1vdmVCZWZvcmVPd25Qcm9wZXJ0eUNoYW5nZUxpc3RlbmVyKCdsZW5ndGgnLCBsaXN0ZW5lcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGN1cnJlbnRXaWxsQ2hhbmdlTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBhcnJheS5yZW1vdmVCZWZvcmVPd25Qcm9wZXJ0eUNoYW5nZUxpc3RlbmVyKCdsZW5ndGgnLCBjdXJyZW50V2lsbENoYW5nZUxpc3RlbmVycyk7XG4gICAgICAgIH1cblxuICAgICAgICBpZihBcnJheS5pc0FycmF5KGN1cnJlbnRDaGFuZ2VMaXN0ZW5lcnMpKSB7XG4gICAgICAgICAgICBjdXJyZW50Q2hhbmdlTGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkucmVtb3ZlT3duUHJvcGVydHlDaGFuZ2VMaXN0ZW5lcignbGVuZ3RoJywgbGlzdGVuZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihjdXJyZW50Q2hhbmdlTGlzdGVuZXJzKXtcbiAgICAgICAgICAgIGFycmF5LnJlbW92ZU93blByb3BlcnR5Q2hhbmdlTGlzdGVuZXIoJ2xlbmd0aCcsIGN1cnJlbnRDaGFuZ2VMaXN0ZW5lcnMpO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyBjdXJyZW50IGlzIG5vdyBvcHRpbWl6ZWQgdG8gYmUgYW4gb2JqZXQgd2hlbiB0aGVyZSdzIG9ubHkgb25lIGxpc3RlbmVyIHZzIGFuIGFycmF5IHdoZW4gdGhlcmUncyBtb3JlIHRoYW4gb25lLlxuICAgICAgICAvL1RoaXMgaXNuJ3QgaW50ZW5kZWQgdG8gYmUgYSBwdWJsaWMgQVBJXG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gYXJyYXkuZ2V0UmFuZ2VDaGFuZ2VEZXNjcmlwdG9yKCksXG4gICAgICAgICAgICBjdXJyZW50V2lsbENoYW5nZUxpc3RlbmVycyA9IGRlc2NyaXB0b3Iud2lsbENoYW5nZUxpc3RlbmVycy5jdXJyZW50LFxuICAgICAgICAgICAgY3VycmVudENoYW5nZUxpc3RlbmVycyA9IGRlc2NyaXB0b3IuY2hhbmdlTGlzdGVuZXJzLmN1cnJlbnQ7XG5cbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShjdXJyZW50V2lsbENoYW5nZUxpc3RlbmVycykpIHtcbiAgICAgICAgICAgIGN1cnJlbnRXaWxsQ2hhbmdlTGlzdGVuZXJzLmZvckVhY2goZnVuY3Rpb24gKGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgYXJyYXkucmVtb3ZlQmVmb3JlUmFuZ2VDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGN1cnJlbnRXaWxsQ2hhbmdlTGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBhcnJheS5yZW1vdmVCZWZvcmVSYW5nZUNoYW5nZUxpc3RlbmVyKGN1cnJlbnRXaWxsQ2hhbmdlTGlzdGVuZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkoY3VycmVudENoYW5nZUxpc3RlbmVycykpIHtcbiAgICAgICAgICAgIGN1cnJlbnRDaGFuZ2VMaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBhcnJheS5yZW1vdmVSYW5nZUNoYW5nZUxpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoY3VycmVudENoYW5nZUxpc3RlbmVycyl7XG4gICAgICAgICAgICBhcnJheS5yZW1vdmVSYW5nZUNoYW5nZUxpc3RlbmVyKGN1cnJlbnRDaGFuZ2VMaXN0ZW5lcnMpO1xuICAgICAgICB9XG5cblxuICAgICAgICAvLyBjdXJyZW50IGlzIG5vdyBvcHRpbWl6ZWQgdG8gYmUgYW4gb2JqZXQgd2hlbiB0aGVyZSdzIG9ubHkgb25lIGxpc3RlbmVyIHZzIGFuIGFycmF5IHdoZW4gdGhlcmUncyBtb3JlIHRoYW4gb25lLlxuICAgICAgICAvL1RoaXMgaXNuJ3QgaW50ZW5kZWQgdG8gYmUgYSBwdWJsaWMgQVBJXG4gICAgICAgIHZhciBkZXNjcmlwdG9yID0gYXJyYXkuZ2V0TWFwQ2hhbmdlRGVzY3JpcHRvcigpLFxuICAgICAgICAgICAgY3VycmVudFdpbGxDaGFuZ2VMaXN0ZW5lcnMgPSBkZXNjcmlwdG9yLndpbGxDaGFuZ2VMaXN0ZW5lcnMuY3VycmVudCxcbiAgICAgICAgICAgIGN1cnJlbnRDaGFuZ2VMaXN0ZW5lcnMgPSBkZXNjcmlwdG9yLmNoYW5nZUxpc3RlbmVycy5jdXJyZW50O1xuXG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkoY3VycmVudFdpbGxDaGFuZ2VMaXN0ZW5lcnMpKSB7XG4gICAgICAgICAgICBjdXJyZW50V2lsbENoYW5nZUxpc3RlbmVycy5mb3JFYWNoKGZ1bmN0aW9uIChsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIGFycmF5LnJlbW92ZUJlZm9yZU1hcENoYW5nZUxpc3RlbmVyKGxpc3RlbmVyKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYoY3VycmVudFdpbGxDaGFuZ2VMaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGFycmF5LnJlbW92ZUJlZm9yZU1hcENoYW5nZUxpc3RlbmVyKGN1cnJlbnRXaWxsQ2hhbmdlTGlzdGVuZXJzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkoY3VycmVudENoYW5nZUxpc3RlbmVycykpIHtcbiAgICAgICAgICAgIGN1cnJlbnRDaGFuZ2VMaXN0ZW5lcnMuZm9yRWFjaChmdW5jdGlvbiAobGlzdGVuZXIpIHtcbiAgICAgICAgICAgICAgICBhcnJheS5yZW1vdmVNYXBDaGFuZ2VMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKGN1cnJlbnRDaGFuZ2VMaXN0ZW5lcnMpe1xuICAgICAgICAgICAgYXJyYXkucmVtb3ZlTWFwQ2hhbmdlTGlzdGVuZXIoY3VycmVudENoYW5nZUxpc3RlbmVycyk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtb2RpZnlcbiAgICAgICAgYXJyYXkuc3BsaWNlKDAsIDAsIDEsIDIsIDMpO1xuXG4gICAgICAgIC8vIG5vdGUgc2lsZW5jZVxuICAgICAgICBleHBlY3Qoc3B5KS5ub3QudG9IYXZlQmVlbkNhbGxlZCgpO1xuICAgIH0pO1xuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tIEZJTiAtLS0tLS0tLS0tLS0tLS0tLVxuXG4gICAgaXQoXCJoYW5kbGVzIGN5Y2xpYyBjb250ZW50IGNoYW5nZSBsaXN0ZW5lcnNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZm9vID0gW107XG4gICAgICAgIHZhciBiYXIgPSBbXTtcbiAgICAgICAgZm9vLmFkZFJhbmdlQ2hhbmdlTGlzdGVuZXIoZnVuY3Rpb24gKHBsdXMsIG1pbnVzLCBpbmRleCkge1xuICAgICAgICAgICAgLy8gaWYgdGhpcyBpcyBhIGNoYW5nZSBpbiByZXNwb25zZSB0byBhIGNoYW5nZSBpbiBiYXIsXG4gICAgICAgICAgICAvLyBkbyBub3Qgc2VuZCBiYWNrXG4gICAgICAgICAgICBpZiAoYmFyLmdldFJhbmdlQ2hhbmdlRGVzY3JpcHRvcigpLmlzQWN0aXZlKVxuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIGJhci5zcGxpY2UuYXBwbHkoYmFyLCBbaW5kZXgsIG1pbnVzLmxlbmd0aF0uY29uY2F0KHBsdXMpKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGJhci5hZGRSYW5nZUNoYW5nZUxpc3RlbmVyKGZ1bmN0aW9uIChwbHVzLCBtaW51cywgaW5kZXgpIHtcbiAgICAgICAgICAgIGlmIChmb28uZ2V0UmFuZ2VDaGFuZ2VEZXNjcmlwdG9yKCkuaXNBY3RpdmUpXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgZm9vLnNwbGljZS5hcHBseShmb28sIFtpbmRleCwgbWludXMubGVuZ3RoXS5jb25jYXQocGx1cykpO1xuICAgICAgICB9KTtcbiAgICAgICAgZm9vLnB1c2goMTAsIDIwLCAzMCk7XG4gICAgICAgIGV4cGVjdChiYXIpLnRvRXF1YWwoWzEwLCAyMCwgMzBdKTtcbiAgICAgICAgYmFyLnBvcCgpO1xuICAgICAgICBleHBlY3QoZm9vKS50b0VxdWFsKFsxMCwgMjBdKTtcbiAgICB9KTtcblxuICAgIGl0KFwib2JzZXJ2ZXMgbGVuZ3RoIGNoYW5nZXMgb24gYXJyYXlzIHRoYXQgYXJlIG5vdCBvdGhlcndpc2VkIG9ic2VydmVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFycmF5ID0gWzEsIDIsIDNdO1xuICAgICAgICB2YXIgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcbiAgICAgICAgYXJyYXkuYWRkT3duUHJvcGVydHlDaGFuZ2VMaXN0ZW5lcihcImxlbmd0aFwiLCBzcHkpO1xuICAgICAgICBhcnJheS5wdXNoKDQpO1xuICAgICAgICBleHBlY3Qoc3B5KS50b0hhdmVCZWVuQ2FsbGVkKCk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInNwbGljZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcnJheTtcbiAgICAgICAgYmVmb3JlRWFjaChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBhcnJheSA9IFswLCAxLCAyXTtcbiAgICAgICAgICAgIGFycmF5Lm1ha2VPYnNlcnZhYmxlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwiaGFuZGxlcyBhIG5lZ2F0aXZlIHN0YXJ0XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZW1vdmVkID0gYXJyYXkuc3BsaWNlKC0xLCAxKTtcbiAgICAgICAgICAgIGV4cGVjdChyZW1vdmVkKS50b0VxdWFsKFsyXSk7XG4gICAgICAgICAgICBleHBlY3QoYXJyYXkpLnRvRXF1YWwoWzAsIDFdKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJoYW5kbGVzIGEgbmVnYXRpdmUgbGVuZ3RoXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciByZW1vdmVkID0gYXJyYXkuc3BsaWNlKDEsIC0xKTtcbiAgICAgICAgICAgIGV4cGVjdChyZW1vdmVkKS50b0VxdWFsKFtdKTtcbiAgICAgICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChbMCwgMSwgMl0pO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgLy8gRGlzYWJsZWQgYmVjYXVzZSBpdCB0YWtlcyBmYXIgdG9vIGxvbmdcbiAgICB4ZGVzY3JpYmUoXCJzd2FwXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG90aGVyQXJyYXk7XG4gICAgICAgIGJlZm9yZUVhY2goZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgYXJyYXkubWFrZU9ic2VydmFibGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGl0KFwic2hvdWxkIHdvcmsgd2l0aCBsYXJnZSBhcnJheXNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgb3RoZXJBcnJheSA9IG5ldyBBcnJheSgyMDAwMDApO1xuICAgICAgICAgICAgLy8gU2hvdWxkIG5vdCB0aHJvdyBhIE1heGltdW0gY2FsbCBzdGFjayBzaXplIGV4Y2VlZGVkIGVycm9yLlxuICAgICAgICAgICAgZXhwZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBhcnJheS5zd2FwKDAsIGFycmF5Lmxlbmd0aCwgb3RoZXJBcnJheSk7XG4gICAgICAgICAgICB9KS5ub3QudG9UaHJvdygpO1xuICAgICAgICAgICAgZXhwZWN0KGFycmF5Lmxlbmd0aCkudG9FcXVhbCgyMDAwMDApO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSk7XG4iXX0=