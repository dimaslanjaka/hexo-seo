"use strict";
console.log('montage-testing', 'Start');
module.exports = require("montage-testing").run(require, [
    "spec/array-spec",
    "spec/clone-spec",
    "spec/deque-spec",
    "spec/dict-spec",
    "spec/fast-map-spec",
    "spec/fast-set-spec",
    "spec/heap-spec",
    "spec/iterator-spec",
    "spec/lfu-map-spec",
    "spec/lfu-set-spec",
    "spec/list-spec",
    "spec/listen/array-changes-spec",
    "spec/listen/property-changes-spec",
    "spec/lru-map-spec",
    "spec/lru-set-spec",
    "spec/map-spec",
    "spec/multi-map-spec",
    "spec/regexp-spec",
    "spec/set-spec",
    "spec/shim-array-spec",
    "spec/shim-functions-spec",
    "spec/shim-object-spec",
    "spec/sorted-array-map-spec",
    "spec/sorted-array-set-spec",
    "spec/sorted-array-spec",
    "spec/sorted-map-spec",
    "spec/sorted-set-spec"
]).then(function () {
    console.log('montage-testing', 'End');
}, function (err) {
    console.log('montage-testing', 'Fail', err, err.stack);
    throw err;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9qcy1wcm90b3R5cGVzL3BhY2thZ2VzL2NvbGxlY3Rpb25zL3Rlc3QvYWxsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3hDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDLGlCQUFpQixDQUFDLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRTtJQUNyRCxpQkFBaUI7SUFDcEIsaUJBQWlCO0lBQ2pCLGlCQUFpQjtJQUNqQixnQkFBZ0I7SUFDaEIsb0JBQW9CO0lBQ3BCLG9CQUFvQjtJQUNwQixnQkFBZ0I7SUFDaEIsb0JBQW9CO0lBQ3BCLG1CQUFtQjtJQUNuQixtQkFBbUI7SUFDbkIsZ0JBQWdCO0lBQ2hCLGdDQUFnQztJQUNoQyxtQ0FBbUM7SUFDbkMsbUJBQW1CO0lBQ25CLG1CQUFtQjtJQUNuQixlQUFlO0lBQ2YscUJBQXFCO0lBQ3JCLGtCQUFrQjtJQUNsQixlQUFlO0lBQ2Ysc0JBQXNCO0lBQ3RCLDBCQUEwQjtJQUMxQix1QkFBdUI7SUFDdkIsNEJBQTRCO0lBQzVCLDRCQUE0QjtJQUM1Qix3QkFBd0I7SUFDeEIsc0JBQXNCO0lBQ3RCLHNCQUFzQjtDQUN0QixDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ0osT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUMxQyxDQUFDLEVBQUUsVUFBVSxHQUFHO0lBQ1osT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUN2RCxNQUFNLEdBQUcsQ0FBQztBQUNkLENBQUMsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiY29uc29sZS5sb2coJ21vbnRhZ2UtdGVzdGluZycsICdTdGFydCcpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9udGFnZS10ZXN0aW5nXCIpLnJ1bihyZXF1aXJlLCBbXG4gICAgXCJzcGVjL2FycmF5LXNwZWNcIixcblx0XCJzcGVjL2Nsb25lLXNwZWNcIixcblx0XCJzcGVjL2RlcXVlLXNwZWNcIixcblx0XCJzcGVjL2RpY3Qtc3BlY1wiLFxuXHRcInNwZWMvZmFzdC1tYXAtc3BlY1wiLFxuXHRcInNwZWMvZmFzdC1zZXQtc3BlY1wiLFxuXHRcInNwZWMvaGVhcC1zcGVjXCIsXG5cdFwic3BlYy9pdGVyYXRvci1zcGVjXCIsXG5cdFwic3BlYy9sZnUtbWFwLXNwZWNcIixcblx0XCJzcGVjL2xmdS1zZXQtc3BlY1wiLFxuXHRcInNwZWMvbGlzdC1zcGVjXCIsXG5cdFwic3BlYy9saXN0ZW4vYXJyYXktY2hhbmdlcy1zcGVjXCIsXG5cdFwic3BlYy9saXN0ZW4vcHJvcGVydHktY2hhbmdlcy1zcGVjXCIsXG5cdFwic3BlYy9scnUtbWFwLXNwZWNcIixcblx0XCJzcGVjL2xydS1zZXQtc3BlY1wiLFxuXHRcInNwZWMvbWFwLXNwZWNcIixcblx0XCJzcGVjL211bHRpLW1hcC1zcGVjXCIsXG5cdFwic3BlYy9yZWdleHAtc3BlY1wiLFxuXHRcInNwZWMvc2V0LXNwZWNcIixcblx0XCJzcGVjL3NoaW0tYXJyYXktc3BlY1wiLFxuXHRcInNwZWMvc2hpbS1mdW5jdGlvbnMtc3BlY1wiLFxuXHRcInNwZWMvc2hpbS1vYmplY3Qtc3BlY1wiLFxuXHRcInNwZWMvc29ydGVkLWFycmF5LW1hcC1zcGVjXCIsXG5cdFwic3BlYy9zb3J0ZWQtYXJyYXktc2V0LXNwZWNcIixcblx0XCJzcGVjL3NvcnRlZC1hcnJheS1zcGVjXCIsXG5cdFwic3BlYy9zb3J0ZWQtbWFwLXNwZWNcIixcblx0XCJzcGVjL3NvcnRlZC1zZXQtc3BlY1wiXG5dKS50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICBjb25zb2xlLmxvZygnbW9udGFnZS10ZXN0aW5nJywgJ0VuZCcpO1xufSwgZnVuY3Rpb24gKGVycikge1xuICAgIGNvbnNvbGUubG9nKCdtb250YWdlLXRlc3RpbmcnLCAnRmFpbCcsIGVyciwgZXJyLnN0YWNrKTtcbiAgICB0aHJvdyBlcnI7XG59KTsiXX0=