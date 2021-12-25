"use strict";
var Dict = require("collections/dict");
var describeDict = require("./dict");
var describeToJson = require("./to-json");
describe("Dict-spec", function () {
    describeDict(Dict);
    describeToJson(Dict, { a: 1, b: 2, c: 3 });
    it("should throw errors for non-string keys", function () {
        var dict = Dict();
        expect(function () {
            dict.get(0);
        }).toThrow();
        expect(function () {
            dict.set(0, 10);
        }).toThrow();
        expect(function () {
            dict.has(0);
        }).toThrow();
        expect(function () {
            dict.delete(0);
        }).toThrow();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGljdC1zcGVjLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9qcy1wcm90b3R5cGVzL3BhY2thZ2VzL2NvbGxlY3Rpb25zL3Rlc3Qvc3BlYy9kaWN0LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3ZDLElBQUksWUFBWSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNyQyxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFMUMsUUFBUSxDQUFDLFdBQVcsRUFBRTtJQUNsQixZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDbkIsY0FBYyxDQUFDLElBQUksRUFBRSxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztJQUV6QyxFQUFFLENBQUMseUNBQXlDLEVBQUU7UUFDMUMsSUFBSSxJQUFJLEdBQUcsSUFBSSxFQUFFLENBQUM7UUFDbEIsTUFBTSxDQUFDO1lBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE1BQU0sQ0FBQztZQUNILElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO1FBQ3BCLENBQUMsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2IsTUFBTSxDQUFDO1lBQ0gsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNiLE1BQU0sQ0FBQztZQUNILElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkIsQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDakIsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlxudmFyIERpY3QgPSByZXF1aXJlKFwiY29sbGVjdGlvbnMvZGljdFwiKTtcbnZhciBkZXNjcmliZURpY3QgPSByZXF1aXJlKFwiLi9kaWN0XCIpO1xudmFyIGRlc2NyaWJlVG9Kc29uID0gcmVxdWlyZShcIi4vdG8tanNvblwiKTtcblxuZGVzY3JpYmUoXCJEaWN0LXNwZWNcIiwgZnVuY3Rpb24gKCkge1xuICAgIGRlc2NyaWJlRGljdChEaWN0KTtcbiAgICBkZXNjcmliZVRvSnNvbihEaWN0LCB7YTogMSwgYjogMiwgYzogM30pO1xuXG4gICAgaXQoXCJzaG91bGQgdGhyb3cgZXJyb3JzIGZvciBub24tc3RyaW5nIGtleXNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGljdCA9IERpY3QoKTtcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRpY3QuZ2V0KDApO1xuICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIGV4cGVjdChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaWN0LnNldCgwLCAxMCk7XG4gICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGRpY3QuaGFzKDApO1xuICAgICAgICB9KS50b1Rocm93KCk7XG4gICAgICAgIGV4cGVjdChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBkaWN0LmRlbGV0ZSgwKTtcbiAgICAgICAgfSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG59KTtcblxuIl19