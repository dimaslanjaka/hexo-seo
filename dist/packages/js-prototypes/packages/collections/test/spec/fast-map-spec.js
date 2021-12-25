"use strict";
var FastMap = require("collections/fast-map");
var describeDict = require("./dict");
var describeMap = require("./map");
var describeToJson = require("./to-json");
describe("FastMap-spec", function () {
    describeDict(FastMap);
    describeMap(FastMap);
    describeToJson(FastMap, [[{ a: 1 }, 10], [{ b: 2 }, 20], [{ c: 3 }, 30]]);
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFzdC1tYXAtc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvanMtcHJvdG90eXBlcy9wYWNrYWdlcy9jb2xsZWN0aW9ucy90ZXN0L3NwZWMvZmFzdC1tYXAtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFDOUMsSUFBSSxZQUFZLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3JDLElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNuQyxJQUFJLGNBQWMsR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFFMUMsUUFBUSxDQUFDLGNBQWMsRUFBRTtJQUNyQixZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDdEIsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ3JCLGNBQWMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLEVBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDeEUsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBGYXN0TWFwID0gcmVxdWlyZShcImNvbGxlY3Rpb25zL2Zhc3QtbWFwXCIpO1xudmFyIGRlc2NyaWJlRGljdCA9IHJlcXVpcmUoXCIuL2RpY3RcIik7XG52YXIgZGVzY3JpYmVNYXAgPSByZXF1aXJlKFwiLi9tYXBcIik7XG52YXIgZGVzY3JpYmVUb0pzb24gPSByZXF1aXJlKFwiLi90by1qc29uXCIpO1xuXG5kZXNjcmliZShcIkZhc3RNYXAtc3BlY1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgZGVzY3JpYmVEaWN0KEZhc3RNYXApO1xuICAgIGRlc2NyaWJlTWFwKEZhc3RNYXApO1xuICAgIGRlc2NyaWJlVG9Kc29uKEZhc3RNYXAsIFtbe2E6IDF9LCAxMF0sIFt7YjogMn0sIDIwXSwgW3tjOiAzfSwgMzBdXSk7XG59KTtcblxuIl19