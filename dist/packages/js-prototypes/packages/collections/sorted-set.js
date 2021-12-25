"use strict";
module.exports = SortedSet;
var Shim = require("./shim");
var GenericCollection = require("./generic-collection");
var GenericSet = require("./generic-set");
var PropertyChanges = require("./listen/property-changes");
var RangeChanges = require("./listen/range-changes");
var TreeLog = require("./tree-log");
function SortedSet(values, equals, compare, getDefault) {
    if (!(this instanceof SortedSet)) {
        return new SortedSet(values, equals, compare, getDefault);
    }
    this.contentEquals = equals || Object.equals;
    this.contentCompare = compare || Object.compare;
    this.getDefault = getDefault || Function.noop;
    this.root = null;
    this.length = 0;
    this.addEach(values);
}
// hack so require("sorted-set").SortedSet will work in MontageJS
SortedSet.SortedSet = SortedSet;
Object.addEach(SortedSet.prototype, GenericCollection.prototype);
Object.addEach(SortedSet.prototype, GenericSet.prototype);
Object.addEach(SortedSet.prototype, PropertyChanges.prototype);
Object.addEach(SortedSet.prototype, RangeChanges.prototype);
Object.defineProperty(SortedSet.prototype, "size", GenericCollection._sizePropertyDescriptor);
SortedSet.from = GenericCollection.from;
SortedSet.prototype.isSorted = true;
SortedSet.prototype.constructClone = function (values) {
    return new this.constructor(values, this.contentEquals, this.contentCompare, this.getDefault);
};
SortedSet.prototype.has = function (value, equals) {
    if (equals) {
        throw new Error("SortedSet#has does not support second argument: equals");
    }
    if (this.root) {
        this.splay(value);
        return this.contentEquals(value, this.root.value);
    }
    else {
        return false;
    }
};
SortedSet.prototype.get = function (value, equals) {
    if (equals) {
        throw new Error("SortedSet#get does not support second argument: equals");
    }
    if (this.root) {
        this.splay(value);
        if (this.contentEquals(value, this.root.value)) {
            return this.root.value;
        }
    }
    return this.getDefault(value);
};
SortedSet.prototype.add = function (value) {
    var node = new this.Node(value);
    if (this.root) {
        this.splay(value);
        if (!this.contentEquals(value, this.root.value)) {
            var comparison = this.contentCompare(value, this.root.value);
            if (comparison === 0) {
                throw new Error("SortedSet cannot contain incomparable but inequal values: " + value + " and " + this.root.value);
            }
            if (this.dispatchesRangeChanges) {
                this.dispatchBeforeRangeChange([value], [], this.root.index);
            }
            if (comparison < 0) {
                // rotate right
                //   R        N
                //  / \  ->  / \
                // l   r    l   R
                // :   :    :    \
                //                r
                //                :
                node.right = this.root;
                node.left = this.root.left;
                this.root.left = null;
                this.root.touch();
            }
            else {
                // rotate left
                //   R        N
                //  / \  ->  / \
                // l   r    R   r
                // :   :   /    :
                //        l
                //        :
                node.left = this.root;
                node.right = this.root.right;
                this.root.right = null;
                this.root.touch();
            }
            node.touch();
            this.root = node;
            this.length++;
            if (this.dispatchesRangeChanges) {
                this.dispatchRangeChange([value], [], this.root.index);
            }
            return true;
        }
    }
    else {
        if (this.dispatchesRangeChanges) {
            this.dispatchBeforeRangeChange([value], [], 0);
        }
        this.root = node;
        this.length++;
        if (this.dispatchesRangeChanges) {
            this.dispatchRangeChange([value], [], 0);
        }
        return true;
    }
    return false;
};
SortedSet.prototype['delete'] = function (value, equals) {
    if (equals) {
        throw new Error("SortedSet#delete does not support second argument: equals");
    }
    if (this.root) {
        this.splay(value);
        if (this.contentEquals(value, this.root.value)) {
            var index = this.root.index;
            if (this.dispatchesRangeChanges) {
                this.dispatchBeforeRangeChange([], [value], index);
            }
            if (!this.root.left) {
                this.root = this.root.right;
            }
            else {
                // remove the right side of the tree,
                var right = this.root.right;
                this.root = this.root.left;
                // the tree now only contains the left side of the tree, so all
                // values are less than the value deleted.
                // splay so that the root has an empty right child
                this.splay(value);
                // put the right side of the tree back
                this.root.right = right;
            }
            this.length--;
            if (this.root) {
                this.root.touch();
            }
            if (this.dispatchesRangeChanges) {
                this.dispatchRangeChange([], [value], index);
            }
            return true;
        }
    }
    return false;
};
SortedSet.prototype.indexOf = function (value, index) {
    if (index) {
        throw new Error("SortedSet#indexOf does not support second argument: startIndex");
    }
    if (this.root) {
        this.splay(value);
        if (this.contentEquals(value, this.root.value)) {
            return this.root.index;
        }
    }
    return -1;
};
SortedSet.prototype.find = function (value, equals, index) {
    if (equals) {
        throw new Error("SortedSet#find does not support second argument: equals");
    }
    if (index) {
        // TODO contemplate using splayIndex to isolate a subtree in
        // which to search.
        throw new Error("SortedSet#find does not support third argument: index");
    }
    if (this.root) {
        this.splay(value);
        if (this.contentEquals(value, this.root.value)) {
            return this.root;
        }
    }
};
SortedSet.prototype.findGreatest = function (at) {
    if (this.root) {
        at = at || this.root;
        while (at.right) {
            at = at.right;
        }
        return at;
    }
};
SortedSet.prototype.findLeast = function (at) {
    if (this.root) {
        at = at || this.root;
        while (at.left) {
            at = at.left;
        }
        return at;
    }
};
SortedSet.prototype.findGreatestLessThanOrEqual = function (value) {
    if (this.root) {
        this.splay(value);
        if (this.contentCompare(this.root.value, value) > 0) {
            return this.root.getPrevious();
        }
        else {
            return this.root;
        }
    }
};
SortedSet.prototype.findGreatestLessThan = function (value) {
    if (this.root) {
        this.splay(value);
        if (this.contentCompare(this.root.value, value) >= 0) {
            return this.root.getPrevious();
        }
        else {
            return this.root;
        }
    }
};
SortedSet.prototype.findLeastGreaterThanOrEqual = function (value) {
    if (this.root) {
        this.splay(value);
        if (this.contentCompare(this.root.value, value) >= 0) {
            return this.root;
        }
        else {
            return this.root.getNext();
        }
    }
};
SortedSet.prototype.findLeastGreaterThan = function (value) {
    if (this.root) {
        this.splay(value);
        if (this.contentCompare(this.root.value, value) <= 0) {
            return this.root.getNext();
        }
        else {
            return this.root;
        }
    }
};
SortedSet.prototype.pop = function () {
    if (this.root) {
        var found = this.findGreatest();
        this["delete"](found.value);
        return found.value;
    }
};
SortedSet.prototype.shift = function () {
    if (this.root) {
        var found = this.findLeast();
        this["delete"](found.value);
        return found.value;
    }
};
SortedSet.prototype.push = function () {
    this.addEach(arguments);
};
SortedSet.prototype.unshift = function () {
    this.addEach(arguments);
};
SortedSet.prototype.slice = function (start, end) {
    var temp;
    start = start || 0;
    end = end || this.length;
    if (start < 0) {
        start += this.length;
    }
    if (end < 0) {
        end += this.length;
    }
    var sliced = [];
    if (this.root) {
        this.splayIndex(start);
        while (this.root.index < end) {
            sliced.push(this.root.value);
            if (!this.root.right) {
                break;
            }
            this.splay(this.root.getNext().value);
        }
    }
    return sliced;
};
SortedSet.prototype.splice = function (at, length /*...plus*/) {
    return this.swap(at, length, Array.prototype.slice.call(arguments, 2));
};
SortedSet.prototype.swap = function (start, length, plus) {
    if (start === undefined && length === undefined) {
        return [];
    }
    start = start || 0;
    if (start < 0) {
        start += this.length;
    }
    if (length === undefined) {
        length = Infinity;
    }
    var swapped = [];
    if (this.root) {
        // start
        this.splayIndex(start);
        // minus length
        for (var i = 0; i < length; i++) {
            swapped.push(this.root.value);
            var next = this.root.getNext();
            this["delete"](this.root.value);
            if (!next) {
                break;
            }
            this.splay(next.value);
        }
    }
    // plus
    this.addEach(plus);
    return swapped;
};
// This is the simplified top-down splaying algorithm from: "Self-adjusting
// Binary Search Trees" by Sleator and Tarjan. Guarantees that root.value
// equals value if value exists. If value does not exist, then root will be
// the node whose value either immediately preceeds or immediately follows value.
// - as described in https://github.com/hij1nx/forest
SortedSet.prototype.splay = function (value) {
    var stub, left, right, temp, root, history;
    if (!this.root) {
        return;
    }
    // Create a stub node.  The use of the stub node is a bit
    // counter-intuitive: The right child of the stub node will hold the L tree
    // of the algorithm.  The left child of the stub node will hold the R tree
    // of the algorithm.  Using a stub node, left and right will always be
    // nodes and we avoid special cases.
    // - http://code.google.com/p/v8/source/browse/branches/bleeding_edge/src/splay-tree-inl.h
    stub = left = right = new this.Node();
    // The history is an upside down tree used to propagate new tree sizes back
    // up the left and right arms of a traversal.  The right children of the
    // transitive left side of the tree will be former roots while linking
    // left.  The left children of the transitive walk to the right side of the
    // history tree will all be previous roots from linking right.  The last
    // node of the left and right traversal will each become a child of the new
    // root.
    history = new this.Node();
    root = this.root;
    while (true) {
        var comparison = this.contentCompare(value, root.value);
        if (comparison < 0) {
            if (root.left) {
                if (this.contentCompare(value, root.left.value) < 0) {
                    // rotate right
                    //        Root         L(temp)
                    //      /     \       / \
                    //     L(temp) R    LL    Root
                    //    / \                /    \
                    //  LL   LR            LR      R
                    temp = root.left;
                    root.left = temp.right;
                    root.touch();
                    temp.right = root;
                    temp.touch();
                    root = temp;
                    if (!root.left) {
                        break;
                    }
                }
                // remember former root for repropagating length
                temp = new Node();
                temp.right = root;
                temp.left = history.left;
                history.left = temp;
                // link left
                right.left = root;
                right.touch();
                right = root;
                root = root.left;
            }
            else {
                break;
            }
        }
        else if (comparison > 0) {
            if (root.right) {
                if (this.contentCompare(value, root.right.value) > 0) {
                    // rotate left
                    //        Root         L(temp)
                    //      /     \       / \
                    //     L(temp) R    LL    Root
                    //    / \                /    \
                    //  LL   LR            LR      R
                    temp = root.right;
                    root.right = temp.left;
                    root.touch();
                    temp.left = root;
                    temp.touch();
                    root = temp;
                    if (!root.right) {
                        break;
                    }
                }
                // remember former root for repropagating length
                temp = new Node();
                temp.left = root;
                temp.right = history.right;
                history.right = temp;
                // link right
                left.right = root;
                left.touch();
                left = root;
                root = root.right;
            }
            else {
                break;
            }
        }
        else { // equal or incomparable
            break;
        }
    }
    // reassemble
    left.right = root.left;
    left.touch();
    right.left = root.right;
    right.touch();
    root.left = stub.right;
    root.right = stub.left;
    // propagate new lengths
    while (history.left) {
        history.left.right.touch();
        history.left = history.left.left;
    }
    while (history.right) {
        history.right.left.touch();
        history.right = history.right.right;
    }
    root.touch();
    this.root = root;
};
// an internal utility for splaying a node based on its index
SortedSet.prototype.splayIndex = function (index) {
    if (this.root) {
        var at = this.root;
        var atIndex = this.root.index;
        while (atIndex !== index) {
            if (atIndex > index && at.left) {
                at = at.left;
                atIndex -= 1 + (at.right ? at.right.length : 0);
            }
            else if (atIndex < index && at.right) {
                at = at.right;
                atIndex += 1 + (at.left ? at.left.length : 0);
            }
            else {
                break;
            }
        }
        this.splay(at.value);
        return this.root.index === index;
    }
    return false;
};
SortedSet.prototype.reduce = function (callback, basis, thisp) {
    if (this.root) {
        basis = this.root.reduce(callback, basis, 0, thisp, this);
    }
    return basis;
};
SortedSet.prototype.reduceRight = function (callback, basis, thisp) {
    if (this.root) {
        basis = this.root.reduceRight(callback, basis, this.length - 1, thisp, this);
    }
    return basis;
};
SortedSet.prototype.min = function (at) {
    var least = this.findLeast(at);
    if (least) {
        return least.value;
    }
};
SortedSet.prototype.max = function (at) {
    var greatest = this.findGreatest(at);
    if (greatest) {
        return greatest.value;
    }
};
SortedSet.prototype.one = function () {
    return this.min();
};
SortedSet.prototype.clear = function () {
    var minus;
    if (this.dispatchesRangeChanges) {
        minus = this.toArray();
        this.dispatchBeforeRangeChange([], minus, 0);
    }
    this.root = null;
    this.length = 0;
    if (this.dispatchesRangeChanges) {
        this.dispatchRangeChange([], minus, 0);
    }
};
SortedSet.prototype.iterate = function (start, end) {
    return new this.Iterator(this, start, end);
};
SortedSet.prototype.Iterator = Iterator;
SortedSet.prototype.summary = function () {
    if (this.root) {
        return this.root.summary();
    }
    else {
        return "()";
    }
};
SortedSet.prototype.log = function (charmap, logNode, callback, thisp) {
    charmap = charmap || TreeLog.unicodeRound;
    logNode = logNode || this.logNode;
    if (!callback) {
        callback = console.log;
        thisp = console;
    }
    callback = callback.bind(thisp);
    if (this.root) {
        this.root.log(charmap, logNode, callback, callback);
    }
};
SortedSet.prototype.logNode = function (node, log, logBefore) {
    log(" " + node.value);
};
SortedSet.logCharsets = TreeLog;
SortedSet.prototype.Node = Node;
function Node(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.length = 1;
}
// TODO case where no basis is provided for reduction
Node.prototype.reduce = function (callback, basis, index, thisp, tree, depth) {
    depth = depth || 0;
    if (this.left) {
        // prerecord length to be resistant to mutation
        var length = this.left.length;
        basis = this.left.reduce(callback, basis, index, thisp, tree, depth + 1);
        index += length;
    }
    basis = callback.call(thisp, basis, this.value, index, tree, this, depth);
    index += 1;
    if (this.right) {
        basis = this.right.reduce(callback, basis, index, thisp, tree, depth + 1);
    }
    return basis;
};
Node.prototype.reduceRight = function (callback, basis, index, thisp, tree, depth) {
    depth = depth || 0;
    if (this.right) {
        basis = this.right.reduceRight(callback, basis, index, thisp, tree, depth + 1);
        index -= this.right.length;
    }
    basis = callback.call(thisp, basis, this.value, this.value, tree, this, depth);
    index -= 1;
    if (this.left) {
        basis = this.left.reduceRight(callback, basis, index, thisp, tree, depth + 1);
    }
    return basis;
};
Node.prototype.touch = function () {
    this.length = 1 +
        (this.left ? this.left.length : 0) +
        (this.right ? this.right.length : 0);
    this.index = this.left ? this.left.length : 0;
};
Node.prototype.checkIntegrity = function () {
    var length = 1;
    length += this.left ? this.left.checkIntegrity() : 0;
    length += this.right ? this.right.checkIntegrity() : 0;
    if (this.length !== length)
        throw new Error("Integrity check failed: " + this.summary());
    return length;
};
// get the next node in this subtree
Node.prototype.getNext = function () {
    var node = this;
    if (node.right) {
        node = node.right;
        while (node.left) {
            node = node.left;
        }
        return node;
    }
};
// get the previous node in this subtree
Node.prototype.getPrevious = function () {
    var node = this;
    if (node.left) {
        node = node.left;
        while (node.right) {
            node = node.right;
        }
        return node;
    }
};
Node.prototype.summary = function () {
    var value = this.value || "-";
    value += " <" + this.length;
    if (!this.left && !this.right) {
        return "(" + value + ")";
    }
    return "(" + value + " " + (this.left ? this.left.summary() : "()") + ", " + (this.right ? this.right.summary() : "()") + ")";
};
Node.prototype.log = function (charmap, logNode, log, logAbove) {
    var self = this;
    var branch;
    if (this.left && this.right) {
        branch = charmap.intersection;
    }
    else if (this.left) {
        branch = charmap.branchUp;
    }
    else if (this.right) {
        branch = charmap.branchDown;
    }
    else {
        branch = charmap.through;
    }
    var loggedAbove;
    this.left && this.left.log(charmap, logNode, function innerWrite(line) {
        if (!loggedAbove) {
            loggedAbove = true;
            // leader
            logAbove(charmap.fromBelow + charmap.through + line);
        }
        else {
            // below
            logAbove(charmap.strafe + " " + line);
        }
    }, function innerWriteAbove(line) {
        // above
        logAbove("  " + line);
    });
    var loggedOn;
    logNode(this, function innerWrite(line) {
        if (!loggedOn) {
            loggedOn = true;
            log(branch + line);
        }
        else {
            log((self.right ? charmap.strafe : " ") + line);
        }
    }, function innerWriteAbove(line) {
        logAbove((self.left ? charmap.strafe : " ") + line);
    });
    var loggedBelow;
    this.right && this.right.log(charmap, logNode, function innerWrite(line) {
        if (!loggedBelow) {
            loggedBelow = true;
            log(charmap.fromAbove + charmap.through + line);
        }
        else {
            log("  " + line);
        }
    }, function innerWriteAbove(line) {
        log(charmap.strafe + " " + line);
    });
};
function Iterator(set, start, end) {
    this.set = set;
    this.prev = null;
    this.end = end;
    if (start) {
        var next = this.set.findLeastGreaterThanOrEqual(start);
        if (next) {
            this.set.splay(next.value);
            this.prev = next.getPrevious();
        }
    }
}
Iterator.prototype.__iterationObject = null;
Object.defineProperty(Iterator.prototype, "_iterationObject", {
    get: function () {
        return this.__iterationObject || (this.__iterationObject = { done: false, value: null });
    }
});
Iterator.prototype.next = function () {
    var next;
    if (this.prev) {
        next = this.set.findLeastGreaterThan(this.prev.value);
    }
    else {
        next = this.set.findLeast();
    }
    if (!next) {
        this._iterationObject.done = true;
        this._iterationObject.value = void 0;
    }
    else {
        if (this.end !== undefined &&
            this.set.contentCompare(next.value, this.end) >= 0) {
            this._iterationObject.done = true;
            this._iterationObject.value = void 0;
        }
        else {
            this.prev = next;
            this._iterationObject.value = next.value;
        }
    }
    return this._iterationObject;
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic29ydGVkLXNldC5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvanMtcHJvdG90eXBlcy9wYWNrYWdlcy9jb2xsZWN0aW9ucy9zb3J0ZWQtc2V0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFlBQVksQ0FBQztBQUViLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDO0FBRTNCLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUM3QixJQUFJLGlCQUFpQixHQUFHLE9BQU8sQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBQ3hELElBQUksVUFBVSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUMxQyxJQUFJLGVBQWUsR0FBRyxPQUFPLENBQUMsMkJBQTJCLENBQUMsQ0FBQztBQUMzRCxJQUFJLFlBQVksR0FBRyxPQUFPLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUNyRCxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFcEMsU0FBUyxTQUFTLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsVUFBVTtJQUNsRCxJQUFJLENBQUMsQ0FBQyxJQUFJLFlBQVksU0FBUyxDQUFDLEVBQUU7UUFDOUIsT0FBTyxJQUFJLFNBQVMsQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxVQUFVLENBQUMsQ0FBQztLQUM3RDtJQUNELElBQUksQ0FBQyxhQUFhLEdBQUcsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUM7SUFDN0MsSUFBSSxDQUFDLGNBQWMsR0FBRyxPQUFPLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNoRCxJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDO0lBQzlDLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0lBQ2pCLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFD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QUFDLEdBQUcsS0FBSyxTQUFTO1lBQ3RCLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFDcEQ7WUFDRSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNsQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxDQUFDO1NBQ3hDO2FBQ0k7WUFDRCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxHQUFJLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDN0M7S0FFSjtJQUNELE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDO0FBQ2pDLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFNvcnRlZFNldDtcblxudmFyIFNoaW0gPSByZXF1aXJlKFwiLi9zaGltXCIpO1xudmFyIEdlbmVyaWNDb2xsZWN0aW9uID0gcmVxdWlyZShcIi4vZ2VuZXJpYy1jb2xsZWN0aW9uXCIpO1xudmFyIEdlbmVyaWNTZXQgPSByZXF1aXJlKFwiLi9nZW5lcmljLXNldFwiKTtcbnZhciBQcm9wZXJ0eUNoYW5nZXMgPSByZXF1aXJlKFwiLi9saXN0ZW4vcHJvcGVydHktY2hhbmdlc1wiKTtcbnZhciBSYW5nZUNoYW5nZXMgPSByZXF1aXJlKFwiLi9saXN0ZW4vcmFuZ2UtY2hhbmdlc1wiKTtcbnZhciBUcmVlTG9nID0gcmVxdWlyZShcIi4vdHJlZS1sb2dcIik7XG5cbmZ1bmN0aW9uIFNvcnRlZFNldCh2YWx1ZXMsIGVxdWFscywgY29tcGFyZSwgZ2V0RGVmYXVsdCkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBTb3J0ZWRTZXQpKSB7XG4gICAgICAgIHJldHVybiBuZXcgU29ydGVkU2V0KHZhbHVlcywgZXF1YWxzLCBjb21wYXJlLCBnZXREZWZhdWx0KTtcbiAgICB9XG4gICAgdGhpcy5jb250ZW50RXF1YWxzID0gZXF1YWxzIHx8IE9iamVjdC5lcXVhbHM7XG4gICAgdGhpcy5jb250ZW50Q29tcGFyZSA9IGNvbXBhcmUgfHwgT2JqZWN0LmNvbXBhcmU7XG4gICAgdGhpcy5nZXREZWZhdWx0ID0gZ2V0RGVmYXVsdCB8fCBGdW5jdGlvbi5ub29wO1xuICAgIHRoaXMucm9vdCA9IG51bGw7XG4gICAgdGhpcy5sZW5ndGggPSAwO1xuICAgIHRoaXMuYWRkRWFjaCh2YWx1ZXMpO1xufVxuXG4vLyBoYWNrIHNvIHJlcXVpcmUoXCJzb3J0ZWQtc2V0XCIpLlNvcnRlZFNldCB3aWxsIHdvcmsgaW4gTW9udGFnZUpTXG5Tb3J0ZWRTZXQuU29ydGVkU2V0ID0gU29ydGVkU2V0O1xuXG5PYmplY3QuYWRkRWFjaChTb3J0ZWRTZXQucHJvdG90eXBlLCBHZW5lcmljQ29sbGVjdGlvbi5wcm90b3R5cGUpO1xuT2JqZWN0LmFkZEVhY2goU29ydGVkU2V0LnByb3RvdHlwZSwgR2VuZXJpY1NldC5wcm90b3R5cGUpO1xuT2JqZWN0LmFkZEVhY2goU29ydGVkU2V0LnByb3RvdHlwZSwgUHJvcGVydHlDaGFuZ2VzLnByb3RvdHlwZSk7XG5PYmplY3QuYWRkRWFjaChTb3J0ZWRTZXQucHJvdG90eXBlLCBSYW5nZUNoYW5nZXMucHJvdG90eXBlKTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShTb3J0ZWRTZXQucHJvdG90eXBlLFwic2l6ZVwiLEdlbmVyaWNDb2xsZWN0aW9uLl9zaXplUHJvcGVydHlEZXNjcmlwdG9yKTtcblNvcnRlZFNldC5mcm9tID0gR2VuZXJpY0NvbGxlY3Rpb24uZnJvbTtcblxuU29ydGVkU2V0LnByb3RvdHlwZS5pc1NvcnRlZCA9IHRydWU7XG5cblNvcnRlZFNldC5wcm90b3R5cGUuY29uc3RydWN0Q2xvbmUgPSBmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKFxuICAgICAgICB2YWx1ZXMsXG4gICAgICAgIHRoaXMuY29udGVudEVxdWFscyxcbiAgICAgICAgdGhpcy5jb250ZW50Q29tcGFyZSxcbiAgICAgICAgdGhpcy5nZXREZWZhdWx0XG4gICAgKTtcbn07XG5cblNvcnRlZFNldC5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24gKHZhbHVlLCBlcXVhbHMpIHtcbiAgICBpZiAoZXF1YWxzKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNvcnRlZFNldCNoYXMgZG9lcyBub3Qgc3VwcG9ydCBzZWNvbmQgYXJndW1lbnQ6IGVxdWFsc1wiKTtcbiAgICB9XG4gICAgaWYgKHRoaXMucm9vdCkge1xuICAgICAgICB0aGlzLnNwbGF5KHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuY29udGVudEVxdWFscyh2YWx1ZSwgdGhpcy5yb290LnZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcblxuU29ydGVkU2V0LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAodmFsdWUsIGVxdWFscykge1xuICAgIGlmIChlcXVhbHMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU29ydGVkU2V0I2dldCBkb2VzIG5vdCBzdXBwb3J0IHNlY29uZCBhcmd1bWVudDogZXF1YWxzXCIpO1xuICAgIH1cbiAgICBpZiAodGhpcy5yb290KSB7XG4gICAgICAgIHRoaXMuc3BsYXkodmFsdWUpO1xuICAgICAgICBpZiAodGhpcy5jb250ZW50RXF1YWxzKHZhbHVlLCB0aGlzLnJvb3QudmFsdWUpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb290LnZhbHVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmdldERlZmF1bHQodmFsdWUpO1xufTtcblxuU29ydGVkU2V0LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICB2YXIgbm9kZSA9IG5ldyB0aGlzLk5vZGUodmFsdWUpO1xuICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgICAgdGhpcy5zcGxheSh2YWx1ZSk7XG4gICAgICAgIGlmICghdGhpcy5jb250ZW50RXF1YWxzKHZhbHVlLCB0aGlzLnJvb3QudmFsdWUpKSB7XG4gICAgICAgICAgICB2YXIgY29tcGFyaXNvbiA9IHRoaXMuY29udGVudENvbXBhcmUodmFsdWUsIHRoaXMucm9vdC52YWx1ZSk7XG4gICAgICAgICAgICBpZiAoY29tcGFyaXNvbiA9PT0gMCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlNvcnRlZFNldCBjYW5ub3QgY29udGFpbiBpbmNvbXBhcmFibGUgYnV0IGluZXF1YWwgdmFsdWVzOiBcIiArIHZhbHVlICsgXCIgYW5kIFwiICsgdGhpcy5yb290LnZhbHVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmRpc3BhdGNoZXNSYW5nZUNoYW5nZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoQmVmb3JlUmFuZ2VDaGFuZ2UoW3ZhbHVlXSwgW10sIHRoaXMucm9vdC5pbmRleCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoY29tcGFyaXNvbiA8IDApIHtcbiAgICAgICAgICAgICAgICAvLyByb3RhdGUgcmlnaHRcbiAgICAgICAgICAgICAgICAvLyAgIFIgICAgICAgIE5cbiAgICAgICAgICAgICAgICAvLyAgLyBcXCAgLT4gIC8gXFxcbiAgICAgICAgICAgICAgICAvLyBsICAgciAgICBsICAgUlxuICAgICAgICAgICAgICAgIC8vIDogICA6ICAgIDogICAgXFxcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICByXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgOlxuICAgICAgICAgICAgICAgIG5vZGUucmlnaHQgPSB0aGlzLnJvb3Q7XG4gICAgICAgICAgICAgICAgbm9kZS5sZWZ0ID0gdGhpcy5yb290LmxlZnQ7XG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmxlZnQgPSBudWxsO1xuICAgICAgICAgICAgICAgIHRoaXMucm9vdC50b3VjaCgpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyByb3RhdGUgbGVmdFxuICAgICAgICAgICAgICAgIC8vICAgUiAgICAgICAgTlxuICAgICAgICAgICAgICAgIC8vICAvIFxcICAtPiAgLyBcXFxuICAgICAgICAgICAgICAgIC8vIGwgICByICAgIFIgICByXG4gICAgICAgICAgICAgICAgLy8gOiAgIDogICAvICAgIDpcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgbFxuICAgICAgICAgICAgICAgIC8vICAgICAgICA6XG4gICAgICAgICAgICAgICAgbm9kZS5sZWZ0ID0gdGhpcy5yb290O1xuICAgICAgICAgICAgICAgIG5vZGUucmlnaHQgPSB0aGlzLnJvb3QucmlnaHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5yb290LnJpZ2h0ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QudG91Y2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG5vZGUudG91Y2goKTtcbiAgICAgICAgICAgIHRoaXMucm9vdCA9IG5vZGU7XG4gICAgICAgICAgICB0aGlzLmxlbmd0aCsrO1xuICAgICAgICAgICAgaWYgKHRoaXMuZGlzcGF0Y2hlc1JhbmdlQ2hhbmdlcykge1xuICAgICAgICAgICAgICAgIHRoaXMuZGlzcGF0Y2hSYW5nZUNoYW5nZShbdmFsdWVdLCBbXSwgdGhpcy5yb290LmluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzcGF0Y2hlc1JhbmdlQ2hhbmdlcykge1xuICAgICAgICAgICAgdGhpcy5kaXNwYXRjaEJlZm9yZVJhbmdlQ2hhbmdlKFt2YWx1ZV0sIFtdLCAwKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJvb3QgPSBub2RlO1xuICAgICAgICB0aGlzLmxlbmd0aCsrO1xuICAgICAgICBpZiAodGhpcy5kaXNwYXRjaGVzUmFuZ2VDaGFuZ2VzKSB7XG4gICAgICAgICAgICB0aGlzLmRpc3BhdGNoUmFuZ2VDaGFuZ2UoW3ZhbHVlXSwgW10sIDApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5Tb3J0ZWRTZXQucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uICh2YWx1ZSwgZXF1YWxzKSB7XG4gICAgaWYgKGVxdWFscykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTb3J0ZWRTZXQjZGVsZXRlIGRvZXMgbm90IHN1cHBvcnQgc2Vjb25kIGFyZ3VtZW50OiBlcXVhbHNcIik7XG4gICAgfVxuICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgICAgdGhpcy5zcGxheSh2YWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRFcXVhbHModmFsdWUsIHRoaXMucm9vdC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMucm9vdC5pbmRleDtcbiAgICAgICAgICAgIGlmICh0aGlzLmRpc3BhdGNoZXNSYW5nZUNoYW5nZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoQmVmb3JlUmFuZ2VDaGFuZ2UoW10sIFt2YWx1ZV0sIGluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghdGhpcy5yb290LmxlZnQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QgPSB0aGlzLnJvb3QucmlnaHQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgcmlnaHQgc2lkZSBvZiB0aGUgdHJlZSxcbiAgICAgICAgICAgICAgICB2YXIgcmlnaHQgPSB0aGlzLnJvb3QucmlnaHQ7XG4gICAgICAgICAgICAgICAgdGhpcy5yb290ID0gdGhpcy5yb290LmxlZnQ7XG4gICAgICAgICAgICAgICAgLy8gdGhlIHRyZWUgbm93IG9ubHkgY29udGFpbnMgdGhlIGxlZnQgc2lkZSBvZiB0aGUgdHJlZSwgc28gYWxsXG4gICAgICAgICAgICAgICAgLy8gdmFsdWVzIGFyZSBsZXNzIHRoYW4gdGhlIHZhbHVlIGRlbGV0ZWQuXG4gICAgICAgICAgICAgICAgLy8gc3BsYXkgc28gdGhhdCB0aGUgcm9vdCBoYXMgYW4gZW1wdHkgcmlnaHQgY2hpbGRcbiAgICAgICAgICAgICAgICB0aGlzLnNwbGF5KHZhbHVlKTtcbiAgICAgICAgICAgICAgICAvLyBwdXQgdGhlIHJpZ2h0IHNpZGUgb2YgdGhlIHRyZWUgYmFja1xuICAgICAgICAgICAgICAgIHRoaXMucm9vdC5yaWdodCA9IHJpZ2h0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5sZW5ndGgtLTtcbiAgICAgICAgICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QudG91Y2goKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh0aGlzLmRpc3BhdGNoZXNSYW5nZUNoYW5nZXMpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmRpc3BhdGNoUmFuZ2VDaGFuZ2UoW10sIFt2YWx1ZV0sIGluZGV4KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn07XG5cblNvcnRlZFNldC5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uICh2YWx1ZSwgaW5kZXgpIHtcbiAgICBpZiAoaW5kZXgpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU29ydGVkU2V0I2luZGV4T2YgZG9lcyBub3Qgc3VwcG9ydCBzZWNvbmQgYXJndW1lbnQ6IHN0YXJ0SW5kZXhcIik7XG4gICAgfVxuICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgICAgdGhpcy5zcGxheSh2YWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRFcXVhbHModmFsdWUsIHRoaXMucm9vdC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJvb3QuaW5kZXg7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIC0xO1xufTtcblxuU29ydGVkU2V0LnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24gKHZhbHVlLCBlcXVhbHMsIGluZGV4KSB7XG4gICAgaWYgKGVxdWFscykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJTb3J0ZWRTZXQjZmluZCBkb2VzIG5vdCBzdXBwb3J0IHNlY29uZCBhcmd1bWVudDogZXF1YWxzXCIpO1xuICAgIH1cbiAgICBpZiAoaW5kZXgpIHtcbiAgICAgICAgLy8gVE9ETyBjb250ZW1wbGF0ZSB1c2luZyBzcGxheUluZGV4IHRvIGlzb2xhdGUgYSBzdWJ0cmVlIGluXG4gICAgICAgIC8vIHdoaWNoIHRvIHNlYXJjaC5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiU29ydGVkU2V0I2ZpbmQgZG9lcyBub3Qgc3VwcG9ydCB0aGlyZCBhcmd1bWVudDogaW5kZXhcIik7XG4gICAgfVxuICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgICAgdGhpcy5zcGxheSh2YWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRFcXVhbHModmFsdWUsIHRoaXMucm9vdC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJvb3Q7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5Tb3J0ZWRTZXQucHJvdG90eXBlLmZpbmRHcmVhdGVzdCA9IGZ1bmN0aW9uIChhdCkge1xuICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgICAgYXQgPSBhdCB8fCB0aGlzLnJvb3Q7XG4gICAgICAgIHdoaWxlIChhdC5yaWdodCkge1xuICAgICAgICAgICAgYXQgPSBhdC5yaWdodDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXQ7XG4gICAgfVxufTtcblxuU29ydGVkU2V0LnByb3RvdHlwZS5maW5kTGVhc3QgPSBmdW5jdGlvbiAoYXQpIHtcbiAgICBpZiAodGhpcy5yb290KSB7XG4gICAgICAgIGF0ID0gYXQgfHwgdGhpcy5yb290O1xuICAgICAgICB3aGlsZSAoYXQubGVmdCkge1xuICAgICAgICAgICAgYXQgPSBhdC5sZWZ0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhdDtcbiAgICB9XG59O1xuXG5Tb3J0ZWRTZXQucHJvdG90eXBlLmZpbmRHcmVhdGVzdExlc3NUaGFuT3JFcXVhbCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgICAgdGhpcy5zcGxheSh2YWx1ZSk7XG4gICAgICAgIGlmICh0aGlzLmNvbnRlbnRDb21wYXJlKHRoaXMucm9vdC52YWx1ZSwgdmFsdWUpID4gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm9vdC5nZXRQcmV2aW91cygpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm9vdDtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cblNvcnRlZFNldC5wcm90b3R5cGUuZmluZEdyZWF0ZXN0TGVzc1RoYW4gPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodGhpcy5yb290KSB7XG4gICAgICAgIHRoaXMuc3BsYXkodmFsdWUpO1xuICAgICAgICBpZiAodGhpcy5jb250ZW50Q29tcGFyZSh0aGlzLnJvb3QudmFsdWUsIHZhbHVlKSA+PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb290LmdldFByZXZpb3VzKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb290O1xuICAgICAgICB9XG4gICAgfVxufTtcblxuU29ydGVkU2V0LnByb3RvdHlwZS5maW5kTGVhc3RHcmVhdGVyVGhhbk9yRXF1YWwgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICBpZiAodGhpcy5yb290KSB7XG4gICAgICAgIHRoaXMuc3BsYXkodmFsdWUpO1xuICAgICAgICBpZiAodGhpcy5jb250ZW50Q29tcGFyZSh0aGlzLnJvb3QudmFsdWUsIHZhbHVlKSA+PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb290O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm9vdC5nZXROZXh0KCk7XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5Tb3J0ZWRTZXQucHJvdG90eXBlLmZpbmRMZWFzdEdyZWF0ZXJUaGFuID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMucm9vdCkge1xuICAgICAgICB0aGlzLnNwbGF5KHZhbHVlKTtcbiAgICAgICAgaWYgKHRoaXMuY29udGVudENvbXBhcmUodGhpcy5yb290LnZhbHVlLCB2YWx1ZSkgPD0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm9vdC5nZXROZXh0KCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb290O1xuICAgICAgICB9XG4gICAgfVxufTtcblxuU29ydGVkU2V0LnByb3RvdHlwZS5wb3AgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucm9vdCkge1xuICAgICAgICB2YXIgZm91bmQgPSB0aGlzLmZpbmRHcmVhdGVzdCgpO1xuICAgICAgICB0aGlzW1wiZGVsZXRlXCJdKGZvdW5kLnZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGZvdW5kLnZhbHVlO1xuICAgIH1cbn07XG5cblNvcnRlZFNldC5wcm90b3R5cGUuc2hpZnQgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKHRoaXMucm9vdCkge1xuICAgICAgICB2YXIgZm91bmQgPSB0aGlzLmZpbmRMZWFzdCgpO1xuICAgICAgICB0aGlzW1wiZGVsZXRlXCJdKGZvdW5kLnZhbHVlKTtcbiAgICAgICAgcmV0dXJuIGZvdW5kLnZhbHVlO1xuICAgIH1cbn07XG5cblNvcnRlZFNldC5wcm90b3R5cGUucHVzaCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFkZEVhY2goYXJndW1lbnRzKTtcbn07XG5cblNvcnRlZFNldC5wcm90b3R5cGUudW5zaGlmdCA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLmFkZEVhY2goYXJndW1lbnRzKTtcbn07XG5cblNvcnRlZFNldC5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICAgIHZhciB0ZW1wO1xuICAgIHN0YXJ0ID0gc3RhcnQgfHwgMDtcbiAgICBlbmQgPSBlbmQgfHwgdGhpcy5sZW5ndGg7XG4gICAgaWYgKHN0YXJ0IDwgMCkge1xuICAgICAgICBzdGFydCArPSB0aGlzLmxlbmd0aDtcbiAgICB9XG4gICAgaWYgKGVuZCA8IDApIHtcbiAgICAgICAgZW5kICs9IHRoaXMubGVuZ3RoO1xuICAgIH1cbiAgICB2YXIgc2xpY2VkID0gW107XG4gICAgaWYgKHRoaXMucm9vdCkge1xuICAgICAgICB0aGlzLnNwbGF5SW5kZXgoc3RhcnQpO1xuICAgICAgICB3aGlsZSAodGhpcy5yb290LmluZGV4IDwgZW5kKSB7XG4gICAgICAgICAgICBzbGljZWQucHVzaCh0aGlzLnJvb3QudmFsdWUpO1xuICAgICAgICAgICAgaWYgKCF0aGlzLnJvb3QucmlnaHQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3BsYXkodGhpcy5yb290LmdldE5leHQoKS52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHNsaWNlZDtcbn07XG5cblNvcnRlZFNldC5wcm90b3R5cGUuc3BsaWNlID0gZnVuY3Rpb24gKGF0LCBsZW5ndGggLyouLi5wbHVzKi8pIHtcbiAgICByZXR1cm4gdGhpcy5zd2FwKGF0LCBsZW5ndGgsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMikpO1xufTtcblxuU29ydGVkU2V0LnByb3RvdHlwZS5zd2FwID0gZnVuY3Rpb24gKHN0YXJ0LCBsZW5ndGgsIHBsdXMpIHtcbiAgICBpZiAoc3RhcnQgPT09IHVuZGVmaW5lZCAmJiBsZW5ndGggPT09IHVuZGVmaW5lZCkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgfVxuICAgIHN0YXJ0ID0gc3RhcnQgfHwgMDtcbiAgICBpZiAoc3RhcnQgPCAwKSB7XG4gICAgICAgIHN0YXJ0ICs9IHRoaXMubGVuZ3RoO1xuICAgIH1cbiAgICBpZiAobGVuZ3RoID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgbGVuZ3RoID0gSW5maW5pdHk7XG4gICAgfVxuICAgIHZhciBzd2FwcGVkID0gW107XG5cbiAgICBpZiAodGhpcy5yb290KSB7XG5cbiAgICAgICAgLy8gc3RhcnRcbiAgICAgICAgdGhpcy5zcGxheUluZGV4KHN0YXJ0KTtcblxuICAgICAgICAvLyBtaW51cyBsZW5ndGhcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgc3dhcHBlZC5wdXNoKHRoaXMucm9vdC52YWx1ZSk7XG4gICAgICAgICAgICB2YXIgbmV4dCA9IHRoaXMucm9vdC5nZXROZXh0KCk7XG4gICAgICAgICAgICB0aGlzW1wiZGVsZXRlXCJdKHRoaXMucm9vdC52YWx1ZSk7XG4gICAgICAgICAgICBpZiAoIW5leHQpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3BsYXkobmV4dC52YWx1ZSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBwbHVzXG4gICAgdGhpcy5hZGRFYWNoKHBsdXMpO1xuXG4gICAgcmV0dXJuIHN3YXBwZWQ7XG59O1xuXG4vLyBUaGlzIGlzIHRoZSBzaW1wbGlmaWVkIHRvcC1kb3duIHNwbGF5aW5nIGFsZ29yaXRobSBmcm9tOiBcIlNlbGYtYWRqdXN0aW5nXG4vLyBCaW5hcnkgU2VhcmNoIFRyZWVzXCIgYnkgU2xlYXRvciBhbmQgVGFyamFuLiBHdWFyYW50ZWVzIHRoYXQgcm9vdC52YWx1ZVxuLy8gZXF1YWxzIHZhbHVlIGlmIHZhbHVlIGV4aXN0cy4gSWYgdmFsdWUgZG9lcyBub3QgZXhpc3QsIHRoZW4gcm9vdCB3aWxsIGJlXG4vLyB0aGUgbm9kZSB3aG9zZSB2YWx1ZSBlaXRoZXIgaW1tZWRpYXRlbHkgcHJlY2VlZHMgb3IgaW1tZWRpYXRlbHkgZm9sbG93cyB2YWx1ZS5cbi8vIC0gYXMgZGVzY3JpYmVkIGluIGh0dHBzOi8vZ2l0aHViLmNvbS9oaWoxbngvZm9yZXN0XG5Tb3J0ZWRTZXQucHJvdG90eXBlLnNwbGF5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgdmFyIHN0dWIsIGxlZnQsIHJpZ2h0LCB0ZW1wLCByb290LCBoaXN0b3J5O1xuXG4gICAgaWYgKCF0aGlzLnJvb3QpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIENyZWF0ZSBhIHN0dWIgbm9kZS4gIFRoZSB1c2Ugb2YgdGhlIHN0dWIgbm9kZSBpcyBhIGJpdFxuICAgIC8vIGNvdW50ZXItaW50dWl0aXZlOiBUaGUgcmlnaHQgY2hpbGQgb2YgdGhlIHN0dWIgbm9kZSB3aWxsIGhvbGQgdGhlIEwgdHJlZVxuICAgIC8vIG9mIHRoZSBhbGdvcml0aG0uICBUaGUgbGVmdCBjaGlsZCBvZiB0aGUgc3R1YiBub2RlIHdpbGwgaG9sZCB0aGUgUiB0cmVlXG4gICAgLy8gb2YgdGhlIGFsZ29yaXRobS4gIFVzaW5nIGEgc3R1YiBub2RlLCBsZWZ0IGFuZCByaWdodCB3aWxsIGFsd2F5cyBiZVxuICAgIC8vIG5vZGVzIGFuZCB3ZSBhdm9pZCBzcGVjaWFsIGNhc2VzLlxuICAgIC8vIC0gaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L3NvdXJjZS9icm93c2UvYnJhbmNoZXMvYmxlZWRpbmdfZWRnZS9zcmMvc3BsYXktdHJlZS1pbmwuaFxuICAgIHN0dWIgPSBsZWZ0ID0gcmlnaHQgPSBuZXcgdGhpcy5Ob2RlKCk7XG4gICAgLy8gVGhlIGhpc3RvcnkgaXMgYW4gdXBzaWRlIGRvd24gdHJlZSB1c2VkIHRvIHByb3BhZ2F0ZSBuZXcgdHJlZSBzaXplcyBiYWNrXG4gICAgLy8gdXAgdGhlIGxlZnQgYW5kIHJpZ2h0IGFybXMgb2YgYSB0cmF2ZXJzYWwuICBUaGUgcmlnaHQgY2hpbGRyZW4gb2YgdGhlXG4gICAgLy8gdHJhbnNpdGl2ZSBsZWZ0IHNpZGUgb2YgdGhlIHRyZWUgd2lsbCBiZSBmb3JtZXIgcm9vdHMgd2hpbGUgbGlua2luZ1xuICAgIC8vIGxlZnQuICBUaGUgbGVmdCBjaGlsZHJlbiBvZiB0aGUgdHJhbnNpdGl2ZSB3YWxrIHRvIHRoZSByaWdodCBzaWRlIG9mIHRoZVxuICAgIC8vIGhpc3RvcnkgdHJlZSB3aWxsIGFsbCBiZSBwcmV2aW91cyByb290cyBmcm9tIGxpbmtpbmcgcmlnaHQuICBUaGUgbGFzdFxuICAgIC8vIG5vZGUgb2YgdGhlIGxlZnQgYW5kIHJpZ2h0IHRyYXZlcnNhbCB3aWxsIGVhY2ggYmVjb21lIGEgY2hpbGQgb2YgdGhlIG5ld1xuICAgIC8vIHJvb3QuXG4gICAgaGlzdG9yeSA9IG5ldyB0aGlzLk5vZGUoKTtcbiAgICByb290ID0gdGhpcy5yb290O1xuXG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgdmFyIGNvbXBhcmlzb24gPSB0aGlzLmNvbnRlbnRDb21wYXJlKHZhbHVlLCByb290LnZhbHVlKTtcbiAgICAgICAgaWYgKGNvbXBhcmlzb24gPCAwKSB7XG4gICAgICAgICAgICBpZiAocm9vdC5sZWZ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY29udGVudENvbXBhcmUodmFsdWUsIHJvb3QubGVmdC52YWx1ZSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJvdGF0ZSByaWdodFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgICAgUm9vdCAgICAgICAgIEwodGVtcClcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAvICAgICBcXCAgICAgICAvIFxcXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICBMKHRlbXApIFIgICAgTEwgICAgUm9vdFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAvIFxcICAgICAgICAgICAgICAgIC8gICAgXFxcbiAgICAgICAgICAgICAgICAgICAgLy8gIExMICAgTFIgICAgICAgICAgICBMUiAgICAgIFJcbiAgICAgICAgICAgICAgICAgICAgdGVtcCA9IHJvb3QubGVmdDtcbiAgICAgICAgICAgICAgICAgICAgcm9vdC5sZWZ0ID0gdGVtcC5yaWdodDtcbiAgICAgICAgICAgICAgICAgICAgcm9vdC50b3VjaCgpO1xuICAgICAgICAgICAgICAgICAgICB0ZW1wLnJpZ2h0ID0gcm9vdDtcbiAgICAgICAgICAgICAgICAgICAgdGVtcC50b3VjaCgpO1xuICAgICAgICAgICAgICAgICAgICByb290ID0gdGVtcDtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFyb290LmxlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vIHJlbWVtYmVyIGZvcm1lciByb290IGZvciByZXByb3BhZ2F0aW5nIGxlbmd0aFxuICAgICAgICAgICAgICAgIHRlbXAgPSBuZXcgTm9kZSgpO1xuICAgICAgICAgICAgICAgIHRlbXAucmlnaHQgPSByb290O1xuICAgICAgICAgICAgICAgIHRlbXAubGVmdCA9IGhpc3RvcnkubGVmdDtcbiAgICAgICAgICAgICAgICBoaXN0b3J5LmxlZnQgPSB0ZW1wO1xuICAgICAgICAgICAgICAgIC8vIGxpbmsgbGVmdFxuICAgICAgICAgICAgICAgIHJpZ2h0LmxlZnQgPSByb290O1xuICAgICAgICAgICAgICAgIHJpZ2h0LnRvdWNoKCk7XG4gICAgICAgICAgICAgICAgcmlnaHQgPSByb290O1xuICAgICAgICAgICAgICAgIHJvb3QgPSByb290LmxlZnQ7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKGNvbXBhcmlzb24gPiAwKSB7XG4gICAgICAgICAgICBpZiAocm9vdC5yaWdodCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNvbnRlbnRDb21wYXJlKHZhbHVlLCByb290LnJpZ2h0LnZhbHVlKSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcm90YXRlIGxlZnRcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICAgIFJvb3QgICAgICAgICBMKHRlbXApXG4gICAgICAgICAgICAgICAgICAgIC8vICAgICAgLyAgICAgXFwgICAgICAgLyBcXFxuICAgICAgICAgICAgICAgICAgICAvLyAgICAgTCh0ZW1wKSBSICAgIExMICAgIFJvb3RcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgLyBcXCAgICAgICAgICAgICAgICAvICAgIFxcXG4gICAgICAgICAgICAgICAgICAgIC8vICBMTCAgIExSICAgICAgICAgICAgTFIgICAgICBSXG4gICAgICAgICAgICAgICAgICAgIHRlbXAgPSByb290LnJpZ2h0O1xuICAgICAgICAgICAgICAgICAgICByb290LnJpZ2h0ID0gdGVtcC5sZWZ0O1xuICAgICAgICAgICAgICAgICAgICByb290LnRvdWNoKCk7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAubGVmdCA9IHJvb3Q7XG4gICAgICAgICAgICAgICAgICAgIHRlbXAudG91Y2goKTtcbiAgICAgICAgICAgICAgICAgICAgcm9vdCA9IHRlbXA7XG4gICAgICAgICAgICAgICAgICAgIGlmICghcm9vdC5yaWdodCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gcmVtZW1iZXIgZm9ybWVyIHJvb3QgZm9yIHJlcHJvcGFnYXRpbmcgbGVuZ3RoXG4gICAgICAgICAgICAgICAgdGVtcCA9IG5ldyBOb2RlKCk7XG4gICAgICAgICAgICAgICAgdGVtcC5sZWZ0ID0gcm9vdDtcbiAgICAgICAgICAgICAgICB0ZW1wLnJpZ2h0ID0gaGlzdG9yeS5yaWdodDtcbiAgICAgICAgICAgICAgICBoaXN0b3J5LnJpZ2h0ID0gdGVtcDtcbiAgICAgICAgICAgICAgICAvLyBsaW5rIHJpZ2h0XG4gICAgICAgICAgICAgICAgbGVmdC5yaWdodCA9IHJvb3Q7XG4gICAgICAgICAgICAgICAgbGVmdC50b3VjaCgpO1xuICAgICAgICAgICAgICAgIGxlZnQgPSByb290O1xuICAgICAgICAgICAgICAgIHJvb3QgPSByb290LnJpZ2h0O1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHsgLy8gZXF1YWwgb3IgaW5jb21wYXJhYmxlXG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlYXNzZW1ibGVcbiAgICBsZWZ0LnJpZ2h0ID0gcm9vdC5sZWZ0O1xuICAgIGxlZnQudG91Y2goKTtcbiAgICByaWdodC5sZWZ0ID0gcm9vdC5yaWdodDtcbiAgICByaWdodC50b3VjaCgpO1xuICAgIHJvb3QubGVmdCA9IHN0dWIucmlnaHQ7XG4gICAgcm9vdC5yaWdodCA9IHN0dWIubGVmdDtcblxuICAgIC8vIHByb3BhZ2F0ZSBuZXcgbGVuZ3Roc1xuICAgIHdoaWxlIChoaXN0b3J5LmxlZnQpIHtcbiAgICAgICAgaGlzdG9yeS5sZWZ0LnJpZ2h0LnRvdWNoKCk7XG4gICAgICAgIGhpc3RvcnkubGVmdCA9IGhpc3RvcnkubGVmdC5sZWZ0O1xuICAgIH1cbiAgICB3aGlsZSAoaGlzdG9yeS5yaWdodCkge1xuICAgICAgICBoaXN0b3J5LnJpZ2h0LmxlZnQudG91Y2goKTtcbiAgICAgICAgaGlzdG9yeS5yaWdodCA9IGhpc3RvcnkucmlnaHQucmlnaHQ7XG4gICAgfVxuICAgIHJvb3QudG91Y2goKTtcblxuICAgIHRoaXMucm9vdCA9IHJvb3Q7XG59O1xuXG4vLyBhbiBpbnRlcm5hbCB1dGlsaXR5IGZvciBzcGxheWluZyBhIG5vZGUgYmFzZWQgb24gaXRzIGluZGV4XG5Tb3J0ZWRTZXQucHJvdG90eXBlLnNwbGF5SW5kZXggPSBmdW5jdGlvbiAoaW5kZXgpIHtcbiAgICBpZiAodGhpcy5yb290KSB7XG4gICAgICAgIHZhciBhdCA9IHRoaXMucm9vdDtcbiAgICAgICAgdmFyIGF0SW5kZXggPSB0aGlzLnJvb3QuaW5kZXg7XG5cbiAgICAgICAgd2hpbGUgKGF0SW5kZXggIT09IGluZGV4KSB7XG4gICAgICAgICAgICBpZiAoYXRJbmRleCA+IGluZGV4ICYmIGF0LmxlZnQpIHtcbiAgICAgICAgICAgICAgICBhdCA9IGF0LmxlZnQ7XG4gICAgICAgICAgICAgICAgYXRJbmRleCAtPSAxICsgKGF0LnJpZ2h0ID8gYXQucmlnaHQubGVuZ3RoIDogMCk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKGF0SW5kZXggPCBpbmRleCAmJiBhdC5yaWdodCkge1xuICAgICAgICAgICAgICAgIGF0ID0gYXQucmlnaHQ7XG4gICAgICAgICAgICAgICAgYXRJbmRleCArPSAxICsgKGF0LmxlZnQgPyBhdC5sZWZ0Lmxlbmd0aCA6IDApO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc3BsYXkoYXQudmFsdWUpO1xuXG4gICAgICAgIHJldHVybiB0aGlzLnJvb3QuaW5kZXggPT09IGluZGV4O1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59O1xuXG5Tb3J0ZWRTZXQucHJvdG90eXBlLnJlZHVjZSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgYmFzaXMsIHRoaXNwKSB7XG4gICAgaWYgKHRoaXMucm9vdCkge1xuICAgICAgICBiYXNpcyA9IHRoaXMucm9vdC5yZWR1Y2UoY2FsbGJhY2ssIGJhc2lzLCAwLCB0aGlzcCwgdGhpcyk7XG4gICAgfVxuICAgIHJldHVybiBiYXNpcztcbn07XG5cblNvcnRlZFNldC5wcm90b3R5cGUucmVkdWNlUmlnaHQgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGJhc2lzLCB0aGlzcCkge1xuICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgICAgYmFzaXMgPSB0aGlzLnJvb3QucmVkdWNlUmlnaHQoY2FsbGJhY2ssIGJhc2lzLCB0aGlzLmxlbmd0aCAtIDEsIHRoaXNwLCB0aGlzKTtcbiAgICB9XG4gICAgcmV0dXJuIGJhc2lzO1xufTtcblxuU29ydGVkU2V0LnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbiAoYXQpIHtcbiAgICB2YXIgbGVhc3QgPSB0aGlzLmZpbmRMZWFzdChhdCk7XG4gICAgaWYgKGxlYXN0KSB7XG4gICAgICAgIHJldHVybiBsZWFzdC52YWx1ZTtcbiAgICB9XG59O1xuXG5Tb3J0ZWRTZXQucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uIChhdCkge1xuICAgIHZhciBncmVhdGVzdCA9IHRoaXMuZmluZEdyZWF0ZXN0KGF0KTtcbiAgICBpZiAoZ3JlYXRlc3QpIHtcbiAgICAgICAgcmV0dXJuIGdyZWF0ZXN0LnZhbHVlO1xuICAgIH1cbn07XG5cblNvcnRlZFNldC5wcm90b3R5cGUub25lID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLm1pbigpO1xufTtcblxuU29ydGVkU2V0LnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbWludXM7XG4gICAgaWYgKHRoaXMuZGlzcGF0Y2hlc1JhbmdlQ2hhbmdlcykge1xuICAgICAgICBtaW51cyA9IHRoaXMudG9BcnJheSgpO1xuICAgICAgICB0aGlzLmRpc3BhdGNoQmVmb3JlUmFuZ2VDaGFuZ2UoW10sIG1pbnVzLCAwKTtcbiAgICB9XG4gICAgdGhpcy5yb290ID0gbnVsbDtcbiAgICB0aGlzLmxlbmd0aCA9IDA7XG4gICAgaWYgKHRoaXMuZGlzcGF0Y2hlc1JhbmdlQ2hhbmdlcykge1xuICAgICAgICB0aGlzLmRpc3BhdGNoUmFuZ2VDaGFuZ2UoW10sIG1pbnVzLCAwKTtcbiAgICB9XG59O1xuXG5Tb3J0ZWRTZXQucHJvdG90eXBlLml0ZXJhdGUgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICAgIHJldHVybiBuZXcgdGhpcy5JdGVyYXRvcih0aGlzLCBzdGFydCwgZW5kKTtcbn07XG5cblNvcnRlZFNldC5wcm90b3R5cGUuSXRlcmF0b3IgPSBJdGVyYXRvcjtcblxuU29ydGVkU2V0LnByb3RvdHlwZS5zdW1tYXJ5ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICh0aGlzLnJvb3QpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMucm9vdC5zdW1tYXJ5KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIFwiKClcIjtcbiAgICB9XG59O1xuXG5Tb3J0ZWRTZXQucHJvdG90eXBlLmxvZyA9IGZ1bmN0aW9uIChjaGFybWFwLCBsb2dOb2RlLCBjYWxsYmFjaywgdGhpc3ApIHtcbiAgICBjaGFybWFwID0gY2hhcm1hcCB8fCBUcmVlTG9nLnVuaWNvZGVSb3VuZDtcbiAgICBsb2dOb2RlID0gbG9nTm9kZSB8fCB0aGlzLmxvZ05vZGU7XG4gICAgaWYgKCFjYWxsYmFjaykge1xuICAgICAgICBjYWxsYmFjayA9IGNvbnNvbGUubG9nO1xuICAgICAgICB0aGlzcCA9IGNvbnNvbGU7XG4gICAgfVxuICAgIGNhbGxiYWNrID0gY2FsbGJhY2suYmluZCh0aGlzcCk7XG4gICAgaWYgKHRoaXMucm9vdCkge1xuICAgICAgICB0aGlzLnJvb3QubG9nKGNoYXJtYXAsIGxvZ05vZGUsIGNhbGxiYWNrLCBjYWxsYmFjayk7XG4gICAgfVxufTtcblxuU29ydGVkU2V0LnByb3RvdHlwZS5sb2dOb2RlID0gZnVuY3Rpb24gKG5vZGUsIGxvZywgbG9nQmVmb3JlKSB7XG4gICAgbG9nKFwiIFwiICsgbm9kZS52YWx1ZSk7XG59O1xuXG5Tb3J0ZWRTZXQubG9nQ2hhcnNldHMgPSBUcmVlTG9nO1xuXG5Tb3J0ZWRTZXQucHJvdG90eXBlLk5vZGUgPSBOb2RlO1xuXG5mdW5jdGlvbiBOb2RlKHZhbHVlKSB7XG4gICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xuICAgIHRoaXMubGVmdCA9IG51bGw7XG4gICAgdGhpcy5yaWdodCA9IG51bGw7XG4gICAgdGhpcy5sZW5ndGggPSAxO1xufVxuXG4vLyBUT0RPIGNhc2Ugd2hlcmUgbm8gYmFzaXMgaXMgcHJvdmlkZWQgZm9yIHJlZHVjdGlvblxuXG5Ob2RlLnByb3RvdHlwZS5yZWR1Y2UgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGJhc2lzLCBpbmRleCwgdGhpc3AsIHRyZWUsIGRlcHRoKSB7XG4gICAgZGVwdGggPSBkZXB0aCB8fCAwO1xuICAgIGlmICh0aGlzLmxlZnQpIHtcbiAgICAgICAgLy8gcHJlcmVjb3JkIGxlbmd0aCB0byBiZSByZXNpc3RhbnQgdG8gbXV0YXRpb25cbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubGVmdC5sZW5ndGg7XG4gICAgICAgIGJhc2lzID0gdGhpcy5sZWZ0LnJlZHVjZShjYWxsYmFjaywgYmFzaXMsIGluZGV4LCB0aGlzcCwgdHJlZSwgZGVwdGggKyAxKTtcbiAgICAgICAgaW5kZXggKz0gbGVuZ3RoO1xuICAgIH1cbiAgICBiYXNpcyA9IGNhbGxiYWNrLmNhbGwodGhpc3AsIGJhc2lzLCB0aGlzLnZhbHVlLCBpbmRleCwgdHJlZSwgdGhpcywgZGVwdGgpO1xuICAgIGluZGV4ICs9IDE7XG4gICAgaWYgKHRoaXMucmlnaHQpIHtcbiAgICAgICAgYmFzaXMgPSB0aGlzLnJpZ2h0LnJlZHVjZShjYWxsYmFjaywgYmFzaXMsIGluZGV4LCB0aGlzcCwgdHJlZSwgZGVwdGggKyAxKTtcbiAgICB9XG4gICAgcmV0dXJuIGJhc2lzO1xufTtcblxuTm9kZS5wcm90b3R5cGUucmVkdWNlUmlnaHQgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGJhc2lzLCBpbmRleCwgdGhpc3AsIHRyZWUsIGRlcHRoKSB7XG4gICAgZGVwdGggPSBkZXB0aCB8fCAwO1xuICAgIGlmICh0aGlzLnJpZ2h0KSB7XG4gICAgICAgIGJhc2lzID0gdGhpcy5yaWdodC5yZWR1Y2VSaWdodChjYWxsYmFjaywgYmFzaXMsIGluZGV4LCB0aGlzcCwgdHJlZSwgZGVwdGggKyAxKTtcbiAgICAgICAgaW5kZXggLT0gdGhpcy5yaWdodC5sZW5ndGg7XG4gICAgfVxuICAgIGJhc2lzID0gY2FsbGJhY2suY2FsbCh0aGlzcCwgYmFzaXMsIHRoaXMudmFsdWUsIHRoaXMudmFsdWUsIHRyZWUsIHRoaXMsIGRlcHRoKTtcbiAgICBpbmRleCAtPSAxO1xuICAgIGlmICh0aGlzLmxlZnQpIHtcbiAgICAgICAgYmFzaXMgPSB0aGlzLmxlZnQucmVkdWNlUmlnaHQoY2FsbGJhY2ssIGJhc2lzLCBpbmRleCwgdGhpc3AsIHRyZWUsIGRlcHRoICsgMSk7XG4gICAgfVxuICAgIHJldHVybiBiYXNpcztcbn07XG5cbk5vZGUucHJvdG90eXBlLnRvdWNoID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMubGVuZ3RoID0gMSArXG4gICAgICAgICh0aGlzLmxlZnQgPyB0aGlzLmxlZnQubGVuZ3RoIDogMCkgK1xuICAgICAgICAodGhpcy5yaWdodCA/IHRoaXMucmlnaHQubGVuZ3RoIDogMCk7XG4gICAgdGhpcy5pbmRleCA9IHRoaXMubGVmdCA/IHRoaXMubGVmdC5sZW5ndGggOiAwO1xufTtcblxuTm9kZS5wcm90b3R5cGUuY2hlY2tJbnRlZ3JpdHkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxlbmd0aCA9IDE7XG4gICAgbGVuZ3RoICs9IHRoaXMubGVmdCA/IHRoaXMubGVmdC5jaGVja0ludGVncml0eSgpIDogMDtcbiAgICBsZW5ndGggKz0gdGhpcy5yaWdodCA/IHRoaXMucmlnaHQuY2hlY2tJbnRlZ3JpdHkoKSA6IDA7XG4gICAgaWYgKHRoaXMubGVuZ3RoICE9PSBsZW5ndGgpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludGVncml0eSBjaGVjayBmYWlsZWQ6IFwiICsgdGhpcy5zdW1tYXJ5KCkpO1xuICAgIHJldHVybiBsZW5ndGg7XG59XG5cbi8vIGdldCB0aGUgbmV4dCBub2RlIGluIHRoaXMgc3VidHJlZVxuTm9kZS5wcm90b3R5cGUuZ2V0TmV4dCA9IGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgbm9kZSA9IHRoaXM7XG4gICAgaWYgKG5vZGUucmlnaHQpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUucmlnaHQ7XG4gICAgICAgIHdoaWxlIChub2RlLmxlZnQpIHtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLmxlZnQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgfVxufTtcblxuLy8gZ2V0IHRoZSBwcmV2aW91cyBub2RlIGluIHRoaXMgc3VidHJlZVxuTm9kZS5wcm90b3R5cGUuZ2V0UHJldmlvdXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIG5vZGUgPSB0aGlzO1xuICAgIGlmIChub2RlLmxlZnQpIHtcbiAgICAgICAgbm9kZSA9IG5vZGUubGVmdDtcbiAgICAgICAgd2hpbGUgKG5vZGUucmlnaHQpIHtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLnJpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBub2RlO1xuICAgIH1cbn07XG5cbk5vZGUucHJvdG90eXBlLnN1bW1hcnkgPSBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHZhbHVlID0gdGhpcy52YWx1ZSB8fCBcIi1cIjtcbiAgICB2YWx1ZSArPSBcIiA8XCIgKyB0aGlzLmxlbmd0aDtcbiAgICBpZiAoIXRoaXMubGVmdCAmJiAhdGhpcy5yaWdodCkge1xuICAgICAgICByZXR1cm4gXCIoXCIgKyB2YWx1ZSArIFwiKVwiO1xuICAgIH1cbiAgICByZXR1cm4gXCIoXCIgKyB2YWx1ZSArIFwiIFwiICsgKFxuICAgICAgICB0aGlzLmxlZnQgPyB0aGlzLmxlZnQuc3VtbWFyeSgpIDogXCIoKVwiXG4gICAgKSArIFwiLCBcIiArIChcbiAgICAgICAgdGhpcy5yaWdodCA/IHRoaXMucmlnaHQuc3VtbWFyeSgpIDogXCIoKVwiXG4gICAgKSArIFwiKVwiO1xufTtcblxuTm9kZS5wcm90b3R5cGUubG9nID0gZnVuY3Rpb24gKGNoYXJtYXAsIGxvZ05vZGUsIGxvZywgbG9nQWJvdmUpIHtcbiAgICB2YXIgc2VsZiA9IHRoaXM7XG5cbiAgICB2YXIgYnJhbmNoO1xuICAgIGlmICh0aGlzLmxlZnQgJiYgdGhpcy5yaWdodCkge1xuICAgICAgICBicmFuY2ggPSBjaGFybWFwLmludGVyc2VjdGlvbjtcbiAgICB9IGVsc2UgaWYgKHRoaXMubGVmdCkge1xuICAgICAgICBicmFuY2ggPSBjaGFybWFwLmJyYW5jaFVwO1xuICAgIH0gZWxzZSBpZiAodGhpcy5yaWdodCkge1xuICAgICAgICBicmFuY2ggPSBjaGFybWFwLmJyYW5jaERvd247XG4gICAgfSBlbHNlIHtcbiAgICAgICAgYnJhbmNoID0gY2hhcm1hcC50aHJvdWdoO1xuICAgIH1cblxuICAgIHZhciBsb2dnZWRBYm92ZTtcbiAgICB0aGlzLmxlZnQgJiYgdGhpcy5sZWZ0LmxvZyhcbiAgICAgICAgY2hhcm1hcCxcbiAgICAgICAgbG9nTm9kZSxcbiAgICAgICAgZnVuY3Rpb24gaW5uZXJXcml0ZShsaW5lKSB7XG4gICAgICAgICAgICBpZiAoIWxvZ2dlZEFib3ZlKSB7XG4gICAgICAgICAgICAgICAgbG9nZ2VkQWJvdmUgPSB0cnVlO1xuICAgICAgICAgICAgICAgIC8vIGxlYWRlclxuICAgICAgICAgICAgICAgIGxvZ0Fib3ZlKGNoYXJtYXAuZnJvbUJlbG93ICsgY2hhcm1hcC50aHJvdWdoICsgbGluZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGJlbG93XG4gICAgICAgICAgICAgICAgbG9nQWJvdmUoY2hhcm1hcC5zdHJhZmUgKyBcIiBcIiArIGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiBpbm5lcldyaXRlQWJvdmUobGluZSkge1xuICAgICAgICAgICAgLy8gYWJvdmVcbiAgICAgICAgICAgIGxvZ0Fib3ZlKFwiICBcIiArIGxpbmUpO1xuICAgICAgICB9XG4gICAgKTtcblxuICAgIHZhciBsb2dnZWRPbjtcbiAgICBsb2dOb2RlKFxuICAgICAgICB0aGlzLFxuICAgICAgICBmdW5jdGlvbiBpbm5lcldyaXRlKGxpbmUpIHtcbiAgICAgICAgICAgIGlmICghbG9nZ2VkT24pIHtcbiAgICAgICAgICAgICAgICBsb2dnZWRPbiA9IHRydWU7XG4gICAgICAgICAgICAgICAgbG9nKGJyYW5jaCArIGxpbmUpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBsb2coKHNlbGYucmlnaHQgPyBjaGFybWFwLnN0cmFmZSA6IFwiIFwiKSArIGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiBpbm5lcldyaXRlQWJvdmUobGluZSkge1xuICAgICAgICAgICAgbG9nQWJvdmUoKHNlbGYubGVmdCA/IGNoYXJtYXAuc3RyYWZlIDogXCIgXCIpICsgbGluZSk7XG4gICAgICAgIH1cbiAgICApO1xuXG4gICAgdmFyIGxvZ2dlZEJlbG93O1xuICAgIHRoaXMucmlnaHQgJiYgdGhpcy5yaWdodC5sb2coXG4gICAgICAgIGNoYXJtYXAsXG4gICAgICAgIGxvZ05vZGUsXG4gICAgICAgIGZ1bmN0aW9uIGlubmVyV3JpdGUobGluZSkge1xuICAgICAgICAgICAgaWYgKCFsb2dnZWRCZWxvdykge1xuICAgICAgICAgICAgICAgIGxvZ2dlZEJlbG93ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBsb2coY2hhcm1hcC5mcm9tQWJvdmUgKyBjaGFybWFwLnRocm91Z2ggKyBsaW5lKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9nKFwiICBcIiArIGxpbmUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmdW5jdGlvbiBpbm5lcldyaXRlQWJvdmUobGluZSkge1xuICAgICAgICAgICAgbG9nKGNoYXJtYXAuc3RyYWZlICsgXCIgXCIgKyBsaW5lKTtcbiAgICAgICAgfVxuICAgICk7XG59O1xuXG5mdW5jdGlvbiBJdGVyYXRvcihzZXQsIHN0YXJ0LCBlbmQpIHtcbiAgICB0aGlzLnNldCA9IHNldDtcbiAgICB0aGlzLnByZXYgPSBudWxsO1xuICAgIHRoaXMuZW5kID0gZW5kO1xuICAgIGlmIChzdGFydCkge1xuICAgICAgICB2YXIgbmV4dCA9IHRoaXMuc2V0LmZpbmRMZWFzdEdyZWF0ZXJUaGFuT3JFcXVhbChzdGFydCk7XG4gICAgICAgIGlmIChuZXh0KSB7XG4gICAgICAgICAgICB0aGlzLnNldC5zcGxheShuZXh0LnZhbHVlKTtcbiAgICAgICAgICAgIHRoaXMucHJldiA9IG5leHQuZ2V0UHJldmlvdXMoKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbkl0ZXJhdG9yLnByb3RvdHlwZS5fX2l0ZXJhdGlvbk9iamVjdCA9IG51bGw7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoSXRlcmF0b3IucHJvdG90eXBlLFwiX2l0ZXJhdGlvbk9iamVjdFwiLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19pdGVyYXRpb25PYmplY3QgfHwgKHRoaXMuX19pdGVyYXRpb25PYmplY3QgPSB7IGRvbmU6IGZhbHNlLCB2YWx1ZTpudWxsfSk7XG4gICAgfVxufSk7XG5cbkl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24gKCkge1xuICAgIHZhciBuZXh0O1xuICAgIGlmICh0aGlzLnByZXYpIHtcbiAgICAgICAgbmV4dCA9IHRoaXMuc2V0LmZpbmRMZWFzdEdyZWF0ZXJUaGFuKHRoaXMucHJldi52YWx1ZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgbmV4dCA9IHRoaXMuc2V0LmZpbmRMZWFzdCgpO1xuICAgIH1cbiAgICBpZiAoIW5leHQpIHtcbiAgICAgICAgdGhpcy5faXRlcmF0aW9uT2JqZWN0LmRvbmUgPSB0cnVlO1xuICAgICAgICB0aGlzLl9pdGVyYXRpb25PYmplY3QudmFsdWUgPSB2b2lkIDA7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmVuZCAhPT0gdW5kZWZpbmVkICYmXG4gICAgICAgICAgICB0aGlzLnNldC5jb250ZW50Q29tcGFyZShuZXh0LnZhbHVlLCB0aGlzLmVuZCkgPj0gMFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHRoaXMuX2l0ZXJhdGlvbk9iamVjdC5kb25lID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuX2l0ZXJhdGlvbk9iamVjdC52YWx1ZSA9IHZvaWQgMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMucHJldiA9IG5leHQ7XG4gICAgICAgICAgICB0aGlzLl9pdGVyYXRpb25PYmplY3QudmFsdWUgPSAgbmV4dC52YWx1ZTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9pdGVyYXRpb25PYmplY3Q7XG59O1xuIl19