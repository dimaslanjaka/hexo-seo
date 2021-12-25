"use strict";
var Set = require("collections/fast-set");
var Iterator = require("collections/iterator");
var TreeLog = require("collections/tree-log");
var describeCollection = require("./collection");
var describeSet = require("./set");
var describeToJson = require("./to-json");
describe("Set-spec", function () {
    // new Set()
    // Set()
    // Set(values)
    // Set(null, equals, hash)
    // Set(null, null, null, content)
    // Set().has(value)
    // Set().get(value)
    // Set().delete(value)
    // Set().clear()
    // Set().add(value)
    // Set().reduce(callback, basis, thisp)
    // Set().forEach()
    // Set().map()
    // Set().toArray()
    // Set().filter()
    // Set().every()
    // Set().some()
    // Set().all()
    // Set().any()
    // Set().min()
    // Set().max()
    describeCollection(Set, [1, 2, 3, 4], true);
    describeCollection(Set, [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }], true);
    describeSet(Set);
    describeToJson(Set, [1, 2, 3, 4]);
    it("can use hash delegate methods", function () {
        function Item(key, value) {
            this.key = key;
            this.value = value;
        }
        Item.prototype.hash = function () {
            return '' + this.key;
        };
        var set = new Set();
        set.add(new Item(1, 'a'));
        set.add(new Item(3, 'b'));
        set.add(new Item(2, 'c'));
        set.add(new Item(2, 'd'));
        expect(set.buckets.keysArray().sort()).toEqual(['1', '2', '3']);
    });
    it("can iterate with forEach", function () {
        var values = [false, null, undefined, 0, 1, {}];
        var set = new Set(values);
        set.forEach(function (value) {
            var index = values.indexOf(value);
            values.splice(index, 1);
        });
        expect(values.length).toBe(0);
    });
    it("can iterate with an iterator", function () {
        var set = new Set([1, 2, 3, 4, 5, 6]);
        var iterator = new Iterator(set);
        var array = iterator.toArray();
        expect(array).toEqual(set.toArray());
    });
    it("should log", function () {
        var set = new Set([1, 2, 3]);
        var lines = [];
        set.log(TreeLog.ascii, null, lines.push, lines);
        expect(lines).toEqual([
            "+-+ 1",
            "| '-- 1",
            "+-+ 2",
            "| '-- 2",
            "'-+ 3",
            "  '-- 3"
        ]);
    });
    it("should log objects by hash", function () {
        function Type(value) {
            this.value = value;
        }
        Type.prototype.hash = function () {
            return this.value;
        };
        var set = new Set([
            new Type(1),
            new Type(1),
            new Type(2),
            new Type(2)
        ]);
        var lines = [];
        set.log(TreeLog.ascii, function (node, write) {
            write(" " + JSON.stringify(node.value));
        }, lines.push, lines);
        expect(lines).toEqual([
            "+-+ 1",
            "| +-- {\"value\":1}",
            "| '-- {\"value\":1}",
            "'-+ 2",
            "  +-- {\"value\":2}",
            "  '-- {\"value\":2}"
        ]);
    });
    it("should log objects by only one hash", function () {
        function Type(value) {
            this.value = value;
        }
        Type.prototype.hash = function () {
            return this.value;
        };
        var set = new Set([
            new Type(1),
            new Type(1)
        ]);
        var lines = [];
        set.log(TreeLog.ascii, null, lines.push, lines);
        expect(lines).toEqual([
            "'-+ 1",
            "  +-- {",
            "  |       \"value\": 1",
            "  |   }",
            "  '-- {",
            "          \"value\": 1",
            "      }"
        ]);
    });
    describe("should log objects with a custom writer with multiple lines", function () {
        function Type(value) {
            this.value = value;
        }
        Type.prototype.hash = function () {
            return this.value;
        };
        var set = new Set([
            new Type(1),
            new Type(1)
        ]);
        var lines = [];
        set.log(TreeLog.ascii, function (node, below, above) {
            above(" . ");
            below("-+ " + node.value.value);
            below(" ' ");
        }, lines.push, lines);
        [
            "'-+ 1",
            "  |   . ",
            "  +---+ 1",
            "  |   ' ",
            "  |   . ",
            "  '---+ 1",
            "      ' "
        ].forEach(function (line, index) {
            it("line " + index, function () {
                expect(lines[index]).toEqual(line);
            });
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFzdC1zZXQtc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvanMtcHJvdG90eXBlcy9wYWNrYWdlcy9jb2xsZWN0aW9ucy90ZXN0L3NwZWMvZmFzdC1zZXQtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFFYixJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUMxQyxJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUMvQyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQztBQUU5QyxJQUFJLGtCQUFrQixHQUFHLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztBQUNqRCxJQUFJLFdBQVcsR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbkMsSUFBSSxjQUFjLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRTFDLFFBQVEsQ0FBQyxVQUFVLEVBQUU7SUFDakIsWUFBWTtJQUNaLFFBQVE7SUFDUixjQUFjO0lBQ2QsMEJBQTBCO0lBQzFCLGlDQUFpQztJQUNqQyxtQkFBbUI7SUFDbkIsbUJBQW1CO0lBQ25CLHNCQUFzQjtJQUN0QixnQkFBZ0I7SUFDaEIsbUJBQW1CO0lBQ25CLHVDQUF1QztJQUN2QyxrQkFBa0I7SUFDbEIsY0FBYztJQUNkLGtCQUFrQjtJQUNsQixpQkFBaUI7SUFDakIsZ0JBQWdCO0lBQ2hCLGVBQWU7SUFDZixjQUFjO0lBQ2QsY0FBYztJQUNkLGNBQWM7SUFDZCxjQUFjO0lBRWQsa0JBQWtCLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7SUFDNUMsa0JBQWtCLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBQyxFQUFF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QUMsQ0FBQztRQUNILElBQUksS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUNmLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxVQUFVLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSztZQUMvQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDYixLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDaEMsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pCLENBQUMsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3RCO1lBQ0ksT0FBTztZQUNQLFVBQVU7WUFDVixXQUFXO1lBQ1gsVUFBVTtZQUNWLFVBQVU7WUFDVixXQUFXO1lBQ1gsVUFBVTtTQUNiLENBQUMsT0FBTyxDQUFDLFVBQVUsSUFBSSxFQUFFLEtBQUs7WUFDM0IsRUFBRSxDQUFDLE9BQU8sR0FBRyxLQUFLLEVBQUU7Z0JBQ2hCLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUMsQ0FBQyxDQUFDO0FBQ1AsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxudmFyIFNldCA9IHJlcXVpcmUoXCJjb2xsZWN0aW9ucy9mYXN0LXNldFwiKTtcbnZhciBJdGVyYXRvciA9IHJlcXVpcmUoXCJjb2xsZWN0aW9ucy9pdGVyYXRvclwiKTtcbnZhciBUcmVlTG9nID0gcmVxdWlyZShcImNvbGxlY3Rpb25zL3RyZWUtbG9nXCIpO1xuXG52YXIgZGVzY3JpYmVDb2xsZWN0aW9uID0gcmVxdWlyZShcIi4vY29sbGVjdGlvblwiKTtcbnZhciBkZXNjcmliZVNldCA9IHJlcXVpcmUoXCIuL3NldFwiKTtcbnZhciBkZXNjcmliZVRvSnNvbiA9IHJlcXVpcmUoXCIuL3RvLWpzb25cIik7XG5cbmRlc2NyaWJlKFwiU2V0LXNwZWNcIiwgZnVuY3Rpb24gKCkge1xuICAgIC8vIG5ldyBTZXQoKVxuICAgIC8vIFNldCgpXG4gICAgLy8gU2V0KHZhbHVlcylcbiAgICAvLyBTZXQobnVsbCwgZXF1YWxzLCBoYXNoKVxuICAgIC8vIFNldChudWxsLCBudWxsLCBudWxsLCBjb250ZW50KVxuICAgIC8vIFNldCgpLmhhcyh2YWx1ZSlcbiAgICAvLyBTZXQoKS5nZXQodmFsdWUpXG4gICAgLy8gU2V0KCkuZGVsZXRlKHZhbHVlKVxuICAgIC8vIFNldCgpLmNsZWFyKClcbiAgICAvLyBTZXQoKS5hZGQodmFsdWUpXG4gICAgLy8gU2V0KCkucmVkdWNlKGNhbGxiYWNrLCBiYXNpcywgdGhpc3ApXG4gICAgLy8gU2V0KCkuZm9yRWFjaCgpXG4gICAgLy8gU2V0KCkubWFwKClcbiAgICAvLyBTZXQoKS50b0FycmF5KClcbiAgICAvLyBTZXQoKS5maWx0ZXIoKVxuICAgIC8vIFNldCgpLmV2ZXJ5KClcbiAgICAvLyBTZXQoKS5zb21lKClcbiAgICAvLyBTZXQoKS5hbGwoKVxuICAgIC8vIFNldCgpLmFueSgpXG4gICAgLy8gU2V0KCkubWluKClcbiAgICAvLyBTZXQoKS5tYXgoKVxuXG4gICAgZGVzY3JpYmVDb2xsZWN0aW9uKFNldCwgWzEsIDIsIDMsIDRdLCB0cnVlKTtcbiAgICBkZXNjcmliZUNvbGxlY3Rpb24oU2V0LCBbe2lkOiAwfSwge2lkOiAxfSwge2lkOiAyfSwge2lkOiAzfV0sIHRydWUpO1xuICAgIGRlc2NyaWJlU2V0KFNldCk7XG4gICAgZGVzY3JpYmVUb0pzb24oU2V0LCBbMSwgMiwgMywgNF0pO1xuXG4gICAgaXQoXCJjYW4gdXNlIGhhc2ggZGVsZWdhdGUgbWV0aG9kc1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIEl0ZW0oa2V5LCB2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5rZXkgPSBrZXk7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cblxuICAgICAgICBJdGVtLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuICcnICsgdGhpcy5rZXk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHNldCA9IG5ldyBTZXQoKTtcbiAgICAgICAgc2V0LmFkZChuZXcgSXRlbSgxLCAnYScpKTtcbiAgICAgICAgc2V0LmFkZChuZXcgSXRlbSgzLCAnYicpKTtcbiAgICAgICAgc2V0LmFkZChuZXcgSXRlbSgyLCAnYycpKTtcbiAgICAgICAgc2V0LmFkZChuZXcgSXRlbSgyLCAnZCcpKTtcblxuICAgICAgICBleHBlY3Qoc2V0LmJ1Y2tldHMua2V5c0FycmF5KCkuc29ydCgpKS50b0VxdWFsKFsnMScsICcyJywgJzMnXSk7XG5cbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGl0ZXJhdGUgd2l0aCBmb3JFYWNoXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHZhbHVlcyA9IFtmYWxzZSwgbnVsbCwgdW5kZWZpbmVkLCAwLCAxLCB7fV07XG4gICAgICAgIHZhciBzZXQgPSBuZXcgU2V0KHZhbHVlcyk7XG4gICAgICAgIHNldC5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gdmFsdWVzLmluZGV4T2YodmFsdWUpO1xuICAgICAgICAgICAgdmFsdWVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QodmFsdWVzLmxlbmd0aCkudG9CZSgwKTtcbiAgICB9KTtcblxuICAgIGl0KFwiY2FuIGl0ZXJhdGUgd2l0aCBhbiBpdGVyYXRvclwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZXQgPSBuZXcgU2V0KFsxLCAyLCAzLCA0LCA1LCA2XSk7XG4gICAgICAgIHZhciBpdGVyYXRvciA9IG5ldyBJdGVyYXRvcihzZXQpO1xuICAgICAgICB2YXIgYXJyYXkgPSBpdGVyYXRvci50b0FycmF5KCk7XG4gICAgICAgIGV4cGVjdChhcnJheSkudG9FcXVhbChzZXQudG9BcnJheSgpKTtcbiAgICB9KTtcblxuICAgIGl0KFwic2hvdWxkIGxvZ1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzZXQgPSBuZXcgU2V0KFsxLCAyLCAzXSk7XG4gICAgICAgIHZhciBsaW5lcyA9IFtdO1xuICAgICAgICBzZXQubG9nKFRyZWVMb2cuYXNjaWksIG51bGwsIGxpbmVzLnB1c2gsIGxpbmVzKTtcbiAgICAgICAgZXhwZWN0KGxpbmVzKS50b0VxdWFsKFtcbiAgICAgICAgICAgIFwiKy0rIDFcIixcbiAgICAgICAgICAgIFwifCAnLS0gMVwiLFxuICAgICAgICAgICAgXCIrLSsgMlwiLFxuICAgICAgICAgICAgXCJ8ICctLSAyXCIsXG4gICAgICAgICAgICBcIictKyAzXCIsXG4gICAgICAgICAgICBcIiAgJy0tIDNcIlxuICAgICAgICBdKTtcbiAgICB9KTtcblxuICAgIGl0KFwic2hvdWxkIGxvZyBvYmplY3RzIGJ5IGhhc2hcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBmdW5jdGlvbiBUeXBlKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgVHlwZS5wcm90b3R5cGUuaGFzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgc2V0ID0gbmV3IFNldChbXG4gICAgICAgICAgICBuZXcgVHlwZSgxKSxcbiAgICAgICAgICAgIG5ldyBUeXBlKDEpLFxuICAgICAgICAgICAgbmV3IFR5cGUoMiksXG4gICAgICAgICAgICBuZXcgVHlwZSgyKVxuICAgICAgICBdKTtcbiAgICAgICAgdmFyIGxpbmVzID0gW107XG4gICAgICAgIHNldC5sb2coVHJlZUxvZy5hc2NpaSwgZnVuY3Rpb24gKG5vZGUsIHdyaXRlKSB7XG4gICAgICAgICAgICB3cml0ZShcIiBcIiArIEpTT04uc3RyaW5naWZ5KG5vZGUudmFsdWUpKTtcbiAgICAgICAgfSwgbGluZXMucHVzaCwgbGluZXMpO1xuICAgICAgICBleHBlY3QobGluZXMpLnRvRXF1YWwoW1xuICAgICAgICAgICAgXCIrLSsgMVwiLFxuICAgICAgICAgICAgXCJ8ICstLSB7XFxcInZhbHVlXFxcIjoxfVwiLFxuICAgICAgICAgICAgXCJ8ICctLSB7XFxcInZhbHVlXFxcIjoxfVwiLFxuICAgICAgICAgICAgXCInLSsgMlwiLFxuICAgICAgICAgICAgXCIgICstLSB7XFxcInZhbHVlXFxcIjoyfVwiLFxuICAgICAgICAgICAgXCIgICctLSB7XFxcInZhbHVlXFxcIjoyfVwiXG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgbG9nIG9iamVjdHMgYnkgb25seSBvbmUgaGFzaFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFR5cGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBUeXBlLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBzZXQgPSBuZXcgU2V0KFtcbiAgICAgICAgICAgIG5ldyBUeXBlKDEpLFxuICAgICAgICAgICAgbmV3IFR5cGUoMSlcbiAgICAgICAgXSk7XG4gICAgICAgIHZhciBsaW5lcyA9IFtdO1xuICAgICAgICBzZXQubG9nKFRyZWVMb2cuYXNjaWksIG51bGwsIGxpbmVzLnB1c2gsIGxpbmVzKTtcbiAgICAgICAgZXhwZWN0KGxpbmVzKS50b0VxdWFsKFtcbiAgICAgICAgICAgIFwiJy0rIDFcIixcbiAgICAgICAgICAgIFwiICArLS0ge1wiLFxuICAgICAgICAgICAgXCIgIHwgICAgICAgXFxcInZhbHVlXFxcIjogMVwiLFxuICAgICAgICAgICAgXCIgIHwgICB9XCIsXG4gICAgICAgICAgICBcIiAgJy0tIHtcIixcbiAgICAgICAgICAgIFwiICAgICAgICAgIFxcXCJ2YWx1ZVxcXCI6IDFcIixcbiAgICAgICAgICAgIFwiICAgICAgfVwiXG4gICAgICAgIF0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJzaG91bGQgbG9nIG9iamVjdHMgd2l0aCBhIGN1c3RvbSB3cml0ZXIgd2l0aCBtdWx0aXBsZSBsaW5lc1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZ1bmN0aW9uIFR5cGUodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICAgICBUeXBlLnByb3RvdHlwZS5oYXNoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gICAgICAgIH07XG4gICAgICAgIHZhciBzZXQgPSBuZXcgU2V0KFtcbiAgICAgICAgICAgIG5ldyBUeXBlKDEpLFxuICAgICAgICAgICAgbmV3IFR5cGUoMSlcbiAgICAgICAgXSk7XG4gICAgICAgIHZhciBsaW5lcyA9IFtdO1xuICAgICAgICBzZXQubG9nKFRyZWVMb2cuYXNjaWksIGZ1bmN0aW9uIChub2RlLCBiZWxvdywgYWJvdmUpIHtcbiAgICAgICAgICAgIGFib3ZlKFwiIC4gXCIpO1xuICAgICAgICAgICAgYmVsb3coXCItKyBcIiArIG5vZGUudmFsdWUudmFsdWUpO1xuICAgICAgICAgICAgYmVsb3coXCIgJyBcIik7XG4gICAgICAgIH0sIGxpbmVzLnB1c2gsIGxpbmVzKTtcbiAgICAgICAgW1xuICAgICAgICAgICAgXCInLSsgMVwiLFxuICAgICAgICAgICAgXCIgIHwgICAuIFwiLFxuICAgICAgICAgICAgXCIgICstLS0rIDFcIixcbiAgICAgICAgICAgIFwiICB8ICAgJyBcIixcbiAgICAgICAgICAgIFwiICB8ICAgLiBcIixcbiAgICAgICAgICAgIFwiICAnLS0tKyAxXCIsXG4gICAgICAgICAgICBcIiAgICAgICcgXCJcbiAgICAgICAgXS5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lLCBpbmRleCkge1xuICAgICAgICAgICAgaXQoXCJsaW5lIFwiICsgaW5kZXgsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QobGluZXNbaW5kZXhdKS50b0VxdWFsKGxpbmUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXX0=