"use strict";
var List = require("../list");
var list = new List([1, 2, 3]);
list.push(4, 5, 6);
list.unshift(-3, -2, -1, 0);
list.pop();
list.forEach(function (value) {
    console.log(value);
});
console.log("length", list.length);
console.log("min", list.min());
console.log("max", list.max());
console.log("sum", list.sum());
console.log("average", list.average());
console.log(list.slice());
console.log(list.slice(list.find(0)));
console.log(list.slice(list.find(0), list.find(4)));
console.log(list.slice(list.find(0), list.find(4).next));
console.log(list.splice(list.find(0), 2, 'a', 'b', 'c'), list.slice());
console.log(new List([1]).only());
console.log(new List([1, 2, 3]).one());
console.log(new List([4, 2, 3, 1]).sorted());
console.log(new List([1, 2, 3]).zip([1, 2, 3, 4]));
console.log(new List([1, 2, 3]).equals([1, 2, 3]));
console.log(new List([1, 2, 3]).equals([1, 2, 3, 4]));
console.log(new List([1, 2, 3, 4]).equals([1, 2, 3]));
console.log(new List([1, 2, 3]).equals([3, 2, 1]));
var SortedSet = require("../sorted-set");
console.log(new List([1, 2, 3]).concat(new List([4, 5, 6]), new List([7, 8, 9]))
    .concat([10, 11, 12])
    .concat(new SortedSet([15, 13, 14]))
    .toArray());
var list = new List([1, 2, 3, 4]);
console.log(list.slice());
console.log(list.slice(0));
console.log(list.slice(1));
console.log(list.slice(-2));
console.log(list.slice(-3, 2));
console.log(list.slice(-3, -2));
console.log(list.slice(-3, -1));
console.log(list.slice(0, 0));
console.log(list.slice(-1, 0));
console.log(list.slice(0, 1));
console.log(list.slice(1, 1));
console.log(list.slice(1, 2));
console.log(list.slice(list.head.next, 2));
console.log(list.slice(list.head.next, list.head));
console.log(list.slice(list.head.next, list.head.prev));
list.reverse();
console.log(list.slice());
console.log(list.sorted());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1kZW1vLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9qcy1wcm90b3R5cGVzL3BhY2thZ2VzL2NvbGxlY3Rpb25zL2RlbW8vbGlzdC1kZW1vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFFOUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDN0IsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7QUFDNUIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ1gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEtBQUs7SUFDeEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUN2QixDQUFDLENBQUMsQ0FBQztBQUVILE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQztBQUV2QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNwRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDekQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7QUFFdkUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztBQUNsQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFFdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztBQUU3QyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsQ0FB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LENBQUMsQ0FBQztBQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDOUIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM5QixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMzQyxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDbkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUV4RCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDZixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0FBQzFCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBMaXN0ID0gcmVxdWlyZShcIi4uL2xpc3RcIik7XG5cbnZhciBsaXN0ID0gbmV3IExpc3QoWzEsMiwzXSk7XG5saXN0LnB1c2goNCwgNSwgNik7XG5saXN0LnVuc2hpZnQoLTMsIC0yLCAtMSwgMCk7XG5saXN0LnBvcCgpO1xubGlzdC5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbn0pO1xuXG5jb25zb2xlLmxvZyhcImxlbmd0aFwiLCBsaXN0Lmxlbmd0aCk7XG5jb25zb2xlLmxvZyhcIm1pblwiLCBsaXN0Lm1pbigpKTtcbmNvbnNvbGUubG9nKFwibWF4XCIsIGxpc3QubWF4KCkpO1xuY29uc29sZS5sb2coXCJzdW1cIiwgbGlzdC5zdW0oKSk7XG5jb25zb2xlLmxvZyhcImF2ZXJhZ2VcIiwgbGlzdC5hdmVyYWdlKCkpO1xuXG5jb25zb2xlLmxvZyhsaXN0LnNsaWNlKCkpO1xuY29uc29sZS5sb2cobGlzdC5zbGljZShsaXN0LmZpbmQoMCkpKTtcbmNvbnNvbGUubG9nKGxpc3Quc2xpY2UobGlzdC5maW5kKDApLCBsaXN0LmZpbmQoNCkpKTtcbmNvbnNvbGUubG9nKGxpc3Quc2xpY2UobGlzdC5maW5kKDApLCBsaXN0LmZpbmQoNCkubmV4dCkpO1xuY29uc29sZS5sb2cobGlzdC5zcGxpY2UobGlzdC5maW5kKDApLCAyLCAnYScsICdiJywgJ2MnKSwgbGlzdC5zbGljZSgpKTtcblxuY29uc29sZS5sb2cobmV3IExpc3QoWzFdKS5vbmx5KCkpO1xuY29uc29sZS5sb2cobmV3IExpc3QoWzEsIDIsIDNdKS5vbmUoKSk7XG5cbmNvbnNvbGUubG9nKG5ldyBMaXN0KFs0LCAyLCAzLCAxXSkuc29ydGVkKCkpO1xuXG5jb25zb2xlLmxvZyhuZXcgTGlzdChbMSwgMiwgM10pLnppcChbMSwgMiwgMywgNF0pKTtcbmNvbnNvbGUubG9nKG5ldyBMaXN0KFsxLCAyLCAzXSkuZXF1YWxzKFsxLCAyLCAzXSkpO1xuY29uc29sZS5sb2cobmV3IExpc3QoWzEsIDIsIDNdKS5lcXVhbHMoWzEsIDIsIDMsIDRdKSk7XG5jb25zb2xlLmxvZyhuZXcgTGlzdChbMSwgMiwgMywgNF0pLmVxdWFscyhbMSwgMiwgM10pKTtcbmNvbnNvbGUubG9nKG5ldyBMaXN0KFsxLCAyLCAzXSkuZXF1YWxzKFszLCAyLCAxXSkpO1xuXG52YXIgU29ydGVkU2V0ID0gcmVxdWlyZShcIi4uL3NvcnRlZC1zZXRcIik7XG5jb25zb2xlLmxvZyhcbiAgICBuZXcgTGlzdChbMSwyLDNdKS5jb25jYXQoXG4gICAgICAgIG5ldyBMaXN0KFs0LDUsNl0pLFxuICAgICAgICBuZXcgTGlzdChbNyw4LDldKVxuICAgIClcbiAgICAuY29uY2F0KFsxMCwgMTEsIDEyXSlcbiAgICAuY29uY2F0KG5ldyBTb3J0ZWRTZXQoWzE1LCAxMywgMTRdKSlcbiAgICAudG9BcnJheSgpXG4pO1xuXG52YXIgbGlzdCA9IG5ldyBMaXN0KFsxLDIsMyw0XSk7XG5jb25zb2xlLmxvZyhsaXN0LnNsaWNlKCkpO1xuY29uc29sZS5sb2cobGlzdC5zbGljZSgwKSk7XG5jb25zb2xlLmxvZyhsaXN0LnNsaWNlKDEpKTtcbmNvbnNvbGUubG9nKGxpc3Quc2xpY2UoLTIpKTtcbmNvbnNvbGUubG9nKGxpc3Quc2xpY2UoLTMsIDIpKTtcbmNvbnNvbGUubG9nKGxpc3Quc2xpY2UoLTMsIC0yKSk7XG5jb25zb2xlLmxvZyhsaXN0LnNsaWNlKC0zLCAtMSkpO1xuY29uc29sZS5sb2cobGlzdC5zbGljZSgwLCAwKSk7XG5jb25zb2xlLmxvZyhsaXN0LnNsaWNlKC0xLCAwKSk7XG5jb25zb2xlLmxvZyhsaXN0LnNsaWNlKDAsIDEpKTtcbmNvbnNvbGUubG9nKGxpc3Quc2xpY2UoMSwgMSkpO1xuY29uc29sZS5sb2cobGlzdC5zbGljZSgxLCAyKSk7XG5jb25zb2xlLmxvZyhsaXN0LnNsaWNlKGxpc3QuaGVhZC5uZXh0LCAyKSk7XG5jb25zb2xlLmxvZyhsaXN0LnNsaWNlKGxpc3QuaGVhZC5uZXh0LCBsaXN0LmhlYWQpKTtcbmNvbnNvbGUubG9nKGxpc3Quc2xpY2UobGlzdC5oZWFkLm5leHQsIGxpc3QuaGVhZC5wcmV2KSk7XG5cbmxpc3QucmV2ZXJzZSgpO1xuY29uc29sZS5sb2cobGlzdC5zbGljZSgpKTtcbmNvbnNvbGUubG9nKGxpc3Quc29ydGVkKCkpO1xuXG4iXX0=