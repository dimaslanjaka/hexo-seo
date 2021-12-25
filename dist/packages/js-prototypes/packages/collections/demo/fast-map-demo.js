"use strict";
var Map = require("../fast-map");
var map = new Map();
map.set('a', 10);
map.set('b', 20);
var mapIter = map.keys(), key;
while (key = mapIter.next().value) {
    console.log(key);
}
var map = new Map();
var a = { am: "a" }, b = { am: "b" }, c = { am: "c" };
map.set(a, 10);
map.set(b, 20);
map.set(c, 30);
console.log(map.get(b));
map.log();
map.forEach(function (value, key) {
    console.log(key + ': ' + value);
});
map.delete(a);
var mapIter = map.values(), value, values = [];
while (value = mapIter.next().value) {
    values.push(value);
}
console.log(values);
console.log('\nclone');
console.log(map.clone().entriesArray());
console.log(new Map().entriesArray());
console.log(new Map({ a: 10, b: 20 }).entriesArray());
console.log(new Map(['a', 'b', 'c']).entriesArray());
console.log(new Map(new Map({ a: 10, b: 20 })).entriesArray());
console.log(new Map({ a: 10, b: 20 }).concat({ c: 30, d: 40 }).toObject());
// a case that may (depending on engine) distinguish a fast map from a map
// (with keys in insertion order)
var map = new Map();
map.set(10, 'b');
map.set(0, 'a');
console.log(map.toArray());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFzdC1tYXAtZGVtby5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvanMtcHJvdG90eXBlcy9wYWNrYWdlcy9jb2xsZWN0aW9ucy9kZW1vL2Zhc3QtbWFwLWRlbW8uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUVqQyxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2pCLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBRWpCLElBQUksT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLEVBQUUsRUFBRSxHQUFHLENBQUM7QUFDOUIsT0FBTyxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssRUFBRTtJQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0NBQ3BCO0FBRUQsSUFBSSxHQUFHLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztBQUNwQixJQUFJLENBQUMsR0FBRyxFQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUMsRUFBRSxDQUFDLEdBQUcsRUFBQyxFQUFFLEVBQUUsR0FBRyxFQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUMsRUFBRSxFQUFFLEdBQUcsRUFBQyxDQUFDO0FBQ2hELEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2YsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDZixHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNmLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3hCLEdBQUcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUVWLEdBQUcsQ0FBQyxPQUFPLENBQUMsVUFBVSxLQUFLLEVBQUUsR0FBRztJQUM1QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsR0FBRyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUM7QUFDcEMsQ0FBQyxDQUFDLENBQUM7QUFFSCxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRWQsSUFBSSxPQUFPLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQy9DLE9BQU8sS0FBSyxHQUFHLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLEVBQUU7SUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztDQUN0QjtBQUNELE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFFcEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBRXhDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBQ3RDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDLFlBQVksRUFBRSxDQUFDLENBQUM7QUFDcEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxDQUFDO0FBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxHQUFHLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQztBQUU3RCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksR0FBRyxDQUFDLEVBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFdkUsMEVBQTBFO0FBQzFFLGlDQUFpQztBQUNqQyxJQUFJLEdBQUcsR0FBRyxJQUFJLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLEdBQUcsQ0FBQyxHQUFHLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2pCLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBNYXAgPSByZXF1aXJlKFwiLi4vZmFzdC1tYXBcIik7XG5cbnZhciBtYXAgPSBuZXcgTWFwKCk7XG5tYXAuc2V0KCdhJywgMTApO1xubWFwLnNldCgnYicsIDIwKTtcblxudmFyIG1hcEl0ZXIgPSBtYXAua2V5cygpLCBrZXk7XG53aGlsZSAoa2V5ID0gbWFwSXRlci5uZXh0KCkudmFsdWUpIHtcbiAgICBjb25zb2xlLmxvZyhrZXkpO1xufVxuXG52YXIgbWFwID0gbmV3IE1hcCgpO1xudmFyIGEgPSB7YW06IFwiYVwifSwgYiA9IHthbTogXCJiXCJ9LCBjID0ge2FtOiBcImNcIn07XG5tYXAuc2V0KGEsIDEwKTtcbm1hcC5zZXQoYiwgMjApO1xubWFwLnNldChjLCAzMCk7XG5jb25zb2xlLmxvZyhtYXAuZ2V0KGIpKTtcbm1hcC5sb2coKTtcblxubWFwLmZvckVhY2goZnVuY3Rpb24gKHZhbHVlLCBrZXkpIHtcbiAgICBjb25zb2xlLmxvZyhrZXkgKyAnOiAnICsgdmFsdWUpO1xufSk7XG5cbm1hcC5kZWxldGUoYSk7XG5cbnZhciBtYXBJdGVyID0gbWFwLnZhbHVlcygpLCB2YWx1ZSwgdmFsdWVzID0gW107XG53aGlsZSAodmFsdWUgPSBtYXBJdGVyLm5leHQoKS52YWx1ZSkge1xuICAgIHZhbHVlcy5wdXNoKHZhbHVlKTtcbn1cbmNvbnNvbGUubG9nKHZhbHVlcyk7XG5cbmNvbnNvbGUubG9nKCdcXG5jbG9uZScpO1xuY29uc29sZS5sb2cobWFwLmNsb25lKCkuZW50cmllc0FycmF5KCkpO1xuXG5jb25zb2xlLmxvZyhuZXcgTWFwKCkuZW50cmllc0FycmF5KCkpO1xuY29uc29sZS5sb2cobmV3IE1hcCh7YTogMTAsIGI6IDIwfSkuZW50cmllc0FycmF5KCkpO1xuY29uc29sZS5sb2cobmV3IE1hcChbJ2EnLCAnYicsICdjJ10pLmVudHJpZXNBcnJheSgpKTtcbmNvbnNvbGUubG9nKG5ldyBNYXAobmV3IE1hcCh7YTogMTAsIGI6IDIwfSkpLmVudHJpZXNBcnJheSgpKTtcblxuY29uc29sZS5sb2cobmV3IE1hcCh7YTogMTAsIGI6IDIwfSkuY29uY2F0KHtjOiAzMCwgZDogNDB9KS50b09iamVjdCgpKTtcblxuLy8gYSBjYXNlIHRoYXQgbWF5IChkZXBlbmRpbmcgb24gZW5naW5lKSBkaXN0aW5ndWlzaCBhIGZhc3QgbWFwIGZyb20gYSBtYXBcbi8vICh3aXRoIGtleXMgaW4gaW5zZXJ0aW9uIG9yZGVyKVxudmFyIG1hcCA9IG5ldyBNYXAoKTtcbm1hcC5zZXQoMTAsICdiJyk7XG5tYXAuc2V0KDAsICdhJyk7XG5jb25zb2xlLmxvZyhtYXAudG9BcnJheSgpKTtcbiJdfQ==