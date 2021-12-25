"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const gulp_1 = __importDefault(require("gulp"));
const gulp_concat_1 = __importDefault(require("gulp-concat"));
const gulp_terser_1 = __importDefault(require("gulp-terser"));
const gulp_typescript_1 = __importDefault(require("gulp-typescript"));
const merge2_1 = __importDefault(require("merge2"));
const del_1 = __importDefault(require("del"));
const through2_1 = __importDefault(require("through2"));
const path_1 = require("path");
const fs_1 = require("fs");
gulp_1.default.task("bundle-clean", function () {
    return (0, del_1.default)("./dist");
});
gulp_1.default.task("bundle-tsc", function () {
    var tsProject = gulp_typescript_1.default.createProject("tsconfig.json");
    var tsResult = gulp_1.default.src("src/**/*.ts").pipe(tsProject());
    //.pipe(gulp.dest("dist/libs"));
    return (0, merge2_1.default)([tsResult.dts.pipe(gulp_1.default.dest("dist/libs")), tsResult.js.pipe(gulp_1.default.dest("dist/libs"))]);
});
gulp_1.default.task("bundle-js", function () {
    return gulp_1.default
        .src(["dist/libs/*.js", "!dist/libs/globals.*"])
        .pipe((0, gulp_concat_1.default)("bundle.js"))
        .pipe(gulp_1.default.dest("./dist/release"));
});
gulp_1.default.task("bundle-min-js", function () {
    return gulp_1.default.src(["dist/libs/*.js"]).pipe((0, gulp_concat_1.default)("bundle.min.js")).pipe((0, gulp_terser_1.default)()).pipe(gulp_1.default.dest("./dist/release"));
});
gulp_1.default.task("bundle-dts", function () {
    return gulp_1.default
        .src(["dist/libs/*.d.ts", "!dist/libs/globals.*"])
        .pipe((0, gulp_concat_1.default)("bundle.d.ts"))
        .pipe(through2_1.default.obj((chunk, enc, cb) => {
        let contents = chunk.contents.toString();
        const source = chunk.path;
        const regex = /\/\/\/.*<reference path=\"(.*)\".*\/>/gm;
        let m;
        while ((m = regex.exec(contents)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            const realpathref = (0, path_1.join)(__dirname, "dist/libs", m[1]);
            contents = contents.replace(m[0], (0, fs_1.readFileSync)(realpathref).toString());
            console.log(realpathref);
        }
        chunk.contents = Buffer.from(contents);
        cb(null, chunk);
    }))
        .pipe(gulp_1.default.dest("./dist/release"));
});
exports.default = gulp_1.default.series("bundle-clean", "bundle-tsc", "bundle-js", "bundle-min-js", "bundle-dts");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3VscGZpbGUuanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbInBhY2thZ2VzL2pzLXByb3RvdHlwZXMvZ3VscGZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxnREFBd0I7QUFDeEIsOERBQWlDO0FBQ2pDLDhEQUFpQztBQUNqQyxzRUFBaUM7QUFDakMsb0RBQTJCO0FBQzNCLDhDQUFzQjtBQUN0Qix3REFBK0I7QUFDL0IsK0JBQTRCO0FBQzVCLDJCQUFrQztBQUVsQyxjQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtJQUN4QixPQUFPLElBQUEsYUFBRyxFQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQ3ZCLENBQUMsQ0FBQyxDQUFDO0FBRUgsY0FBSSxDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUU7SUFDdEIsSUFBSSxTQUFTLEdBQUcseUJBQUUsQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7SUFDbEQsSUFBSSxRQUFRLEdBQUcsY0FBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQztJQUN6RCxnQ0FBZ0M7SUFDaEMsT0FBTyxJQUFBLGdCQUFLLEVBQUMsQ0FBQyxRQUFRLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN0RyxDQUFDLENBQUMsQ0FBQztBQUVILGNBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO0lBQ3JCLE9BQU8sY0FBSTtTQUNSLEdBQUcsQ0FBQyxDQUFDLGdCQUFnQixFQUFFLHNCQUFzQixDQUFDLENBQUM7U0FDL0MsSUFBSSxDQUFDLElBQUEscUJBQU0sRUFBQyxXQUFXLENBQUMsQ0FBQztTQUN6QixJQUFJLENBQUMsY0FBSSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUM7QUFDdkMsQ0FBQyxDQUFDLENBQUM7QUFFSCxjQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRTtJQUN6QixPQUFPLGNBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUEscUJBQU0sRUFBQyxlQUFlLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFBLHFCQUFNLEdBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFJLENBQUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsQ0FBQztBQUNySCxDQUFDLENBQUMsQ0FBQztBQU9ILGNBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxFQUFFO0lBQ3RCLE9BQU8sY0FBSTtTQUNSLEdBQUcsQ0FBQyxDQUFDLGtCQUFrQixFQUFFLHNCQUFzQixDQUFDLENBQUM7U0FDakQsSUFBSSxDQUFDLElBQUEscUJBQU0sRUFBQyxhQUFhLENBQUMsQ0FBQztTQUMzQixJQUFJLENBQ0gsa0JBQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxLQUFZLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxFQUFFO1FBQ3BDLElBQUksUUFBUSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDekMsTUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztRQUMxQixNQUFNLEtBQUssR0FBRyx5Q0FBeUMsQ0FBQztRQUN4RCxJQUFJLENBQWtCLENBQUM7UUFDdkIsT0FBTyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEtBQUssSUFBSSxFQUFFO1lBQzFDLG9FQUFvRTtZQUNwRSxJQUFJLENBQUMsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLFNBQVMsRUFBRTtnQkFDL0IsS0FBSyxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ25CO1lBQ0QsTUFBTSxXQUFXLEdBQUcsSUFBQSxXQUFJLEVBQUMsU0FBUyxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN2RCxRQUFRLEdBQUcsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBQSxpQkFBWSxFQUFDLFdBQVcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7WUFDeEUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUMxQjtRQUNELEtBQUssQ0FBQyxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUN2QyxFQUFFLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBQ2xCLENBQUMsQ0FBQyxDQUNIO1NBQ0EsSUFBSSxDQUFDLGNBQUksQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDO0FBQ3ZDLENBQUMsQ0FBQyxDQUFDO0FBRUgsT0FBTyxDQUFDLE9BQU8sR0FBRyxjQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLGVBQWUsRUFBRSxZQUFZLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBndWxwIGZyb20gXCJndWxwXCI7XG5pbXBvcnQgY29uY2F0IGZyb20gXCJndWxwLWNvbmNhdFwiO1xuaW1wb3J0IHRlcnNlciBmcm9tIFwiZ3VscC10ZXJzZXJcIjtcbmltcG9ydCB0cyBmcm9tIFwiZ3VscC10eXBlc2NyaXB0XCI7XG5pbXBvcnQgbWVyZ2UgZnJvbSBcIm1lcmdlMlwiO1xuaW1wb3J0IGRlbCBmcm9tIFwiZGVsXCI7XG5pbXBvcnQgdGhyb3VnaCBmcm9tIFwidGhyb3VnaDJcIjtcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgcmVhZEZpbGVTeW5jIH0gZnJvbSBcImZzXCI7XG5cbmd1bHAudGFzayhcImJ1bmRsZS1jbGVhblwiLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBkZWwoXCIuL2Rpc3RcIik7XG59KTtcblxuZ3VscC50YXNrKFwiYnVuZGxlLXRzY1wiLCBmdW5jdGlvbiAoKSB7XG4gIHZhciB0c1Byb2plY3QgPSB0cy5jcmVhdGVQcm9qZWN0KFwidHNjb25maWcuanNvblwiKTtcbiAgdmFyIHRzUmVzdWx0ID0gZ3VscC5zcmMoXCJzcmMvKiovKi50c1wiKS5waXBlKHRzUHJvamVjdCgpKTtcbiAgLy8ucGlwZShndWxwLmRlc3QoXCJkaXN0L2xpYnNcIikpO1xuICByZXR1cm4gbWVyZ2UoW3RzUmVzdWx0LmR0cy5waXBlKGd1bHAuZGVzdChcImRpc3QvbGlic1wiKSksIHRzUmVzdWx0LmpzLnBpcGUoZ3VscC5kZXN0KFwiZGlzdC9saWJzXCIpKV0pO1xufSk7XG5cbmd1bHAudGFzayhcImJ1bmRsZS1qc1wiLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBndWxwXG4gICAgLnNyYyhbXCJkaXN0L2xpYnMvKi5qc1wiLCBcIiFkaXN0L2xpYnMvZ2xvYmFscy4qXCJdKVxuICAgIC5waXBlKGNvbmNhdChcImJ1bmRsZS5qc1wiKSlcbiAgICAucGlwZShndWxwLmRlc3QoXCIuL2Rpc3QvcmVsZWFzZVwiKSk7XG59KTtcblxuZ3VscC50YXNrKFwiYnVuZGxlLW1pbi1qc1wiLCBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBndWxwLnNyYyhbXCJkaXN0L2xpYnMvKi5qc1wiXSkucGlwZShjb25jYXQoXCJidW5kbGUubWluLmpzXCIpKS5waXBlKHRlcnNlcigpKS5waXBlKGd1bHAuZGVzdChcIi4vZGlzdC9yZWxlYXNlXCIpKTtcbn0pO1xuXG5pbnRlcmZhY2UgY2h1bmsge1xuICBwYXRoOiBzdHJpbmc7XG4gIGNvbnRlbnRzOiBCdWZmZXI7XG59XG5cbmd1bHAudGFzayhcImJ1bmRsZS1kdHNcIiwgZnVuY3Rpb24gKCkge1xuICByZXR1cm4gZ3VscFxuICAgIC5zcmMoW1wiZGlzdC9saWJzLyouZC50c1wiLCBcIiFkaXN0L2xpYnMvZ2xvYmFscy4qXCJdKVxuICAgIC5waXBlKGNvbmNhdChcImJ1bmRsZS5kLnRzXCIpKVxuICAgIC5waXBlKFxuICAgICAgdGhyb3VnaC5vYmooKGNodW5rOiBjaHVuaywgZW5jLCBjYikgPT4ge1xuICAgICAgICBsZXQgY29udGVudHMgPSBjaHVuay5jb250ZW50cy50b1N0cmluZygpO1xuICAgICAgICBjb25zdCBzb3VyY2UgPSBjaHVuay5wYXRoO1xuICAgICAgICBjb25zdCByZWdleCA9IC9cXC9cXC9cXC8uKjxyZWZlcmVuY2UgcGF0aD1cXFwiKC4qKVxcXCIuKlxcLz4vZ207XG4gICAgICAgIGxldCBtOiBSZWdFeHBFeGVjQXJyYXk7XG4gICAgICAgIHdoaWxlICgobSA9IHJlZ2V4LmV4ZWMoY29udGVudHMpKSAhPT0gbnVsbCkge1xuICAgICAgICAgIC8vIFRoaXMgaXMgbmVjZXNzYXJ5IHRvIGF2b2lkIGluZmluaXRlIGxvb3BzIHdpdGggemVyby13aWR0aCBtYXRjaGVzXG4gICAgICAgICAgaWYgKG0uaW5kZXggPT09IHJlZ2V4Lmxhc3RJbmRleCkge1xuICAgICAgICAgICAgcmVnZXgubGFzdEluZGV4Kys7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbnN0IHJlYWxwYXRocmVmID0gam9pbihfX2Rpcm5hbWUsIFwiZGlzdC9saWJzXCIsIG1bMV0pO1xuICAgICAgICAgIGNvbnRlbnRzID0gY29udGVudHMucmVwbGFjZShtWzBdLCByZWFkRmlsZVN5bmMocmVhbHBhdGhyZWYpLnRvU3RyaW5nKCkpO1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlYWxwYXRocmVmKTtcbiAgICAgICAgfVxuICAgICAgICBjaHVuay5jb250ZW50cyA9IEJ1ZmZlci5mcm9tKGNvbnRlbnRzKTtcbiAgICAgICAgY2IobnVsbCwgY2h1bmspO1xuICAgICAgfSlcbiAgICApXG4gICAgLnBpcGUoZ3VscC5kZXN0KFwiLi9kaXN0L3JlbGVhc2VcIikpO1xufSk7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGd1bHAuc2VyaWVzKFwiYnVuZGxlLWNsZWFuXCIsIFwiYnVuZGxlLXRzY1wiLCBcImJ1bmRsZS1qc1wiLCBcImJ1bmRsZS1taW4tanNcIiwgXCJidW5kbGUtZHRzXCIpO1xuIl19