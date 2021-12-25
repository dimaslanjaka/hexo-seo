"use strict";
var LruMap = require("../lru-map");
var map = new LruMap({ a: 10, b: 20, c: 30 }, 3);
map.set('a', 10);
console.log(map.toObject());
map.set('b', 20);
console.log(map.toObject());
map.set("d", 40);
console.log(map.toObject());
map["delete"]("d");
console.log(map.toObject());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibHJ1LW1hcC1kZW1vLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJwYWNrYWdlcy9qcy1wcm90b3R5cGVzL3BhY2thZ2VzL2NvbGxlY3Rpb25zL2RlbW8vbHJ1LW1hcC1kZW1vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFbkMsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0FBRS9DLEdBQUcsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0FBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFNUIsR0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7QUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztBQUU1QixHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztBQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBRTVCLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG52YXIgTHJ1TWFwID0gcmVxdWlyZShcIi4uL2xydS1tYXBcIik7XG5cbnZhciBtYXAgPSBuZXcgTHJ1TWFwKHthOiAxMCwgYjogMjAsIGM6IDMwfSwgMyk7XG5cbm1hcC5zZXQoJ2EnLCAxMCk7XG5jb25zb2xlLmxvZyhtYXAudG9PYmplY3QoKSk7XG5cbm1hcC5zZXQoJ2InLCAyMCk7XG5jb25zb2xlLmxvZyhtYXAudG9PYmplY3QoKSk7XG5cbm1hcC5zZXQoXCJkXCIsIDQwKTtcbmNvbnNvbGUubG9nKG1hcC50b09iamVjdCgpKTtcblxubWFwW1wiZGVsZXRlXCJdKFwiZFwiKTtcbmNvbnNvbGUubG9nKG1hcC50b09iamVjdCgpKTtcblxuIl19