"use strict";
/*
    Based in part on extras from Motorola Mobility’s Montage
    Copyright (c) 2012, Motorola Mobility LLC. All Rights Reserved.
    3-Clause BSD License
    https://github.com/motorola-mobility/montage/blob/master/LICENSE.md
*/
require("collections/shim");
var Dict = require("collections/dict");
var Set = require("collections/set");
describe("ObjectShim-spec", function () {
    it("should have no enumerable properties", function () {
        expect(Object.keys(Object.prototype)).toEqual([]);
    });
    describe("empty", function () {
        it("should own no properties", function () {
            expect(Object.getOwnPropertyNames(Object.empty)).toEqual([]);
            expect(Object.keys(Object.empty)).toEqual([]);
        });
        it("should have no prototype", function () {
            expect(Object.getPrototypeOf(Object.empty)).toBe(null);
        });
        it("should be immutable", function () {
            "strict mode";
            expect(function () {
                Object.empty.a = 10; // should throw an error in strict mode
                if (Object.empty.a !== 10) {
                    throw new Error("Unchanged");
                }
            }).toThrow();
        });
    });
    describe("isObject", function () {
        [
            ["null is not an object", null, false],
            ["numbers are not objects", 1, false],
            ["undefined is not an object", undefined, false],
            ["arrays are objects", [], true],
            ["object literals are objects", {}, true],
            [
                "pure objects (null prototype) are",
                Object.create(null),
                true
            ]
        ].forEach(function (test) {
            it("should recognize that " + test[0], function () {
                expect(Object.isObject(test[1])).toEqual(test[2]);
            });
        });
    });
    describe("getValueOf", function () {
        var fakeNumber = Object.create({
            valueOf: function () {
                return 10;
            }
        });
        var object = { valueOf: 10 };
        var tests = [
            [10, 10, "number"],
            [object, object, "object (identical, with misleading owned property)"],
            [new Number(20), 20, "boxed number"],
            [fakeNumber, 10, "fake number"]
        ];
        tests.forEach(function (test) {
            it(test[2], function () {
                expect(Object.getValueOf(test[0])).toBe(test[1]);
            });
        });
    });
    describe("owns", function () {
        it("should recognized an owned property", function () {
            expect(Object.owns({ a: 0 }, "a")).toEqual(true);
        });
        it("should distinguish an inherited property", function () {
            expect(Object.owns(Object.prototype, "toString")).toEqual(true);
        });
    });
    describe("has", function () {
        it("should recognized an owned property", function () {
            expect(Object.has({ toString: true }, "toString")).toEqual(true);
        });
        it("should recognize an inherited propertry", function () {
            var parent = { "a": 10 };
            var child = Object.create(parent);
            expect(Object.has(child, "a")).toEqual(true);
        });
        it("should distinguish a property from the Object prototype", function () {
            expect(Object.has({}, "toString")).toEqual(false);
        });
        it("should recognize a property on a null prototype chain", function () {
            var parent = Object.create(null);
            parent.a = 10;
            var child = Object.create(parent);
            expect(Object.has(child, "a")).toEqual(true);
        });
        it("should recognize a falsy property", function () {
            expect(Object.has({ a: 0 }, "a")).toEqual(true);
        });
        it("should throw an error if the first argument is not an object", function () {
            expect(function () {
                Object.has(10, 10);
            }).toThrow();
        });
        it("should delegate to a prototype method", function () {
            var Type = Object.create(Object.prototype, {
                has: {
                    value: function (key) {
                        return key === "a";
                    }
                }
            });
            var instance = Object.create(Type);
            expect(Object.has(instance, "a")).toEqual(true);
            expect(Object.has(instance, "toString")).toEqual(false);
        });
        it("should delegate to a set", function () {
            var set = new Set([1, 2, 3]);
            expect(Object.has(set, 2)).toEqual(true);
            expect(Object.has(set, 4)).toEqual(false);
            expect(Object.has(set, "toString")).toEqual(false);
        });
    });
    describe("get", function () {
        it("should get an owned property from an object literal", function () {
            expect(Object.get({ a: 10 }, "a")).toEqual(10);
        });
        it("should not get a property from the Object prototype on a literal", function () {
            expect(Object.get({}, "toString")).toEqual(undefined);
        });
        it("should delegate to a prototype method", function () {
            var Type = Object.create(Object.prototype, {
                get: {
                    value: function (key) {
                        if (key === "a")
                            return 10;
                    }
                }
            });
            var instance = Object.create(Type);
            expect(Object.get(instance, "a")).toEqual(10);
        });
        it("should not delegate to an owned 'get' method", function () {
            expect(Object.get({ get: 10 }, "get")).toEqual(10);
        });
        it("should fallback to a default argument if defined", function () {
            expect(Object.get({}, "toString", 10)).toEqual(10);
        });
    });
    describe("set", function () {
        it("should set a property", function () {
            var object = {};
            Object.set(object, "set", 10);
            expect(Object.get(object, "set")).toEqual(10);
        });
        it("should delegate to a 'set' method", function () {
            var spy = jasmine.createSpy();
            var Type = Object.create(Object.prototype, {
                set: {
                    value: spy
                }
            });
            var instance = Object.create(Type);
            Object.set(instance, "a", 10);
            var argsForCall = spy.calls.all().map(function (call) { return call.args; });
            expect(argsForCall).toEqual([
                ["a", 10]
            ]);
        });
    });
    describe("forEach", function () {
        it("should iterate the owned properties of an object", function () {
            var spy = jasmine.createSpy();
            var object = { a: 10, b: 20, c: 30 };
            Object.forEach(object, spy);
            var argsForCall = spy.calls.all().map(function (call) { return call.args; });
            expect(argsForCall).toEqual([
                [10, "a", object],
                [20, "b", object],
                [30, "c", object]
            ]);
        });
        it("should pass a thisp into the callback", function () {
            var thisp = {};
            Object.forEach([1], function (value, key, object) {
                expect(this).toBe(thisp);
                expect(value).toEqual(1);
                expect(key).toEqual("0");
                expect(object).toEqual([1]);
                thisp = null;
            }, thisp);
            expect(thisp).toEqual(null);
        });
    });
    describe("map", function () {
        it("should iterate the owned properties of an object with a context thisp", function () {
            var object = { a: 10, b: 20 };
            var result = Object.map(object, function (value, key, o) {
                expect(o).toBe(object);
                return key + this + value;
            }, ": ").join(", ");
            expect(result).toEqual("a: 10, b: 20");
        });
    });
    describe("values", function () {
        it("should produce the values for owned properties", function () {
            expect(Object.values({ b: 10, a: 20 })).toEqual([10, 20]);
        });
    });
    describe("concat", function () {
        it("should merge objects into a new object", function () {
            expect(Object.concat({ a: 10 }, { b: 20 })).toEqual({ a: 10, b: 20 });
        });
        it("should prioritize latter objects", function () {
            expect(Object.concat({ a: 10 }, { a: 20 })).toEqual({ a: 20 });
        });
        it("should delegate to arrays", function () {
            expect(Object.concat({ a: 10, b: 20 }, [['c', 30]])).toEqual({ a: 10, b: 20, c: 30 });
        });
        it("should delegate to maps", function () {
            expect(Object.concat({ a: 10, b: 20 }, Dict({ c: 30 }))).toEqual({ a: 10, b: 20, c: 30 });
        });
    });
    describe("is", function () {
        var distinctValues = {
            'positive zero': 0,
            'negative zero': -0,
            'positive infinity': 1 / 0,
            'negative infinity': -1 / 0,
            'one': 1,
            'two': 2,
            'NaN': NaN,
            'objects': {},
            'other objects': {}
        };
        Object.forEach(distinctValues, function (a, ai) {
            Object.forEach(distinctValues, function (b, bi) {
                if (ai < bi)
                    return;
                var operation = ai === bi ? "recognizes" : "distinguishes";
                it(operation + " " + ai + " and " + bi, function () {
                    expect(Object.is(a, b)).toEqual(ai === bi);
                });
            });
        });
    });
    describe("equals", function () {
        var fakeNumber = {
            valueOf: function () {
                return 10;
            }
        };
        var equatable = {
            value: 10,
            clone: function () {
                return this;
            },
            equals: function (n) {
                return n === 10 || typeof n === "object" && n !== null && n.value === 10;
            }
        };
        var equivalenceClasses = [
            {
                'unboxed number': 10,
                'boxed number': new Number(10),
                'faked number': fakeNumber,
                'equatable': equatable
            },
            {
                'array': [10],
                'other array': [10]
            },
            {
                'nested array': [[10, 20], [30, 40]]
            },
            {
                'object': { a: 10 },
                'other object': { a: 10 }
            },
            {
                'now': new Date()
            },
            {
                'NaN': NaN
            },
            {
                'undefined': undefined
            },
            {
                'null': null
            }
        ];
        // positives:
        // everything should be equal to every other thing in
        // its equivalence class
        equivalenceClasses.forEach(function (equivalenceClass) {
            Object.forEach(equivalenceClass, function (a, ai) {
                equivalenceClass[ai + " clone"] = Object.clone(a);
            });
            // within each pair of class, test exhaustive combinations to cover
            // the commutative property
            Object.forEach(equivalenceClass, function (a, ai) {
                Object.forEach(equivalenceClass, function (b, bi) {
                    it(": " + ai + " equals " + bi, function () {
                        expect(Object.equals(a, b)).toBe(true);
                    });
                });
            });
        });
        // negatives
        // everything from one equivalence class should not equal
        // any other thing from a different equivalence class
        equivalenceClasses.forEach(function (aClass, aClassIndex) {
            equivalenceClasses.forEach(function (bClass, bClassIndex) {
                // only compare each respective class against another once (>),
                // and not for equivalence classes to themselves (==).
                // This cuts the bottom right triangle below the diagonal out
                // of the test matrix of equivalence classes.
                if (aClassIndex >= bClassIndex)
                    return;
                // but within each pair of classes, test exhaustive
                // combinations to cover the commutative property
                Object.forEach(aClass, function (a, ai) {
                    Object.forEach(bClass, function (b, bi) {
                        it(ai + " not equals " + bi, function () {
                            expect(Object.equals(a, b)).toBe(false);
                        });
                    });
                });
            });
        });
    });
    describe("compare", function () {
        var fakeOne = Object.create({
            valueOf: function () {
                return 1;
            }
        });
        var comparable = Object.create({
            create: function (compare) {
                var self = Object.create(this);
                self._compare = compare;
                return self;
            },
            compare: function (other) {
                return this._compare(other);
            }
        });
        var now = new Date();
        var tests = [
            [0, 0, 0],
            [0, 1, -1],
            [1, 0, 1],
            [[10], [10], 0],
            [[10], [20], -10],
            [[100, 10], [100, 0], 10],
            ["a", "b", -Infinity],
            [now, now, 0, "now to itself"],
            [
                comparable.create(function () {
                    return -1;
                }),
                null,
                -1,
                "comparable"
            ],
            [
                null,
                comparable.create(function () {
                    return 1;
                }),
                -1,
                "opposite comparable"
            ],
            [{ b: 10 }, { a: 0 }, 0, "incomparable to another"],
            [new Number(-10), 20, -30, "boxed number to real number"],
            [fakeOne, 0, 1, "fake number to real number"]
        ];
        tests.forEach(function (test) {
            it(test[3] ||
                (JSON.stringify(test[0]) + " to " +
                    JSON.stringify(test[1])), function () {
                expect(Object.compare(test[0], test[1])).toEqual(test[2]);
            });
        });
    });
    describe("clone", function () {
        var graph = {
            object: { a: 10 },
            array: [1, 2, 3],
            string: "hello",
            number: 10,
            nestedObject: {
                a: { a1: 10, a2: 20 },
                b: { b1: "a", b2: "c" }
            },
            nestedArray: [
                [1, 2, 3],
                [4, 5, 6]
            ],
            mixedObject: {
                array: [1, 3, 4],
                object: { a: 10, b: 20 }
            },
            mixedArray: [
                [],
                { a: 10, b: 20 }
            ],
            arrayWithHoles: [],
            clonable: Object.create({
                clone: function () {
                    return this;
                }
            })
        };
        graph.cycle = graph;
        graph.arrayWithHoles[10] = 10;
        graph.typedObject = Object.create(null);
        graph.typedObject.a = 10;
        graph.typedObject.b = 10;
        Object.forEach(graph, function (value, name) {
            it(name + " cloned equals self", function () {
                expect(Object.clone(value)).toEqual(value);
            });
        });
        it("should clone zero levels of depth", function () {
            var clone = Object.clone(graph, 0);
            expect(clone).toBe(graph);
        });
        it("should clone object at one level of depth", function () {
            var clone = Object.clone(graph, 1);
            expect(clone).toEqual(graph);
            expect(clone).not.toBe(graph);
        });
        it("should clone object at two levels of depth", function () {
            var clone = Object.clone(graph, 2);
            expect(clone).toEqual(graph);
            expect(clone.object).not.toBe(graph.object);
            expect(clone.object).toEqual(graph.object);
            expect(clone.nestedObject.a).toBe(graph.nestedObject.a);
        });
        it("should clone array at two levels of depth", function () {
            var clone = Object.clone(graph, 2);
            expect(clone).toEqual(graph);
            expect(clone.array).not.toBe(graph.array);
            expect(clone.array).toEqual(graph.array);
        });
        it("should clone identical values at least once", function () {
            var clone = Object.clone(graph);
            expect(clone.cycle).not.toBe(graph.cycle);
        });
        it("should clone identical values only once", function () {
            var clone = Object.clone(graph);
            expect(clone.cycle).toBe(clone);
        });
        it("should clone clonable", function () {
            var clone = Object.clone(graph);
            expect(clone.clonable).toBe(graph.clonable);
        });
    });
    describe("clone", function () {
        var object = { a: { a1: 10, a2: 20 }, b: { b1: 10, b2: 20 } };
        it("should clone zero levels", function () {
            expect(Object.clone(object, 0)).toBe(object);
        });
        it("should clone one level", function () {
            var clone = Object.clone(object, 1);
            expect(clone).toEqual(object);
            expect(clone).not.toBe(object);
            expect(clone.a).toBe(object.a);
        });
        it("should clone two levels", function () {
            var clone = Object.clone(object, 2);
            expect(clone).toEqual(object);
            expect(clone).not.toBe(object);
            expect(clone.a).not.toBe(object.a);
        });
        it("should clone with reference cycles", function () {
            var cycle = {};
            cycle.cycle = cycle;
            var clone = Object.clone(cycle);
            expect(clone).toEqual(cycle);
            expect(clone).not.toBe(cycle);
            expect(clone.cycle).toBe(clone);
        });
    });
    describe("clear", function () {
        it("should clear all owned properties of the object", function () {
            expect(Object.keys(Object.clear({ a: 10 }))).toEqual([]);
        });
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2hpbS1vYmplY3Qtc3BlYy5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvanMtcHJvdG90eXBlcy9wYWNrYWdlcy9jb2xsZWN0aW9ucy90ZXN0L3NwZWMvc2hpbS1vYmplY3Qtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxZQUFZLENBQUM7QUFFYjs7Ozs7RUFLRTtBQUVGLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzVCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQ3ZDLElBQUksR0FBRyxHQUFHLE9BQU8sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO0FBRXJDLFFBQVEsQ0FBQyxpQkFBaUIsRUFBRTtJQUV4QixFQUFFLENBQUMsc0NBQXNDLEVBQUU7UUFDdkMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ3RELENBQUMsQ0FBQyxDQUFDO0lBRUgsUUFBUSxDQUFDLE9BQU8sRUFBRTtRQUVkLEVBQUUsQ0FBQywwQkFBMEIsRUFBRTtZQUMzQixNQUFNLENBQUMsTUFBTSxDQUFDLG1CQUFtQixDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUM3RCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEQsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsMEJBQTBCLEVBQUU7WUFDM0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO1FBRUgsRUFB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QUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBQyxFQUFFLENBQUMsRUFBRSxFQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsRUFBQyxFQUFDLENBQUM7UUFFeEQsRUFBRSxDQUFDLDBCQUEwQixFQUFFO1lBQzNCLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx3QkFBd0IsRUFBRTtZQUN6QixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUMsQ0FBQztRQUVILEVBQUUsQ0FBQyx5QkFBeUIsRUFBRTtZQUMxQixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9CLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDdkMsQ0FBQyxDQUFDLENBQUM7UUFFSCxFQUFFLENBQUMsb0NBQW9DLEVBQUU7WUFDckMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2YsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7WUFDcEIsSUFBSSxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQzlCLE1BQU0sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQyxDQUFDLENBQUM7SUFFSCxRQUFRLENBQUMsT0FBTyxFQUFFO1FBRWQsRUFBRSxDQUFDLGlEQUFpRCxFQUFFO1lBQ2xELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsRUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzNELENBQUMsQ0FBQyxDQUFDO0lBRVAsQ0FBQyxDQUFDLENBQUM7QUFFUCxDQUFDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICAgIEJhc2VkIGluIHBhcnQgb24gZXh0cmFzIGZyb20gTW90b3JvbGEgTW9iaWxpdHnigJlzIE1vbnRhZ2VcbiAgICBDb3B5cmlnaHQgKGMpIDIwMTIsIE1vdG9yb2xhIE1vYmlsaXR5IExMQy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAgICAzLUNsYXVzZSBCU0QgTGljZW5zZVxuICAgIGh0dHBzOi8vZ2l0aHViLmNvbS9tb3Rvcm9sYS1tb2JpbGl0eS9tb250YWdlL2Jsb2IvbWFzdGVyL0xJQ0VOU0UubWRcbiovXG5cbnJlcXVpcmUoXCJjb2xsZWN0aW9ucy9zaGltXCIpO1xudmFyIERpY3QgPSByZXF1aXJlKFwiY29sbGVjdGlvbnMvZGljdFwiKTtcbnZhciBTZXQgPSByZXF1aXJlKFwiY29sbGVjdGlvbnMvc2V0XCIpO1xuXG5kZXNjcmliZShcIk9iamVjdFNoaW0tc3BlY1wiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICBpdChcInNob3VsZCBoYXZlIG5vIGVudW1lcmFibGUgcHJvcGVydGllc1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGV4cGVjdChPYmplY3Qua2V5cyhPYmplY3QucHJvdG90eXBlKSkudG9FcXVhbChbXSk7XG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImVtcHR5XCIsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpdChcInNob3VsZCBvd24gbm8gcHJvcGVydGllc1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoT2JqZWN0LmVtcHR5KSkudG9FcXVhbChbXSk7XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0LmtleXMoT2JqZWN0LmVtcHR5KSkudG9FcXVhbChbXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGhhdmUgbm8gcHJvdG90eXBlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3QuZ2V0UHJvdG90eXBlT2YoT2JqZWN0LmVtcHR5KSkudG9CZShudWxsKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgYmUgaW1tdXRhYmxlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIFwic3RyaWN0IG1vZGVcIjtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmVtcHR5LmEgPSAxMDsgLy8gc2hvdWxkIHRocm93IGFuIGVycm9yIGluIHN0cmljdCBtb2RlXG4gICAgICAgICAgICAgICAgaWYgKE9iamVjdC5lbXB0eS5hICE9PSAxMCkge1xuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmNoYW5nZWRcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJpc09iamVjdFwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgW1xuICAgICAgICAgICAgW1wibnVsbCBpcyBub3QgYW4gb2JqZWN0XCIsIG51bGwsIGZhbHNlXSxcbiAgICAgICAgICAgIFtcIm51bWJlcnMgYXJlIG5vdCBvYmplY3RzXCIsIDEsIGZhbHNlXSxcbiAgICAgICAgICAgIFtcInVuZGVmaW5lZCBpcyBub3QgYW4gb2JqZWN0XCIsIHVuZGVmaW5lZCwgZmFsc2VdLFxuICAgICAgICAgICAgW1wiYXJyYXlzIGFyZSBvYmplY3RzXCIsIFtdLCB0cnVlXSxcbiAgICAgICAgICAgIFtcIm9iamVjdCBsaXRlcmFscyBhcmUgb2JqZWN0c1wiLCB7fSwgdHJ1ZV0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgXCJwdXJlIG9iamVjdHMgKG51bGwgcHJvdG90eXBlKSBhcmVcIixcbiAgICAgICAgICAgICAgICBPYmplY3QuY3JlYXRlKG51bGwpLFxuICAgICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgIF1cbiAgICAgICAgXS5mb3JFYWNoKGZ1bmN0aW9uICh0ZXN0KSB7XG4gICAgICAgICAgICBpdChcInNob3VsZCByZWNvZ25pemUgdGhhdCBcIiArIHRlc3RbMF0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICBleHBlY3QoT2JqZWN0LmlzT2JqZWN0KHRlc3RbMV0pKS50b0VxdWFsKHRlc3RbMl0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImdldFZhbHVlT2ZcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZmFrZU51bWJlciA9IE9iamVjdC5jcmVhdGUoe1xuICAgICAgICAgICAgdmFsdWVPZjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIG9iamVjdCA9IHt2YWx1ZU9mOiAxMH07XG4gICAgICAgIHZhciB0ZXN0cyA9IFtcbiAgICAgICAgICAgIFsxMCwgMTAsIFwibnVtYmVyXCJdLFxuICAgICAgICAgICAgW29iamVjdCwgb2JqZWN0LCBcIm9iamVjdCAoaWRlbnRpY2FsLCB3aXRoIG1pc2xlYWRpbmcgb3duZWQgcHJvcGVydHkpXCJdLFxuICAgICAgICAgICAgW25ldyBOdW1iZXIoMjApLCAyMCwgXCJib3hlZCBudW1iZXJcIl0sXG4gICAgICAgICAgICBbZmFrZU51bWJlciwgMTAsIFwiZmFrZSBudW1iZXJcIl1cbiAgICAgICAgXTtcblxuICAgICAgICB0ZXN0cy5mb3JFYWNoKGZ1bmN0aW9uICh0ZXN0KSB7XG4gICAgICAgICAgICBpdCh0ZXN0WzJdLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5nZXRWYWx1ZU9mKHRlc3RbMF0pKS50b0JlKHRlc3RbMV0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcIm93bnNcIiwgZnVuY3Rpb24gKCkge1xuXG4gICAgICAgIGl0KFwic2hvdWxkIHJlY29nbml6ZWQgYW4gb3duZWQgcHJvcGVydHlcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5vd25zKHthOiAwfSwgXCJhXCIpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCBkaXN0aW5ndWlzaCBhbiBpbmhlcml0ZWQgcHJvcGVydHlcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5vd25zKE9iamVjdC5wcm90b3R5cGUsIFwidG9TdHJpbmdcIikpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImhhc1wiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgcmVjb2duaXplZCBhbiBvd25lZCBwcm9wZXJ0eVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0Lmhhcyh7dG9TdHJpbmc6IHRydWV9LCBcInRvU3RyaW5nXCIpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCByZWNvZ25pemUgYW4gaW5oZXJpdGVkIHByb3BlcnRyeVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0ge1wiYVwiOiAxMH07XG4gICAgICAgICAgICB2YXIgY2hpbGQgPSBPYmplY3QuY3JlYXRlKHBhcmVudCk7XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0LmhhcyhjaGlsZCwgXCJhXCIpKS50b0VxdWFsKHRydWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCBkaXN0aW5ndWlzaCBhIHByb3BlcnR5IGZyb20gdGhlIE9iamVjdCBwcm90b3R5cGVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5oYXMoe30sIFwidG9TdHJpbmdcIikpLnRvRXF1YWwoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCByZWNvZ25pemUgYSBwcm9wZXJ0eSBvbiBhIG51bGwgcHJvdG90eXBlIGNoYWluXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgICAgcGFyZW50LmEgPSAxMDtcbiAgICAgICAgICAgIHZhciBjaGlsZCA9IE9iamVjdC5jcmVhdGUocGFyZW50KTtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3QuaGFzKGNoaWxkLCBcImFcIikpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIHJlY29nbml6ZSBhIGZhbHN5IHByb3BlcnR5XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3QuaGFzKHthOjB9LCBcImFcIikpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIHRocm93IGFuIGVycm9yIGlmIHRoZSBmaXJzdCBhcmd1bWVudCBpcyBub3QgYW4gb2JqZWN0XCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgT2JqZWN0LmhhcygxMCwgMTApO1xuICAgICAgICAgICAgfSkudG9UaHJvdygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCBkZWxlZ2F0ZSB0byBhIHByb3RvdHlwZSBtZXRob2RcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIFR5cGUgPSBPYmplY3QuY3JlYXRlKE9iamVjdC5wcm90b3R5cGUsIHtcbiAgICAgICAgICAgICAgICBoYXM6IHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBrZXkgPT09IFwiYVwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKFR5cGUpO1xuICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5oYXMoaW5zdGFuY2UsIFwiYVwiKSkudG9FcXVhbCh0cnVlKTtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3QuaGFzKGluc3RhbmNlLCBcInRvU3RyaW5nXCIpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgZGVsZWdhdGUgdG8gYSBzZXRcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNldCA9IG5ldyBTZXQoWzEsIDIsIDNdKTtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3QuaGFzKHNldCwgMikpLnRvRXF1YWwodHJ1ZSk7XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0LmhhcyhzZXQsIDQpKS50b0VxdWFsKGZhbHNlKTtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3QuaGFzKHNldCwgXCJ0b1N0cmluZ1wiKSkudG9FcXVhbChmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImdldFwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgZ2V0IGFuIG93bmVkIHByb3BlcnR5IGZyb20gYW4gb2JqZWN0IGxpdGVyYWxcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5nZXQoe2E6IDEwfSwgXCJhXCIpKS50b0VxdWFsKDEwKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgbm90IGdldCBhIHByb3BlcnR5IGZyb20gdGhlIE9iamVjdCBwcm90b3R5cGUgb24gYSBsaXRlcmFsXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3QuZ2V0KHt9LCBcInRvU3RyaW5nXCIpKS50b0VxdWFsKHVuZGVmaW5lZCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGRlbGVnYXRlIHRvIGEgcHJvdG90eXBlIG1ldGhvZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgVHlwZSA9IE9iamVjdC5jcmVhdGUoT2JqZWN0LnByb3RvdHlwZSwge1xuICAgICAgICAgICAgICAgIGdldDoge1xuICAgICAgICAgICAgICAgICAgICB2YWx1ZTogZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGtleSA9PT0gXCJhXCIpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDEwO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2YXIgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKFR5cGUpO1xuICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5nZXQoaW5zdGFuY2UsIFwiYVwiKSkudG9FcXVhbCgxMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIG5vdCBkZWxlZ2F0ZSB0byBhbiBvd25lZCAnZ2V0JyBtZXRob2RcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5nZXQoe2dldDogMTB9LCBcImdldFwiKSkudG9FcXVhbCgxMCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGZhbGxiYWNrIHRvIGEgZGVmYXVsdCBhcmd1bWVudCBpZiBkZWZpbmVkXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3QuZ2V0KHt9LCBcInRvU3RyaW5nXCIsIDEwKSkudG9FcXVhbCgxMCk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInNldFwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgc2V0IGEgcHJvcGVydHlcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIG9iamVjdCA9IHt9O1xuICAgICAgICAgICAgT2JqZWN0LnNldChvYmplY3QsIFwic2V0XCIsIDEwKTtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3QuZ2V0KG9iamVjdCwgXCJzZXRcIikpLnRvRXF1YWwoMTApO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCBkZWxlZ2F0ZSB0byBhICdzZXQnIG1ldGhvZFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgc3B5ID0gamFzbWluZS5jcmVhdGVTcHkoKTtcbiAgICAgICAgICAgIHZhciBUeXBlID0gT2JqZWN0LmNyZWF0ZShPYmplY3QucHJvdG90eXBlLCB7XG4gICAgICAgICAgICAgICAgc2V0OiB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlOiBzcHlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBpbnN0YW5jZSA9IE9iamVjdC5jcmVhdGUoVHlwZSk7XG4gICAgICAgICAgICBPYmplY3Quc2V0KGluc3RhbmNlLCBcImFcIiwgMTApO1xuXG4gICAgICAgICAgICB2YXIgYXJnc0ZvckNhbGwgPSBzcHkuY2FsbHMuYWxsKCkubWFwKGZ1bmN0aW9uIChjYWxsKSB7IHJldHVybiBjYWxsLmFyZ3MgfSk7XG4gICAgICAgICAgICBleHBlY3QoYXJnc0ZvckNhbGwpLnRvRXF1YWwoW1xuICAgICAgICAgICAgICAgIFtcImFcIiwgMTBdXG4gICAgICAgICAgICBdKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiZm9yRWFjaFwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgaXRlcmF0ZSB0aGUgb3duZWQgcHJvcGVydGllcyBvZiBhbiBvYmplY3RcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIHNweSA9IGphc21pbmUuY3JlYXRlU3B5KCk7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0ge2E6IDEwLCBiOiAyMCwgYzogMzB9O1xuICAgICAgICAgICAgT2JqZWN0LmZvckVhY2gob2JqZWN0LCBzcHkpO1xuICAgICAgICAgICAgdmFyIGFyZ3NGb3JDYWxsID0gc3B5LmNhbGxzLmFsbCgpLm1hcChmdW5jdGlvbiAoY2FsbCkgeyByZXR1cm4gY2FsbC5hcmdzIH0pO1xuICAgICAgICAgICAgZXhwZWN0KGFyZ3NGb3JDYWxsKS50b0VxdWFsKFtcbiAgICAgICAgICAgICAgICBbMTAsIFwiYVwiLCBvYmplY3RdLFxuICAgICAgICAgICAgICAgIFsyMCwgXCJiXCIsIG9iamVjdF0sXG4gICAgICAgICAgICAgICAgWzMwLCBcImNcIiwgb2JqZWN0XVxuICAgICAgICAgICAgXSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIHBhc3MgYSB0aGlzcCBpbnRvIHRoZSBjYWxsYmFja1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgdGhpc3AgPSB7fTtcbiAgICAgICAgICAgIE9iamVjdC5mb3JFYWNoKFsxXSwgZnVuY3Rpb24gKHZhbHVlLCBrZXksIG9iamVjdCkge1xuICAgICAgICAgICAgICAgIGV4cGVjdCh0aGlzKS50b0JlKHRoaXNwKTtcbiAgICAgICAgICAgICAgICBleHBlY3QodmFsdWUpLnRvRXF1YWwoMSk7XG4gICAgICAgICAgICAgICAgZXhwZWN0KGtleSkudG9FcXVhbChcIjBcIik7XG4gICAgICAgICAgICAgICAgZXhwZWN0KG9iamVjdCkudG9FcXVhbChbMV0pO1xuICAgICAgICAgICAgICAgIHRoaXNwID0gbnVsbDtcbiAgICAgICAgICAgIH0sIHRoaXNwKTtcbiAgICAgICAgICAgIGV4cGVjdCh0aGlzcCkudG9FcXVhbChudWxsKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwibWFwXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICBpdChcInNob3VsZCBpdGVyYXRlIHRoZSBvd25lZCBwcm9wZXJ0aWVzIG9mIGFuIG9iamVjdCB3aXRoIGEgY29udGV4dCB0aGlzcFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgb2JqZWN0ID0ge2E6IDEwLCBiOiAyMH1cbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBPYmplY3QubWFwKG9iamVjdCwgZnVuY3Rpb24gKHZhbHVlLCBrZXksIG8pIHtcbiAgICAgICAgICAgICAgICBleHBlY3QobykudG9CZShvYmplY3QpO1xuICAgICAgICAgICAgICAgIHJldHVybiBrZXkgKyB0aGlzICsgdmFsdWU7XG4gICAgICAgICAgICB9LCBcIjogXCIpLmpvaW4oXCIsIFwiKTtcbiAgICAgICAgICAgIGV4cGVjdChyZXN1bHQpLnRvRXF1YWwoXCJhOiAxMCwgYjogMjBcIik7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcInZhbHVlc1wiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgcHJvZHVjZSB0aGUgdmFsdWVzIGZvciBvd25lZCBwcm9wZXJ0aWVzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3QudmFsdWVzKHtiOiAxMCwgYTogMjB9KSkudG9FcXVhbChbMTAsIDIwXSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImNvbmNhdFwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgbWVyZ2Ugb2JqZWN0cyBpbnRvIGEgbmV3IG9iamVjdFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0LmNvbmNhdCh7YTogMTB9LCB7YjogMjB9KSkudG9FcXVhbCh7YTogMTAsIGI6IDIwfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIHByaW9yaXRpemUgbGF0dGVyIG9iamVjdHNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5jb25jYXQoe2E6IDEwfSwge2E6IDIwfSkpLnRvRXF1YWwoe2E6IDIwfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGRlbGVnYXRlIHRvIGFycmF5c1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0LmNvbmNhdCh7YTogMTAsIGI6IDIwfSwgW1snYycsIDMwXV0pKS50b0VxdWFsKHthOiAxMCwgYjogMjAsIGM6IDMwfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGRlbGVnYXRlIHRvIG1hcHNcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5jb25jYXQoe2E6IDEwLCBiOiAyMH0sIERpY3Qoe2M6IDMwfSkpKS50b0VxdWFsKHthOiAxMCwgYjogMjAsIGM6IDMwfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImlzXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgZGlzdGluY3RWYWx1ZXMgPSB7XG4gICAgICAgICAgICAncG9zaXRpdmUgemVybyc6IDAsXG4gICAgICAgICAgICAnbmVnYXRpdmUgemVybyc6IC0wLFxuICAgICAgICAgICAgJ3Bvc2l0aXZlIGluZmluaXR5JzogMS8wLFxuICAgICAgICAgICAgJ25lZ2F0aXZlIGluZmluaXR5JzogLTEvMCxcbiAgICAgICAgICAgICdvbmUnOiAxLFxuICAgICAgICAgICAgJ3R3byc6IDIsXG4gICAgICAgICAgICAnTmFOJzogTmFOLFxuICAgICAgICAgICAgJ29iamVjdHMnOiB7fSxcbiAgICAgICAgICAgICdvdGhlciBvYmplY3RzJzoge31cbiAgICAgICAgfTtcblxuICAgICAgICBPYmplY3QuZm9yRWFjaChkaXN0aW5jdFZhbHVlcywgZnVuY3Rpb24gKGEsIGFpKSB7XG4gICAgICAgICAgICBPYmplY3QuZm9yRWFjaChkaXN0aW5jdFZhbHVlcywgZnVuY3Rpb24gKGIsIGJpKSB7XG4gICAgICAgICAgICAgICAgaWYgKGFpIDwgYmkpXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB2YXIgb3BlcmF0aW9uID0gYWkgPT09IGJpID8gXCJyZWNvZ25pemVzXCIgOiBcImRpc3Rpbmd1aXNoZXNcIjtcbiAgICAgICAgICAgICAgICBpdChvcGVyYXRpb24gKyBcIiBcIiArIGFpICsgXCIgYW5kIFwiICsgYmksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5pcyhhLCBiKSkudG9FcXVhbChhaSA9PT0gYmkpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImVxdWFsc1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBmYWtlTnVtYmVyID0ge1xuICAgICAgICAgICAgdmFsdWVPZjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAxMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICAgICAgdmFyIGVxdWF0YWJsZSA9IHtcbiAgICAgICAgICAgIHZhbHVlOiAxMCxcbiAgICAgICAgICAgIGNsb25lOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZXF1YWxzOiBmdW5jdGlvbiAobikge1xuICAgICAgICAgICAgICAgIHJldHVybiBuID09PSAxMCB8fCB0eXBlb2YgbiA9PT0gXCJvYmplY3RcIiAmJiBuICE9PSBudWxsICYmIG4udmFsdWUgPT09IDEwO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHZhciBlcXVpdmFsZW5jZUNsYXNzZXMgPSBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ3VuYm94ZWQgbnVtYmVyJzogMTAsXG4gICAgICAgICAgICAgICAgJ2JveGVkIG51bWJlcic6IG5ldyBOdW1iZXIoMTApLFxuICAgICAgICAgICAgICAgICdmYWtlZCBudW1iZXInOiBmYWtlTnVtYmVyLFxuICAgICAgICAgICAgICAgICdlcXVhdGFibGUnOiBlcXVhdGFibGVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ2FycmF5JzogWzEwXSxcbiAgICAgICAgICAgICAgICAnb3RoZXIgYXJyYXknOiBbMTBdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICduZXN0ZWQgYXJyYXknOiBbWzEwLCAyMF0sIFszMCwgNDBdXVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnb2JqZWN0Jzoge2E6IDEwfSxcbiAgICAgICAgICAgICAgICAnb3RoZXIgb2JqZWN0Jzoge2E6IDEwfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnbm93JzogbmV3IERhdGUoKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAnTmFOJzogTmFOXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICd1bmRlZmluZWQnOiB1bmRlZmluZWRcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJ251bGwnOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgIF07XG5cbiAgICAgICAgLy8gcG9zaXRpdmVzOlxuICAgICAgICAvLyBldmVyeXRoaW5nIHNob3VsZCBiZSBlcXVhbCB0byBldmVyeSBvdGhlciB0aGluZyBpblxuICAgICAgICAvLyBpdHMgZXF1aXZhbGVuY2UgY2xhc3NcbiAgICAgICAgZXF1aXZhbGVuY2VDbGFzc2VzLmZvckVhY2goZnVuY3Rpb24gKGVxdWl2YWxlbmNlQ2xhc3MpIHtcbiAgICAgICAgICAgIE9iamVjdC5mb3JFYWNoKGVxdWl2YWxlbmNlQ2xhc3MsIGZ1bmN0aW9uIChhLCBhaSkge1xuICAgICAgICAgICAgICAgIGVxdWl2YWxlbmNlQ2xhc3NbYWkgKyBcIiBjbG9uZVwiXSA9IE9iamVjdC5jbG9uZShhKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gd2l0aGluIGVhY2ggcGFpciBvZiBjbGFzcywgdGVzdCBleGhhdXN0aXZlIGNvbWJpbmF0aW9ucyB0byBjb3ZlclxuICAgICAgICAgICAgLy8gdGhlIGNvbW11dGF0aXZlIHByb3BlcnR5XG4gICAgICAgICAgICBPYmplY3QuZm9yRWFjaChlcXVpdmFsZW5jZUNsYXNzLCBmdW5jdGlvbiAoYSwgYWkpIHtcbiAgICAgICAgICAgICAgICBPYmplY3QuZm9yRWFjaChlcXVpdmFsZW5jZUNsYXNzLCBmdW5jdGlvbiAoYiwgYmkpIHtcbiAgICAgICAgICAgICAgICAgICAgaXQoXCI6IFwiICsgYWkgKyBcIiBlcXVhbHMgXCIgKyBiaSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5lcXVhbHMoYSwgYikpLnRvQmUodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIG5lZ2F0aXZlc1xuICAgICAgICAvLyBldmVyeXRoaW5nIGZyb20gb25lIGVxdWl2YWxlbmNlIGNsYXNzIHNob3VsZCBub3QgZXF1YWxcbiAgICAgICAgLy8gYW55IG90aGVyIHRoaW5nIGZyb20gYSBkaWZmZXJlbnQgZXF1aXZhbGVuY2UgY2xhc3NcbiAgICAgICAgZXF1aXZhbGVuY2VDbGFzc2VzLmZvckVhY2goZnVuY3Rpb24gKGFDbGFzcywgYUNsYXNzSW5kZXgpIHtcbiAgICAgICAgICAgIGVxdWl2YWxlbmNlQ2xhc3Nlcy5mb3JFYWNoKGZ1bmN0aW9uIChiQ2xhc3MsIGJDbGFzc0luZGV4KSB7XG4gICAgICAgICAgICAgICAgLy8gb25seSBjb21wYXJlIGVhY2ggcmVzcGVjdGl2ZSBjbGFzcyBhZ2FpbnN0IGFub3RoZXIgb25jZSAoPiksXG4gICAgICAgICAgICAgICAgLy8gYW5kIG5vdCBmb3IgZXF1aXZhbGVuY2UgY2xhc3NlcyB0byB0aGVtc2VsdmVzICg9PSkuXG4gICAgICAgICAgICAgICAgLy8gVGhpcyBjdXRzIHRoZSBib3R0b20gcmlnaHQgdHJpYW5nbGUgYmVsb3cgdGhlIGRpYWdvbmFsIG91dFxuICAgICAgICAgICAgICAgIC8vIG9mIHRoZSB0ZXN0IG1hdHJpeCBvZiBlcXVpdmFsZW5jZSBjbGFzc2VzLlxuICAgICAgICAgICAgICAgIGlmIChhQ2xhc3NJbmRleCA+PSBiQ2xhc3NJbmRleClcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIC8vIGJ1dCB3aXRoaW4gZWFjaCBwYWlyIG9mIGNsYXNzZXMsIHRlc3QgZXhoYXVzdGl2ZVxuICAgICAgICAgICAgICAgIC8vIGNvbWJpbmF0aW9ucyB0byBjb3ZlciB0aGUgY29tbXV0YXRpdmUgcHJvcGVydHlcbiAgICAgICAgICAgICAgICBPYmplY3QuZm9yRWFjaChhQ2xhc3MsIGZ1bmN0aW9uIChhLCBhaSkge1xuICAgICAgICAgICAgICAgICAgICBPYmplY3QuZm9yRWFjaChiQ2xhc3MsIGZ1bmN0aW9uIChiLCBiaSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaXQoYWkgKyBcIiBub3QgZXF1YWxzIFwiICsgYmksIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBleHBlY3QoT2JqZWN0LmVxdWFscyhhLCBiKSkudG9CZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiY29tcGFyZVwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIGZha2VPbmUgPSBPYmplY3QuY3JlYXRlKHtcbiAgICAgICAgICAgIHZhbHVlT2Y6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgdmFyIGNvbXBhcmFibGUgPSBPYmplY3QuY3JlYXRlKHtcbiAgICAgICAgICAgIGNyZWF0ZTogZnVuY3Rpb24gKGNvbXBhcmUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IE9iamVjdC5jcmVhdGUodGhpcyk7XG4gICAgICAgICAgICAgICAgc2VsZi5fY29tcGFyZSA9IGNvbXBhcmU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbGY7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcGFyZTogZnVuY3Rpb24gKG90aGVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NvbXBhcmUob3RoZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICB2YXIgbm93ID0gbmV3IERhdGUoKTtcblxuICAgICAgICB2YXIgdGVzdHMgPSBbXG4gICAgICAgICAgICBbMCwgMCwgMF0sXG4gICAgICAgICAgICBbMCwgMSwgLTFdLFxuICAgICAgICAgICAgWzEsIDAsIDFdLFxuICAgICAgICAgICAgW1sxMF0sIFsxMF0sIDBdLFxuICAgICAgICAgICAgW1sxMF0sIFsyMF0sIC0xMF0sXG4gICAgICAgICAgICBbWzEwMCwgMTBdLCBbMTAwLCAwXSwgMTBdLFxuICAgICAgICAgICAgW1wiYVwiLCBcImJcIiwgLUluZmluaXR5XSxcbiAgICAgICAgICAgIFtub3csIG5vdywgMCwgXCJub3cgdG8gaXRzZWxmXCJdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgIGNvbXBhcmFibGUuY3JlYXRlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgLTEsXG4gICAgICAgICAgICAgICAgXCJjb21wYXJhYmxlXCJcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICBjb21wYXJhYmxlLmNyZWF0ZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiAxO1xuICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgIC0xLFxuICAgICAgICAgICAgICAgIFwib3Bwb3NpdGUgY29tcGFyYWJsZVwiXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW3tiOiAxMH0sIHthOiAwfSwgMCwgXCJpbmNvbXBhcmFibGUgdG8gYW5vdGhlclwiXSxcbiAgICAgICAgICAgIFtuZXcgTnVtYmVyKC0xMCksIDIwLCAtMzAsIFwiYm94ZWQgbnVtYmVyIHRvIHJlYWwgbnVtYmVyXCJdLFxuICAgICAgICAgICAgW2Zha2VPbmUsIDAsIDEsIFwiZmFrZSBudW1iZXIgdG8gcmVhbCBudW1iZXJcIl1cbiAgICAgICAgXTtcblxuICAgICAgICB0ZXN0cy5mb3JFYWNoKGZ1bmN0aW9uICh0ZXN0KSB7XG4gICAgICAgICAgICBpdChcbiAgICAgICAgICAgICAgICB0ZXN0WzNdIHx8XG4gICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgICBKU09OLnN0cmluZ2lmeSh0ZXN0WzBdKSArIFwiIHRvIFwiICtcbiAgICAgICAgICAgICAgICAgICAgSlNPTi5zdHJpbmdpZnkodGVzdFsxXSlcbiAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5jb21wYXJlKHRlc3RbMF0sIHRlc3RbMV0pKS50b0VxdWFsKHRlc3RbMl0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbiAgICBkZXNjcmliZShcImNsb25lXCIsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgZ3JhcGggPSB7XG4gICAgICAgICAgICBvYmplY3Q6IHthOiAxMH0sXG4gICAgICAgICAgICBhcnJheTogWzEsIDIsIDNdLFxuICAgICAgICAgICAgc3RyaW5nOiBcImhlbGxvXCIsXG4gICAgICAgICAgICBudW1iZXI6IDEwLFxuICAgICAgICAgICAgbmVzdGVkT2JqZWN0OiB7XG4gICAgICAgICAgICAgICAgYToge2ExOiAxMCwgYTI6IDIwfSxcbiAgICAgICAgICAgICAgICBiOiB7YjE6IFwiYVwiLCBiMjogXCJjXCJ9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmVzdGVkQXJyYXk6IFtcbiAgICAgICAgICAgICAgICBbMSwgMiwgM10sXG4gICAgICAgICAgICAgICAgWzQsIDUsIDZdXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgbWl4ZWRPYmplY3Q6IHtcbiAgICAgICAgICAgICAgICBhcnJheTogWzEsIDMsIDRdLFxuICAgICAgICAgICAgICAgIG9iamVjdDoge2E6IDEwLCBiOiAyMH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtaXhlZEFycmF5OiBbXG4gICAgICAgICAgICAgICAgW10sXG4gICAgICAgICAgICAgICAge2E6IDEwLCBiOiAyMH1cbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBhcnJheVdpdGhIb2xlczogW10sXG4gICAgICAgICAgICBjbG9uYWJsZTogT2JqZWN0LmNyZWF0ZSh7XG4gICAgICAgICAgICAgICAgY2xvbmU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuXG4gICAgICAgIGdyYXBoLmN5Y2xlID0gZ3JhcGg7XG4gICAgICAgIGdyYXBoLmFycmF5V2l0aEhvbGVzWzEwXSA9IDEwO1xuXG4gICAgICAgIGdyYXBoLnR5cGVkT2JqZWN0ID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgZ3JhcGgudHlwZWRPYmplY3QuYSA9IDEwO1xuICAgICAgICBncmFwaC50eXBlZE9iamVjdC5iID0gMTA7XG5cbiAgICAgICAgT2JqZWN0LmZvckVhY2goZ3JhcGgsIGZ1bmN0aW9uICh2YWx1ZSwgbmFtZSkge1xuICAgICAgICAgICAgaXQobmFtZSArIFwiIGNsb25lZCBlcXVhbHMgc2VsZlwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgZXhwZWN0KE9iamVjdC5jbG9uZSh2YWx1ZSkpLnRvRXF1YWwodmFsdWUpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGNsb25lIHplcm8gbGV2ZWxzIG9mIGRlcHRoXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjbG9uZSA9IE9iamVjdC5jbG9uZShncmFwaCwgMCk7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmUpLnRvQmUoZ3JhcGgpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCBjbG9uZSBvYmplY3QgYXQgb25lIGxldmVsIG9mIGRlcHRoXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjbG9uZSA9IE9iamVjdC5jbG9uZShncmFwaCwgMSk7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmUpLnRvRXF1YWwoZ3JhcGgpO1xuICAgICAgICAgICAgZXhwZWN0KGNsb25lKS5ub3QudG9CZShncmFwaCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGNsb25lIG9iamVjdCBhdCB0d28gbGV2ZWxzIG9mIGRlcHRoXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjbG9uZSA9IE9iamVjdC5jbG9uZShncmFwaCwgMik7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmUpLnRvRXF1YWwoZ3JhcGgpO1xuICAgICAgICAgICAgZXhwZWN0KGNsb25lLm9iamVjdCkubm90LnRvQmUoZ3JhcGgub2JqZWN0KTtcbiAgICAgICAgICAgIGV4cGVjdChjbG9uZS5vYmplY3QpLnRvRXF1YWwoZ3JhcGgub2JqZWN0KTtcbiAgICAgICAgICAgIGV4cGVjdChjbG9uZS5uZXN0ZWRPYmplY3QuYSkudG9CZShncmFwaC5uZXN0ZWRPYmplY3QuYSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGNsb25lIGFycmF5IGF0IHR3byBsZXZlbHMgb2YgZGVwdGhcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNsb25lID0gT2JqZWN0LmNsb25lKGdyYXBoLCAyKTtcbiAgICAgICAgICAgIGV4cGVjdChjbG9uZSkudG9FcXVhbChncmFwaCk7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmUuYXJyYXkpLm5vdC50b0JlKGdyYXBoLmFycmF5KTtcbiAgICAgICAgICAgIGV4cGVjdChjbG9uZS5hcnJheSkudG9FcXVhbChncmFwaC5hcnJheSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGNsb25lIGlkZW50aWNhbCB2YWx1ZXMgYXQgbGVhc3Qgb25jZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY2xvbmUgPSBPYmplY3QuY2xvbmUoZ3JhcGgpO1xuICAgICAgICAgICAgZXhwZWN0KGNsb25lLmN5Y2xlKS5ub3QudG9CZShncmFwaC5jeWNsZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGNsb25lIGlkZW50aWNhbCB2YWx1ZXMgb25seSBvbmNlXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjbG9uZSA9IE9iamVjdC5jbG9uZShncmFwaCk7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmUuY3ljbGUpLnRvQmUoY2xvbmUpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCBjbG9uZSBjbG9uYWJsZVwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY2xvbmUgPSBPYmplY3QuY2xvbmUoZ3JhcGgpO1xuICAgICAgICAgICAgZXhwZWN0KGNsb25lLmNsb25hYmxlKS50b0JlKGdyYXBoLmNsb25hYmxlKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcblxuICAgIGRlc2NyaWJlKFwiY2xvbmVcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgb2JqZWN0ID0ge2E6IHthMTogMTAsIGEyOiAyMH0sIGI6IHtiMTogMTAsIGIyOiAyMH19O1xuXG4gICAgICAgIGl0KFwic2hvdWxkIGNsb25lIHplcm8gbGV2ZWxzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGV4cGVjdChPYmplY3QuY2xvbmUob2JqZWN0LCAwKSkudG9CZShvYmplY3QpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpdChcInNob3VsZCBjbG9uZSBvbmUgbGV2ZWxcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgdmFyIGNsb25lID0gT2JqZWN0LmNsb25lKG9iamVjdCwgMSk7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmUpLnRvRXF1YWwob2JqZWN0KTtcbiAgICAgICAgICAgIGV4cGVjdChjbG9uZSkubm90LnRvQmUob2JqZWN0KTtcbiAgICAgICAgICAgIGV4cGVjdChjbG9uZS5hKS50b0JlKG9iamVjdC5hKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgY2xvbmUgdHdvIGxldmVsc1wiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICB2YXIgY2xvbmUgPSBPYmplY3QuY2xvbmUob2JqZWN0LCAyKTtcbiAgICAgICAgICAgIGV4cGVjdChjbG9uZSkudG9FcXVhbChvYmplY3QpO1xuICAgICAgICAgICAgZXhwZWN0KGNsb25lKS5ub3QudG9CZShvYmplY3QpO1xuICAgICAgICAgICAgZXhwZWN0KGNsb25lLmEpLm5vdC50b0JlKG9iamVjdC5hKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgY2xvbmUgd2l0aCByZWZlcmVuY2UgY3ljbGVzXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBjeWNsZSA9IHt9O1xuICAgICAgICAgICAgY3ljbGUuY3ljbGUgPSBjeWNsZTtcbiAgICAgICAgICAgIHZhciBjbG9uZSA9IE9iamVjdC5jbG9uZShjeWNsZSk7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmUpLnRvRXF1YWwoY3ljbGUpO1xuICAgICAgICAgICAgZXhwZWN0KGNsb25lKS5ub3QudG9CZShjeWNsZSk7XG4gICAgICAgICAgICBleHBlY3QoY2xvbmUuY3ljbGUpLnRvQmUoY2xvbmUpO1xuICAgICAgICB9KTtcblxuICAgIH0pO1xuXG4gICAgZGVzY3JpYmUoXCJjbGVhclwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgaXQoXCJzaG91bGQgY2xlYXIgYWxsIG93bmVkIHByb3BlcnRpZXMgb2YgdGhlIG9iamVjdFwiLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBleHBlY3QoT2JqZWN0LmtleXMoT2JqZWN0LmNsZWFyKHthOiAxMH0pKSkudG9FcXVhbChbXSk7XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn0pO1xuIl19