"use strict";
require("collections/shim-object");
require("collections/shim-function");
describe("FunctionShim-spec", function () {
    describe("identity", function () {
        it("should return the first argument", function () {
            expect(Function.identity(1, 2, 3)).toBe(1);
        });
    });
    describe("noop", function () {
        // should do nothing (not verifiable)
        it("should return nothing", function () {
            expect(Function.noop(1, 2, 3)).toBe(undefined);
        });
    });
    describe("by", function () {
        var getA = function (x) {
            return x.a;
        };
        var wrappedCompare = function (a, b) {
            return Object.compare(a, b);
        };
        var compare = Function.by(getA, wrappedCompare);
        it("should compare two values", function () {
            expect(compare({ a: 10 }, { a: 20 })).toBe(-10);
        });
        it("should have a by property", function () {
            expect(compare.by).toBe(getA);
        });
        it("should have a compare property", function () {
            expect(compare.compare).toBe(wrappedCompare);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpbS1mdW5jdGlvbnMtc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvanMtcHJvdG90eXBlcy9wYWNrYWdlcy9jb2xsZWN0aW9ucy90ZXN0L3NwZWMvc2hpbS1mdW5jdGlvbnMtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUM7QUFDbkMsT0FBTyxDQUFDLDJCQUEyQixDQUFDLENBQUM7QUFFckMsUUFBUSxDQUFDLG1CQUFtQixFQUFFO0lBRTFCLFFBQVEsQ0FBQyxVQUFVLEVBQUU7UUFFakIsRUFBRSxDQUFDLGtDQUFrQyxFQUFFO1lBQ25DLE1BQU0sQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxNQUFNLEVBQUU7UUFFYixxQ0FBcUM7UUFFckMsRUFBRSxDQUFDLHVCQUF1QixFQUFFO1lBQ3hCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFFUCxDQUFDLENBQUMsQ0FBQztJQUVILFFBQVEsQ0FBQyxJQUFJLEVBQUU7UUFDWCxJQUFJLElBQUksR0FBRyxVQUFVLENBQUM7WUFDbEIsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxjQUFjLEdBQUcsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUMvQixPQUFPLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQztRQUNGLElBQUksT0FBTyxHQUFHLFFBQVEsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRWhELEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtZQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxFQUFFLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNoRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQywyQkFBMkIsRUFBRTtZQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNsQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyxnQ0FBZ0MsRUFBRTtZQUNqQyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUVQLENBQUMsQ0FBQyxDQUFDO0FBRVAsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbnJlcXVpcmUoXCJjb2xsZWN0aW9ucy9zaGltLW9iamVjdFwiKTtcbnJlcXVpcmUoXCJjb2xsZWN0aW9ucy9zaGltLWZ1bmN0aW9uXCIpO1xuXG5kZXNjcmliZShcIkZ1bmN0aW9uU2hpbS1zcGVjXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgIGRlc2NyaWJlKFwiaWRlbnRpdHlcIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGl0KFwic2hvdWxkIHJldHVybiB0aGUgZmlyc3QgYXJndW1lbnRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KEZ1bmN0aW9uLmlkZW50aXR5KDEsIDIsIDMpKS50b0JlKDEpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJub29wXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICAvLyBzaG91bGQgZG8gbm90aGluZyAobm90IHZlcmlmaWFibGUpXG5cbiAgICAgICAgaXQoXCJzaG91bGQgcmV0dXJuIG5vdGhpbmdcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KEZ1bmN0aW9uLm5vb3AoMSwgMiwgMykpLnRvQmUodW5kZWZpbmVkKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiYnlcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZ2V0QSA9IGZ1bmN0aW9uICh4KSB7XG4gICAgICAgICAgICByZXR1cm4geC5hO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgd3JhcHBlZENvbXBhcmUgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5jb21wYXJlKGEsIGIpO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgY29tcGFyZSA9IEZ1bmN0aW9uLmJ5KGdldEEsIHdyYXBwZWRDb21wYXJlKTtcblxuICAgICAgICBpdChcInNob3VsZCBjb21wYXJlIHR3byB2YWx1ZXNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KGNvbXBhcmUoe2E6IDEwfSwge2E6IDIwfSkpLnRvQmUoLTEwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgaGF2ZSBhIGJ5IHByb3BlcnR5XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChjb21wYXJlLmJ5KS50b0JlKGdldEEpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCBoYXZlIGEgY29tcGFyZSBwcm9wZXJ0eVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleHBlY3QoY29tcGFyZS5jb21wYXJlKS50b0JlKHdyYXBwZWRDb21wYXJlKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxufSk7XG5cbiJdfQ==