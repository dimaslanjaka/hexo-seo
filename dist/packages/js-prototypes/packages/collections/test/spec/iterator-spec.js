"use strict";
var Iterator = require("collections/iterator");
describe("Iterator-spec", function () {
    shouldWorkWithConstructor(function withoutNew(iterable) {
        return Iterator(iterable);
    });
    shouldWorkWithConstructor(function withNew(iterable) {
        return new Iterator(iterable);
    });
    describe("Iterator.cycle", function () {
        it("should work", function () {
            var iterator = Iterator.cycle([1, 2, 3]);
            for (var i = 0; i < 10; i++) {
                expect(iterator.next().value).toBe(1);
                expect(iterator.next().value).toBe(2);
                expect(iterator.next().value).toBe(3);
            }
        });
        it("should work with specified number of times", function () {
            var iterator = Iterator.cycle([1, 2, 3], 2);
            for (var i = 0; i < 2; i++) {
                expect(iterator.next().value).toBe(1);
                expect(iterator.next().value).toBe(2);
                expect(iterator.next().value).toBe(3);
            }
            expect(iterator.next().done).toBe(true);
            expect(iterator.next().done).toBe(true);
        });
        it("should work with specified 0 times", function () {
            var iterator = Iterator.cycle([1, 2, 3], 0);
            expect(iterator.next().done).toBe(true);
            expect(iterator.next().done).toBe(true);
        });
        it("should work with specified -1 times", function () {
            var iterator = Iterator.cycle([1, 2, 3], 0);
            expect(iterator.next().done).toBe(true);
            expect(iterator.next().done).toBe(true);
        });
    });
    describe("Iterator.repeat", function () {
        it("should repeat a value indefinite times by default", function () {
            var iterator = Iterator.repeat(1);
            for (var i = 0; i < 10; i++) {
                expect(iterator.next().value).toEqual(1);
            }
        });
        it("should repeat a value specified times", function () {
            var iterator = Iterator.repeat(1, 3);
            for (var i = 0; i < 3; i++) {
                expect(iterator.next().value).toEqual(1);
            }
            expect(iterator.next().done).toBe(true);
            expect(iterator.next().done).toBe(true);
        });
    });
    describe("Iterator.concat", function () {
        it("should work", function () {
            var iterator = Iterator.concat([
                Iterator([1, 2, 3]),
                Iterator([4, 5, 6]),
                Iterator([7, 8, 9])
            ]);
            for (var i = 0; i < 9; i++) {
                expect(iterator.next().value).toEqual(i + 1);
            }
            expect(iterator.next().done).toBe(true);
            expect(iterator.next().done).toBe(true);
        });
    });
    describe("Iterator.chain", function () {
        it("should work", function () {
            var iterator = Iterator.chain(Iterator([1, 2, 3]), Iterator([4, 5, 6]), Iterator([7, 8, 9]));
            for (var i = 0; i < 9; i++) {
                expect(iterator.next().value).toEqual(i + 1);
            }
            expect(iterator.next().done).toBe(true);
            expect(iterator.next().done).toBe(true);
        });
    });
    describe("Iterator.unzip", function () {
        it("should work", function () {
            var iterator = Iterator.unzip([
                Iterator([0, 'A', 'x']),
                Iterator([1, 'B', 'y', 'I']),
                Iterator([2, 'C'])
            ]);
            expect(iterator.next().value).toEqual([0, 1, 2]);
            expect(iterator.next().value).toEqual(['A', 'B', 'C']);
            expect(iterator.next().done).toBe(true);
            expect(iterator.next().done).toBe(true);
        });
    });
    describe("Iterator.zip", function () {
        it("should work", function () {
            var iterator = Iterator.zip(Iterator([0, 'A', 'x']), Iterator([1, 'B', 'y', 'I']), Iterator([2, 'C']));
            expect(iterator.next().value).toEqual([0, 1, 2]);
            expect(iterator.next().value).toEqual(['A', 'B', 'C']);
            expect(iterator.next().done).toBe(true);
            expect(iterator.next().done).toBe(true);
        });
    });
    describe("Iterator.range", function () {
    });
    describe("Iterator.count", function () {
    });
});
function shouldWorkWithConstructor(Iterator) {
    function definiteIterator() {
        return Iterator([1, 2, 3]);
    }
    function indefiniteIterator() {
        var n = 0;
        return Iterator(function () {
            return {
                done: false,
                value: n++
            };
        });
    }
    it("should iterate an array", function () {
        var iterator = Iterator([1, 2, 3]);
        expect(iterator.next().value).toEqual(1);
        expect(iterator.next().value).toEqual(2);
        expect(iterator.next().value).toEqual(3);
        expect(iterator.next().done).toBe(true);
        expect(iterator.next().done).toBe(true);
    });
    it("should iterate an sparse array", function () {
        var array = [];
        array[0] = 1;
        array[100] = 2;
        array[1000] = 3;
        var iterator = Iterator(array);
        expect(iterator.next().value).toEqual(1);
        expect(iterator.next().value).toEqual(2);
        expect(iterator.next().value).toEqual(3);
        expect(iterator.next().done).toBe(true);
        expect(iterator.next().done).toBe(true);
    });
    it("should iterate a string", function () {
        var iterator = Iterator("abc");
        expect(iterator.next().value).toEqual("a");
        expect(iterator.next().value).toEqual("b");
        expect(iterator.next().value).toEqual("c");
        expect(iterator.next().done).toBe(true);
        expect(iterator.next().done).toBe(true);
    });
    it("should gracefully fail to iterate null", function () {
        expect(function () {
            Iterator(null);
        }).toThrow();
    });
    it("should gracefully fail to iterate undefined", function () {
        expect(function () {
            Iterator();
        }).toThrow();
    });
    it("should gracefully fail to iterate a number", function () {
        expect(function () {
            Iterator(42);
        }).toThrow();
    });
    it("should gracefully pass an existing iterator through", function () {
        var iterator = Iterator([1, 2, 3]);
        iterator = Iterator(iterator);
        expect(iterator.next().value).toEqual(1);
        expect(iterator.next().value).toEqual(2);
        expect(iterator.next().value).toEqual(3);
        expect(iterator.next().done).toBe(true);
        expect(iterator.next().done).toBe(true);
    });
    it("should iterate an iterator", function () {
        var iterator = Iterator({
            iterate: function () {
                return Iterator([1, 2, 3]);
            }
        });
        iterator = Iterator(iterator);
        expect(iterator.next().value).toEqual(1);
        expect(iterator.next().value).toEqual(2);
        expect(iterator.next().value).toEqual(3);
        expect(iterator.next().done).toBe(true);
        expect(iterator.next().done).toBe(true);
    });
    it("should iterate an iterable", function () {
        var n = 0;
        var iterator = Iterator({
            next: function next() {
                if (++n > 3) {
                    return { value: void 0, done: true };
                }
                else {
                    return { value: n, done: false };
                }
            }
        });
        expect(iterator.next().value).toEqual(1);
        expect(iterator.next().value).toEqual(2);
        expect(iterator.next().value).toEqual(3);
        expect(iterator.next().done).toBe(true);
        expect(iterator.next().done).toBe(true);
    });
    it("should create an iterator from a function", function () {
        var n = 0;
        var iterator = Iterator(function next() {
            if (++n > 3) {
                return { value: void 0, done: true };
            }
            else {
                return { value: n, done: false };
            }
        });
        expect(iterator.next().value).toEqual(1);
        expect(iterator.next().value).toEqual(2);
        expect(iterator.next().value).toEqual(3);
        expect(iterator.next().done).toBe(true);
        expect(iterator.next().done).toBe(true);
    });
    describe("reduce", function () {
        it("should work", function () {
            var iterator = definiteIterator();
            var count = 0;
            var result = iterator.reduce(function (result, value, key, object) {
                expect(value).toBe(count + 1);
                expect(key).toBe(count);
                expect(object).toBe(iterator);
                count++;
                return value + 1;
            }, 0);
            expect(result).toBe(4);
        });
    });
    describe("forEach", function () {
        it("should work", function () {
            var iterator = definiteIterator();
            var count = 0;
            iterator.forEach(function (value, key, object) {
                expect(value).toBe(count + 1);
                expect(key).toBe(count);
                expect(object).toBe(iterator);
                count++;
            });
            expect(count).toBe(3);
        });
    });
    describe("map", function () {
        it("should work", function () {
            var iterator = definiteIterator();
            var count = 0;
            var result = iterator.map(function (value, key, object) {
                expect(value).toBe(count + 1);
                expect(key).toBe(count);
                expect(object).toBe(iterator);
                count++;
                return "abc".charAt(key);
            });
            expect(result).toEqual(["a", "b", "c"]);
            expect(count).toBe(3);
        });
    });
    describe("filter", function () {
        it("should work", function () {
            var iterator = definiteIterator();
            var count = 0;
            var result = iterator.filter(function (value, key, object) {
                expect(value).toBe(count + 1);
                expect(key).toBe(count);
                expect(object).toBe(iterator);
                count++;
                return value === 2;
            });
            expect(result).toEqual([2]);
            expect(count).toBe(3);
        });
    });
    describe("every", function () {
        it("should work", function () {
            expect(Iterator([1, 2, 3]).every(function (n) {
                return n < 10;
            })).toBe(true);
            expect(Iterator([1, 2, 3]).every(function (n) {
                return n > 1;
            })).toBe(false);
        });
    });
    describe("some", function () {
        it("should work", function () {
            expect(Iterator([1, 2, 3]).some(function (n) {
                return n === 2;
            })).toBe(true);
            expect(Iterator([1, 2, 3]).some(function (n) {
                return n > 10;
            })).toBe(false);
        });
    });
    describe("any", function () {
        [
            [[false, false], false],
            [[false, true], true],
            [[true, false], true],
            [[true, true], true]
        ].forEach(function (test) {
            test = Iterator(test);
            var input = test.next().value;
            var output = test.next().value;
            it("any of " + JSON.stringify(input) + " should be " + output, function () {
                expect(Iterator(input).any()).toEqual(output);
            });
        });
    });
    describe("all", function () {
        [
            [[false, false], false],
            [[false, true], false],
            [[true, false], false],
            [[true, true], true]
        ].forEach(function (test) {
            test = Iterator(test);
            var input = test.next().value;
            var output = test.next().value;
            it("all of " + JSON.stringify(input) + " should be " + output, function () {
                expect(Iterator(input).all()).toEqual(output);
            });
        });
    });
    describe("min", function () {
        it("should work", function () {
            expect(definiteIterator().min()).toBe(1);
        });
    });
    describe("max", function () {
        it("should work", function () {
            expect(definiteIterator().max()).toBe(3);
        });
    });
    describe("sum", function () {
        it("should work", function () {
            expect(definiteIterator().sum()).toBe(6);
        });
    });
    describe("average", function () {
        it("should work", function () {
            expect(definiteIterator().average()).toBe(2);
        });
    });
    describe("flatten", function () {
        it("should work", function () {
            expect(Iterator([
                definiteIterator(),
                definiteIterator(),
                definiteIterator()
            ]).flatten()).toEqual([
                1, 2, 3,
                1, 2, 3,
                1, 2, 3
            ]);
        });
    });
    describe("zip", function () {
        it("should work", function () {
            var cardinals = definiteIterator().mapIterator(function (n) {
                return n - 1;
            });
            var ordinals = definiteIterator();
            expect(cardinals.zip(ordinals)).toEqual([
                [0, 1],
                [1, 2],
                [2, 3]
            ]);
        });
    });
    describe("enumerate", function () {
        it("should work with default start", function () {
            var cardinals = definiteIterator();
            expect(cardinals.enumerate()).toEqual([
                [0, 1],
                [1, 2],
                [2, 3]
            ]);
        });
        it("should work with given start", function () {
            var cardinals = definiteIterator();
            expect(cardinals.enumerate(1)).toEqual([
                [1, 1],
                [2, 2],
                [3, 3]
            ]);
        });
    });
    describe("sorted", function () {
        it("should work", function () {
            expect(Iterator([5, 2, 4, 1, 3]).sorted()).toEqual([1, 2, 3, 4, 5]);
        });
    });
    describe("group", function () {
        it("should work", function () {
            expect(Iterator([5, 2, 4, 1, 3]).group(function (n) {
                return n % 2 === 0;
            })).toEqual([
                [false, [5, 1, 3]],
                [true, [2, 4]]
            ]);
        });
    });
    describe("reversed", function () {
        it("should work", function () {
            expect(Iterator([5, 2, 4, 1, 3]).reversed()).toEqual([3, 1, 4, 2, 5]);
        });
    });
    describe("toArray", function () {
        it("should work", function () {
            expect(Iterator([5, 2, 4, 1, 3]).toArray()).toEqual([5, 2, 4, 1, 3]);
        });
    });
    describe("toObject", function () {
        it("should work", function () {
            expect(Iterator("AB").toObject()).toEqual({
                0: "A",
                1: "B"
            });
        });
    });
    describe("mapIterator", function () {
        it("should work", function () {
            var iterator = indefiniteIterator()
                .mapIterator(function (n, i, o) {
                return n * 2;
            });
            expect(iterator.next().value).toBe(0);
            expect(iterator.next().value).toBe(2);
            expect(iterator.next().value).toBe(4);
            expect(iterator.next().value).toBe(6);
        });
        it("should pass the correct arguments to the callback", function () {
            var iterator = indefiniteIterator();
            var result = iterator.mapIterator(function (n, i, o) {
                expect(i).toBe(n);
                expect(o).toBe(iterator);
                return n * 2;
            });
            result.next();
            result.next();
            result.next();
            result.next();
        });
    });
    describe("filterIterator", function () {
        it("should work", function () {
            var iterator = indefiniteIterator()
                .filterIterator(function (n, i, o) {
                expect(i).toBe(n);
                //expect(o).toBe(iterator);
                return n % 2 === 0;
            });
            expect(iterator.next().value).toBe(0);
            expect(iterator.next().value).toBe(2);
            expect(iterator.next().value).toBe(4);
            expect(iterator.next().value).toBe(6);
        });
        it("should pass the correct arguments to the callback", function () {
            var iterator = indefiniteIterator();
            var result = iterator.filterIterator(function (n, i, o) {
                expect(i).toBe(n);
                expect(o).toBe(iterator);
                return n * 2;
            });
            result.next();
            result.next();
            result.next();
            result.next();
        });
    });
    describe("concat", function () {
        it("should work", function () {
            var iterator = definiteIterator().concat(definiteIterator());
            expect(iterator.next().value).toBe(1);
            expect(iterator.next().value).toBe(2);
            expect(iterator.next().value).toBe(3);
            expect(iterator.next().value).toBe(1);
            expect(iterator.next().value).toBe(2);
            expect(iterator.next().value).toBe(3);
            expect(iterator.next().done).toBe(true);
        });
    });
    describe("dropWhile", function () {
        it("should work", function () {
            var iterator = indefiniteIterator()
                .dropWhile(function (n) {
                return n < 10;
            });
            expect(iterator.next().value).toBe(10);
            expect(iterator.next().value).toBe(11);
            expect(iterator.next().value).toBe(12);
        });
        it("should pass the correct arguments to the callback", function () {
            var iterator = indefiniteIterator();
            var result = iterator.dropWhile(function (n, i, o) {
                expect(i).toBe(n);
                expect(o).toBe(iterator);
            });
            result.next();
            result.next();
            result.next();
        });
    });
    describe("takeWhile", function () {
        it("should work", function () {
            var iterator = indefiniteIterator()
                .takeWhile(function (n) {
                return n < 3;
            });
            expect(iterator.next().value).toBe(0);
            expect(iterator.next().value).toBe(1);
            expect(iterator.next().value).toBe(2);
            expect(iterator.next().done).toBe(true);
        });
        it("should pass the correct arguments to the callback", function () {
            var iterator = indefiniteIterator();
            var result = iterator.takeWhile(function (n, i, o) {
                expect(i).toBe(n);
                expect(o).toBe(iterator);
                return n < 3;
            });
            result.next();
            result.next();
            result.next();
        });
    });
    describe("zipIterator", function () {
        it("should work", function () {
            var cardinals = indefiniteIterator();
            var ordinals = indefiniteIterator().mapIterator(function (n) {
                return n + 1;
            });
            var iterator = cardinals.zipIterator(ordinals);
            expect(iterator.next().value).toEqual([0, 1]);
            expect(iterator.next().value).toEqual([1, 2]);
            expect(iterator.next().value).toEqual([2, 3]);
        });
        it("should work, even for crazy people", function () {
            var cardinals = indefiniteIterator();
            var iterator = cardinals.zipIterator(cardinals, cardinals);
            expect(iterator.next().value).toEqual([0, 1, 2]);
            expect(iterator.next().value).toEqual([3, 4, 5]);
            expect(iterator.next().value).toEqual([6, 7, 8]);
        });
    });
    describe("enumerateIterator", function () {
        it("should work", function () {
            var ordinals = indefiniteIterator().mapIterator(function (n) {
                return n + 1;
            });
            var iterator = ordinals.enumerateIterator();
            expect(iterator.next().value).toEqual([0, 1]);
            expect(iterator.next().value).toEqual([1, 2]);
            expect(iterator.next().value).toEqual([2, 3]);
        });
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaXRlcmF0b3Itc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvanMtcHJvdG90eXBlcy9wYWNrYWdlcy9jb2xsZWN0aW9ucy90ZXN0L3NwZWMvaXRlcmF0b3Itc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFFL0MsUUFBUSxDQUFDLGVBQWUsRUFBRTtJQUV0Qix5QkFBeUIsQ0FBQyxTQUFTLFVBQVUsQ0FBQyxRQUFRO1FBQ2xELE9BQU8sUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlCLENBQUMsQ0FBQyxDQUFDO0lBRUgseUJBQXlCLENBQUMsU0FBUyxPQUFPLENBQUMsUUFBUTtRQUMvQyxPQUFPLElBQUksUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2xDLENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLGdCQUFnQixFQUFFO1FBRXZCLEVBQUUsQ0FBQyxhQUFhLEVBQUU7WUFDZCxJQUFJLFFBQVEsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pDLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pCLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDekM7UUFDTCxD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QUFDLGFBQWEsRUFBRTtZQUNkLElBQUksUUFBUSxHQUFHLGtCQUFrQixFQUFFLENBQUMsV0FBVyxDQUFDLFVBQVUsQ0FBQztnQkFDdkQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxRQUFRLEdBQUcsUUFBUSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDNUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM5QyxNQUFNLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDLENBQUMsQ0FBQztBQUVQLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJcbnZhciBJdGVyYXRvciA9IHJlcXVpcmUoXCJjb2xsZWN0aW9ucy9pdGVyYXRvclwiKTtcblxuZGVzY3JpYmUoXCJJdGVyYXRvci1zcGVjXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgIHNob3VsZFdvcmtXaXRoQ29uc3RydWN0b3IoZnVuY3Rpb24gd2l0aG91dE5ldyhpdGVyYWJsZSkge1xuICAgICAgICByZXR1cm4gSXRlcmF0b3IoaXRlcmFibGUpO1xuICAgIH0pO1xuXG4gICAgc2hvdWxkV29ya1dpdGhDb25zdHJ1Y3RvcihmdW5jdGlvbiB3aXRoTmV3KGl0ZXJhYmxlKSB7XG4gICAgICAgIHJldHVybiBuZXcgSXRlcmF0b3IoaXRlcmFibGUpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJJdGVyYXRvci5jeWNsZVwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgd29ya1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBJdGVyYXRvci5jeWNsZShbMSwgMiwgM10pO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAxMDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9CZSgxKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0JlKDIpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvQmUoMyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIHdvcmsgd2l0aCBzcGVjaWZpZWQgbnVtYmVyIG9mIHRpbWVzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IEl0ZXJhdG9yLmN5Y2xlKFsxLCAyLCAzXSwgMik7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDI7IGkrKykge1xuICAgICAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvQmUoMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9CZSgyKTtcbiAgICAgICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0JlKDMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS5kb25lKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS5kb25lKS50b0JlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCB3b3JrIHdpdGggc3BlY2lmaWVkIDAgdGltZXNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gSXRlcmF0b3IuY3ljbGUoWzEsIDIsIDNdLCAwKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkuZG9uZSkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkuZG9uZSkudG9CZSh0cnVlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgd29yayB3aXRoIHNwZWNpZmllZCAtMSB0aW1lc1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBJdGVyYXRvci5jeWNsZShbMSwgMiwgM10sIDApO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS5kb25lKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS5kb25lKS50b0JlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJJdGVyYXRvci5yZXBlYXRcIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGl0KFwic2hvdWxkIHJlcGVhdCBhIHZhbHVlIGluZGVmaW5pdGUgdGltZXMgYnkgZGVmYXVsdFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBJdGVyYXRvci5yZXBlYXQoMSk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCByZXBlYXQgYSB2YWx1ZSBzcGVjaWZpZWQgdGltZXNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gSXRlcmF0b3IucmVwZWF0KDEsIDMpO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0VxdWFsKDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS5kb25lKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS5kb25lKS50b0JlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJJdGVyYXRvci5jb25jYXRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IEl0ZXJhdG9yLmNvbmNhdChbXG4gICAgICAgICAgICAgICBJdGVyYXRvcihbMSwgMiwgM10pLFxuICAgICAgICAgICAgICAgSXRlcmF0b3IoWzQsIDUsIDZdKSxcbiAgICAgICAgICAgICAgIEl0ZXJhdG9yKFs3LCA4LCA5XSlcbiAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCA5OyBpKyspIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0VxdWFsKGkgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkuZG9uZSkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkuZG9uZSkudG9CZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcIkl0ZXJhdG9yLmNoYWluXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXQoXCJzaG91bGQgd29ya1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBJdGVyYXRvci5jaGFpbihcbiAgICAgICAgICAgICAgIEl0ZXJhdG9yKFsxLCAyLCAzXSksXG4gICAgICAgICAgICAgICBJdGVyYXRvcihbNCwgNSwgNl0pLFxuICAgICAgICAgICAgICAgSXRlcmF0b3IoWzcsIDgsIDldKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgOTsgaSsrKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbChpICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLmRvbmUpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLmRvbmUpLnRvQmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJJdGVyYXRvci51bnppcFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGl0KFwic2hvdWxkIHdvcmtcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gSXRlcmF0b3IudW56aXAoW1xuICAgICAgICAgICAgICAgIEl0ZXJhdG9yKFswLCAnQScsICd4J10pLFxuICAgICAgICAgICAgICAgIEl0ZXJhdG9yKFsxLCAnQicsICd5JywgJ0knXSksXG4gICAgICAgICAgICAgICAgSXRlcmF0b3IoWzIsICdDJ10pXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbChbMCwgMSwgMl0pO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbChbJ0EnLCAnQicsICdDJ10pO1xuXG4gICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLmRvbmUpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLmRvbmUpLnRvQmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJJdGVyYXRvci56aXBcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IEl0ZXJhdG9yLnppcChcbiAgICAgICAgICAgICAgICBJdGVyYXRvcihbMCwgJ0EnLCAneCddKSxcbiAgICAgICAgICAgICAgICBJdGVyYXRvcihbMSwgJ0InLCAneScsICdJJ10pLFxuICAgICAgICAgICAgICAgIEl0ZXJhdG9yKFsyLCAnQyddKVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbChbMCwgMSwgMl0pO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbChbJ0EnLCAnQicsICdDJ10pO1xuXG4gICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLmRvbmUpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLmRvbmUpLnRvQmUodHJ1ZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJJdGVyYXRvci5yYW5nZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcIkl0ZXJhdG9yLmNvdW50XCIsIGZ1bmN0aW9uICgpIHtcbiAgICB9KTtcblxufSk7XG5cbmZ1bmN0aW9uIHNob3VsZFdvcmtXaXRoQ29uc3RydWN0b3IoSXRlcmF0b3IpIHtcblxuICAgIGZ1bmN0aW9uIGRlZmluaXRlSXRlcmF0b3IoKSB7XG4gICAgICAgIHJldHVybiBJdGVyYXRvcihbMSwgMiwgM10pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluZGVmaW5pdGVJdGVyYXRvcigpIHtcbiAgICAgICAgdmFyIG4gPSAwO1xuICAgICAgICByZXR1cm4gSXRlcmF0b3IoZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICBkb25lOiBmYWxzZSxcbiAgICAgICAgICAgICAgICB2YWx1ZTogbisrXG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBpdChcInNob3VsZCBpdGVyYXRlIGFuIGFycmF5XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gSXRlcmF0b3IoWzEsIDIsIDNdKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbCgxKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbCgyKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbCgzKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS5kb25lKS50b0JlKHRydWUpO1xuICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLmRvbmUpLnRvQmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdChcInNob3VsZCBpdGVyYXRlIGFuIHNwYXJzZSBhcnJheVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcnJheSA9IFtdO1xuICAgICAgICBhcnJheVswXSA9IDE7XG4gICAgICAgIGFycmF5WzEwMF0gPSAyO1xuICAgICAgICBhcnJheVsxMDAwXSA9IDM7XG4gICAgICAgIHZhciBpdGVyYXRvciA9IEl0ZXJhdG9yKGFycmF5KTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbCgxKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbCgyKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbCgzKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS5kb25lKS50b0JlKHRydWUpO1xuICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLmRvbmUpLnRvQmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdChcInNob3VsZCBpdGVyYXRlIGEgc3RyaW5nXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gSXRlcmF0b3IoXCJhYmNcIik7XG4gICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvRXF1YWwoXCJhXCIpO1xuICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0VxdWFsKFwiYlwiKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbChcImNcIik7XG4gICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkuZG9uZSkudG9CZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS5kb25lKS50b0JlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgZ3JhY2VmdWxseSBmYWlsIHRvIGl0ZXJhdGUgbnVsbFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGV4cGVjdChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBJdGVyYXRvcihudWxsKTtcbiAgICAgICAgfSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgZ3JhY2VmdWxseSBmYWlsIHRvIGl0ZXJhdGUgdW5kZWZpbmVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEl0ZXJhdG9yKCk7XG4gICAgICAgIH0pLnRvVGhyb3coKTtcbiAgICB9KTtcblxuICAgIGl0KFwic2hvdWxkIGdyYWNlZnVsbHkgZmFpbCB0byBpdGVyYXRlIGEgbnVtYmVyXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZXhwZWN0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIEl0ZXJhdG9yKDQyKTtcbiAgICAgICAgfSkudG9UaHJvdygpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgZ3JhY2VmdWxseSBwYXNzIGFuIGV4aXN0aW5nIGl0ZXJhdG9yIHRocm91Z2hcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaXRlcmF0b3IgPSBJdGVyYXRvcihbMSwgMiwgM10pO1xuICAgICAgICBpdGVyYXRvciA9IEl0ZXJhdG9yKGl0ZXJhdG9yKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbCgxKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbCgyKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbCgzKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS5kb25lKS50b0JlKHRydWUpO1xuICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLmRvbmUpLnRvQmUodHJ1ZSk7XG4gICAgfSk7XG5cbiAgICBpdChcInNob3VsZCBpdGVyYXRlIGFuIGl0ZXJhdG9yXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gSXRlcmF0b3Ioe1xuICAgICAgICAgICAgaXRlcmF0ZTogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBJdGVyYXRvcihbMSwgMiwgM10pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaXRlcmF0b3IgPSBJdGVyYXRvcihpdGVyYXRvcik7XG4gICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvRXF1YWwoMSk7XG4gICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvRXF1YWwoMik7XG4gICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvRXF1YWwoMyk7XG4gICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkuZG9uZSkudG9CZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS5kb25lKS50b0JlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgaXQoXCJzaG91bGQgaXRlcmF0ZSBhbiBpdGVyYWJsZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBuID0gMDtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gSXRlcmF0b3Ioe1xuICAgICAgICAgICAgbmV4dDogZnVuY3Rpb24gbmV4dCgpIHtcbiAgICAgICAgICAgICAgICBpZiAoKytuID4gMykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge3ZhbHVlOnZvaWQgMCxkb25lOnRydWV9O1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB7dmFsdWU6bixkb25lOmZhbHNlfTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0VxdWFsKDEpO1xuICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0VxdWFsKDIpO1xuICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0VxdWFsKDMpO1xuICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLmRvbmUpLnRvQmUodHJ1ZSk7XG4gICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkuZG9uZSkudG9CZSh0cnVlKTtcbiAgICB9KTtcblxuICAgIGl0KFwic2hvdWxkIGNyZWF0ZSBhbiBpdGVyYXRvciBmcm9tIGEgZnVuY3Rpb25cIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbiA9IDA7XG4gICAgICAgIHZhciBpdGVyYXRvciA9IEl0ZXJhdG9yKGZ1bmN0aW9uIG5leHQoKSB7XG4gICAgICAgICAgICBpZiAoKytuID4gMykge1xuICAgICAgICAgICAgICAgIHJldHVybiB7dmFsdWU6dm9pZCAwLGRvbmU6dHJ1ZX07XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB7dmFsdWU6bixkb25lOmZhbHNlfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvRXF1YWwoMSk7XG4gICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvRXF1YWwoMik7XG4gICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvRXF1YWwoMyk7XG4gICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkuZG9uZSkudG9CZSh0cnVlKTtcbiAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS5kb25lKS50b0JlKHRydWUpO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJyZWR1Y2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IGRlZmluaXRlSXRlcmF0b3IoKTtcbiAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaXRlcmF0b3IucmVkdWNlKGZ1bmN0aW9uIChyZXN1bHQsIHZhbHVlLCBrZXksIG9iamVjdCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdCh2YWx1ZSkudG9CZShjb3VudCArIDEpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChrZXkpLnRvQmUoY291bnQpO1xuICAgICAgICAgICAgICAgIGV4cGVjdChvYmplY3QpLnRvQmUoaXRlcmF0b3IpO1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlICsgMTtcbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9CZSg0KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImZvckVhY2hcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IGRlZmluaXRlSXRlcmF0b3IoKTtcbiAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgICAgICBpdGVyYXRvci5mb3JFYWNoKGZ1bmN0aW9uICh2YWx1ZSwga2V5LCBvYmplY3QpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QodmFsdWUpLnRvQmUoY291bnQgKyAxKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoa2V5KS50b0JlKGNvdW50KTtcbiAgICAgICAgICAgICAgICBleHBlY3Qob2JqZWN0KS50b0JlKGl0ZXJhdG9yKTtcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBleHBlY3QoY291bnQpLnRvQmUoMyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJtYXBcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IGRlZmluaXRlSXRlcmF0b3IoKTtcbiAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaXRlcmF0b3IubWFwKGZ1bmN0aW9uICh2YWx1ZSwga2V5LCBvYmplY3QpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QodmFsdWUpLnRvQmUoY291bnQgKyAxKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoa2V5KS50b0JlKGNvdW50KTtcbiAgICAgICAgICAgICAgICBleHBlY3Qob2JqZWN0KS50b0JlKGl0ZXJhdG9yKTtcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiBcImFiY1wiLmNoYXJBdChrZXkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBleHBlY3QocmVzdWx0KS50b0VxdWFsKFtcImFcIiwgXCJiXCIsIFwiY1wiXSk7XG4gICAgICAgICAgICBleHBlY3QoY291bnQpLnRvQmUoMyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJmaWx0ZXJcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IGRlZmluaXRlSXRlcmF0b3IoKTtcbiAgICAgICAgICAgIHZhciBjb3VudCA9IDA7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaXRlcmF0b3IuZmlsdGVyKGZ1bmN0aW9uICh2YWx1ZSwga2V5LCBvYmplY3QpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QodmFsdWUpLnRvQmUoY291bnQgKyAxKTtcbiAgICAgICAgICAgICAgICBleHBlY3Qoa2V5KS50b0JlKGNvdW50KTtcbiAgICAgICAgICAgICAgICBleHBlY3Qob2JqZWN0KS50b0JlKGl0ZXJhdG9yKTtcbiAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZSA9PT0gMjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZXhwZWN0KHJlc3VsdCkudG9FcXVhbChbMl0pO1xuICAgICAgICAgICAgZXhwZWN0KGNvdW50KS50b0JlKDMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZXZlcnlcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChJdGVyYXRvcihbMSwgMiwgM10pLmV2ZXJ5KGZ1bmN0aW9uIChuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG4gPCAxMDtcbiAgICAgICAgICAgIH0pKS50b0JlKHRydWUpO1xuICAgICAgICAgICAgZXhwZWN0KEl0ZXJhdG9yKFsxLCAyLCAzXSkuZXZlcnkoZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbiA+IDE7XG4gICAgICAgICAgICB9KSkudG9CZShmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJzb21lXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXQoXCJzaG91bGQgd29ya1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleHBlY3QoSXRlcmF0b3IoWzEsIDIsIDNdKS5zb21lKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG4gPT09IDI7XG4gICAgICAgICAgICB9KSkudG9CZSh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChJdGVyYXRvcihbMSwgMiwgM10pLnNvbWUoZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbiA+IDEwO1xuICAgICAgICAgICAgfSkpLnRvQmUoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiYW55XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgW1xuICAgICAgICAgICAgW1tmYWxzZSwgZmFsc2VdLCBmYWxzZV0sXG4gICAgICAgICAgICBbW2ZhbHNlLCB0cnVlXSwgdHJ1ZV0sXG4gICAgICAgICAgICBbW3RydWUsIGZhbHNlXSwgdHJ1ZV0sXG4gICAgICAgICAgICBbW3RydWUsIHRydWVdLCB0cnVlXVxuICAgICAgICBdLmZvckVhY2goZnVuY3Rpb24gKHRlc3QpIHtcbiAgICAgICAgICAgIHRlc3QgPSBJdGVyYXRvcih0ZXN0KTtcbiAgICAgICAgICAgIHZhciBpbnB1dCA9IHRlc3QubmV4dCgpLnZhbHVlO1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IHRlc3QubmV4dCgpLnZhbHVlO1xuICAgICAgICAgICAgaXQoXCJhbnkgb2YgXCIgKyBKU09OLnN0cmluZ2lmeShpbnB1dCkgKyBcIiBzaG91bGQgYmUgXCIgKyBvdXRwdXQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoSXRlcmF0b3IoaW5wdXQpLmFueSgpKS50b0VxdWFsKG91dHB1dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImFsbFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIFtcbiAgICAgICAgICAgIFtbZmFsc2UsIGZhbHNlXSwgZmFsc2VdLFxuICAgICAgICAgICAgW1tmYWxzZSwgdHJ1ZV0sIGZhbHNlXSxcbiAgICAgICAgICAgIFtbdHJ1ZSwgZmFsc2VdLCBmYWxzZV0sXG4gICAgICAgICAgICBbW3RydWUsIHRydWVdLCB0cnVlXVxuICAgICAgICBdLmZvckVhY2goZnVuY3Rpb24gKHRlc3QpIHtcbiAgICAgICAgICAgIHRlc3QgPSBJdGVyYXRvcih0ZXN0KTtcbiAgICAgICAgICAgIHZhciBpbnB1dCA9IHRlc3QubmV4dCgpLnZhbHVlO1xuICAgICAgICAgICAgdmFyIG91dHB1dCA9IHRlc3QubmV4dCgpLnZhbHVlO1xuICAgICAgICAgICAgaXQoXCJhbGwgb2YgXCIgKyBKU09OLnN0cmluZ2lmeShpbnB1dCkgKyBcIiBzaG91bGQgYmUgXCIgKyBvdXRwdXQsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoSXRlcmF0b3IoaW5wdXQpLmFsbCgpKS50b0VxdWFsKG91dHB1dCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcIm1pblwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGl0KFwic2hvdWxkIHdvcmtcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KGRlZmluaXRlSXRlcmF0b3IoKS5taW4oKSkudG9CZSgxKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcIm1heFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGl0KFwic2hvdWxkIHdvcmtcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KGRlZmluaXRlSXRlcmF0b3IoKS5tYXgoKSkudG9CZSgzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInN1bVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGl0KFwic2hvdWxkIHdvcmtcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KGRlZmluaXRlSXRlcmF0b3IoKS5zdW0oKSkudG9CZSg2KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImF2ZXJhZ2VcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChkZWZpbml0ZUl0ZXJhdG9yKCkuYXZlcmFnZSgpKS50b0JlKDIpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZmxhdHRlblwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGl0KFwic2hvdWxkIHdvcmtcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KFxuICAgICAgICAgICAgICAgIEl0ZXJhdG9yKFtcbiAgICAgICAgICAgICAgICAgICAgZGVmaW5pdGVJdGVyYXRvcigpLFxuICAgICAgICAgICAgICAgICAgICBkZWZpbml0ZUl0ZXJhdG9yKCksXG4gICAgICAgICAgICAgICAgICAgIGRlZmluaXRlSXRlcmF0b3IoKVxuICAgICAgICAgICAgICAgIF0pLmZsYXR0ZW4oKVxuICAgICAgICAgICAgKS50b0VxdWFsKFtcbiAgICAgICAgICAgICAgICAxLCAyLCAzLFxuICAgICAgICAgICAgICAgIDEsIDIsIDMsXG4gICAgICAgICAgICAgICAgMSwgMiwgM1xuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJ6aXBcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjYXJkaW5hbHMgPSBkZWZpbml0ZUl0ZXJhdG9yKCkubWFwSXRlcmF0b3IoZnVuY3Rpb24gKG4pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbiAtIDE7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBvcmRpbmFscyA9IGRlZmluaXRlSXRlcmF0b3IoKTtcbiAgICAgICAgICAgIGV4cGVjdChjYXJkaW5hbHMuemlwKG9yZGluYWxzKSkudG9FcXVhbChbXG4gICAgICAgICAgICAgICAgWzAsIDFdLFxuICAgICAgICAgICAgICAgIFsxLCAyXSxcbiAgICAgICAgICAgICAgICBbMiwgM11cbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZW51bWVyYXRlXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpdChcInNob3VsZCB3b3JrIHdpdGggZGVmYXVsdCBzdGFydFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY2FyZGluYWxzID0gZGVmaW5pdGVJdGVyYXRvcigpO1xuICAgICAgICAgICAgZXhwZWN0KGNhcmRpbmFscy5lbnVtZXJhdGUoKSkudG9FcXVhbChbXG4gICAgICAgICAgICAgICAgWzAsIDFdLFxuICAgICAgICAgICAgICAgIFsxLCAyXSxcbiAgICAgICAgICAgICAgICBbMiwgM11cbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCB3b3JrIHdpdGggZ2l2ZW4gc3RhcnRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNhcmRpbmFscyA9IGRlZmluaXRlSXRlcmF0b3IoKTtcbiAgICAgICAgICAgIGV4cGVjdChjYXJkaW5hbHMuZW51bWVyYXRlKDEpKS50b0VxdWFsKFtcbiAgICAgICAgICAgICAgICBbMSwgMV0sXG4gICAgICAgICAgICAgICAgWzIsIDJdLFxuICAgICAgICAgICAgICAgIFszLCAzXVxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInNvcnRlZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGl0KFwic2hvdWxkIHdvcmtcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KEl0ZXJhdG9yKFs1LCAyLCA0LCAxLCAzXSkuc29ydGVkKCkpLnRvRXF1YWwoWzEsIDIsIDMsIDQsIDVdKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImdyb3VwXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXQoXCJzaG91bGQgd29ya1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleHBlY3QoSXRlcmF0b3IoWzUsIDIsIDQsIDEsIDNdKS5ncm91cChmdW5jdGlvbiAobikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuICUgMiA9PT0gMDtcbiAgICAgICAgICAgIH0pKS50b0VxdWFsKFtcbiAgICAgICAgICAgICAgICBbZmFsc2UsIFs1LCAxLCAzXV0sXG4gICAgICAgICAgICAgICAgW3RydWUsIFsyLCA0XV1cbiAgICAgICAgICAgIF0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwicmV2ZXJzZWRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChJdGVyYXRvcihbNSwgMiwgNCwgMSwgM10pLnJldmVyc2VkKCkpLnRvRXF1YWwoWzMsIDEsIDQsIDIsIDVdKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInRvQXJyYXlcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChJdGVyYXRvcihbNSwgMiwgNCwgMSwgM10pLnRvQXJyYXkoKSkudG9FcXVhbChbNSwgMiwgNCwgMSwgM10pO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwidG9PYmplY3RcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChJdGVyYXRvcihcIkFCXCIpLnRvT2JqZWN0KCkpLnRvRXF1YWwoe1xuICAgICAgICAgICAgICAgIDA6IFwiQVwiLFxuICAgICAgICAgICAgICAgIDE6IFwiQlwiXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcIm1hcEl0ZXJhdG9yXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IGluZGVmaW5pdGVJdGVyYXRvcigpXG4gICAgICAgICAgICAubWFwSXRlcmF0b3IoZnVuY3Rpb24gKG4sIGksIG8pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbiAqIDI7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvQmUoMCk7XG4gICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0JlKDIpO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9CZSg0KTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvQmUoNik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIHBhc3MgdGhlIGNvcnJlY3QgYXJndW1lbnRzIHRvIHRoZSBjYWxsYmFja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpbmRlZmluaXRlSXRlcmF0b3IoKVxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGl0ZXJhdG9yLm1hcEl0ZXJhdG9yKGZ1bmN0aW9uIChuLCBpLCBvKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGkpLnRvQmUobik7XG4gICAgICAgICAgICAgICAgZXhwZWN0KG8pLnRvQmUoaXRlcmF0b3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuICogMjtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmVzdWx0Lm5leHQoKTtcbiAgICAgICAgICAgIHJlc3VsdC5uZXh0KCk7XG4gICAgICAgICAgICByZXN1bHQubmV4dCgpO1xuICAgICAgICAgICAgcmVzdWx0Lm5leHQoKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZmlsdGVySXRlcmF0b3JcIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGl0KFwic2hvdWxkIHdvcmtcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gaW5kZWZpbml0ZUl0ZXJhdG9yKClcbiAgICAgICAgICAgIC5maWx0ZXJJdGVyYXRvcihmdW5jdGlvbiAobiwgaSwgbykge1xuICAgICAgICAgICAgICAgIGV4cGVjdChpKS50b0JlKG4pO1xuICAgICAgICAgICAgICAgIC8vZXhwZWN0KG8pLnRvQmUoaXRlcmF0b3IpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuICUgMiA9PT0gMDtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9CZSgwKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvQmUoMik7XG4gICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0JlKDQpO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9CZSg2KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgcGFzcyB0aGUgY29ycmVjdCBhcmd1bWVudHMgdG8gdGhlIGNhbGxiYWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IGluZGVmaW5pdGVJdGVyYXRvcigpXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaXRlcmF0b3IuZmlsdGVySXRlcmF0b3IoZnVuY3Rpb24gKG4sIGksIG8pIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoaSkudG9CZShuKTtcbiAgICAgICAgICAgICAgICBleHBlY3QobykudG9CZShpdGVyYXRvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG4gKiAyO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXN1bHQubmV4dCgpO1xuICAgICAgICAgICAgcmVzdWx0Lm5leHQoKTtcbiAgICAgICAgICAgIHJlc3VsdC5uZXh0KCk7XG4gICAgICAgICAgICByZXN1bHQubmV4dCgpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJjb25jYXRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IGRlZmluaXRlSXRlcmF0b3IoKS5jb25jYXQoZGVmaW5pdGVJdGVyYXRvcigpKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvQmUoMSk7XG4gICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0JlKDIpO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9CZSgzKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvQmUoMSk7XG4gICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0JlKDIpO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9CZSgzKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkuZG9uZSkudG9CZSh0cnVlKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImRyb3BXaGlsZVwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgd29ya1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpbmRlZmluaXRlSXRlcmF0b3IoKVxuICAgICAgICAgICAgLmRyb3BXaGlsZShmdW5jdGlvbiAobikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuIDwgMTA7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvQmUoMTApO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9CZSgxMSk7XG4gICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0JlKDEyKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgcGFzcyB0aGUgY29ycmVjdCBhcmd1bWVudHMgdG8gdGhlIGNhbGxiYWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBpdGVyYXRvciA9IGluZGVmaW5pdGVJdGVyYXRvcigpXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gaXRlcmF0b3IuZHJvcFdoaWxlKGZ1bmN0aW9uIChuLCBpLCBvKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGkpLnRvQmUobik7XG4gICAgICAgICAgICAgICAgZXhwZWN0KG8pLnRvQmUoaXRlcmF0b3IpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXN1bHQubmV4dCgpO1xuICAgICAgICAgICAgcmVzdWx0Lm5leHQoKTtcbiAgICAgICAgICAgIHJlc3VsdC5uZXh0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInRha2VXaGlsZVwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgd29ya1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBpbmRlZmluaXRlSXRlcmF0b3IoKVxuICAgICAgICAgICAgLnRha2VXaGlsZShmdW5jdGlvbiAobikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuIDwgMztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9CZSgwKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvQmUoMSk7XG4gICAgICAgICAgICBleHBlY3QoaXRlcmF0b3IubmV4dCgpLnZhbHVlKS50b0JlKDIpO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS5kb25lKS50b0JlKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCBwYXNzIHRoZSBjb3JyZWN0IGFyZ3VtZW50cyB0byB0aGUgY2FsbGJhY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gaW5kZWZpbml0ZUl0ZXJhdG9yKClcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBpdGVyYXRvci50YWtlV2hpbGUoZnVuY3Rpb24gKG4sIGksIG8pIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoaSkudG9CZShuKTtcbiAgICAgICAgICAgICAgICBleHBlY3QobykudG9CZShpdGVyYXRvcik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG4gPCAzO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICByZXN1bHQubmV4dCgpO1xuICAgICAgICAgICAgcmVzdWx0Lm5leHQoKTtcbiAgICAgICAgICAgIHJlc3VsdC5uZXh0KCk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInppcEl0ZXJhdG9yXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpdChcInNob3VsZCB3b3JrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjYXJkaW5hbHMgPSBpbmRlZmluaXRlSXRlcmF0b3IoKTtcbiAgICAgICAgICAgIHZhciBvcmRpbmFscyA9IGluZGVmaW5pdGVJdGVyYXRvcigpLm1hcEl0ZXJhdG9yKGZ1bmN0aW9uIChuKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG4gKyAxO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgaXRlcmF0b3IgPSBjYXJkaW5hbHMuemlwSXRlcmF0b3Iob3JkaW5hbHMpO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbChbMCwgMV0pO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbChbMSwgMl0pO1xuICAgICAgICAgICAgZXhwZWN0KGl0ZXJhdG9yLm5leHQoKS52YWx1ZSkudG9FcXVhbChbMiwgM10pO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCB3b3JrLCBldmVuIGZvciBjcmF6eSBwZW9wbGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNhcmRpbmFscyA9IGluZGVmaW5pdGVJdGVyYXRvcigpO1xuICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gY2FyZGluYWxzLnppcEl0ZXJhdG9yKGNhcmRpbmFscywgY2FyZGluYWxzKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvRXF1YWwoWzAsIDEsIDJdKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvRXF1YWwoWzMsIDQsIDVdKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvRXF1YWwoWzYsIDcsIDhdKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImVudW1lcmF0ZUl0ZXJhdG9yXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaXQoXCJzaG91bGQgd29ya1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb3JkaW5hbHMgPSBpbmRlZmluaXRlSXRlcmF0b3IoKS5tYXBJdGVyYXRvcihmdW5jdGlvbiAobikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuICsgMTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgdmFyIGl0ZXJhdG9yID0gb3JkaW5hbHMuZW51bWVyYXRlSXRlcmF0b3IoKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvRXF1YWwoWzAsIDFdKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvRXF1YWwoWzEsIDJdKTtcbiAgICAgICAgICAgIGV4cGVjdChpdGVyYXRvci5uZXh0KCkudmFsdWUpLnRvRXF1YWwoWzIsIDNdKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn1cbiJdfQ==