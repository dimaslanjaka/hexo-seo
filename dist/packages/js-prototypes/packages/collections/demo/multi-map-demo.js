"use strict";
var MultiMap = require("../multi-map");
require("../shim-array"); // for Array#swap
var List = require("../list");
debugger;
var map = new MultiMap({ a: [1, 2, 3] }, List);
console.log(map);
var mapIter = map.keys(), key;
while (key = mapIter.next().value) {
    console.log(key);
}
console.log(map.get("a"));
console.log(map.get("a").toArray());
var before = map.get("a");
map.get("a").push(4);
console.log(map.get("a").toArray());
map.set("a", []);
console.log(map.get("a").toArray());
console.log(map.get("a") === before);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXVsdGktbWFwLWRlbW8uanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2pzLXByb3RvdHlwZXMvcGFja2FnZXMvY29sbGVjdGlvbnMvZGVtby9tdWx0aS1tYXAtZGVtby5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0FBQ3ZDLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLGlCQUFpQjtBQUMzQyxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFOUIsUUFBUSxDQUFDO0FBQ1QsSUFBSSxHQUFHLEdBQUcsSUFBSSxRQUFRLENBQUMsRUFBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNqQixJQUFJLE9BQU8sR0FBRyxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsR0FBRyxDQUFDO0FBQzlCLE9BQU8sR0FBRyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUU7SUFDL0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNwQjtBQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO0FBQ3BDLElBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDMUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDckIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDcEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7QUFDcEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLE1BQU0sQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgTXVsdGlNYXAgPSByZXF1aXJlKFwiLi4vbXVsdGktbWFwXCIpO1xucmVxdWlyZShcIi4uL3NoaW0tYXJyYXlcIik7IC8vIGZvciBBcnJheSNzd2FwXG52YXIgTGlzdCA9IHJlcXVpcmUoXCIuLi9saXN0XCIpO1xuXG5kZWJ1Z2dlcjtcbnZhciBtYXAgPSBuZXcgTXVsdGlNYXAoe2E6IFsxLCAyLCAzXX0sIExpc3QpO1xuY29uc29sZS5sb2cobWFwKTtcbnZhciBtYXBJdGVyID0gbWFwLmtleXMoKSwga2V5O1xud2hpbGUgKGtleSA9IG1hcEl0ZXIubmV4dCgpLnZhbHVlKSB7XG4gICAgY29uc29sZS5sb2coa2V5KTtcbn1cbmNvbnNvbGUubG9nKG1hcC5nZXQoXCJhXCIpKTtcbmNvbnNvbGUubG9nKG1hcC5nZXQoXCJhXCIpLnRvQXJyYXkoKSk7XG52YXIgYmVmb3JlID0gbWFwLmdldChcImFcIik7XG5tYXAuZ2V0KFwiYVwiKS5wdXNoKDQpO1xuY29uc29sZS5sb2cobWFwLmdldChcImFcIikudG9BcnJheSgpKTtcbm1hcC5zZXQoXCJhXCIsIFtdKTtcbmNvbnNvbGUubG9nKG1hcC5nZXQoXCJhXCIpLnRvQXJyYXkoKSk7XG5jb25zb2xlLmxvZyhtYXAuZ2V0KFwiYVwiKSA9PT0gYmVmb3JlKTtcbiJdfQ==