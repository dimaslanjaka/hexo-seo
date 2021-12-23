import gulp from "gulp";
import concat from "gulp-concat";
import terser from "gulp-terser";
import ts from "gulp-typescript";
import merge from "merge2";
import clean from "gulp-clean";

gulp.task("bundle-clean", function () {
  return gulp.src("dist", { read: false }).pipe(clean());
});

gulp.task("bundle-tsc", function () {
  var tsProject = ts.createProject("tsconfig.json");
  var tsResult = gulp.src("src/**/*.ts").pipe(tsProject());
  //.pipe(gulp.dest("dist/libs"));
  return merge([
    tsResult.dts.pipe(gulp.dest("dist/libs")),
    tsResult.js.pipe(gulp.dest("dist/libs")),
  ]);
});

gulp.task("bundle-js", function () {
  return gulp
    .src(["dist/libs/*.js"])
    .pipe(concat("bundle.js"))
    .pipe(gulp.dest("./dist/release"));
});

gulp.task("bundle-min-js", function () {
  return gulp
    .src(["dist/libs/*.js"])
    .pipe(concat("bundle.min.js"))
    .pipe(terser())
    .pipe(gulp.dest("./dist/release"));
});

gulp.task("bundle-dts", function () {
  return gulp
    .src(["dist/libs/*.d.ts"])
    .pipe(concat("bundle.d.ts"))
    .pipe(gulp.dest("./dist/release"));
});

exports.default = gulp.series(
  "bundle-tsc",
  "bundle-js",
  "bundle-min-js",
  "bundle-dts"
);
