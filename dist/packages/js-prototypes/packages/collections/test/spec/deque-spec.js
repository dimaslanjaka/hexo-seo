"use strict";
var Deque = require("collections/deque");
var describeDeque = require("./deque");
var describeOrder = require("./order");
var describeToJson = require("./to-json");
describe("Deque-spec", function () {
    it("just the facts", function () {
        var deque = new Deque();
        expect(deque.length).toBe(0);
        expect(deque.capacity).toBe(16);
        deque.push(10);
        expect(deque.length).toBe(1);
        expect(deque.shift()).toBe(10);
        expect(deque.length).toBe(0);
        deque.push(20);
        expect(deque.length).toBe(1);
        deque.push(30);
        expect(deque.length).toBe(2);
        expect(deque.shift()).toBe(20);
        expect(deque.length).toBe(1);
        expect(deque.shift()).toBe(30);
        expect(deque.length).toBe(0);
        expect(deque.capacity).toBe(16);
    });
    it("grows", function () {
        var deque = Deque();
        for (var i = 0; i < 16; i++) {
            expect(deque.length).toBe(i);
            deque.push(i);
            expect(deque.capacity).toBe(16);
        }
        deque.push(i);
        expect(deque.capacity).toBe(64);
    });
    it("initializes", function () {
        var deque = new Deque([1, 2, 3]);
        expect(deque.length).toBe(3);
        expect(deque.shift()).toBe(1);
        expect(deque.shift()).toBe(2);
        expect(deque.shift()).toBe(3);
    });
    it("does not get in a funk", function () {
        var deque = Deque();
        expect(deque.shift()).toBe(undefined);
        deque.push(4);
        expect(deque.shift()).toBe(4);
    });
    it("dispatches range changes", function () {
        var spy = jasmine.createSpy();
        var handler = function (plus, minus, value) {
            spy(plus, minus, value); // ignore last arg
        };
        var deque = Deque();
        deque.addRangeChangeListener(handler);
        deque.push(1);
        deque.push(2, 3);
        deque.pop();
        deque.shift();
        deque.unshift(4, 5);
        deque.removeRangeChangeListener(handler);
        deque.shift();
        var argsForCall = spy.calls.all().map(function (call) { return call.args; });
        expect(argsForCall).toEqual([
            [[1], [], 0],
            [[2, 3], [], 1],
            [[], [3], 2],
            [[], [1], 0],
            [[4, 5], [], 0]
        ]);
    });
    // from https://github.com/petkaantonov/deque
    describe('get', function () {
        it("should return undefined on nonsensical argument", function () {
            var a = new Deque([1, 2, 3, 4]);
            expect(a.get(-5)).toBe(void 0);
            expect(a.get(-100)).toBe(void 0);
            expect(a.get(void 0)).toBe(void 0);
            expect(a.get("1")).toBe(void 0);
            expect(a.get(NaN)).toBe(void 0);
            expect(a.get(Infinity)).toBe(void 0);
            expect(a.get(-Infinity)).toBe(void 0);
            expect(a.get(1.5)).toBe(void 0);
            expect(a.get(4)).toBe(void 0);
        });
        it("should support positive indexing", function () {
            var a = new Deque([1, 2, 3, 4]);
            expect(a.get(0)).toBe(1);
            expect(a.get(1)).toBe(2);
            expect(a.get(2)).toBe(3);
            expect(a.get(3)).toBe(4);
        });
        it("should support negative indexing", function () {
            var a = new Deque([1, 2, 3, 4]);
            expect(a.get(-1)).toBe(4);
            expect(a.get(-2)).toBe(3);
            expect(a.get(-3)).toBe(2);
            expect(a.get(-4)).toBe(1);
        });
    });
    describeDeque(Deque);
    describeOrder(Deque);
    describeToJson(Deque, [1, 2, 3, 4]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVxdWUtc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvanMtcHJvdG90eXBlcy9wYWNrYWdlcy9jb2xsZWN0aW9ucy90ZXN0L3NwZWMvZGVxdWUtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7QUFDekMsSUFBSSxhQUFhLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3ZDLElBQUksYUFBYSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2QyxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFMUMsUUFBUSxDQUFDLFlBQVksRUFBRTtJQUVuQixFQUFFLENBQUMsZ0JBQWdCLEVBQUU7UUFDakIsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztRQUN4QixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM3QixNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUVoQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3QixLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJ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Q0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5QixDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0lBRUgsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3JCLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQixjQUFjLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUV4QyxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxudmFyIERlcXVlID0gcmVxdWlyZShcImNvbGxlY3Rpb25zL2RlcXVlXCIpO1xudmFyIGRlc2NyaWJlRGVxdWUgPSByZXF1aXJlKFwiLi9kZXF1ZVwiKTtcbnZhciBkZXNjcmliZU9yZGVyID0gcmVxdWlyZShcIi4vb3JkZXJcIik7XG52YXIgZGVzY3JpYmVUb0pzb24gPSByZXF1aXJlKFwiLi90by1qc29uXCIpO1xuXG5kZXNjcmliZShcIkRlcXVlLXNwZWNcIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgaXQoXCJqdXN0IHRoZSBmYWN0c1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZXF1ZSA9IG5ldyBEZXF1ZSgpO1xuICAgICAgICBleHBlY3QoZGVxdWUubGVuZ3RoKS50b0JlKDApO1xuICAgICAgICBleHBlY3QoZGVxdWUuY2FwYWNpdHkpLnRvQmUoMTYpO1xuXG4gICAgICAgIGRlcXVlLnB1c2goMTApO1xuICAgICAgICBleHBlY3QoZGVxdWUubGVuZ3RoKS50b0JlKDEpO1xuICAgICAgICBleHBlY3QoZGVxdWUuc2hpZnQoKSkudG9CZSgxMCk7XG4gICAgICAgIGV4cGVjdChkZXF1ZS5sZW5ndGgpLnRvQmUoMCk7XG5cbiAgICAgICAgZGVxdWUucHVzaCgyMCk7XG4gICAgICAgIGV4cGVjdChkZXF1ZS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgIGRlcXVlLnB1c2goMzApO1xuICAgICAgICBleHBlY3QoZGVxdWUubGVuZ3RoKS50b0JlKDIpO1xuICAgICAgICBleHBlY3QoZGVxdWUuc2hpZnQoKSkudG9CZSgyMCk7XG4gICAgICAgIGV4cGVjdChkZXF1ZS5sZW5ndGgpLnRvQmUoMSk7XG4gICAgICAgIGV4cGVjdChkZXF1ZS5zaGlmdCgpKS50b0JlKDMwKTtcbiAgICAgICAgZXhwZWN0KGRlcXVlLmxlbmd0aCkudG9CZSgwKTtcblxuICAgICAgICBleHBlY3QoZGVxdWUuY2FwYWNpdHkpLnRvQmUoMTYpO1xuXG4gICAgfSk7XG5cbiAgICBpdChcImdyb3dzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlcXVlID0gRGVxdWUoKTtcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDE2OyBpKyspIHtcbiAgICAgICAgICAgIGV4cGVjdChkZXF1ZS5sZW5ndGgpLnRvQmUoaSk7XG4gICAgICAgICAgICBkZXF1ZS5wdXNoKGkpO1xuICAgICAgICAgICAgZXhwZWN0KGRlcXVlLmNhcGFjaXR5KS50b0JlKDE2KTtcbiAgICAgICAgfVxuICAgICAgICBkZXF1ZS5wdXNoKGkpO1xuICAgICAgICBleHBlY3QoZGVxdWUuY2FwYWNpdHkpLnRvQmUoNjQpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJpbml0aWFsaXplc1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkZXF1ZSA9IG5ldyBEZXF1ZShbMSwgMiwgM10pO1xuICAgICAgICBleHBlY3QoZGVxdWUubGVuZ3RoKS50b0JlKDMpO1xuICAgICAgICBleHBlY3QoZGVxdWUuc2hpZnQoKSkudG9CZSgxKTtcbiAgICAgICAgZXhwZWN0KGRlcXVlLnNoaWZ0KCkpLnRvQmUoMik7XG4gICAgICAgIGV4cGVjdChkZXF1ZS5zaGlmdCgpKS50b0JlKDMpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJkb2VzIG5vdCBnZXQgaW4gYSBmdW5rXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRlcXVlID0gRGVxdWUoKTtcbiAgICAgICAgZXhwZWN0KGRlcXVlLnNoaWZ0KCkpLnRvQmUodW5kZWZpbmVkKTtcbiAgICAgICAgZGVxdWUucHVzaCg0KTtcbiAgICAgICAgZXhwZWN0KGRlcXVlLnNoaWZ0KCkpLnRvQmUoNCk7XG4gICAgfSk7XG5cbiAgICBpdChcImRpc3BhdGNoZXMgcmFuZ2UgY2hhbmdlc1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzcHkgPSBqYXNtaW5lLmNyZWF0ZVNweSgpO1xuICAgICAgICB2YXIgaGFuZGxlciA9IGZ1bmN0aW9uIChwbHVzLCBtaW51cywgdmFsdWUpIHtcbiAgICAgICAgICAgIHNweShwbHVzLCBtaW51cywgdmFsdWUpOyAvLyBpZ25vcmUgbGFzdCBhcmdcbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGRlcXVlID0gRGVxdWUoKTtcbiAgICAgICAgZGVxdWUuYWRkUmFuZ2VDaGFuZ2VMaXN0ZW5lcihoYW5kbGVyKTtcbiAgICAgICAgZGVxdWUucHVzaCgxKTtcbiAgICAgICAgZGVxdWUucHVzaCgyLCAzKTtcbiAgICAgICAgZGVxdWUucG9wKCk7XG4gICAgICAgIGRlcXVlLnNoaWZ0KCk7XG4gICAgICAgIGRlcXVlLnVuc2hpZnQoNCwgNSk7XG4gICAgICAgIGRlcXVlLnJlbW92ZVJhbmdlQ2hhbmdlTGlzdGVuZXIoaGFuZGxlcik7XG4gICAgICAgIGRlcXVlLnNoaWZ0KCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgYXJnc0ZvckNhbGwgPSBzcHkuY2FsbHMuYWxsKCkubWFwKGZ1bmN0aW9uIChjYWxsKSB7IHJldHVybiBjYWxsLmFyZ3MgfSk7XG4gICAgICAgIGV4cGVjdChhcmdzRm9yQ2FsbCkudG9FcXVhbChbXG4gICAgICAgICAgICBbWzFdLCBbXSwgMF0sXG4gICAgICAgICAgICBbWzIsIDNdLCBbXSwgMV0sXG4gICAgICAgICAgICBbW10sIFszXSwgMl0sXG4gICAgICAgICAgICBbW10sIFsxXSwgMF0sXG4gICAgICAgICAgICBbWzQsIDVdLCBbXSwgMF1cbiAgICAgICAgXSk7XG4gICAgfSk7XG5cbiAgICAvLyBmcm9tIGh0dHBzOi8vZ2l0aHViLmNvbS9wZXRrYWFudG9ub3YvZGVxdWVcblxuICAgIGRlc2NyaWJlKCdnZXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGl0KFwic2hvdWxkIHJldHVybiB1bmRlZmluZWQgb24gbm9uc2Vuc2ljYWwgYXJndW1lbnRcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYSA9IG5ldyBEZXF1ZShbMSwyLDMsNF0pO1xuICAgICAgICAgICAgZXhwZWN0KGEuZ2V0KC01KSkudG9CZSh2b2lkIDApO1xuICAgICAgICAgICAgZXhwZWN0KGEuZ2V0KC0xMDApKS50b0JlKHZvaWQgMCk7XG4gICAgICAgICAgICBleHBlY3QoYS5nZXQodm9pZCAwKSkudG9CZSh2b2lkIDApO1xuICAgICAgICAgICAgZXhwZWN0KGEuZ2V0KFwiMVwiKSkudG9CZSh2b2lkIDApO1xuICAgICAgICAgICAgZXhwZWN0KGEuZ2V0KE5hTikpLnRvQmUodm9pZCAwKTtcbiAgICAgICAgICAgIGV4cGVjdChhLmdldChJbmZpbml0eSkpLnRvQmUodm9pZCAwKTtcbiAgICAgICAgICAgIGV4cGVjdChhLmdldCgtSW5maW5pdHkpKS50b0JlKHZvaWQgMCk7XG4gICAgICAgICAgICBleHBlY3QoYS5nZXQoMS41KSkudG9CZSh2b2lkIDApO1xuICAgICAgICAgICAgZXhwZWN0KGEuZ2V0KDQpKS50b0JlKHZvaWQgMCk7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgaXQoXCJzaG91bGQgc3VwcG9ydCBwb3NpdGl2ZSBpbmRleGluZ1wiLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBhID0gbmV3IERlcXVlKFsxLDIsMyw0XSk7XG4gICAgICAgICAgICBleHBlY3QoYS5nZXQoMCkpLnRvQmUoMSk7XG4gICAgICAgICAgICBleHBlY3QoYS5nZXQoMSkpLnRvQmUoMik7XG4gICAgICAgICAgICBleHBlY3QoYS5nZXQoMikpLnRvQmUoMyk7XG4gICAgICAgICAgICBleHBlY3QoYS5nZXQoMykpLnRvQmUoNCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIHN1cHBvcnQgbmVnYXRpdmUgaW5kZXhpbmdcIiwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgYSA9IG5ldyBEZXF1ZShbMSwyLDMsNF0pO1xuICAgICAgICAgICAgZXhwZWN0KGEuZ2V0KC0xKSkudG9CZSg0KTtcbiAgICAgICAgICAgIGV4cGVjdChhLmdldCgtMikpLnRvQmUoMyk7XG4gICAgICAgICAgICBleHBlY3QoYS5nZXQoLTMpKS50b0JlKDIpO1xuICAgICAgICAgICAgZXhwZWN0KGEuZ2V0KC00KSkudG9CZSgxKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZURlcXVlKERlcXVlKTtcbiAgICBkZXNjcmliZU9yZGVyKERlcXVlKTtcbiAgICBkZXNjcmliZVRvSnNvbihEZXF1ZSwgWzEsIDIsIDMsIDRdKTtcblxufSk7XG5cbiJdfQ==