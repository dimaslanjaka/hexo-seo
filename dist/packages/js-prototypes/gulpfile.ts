import gulp from "gulp";
import concat from "gulp-concat";
import terser from "gulp-terser";
import ts from "gulp-typescript";
import merge from "merge2";
import del from "del";
import through from "through2";
import { join } from "path";
import { readFileSync } from "fs";

gulp.task("bundle-clean", function () {
  return del("./dist");
});

gulp.task("bundle-tsc", function () {
  var tsProject = ts.createProject("tsconfig.json");
  var tsResult = gulp.src("src/**/*.ts").pipe(tsProject());
  //.pipe(gulp.dest("dist/libs"));
  return merge([tsResult.dts.pipe(gulp.dest("dist/libs")), tsResult.js.pipe(gulp.dest("dist/libs"))]);
});

gulp.task("bundle-js", function () {
  return gulp
    .src(["dist/libs/*.js", "!dist/libs/globals.*"])
    .pipe(concat("bundle.js"))
    .pipe(
      through.obj((chunk: chunk, enc, cb) => {
        let contents = chunk.contents.toString();
        const source = chunk.path;
        const regex = /\/\/\/.*<reference path=\"(.*)\".*\/>/gm;
        let m: RegExpExecArray;
        while ((m = regex.exec(contents)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          contents = contents.replace(m[0], "");
        }
        chunk.contents = Buffer.from(contents);
        cb(null, chunk);
      })
    )
    .pipe(gulp.dest("./dist/release"));
});

gulp.task("bundle-min-js", function () {
  return gulp.src(["dist/libs/*.js"]).pipe(concat("bundle.min.js")).pipe(terser()).pipe(gulp.dest("./dist/release"));
});

interface chunk {
  path: string;
  contents: Buffer;
}

gulp.task("bundle-dts", function () {
  return gulp
    .src(["dist/libs/*.d.ts", "!dist/libs/globals.*"])
    .pipe(concat("bundle.d.ts"))
    .pipe(
      through.obj((chunk: chunk, enc, cb) => {
        let contents = chunk.contents.toString();
        const source = chunk.path;
        const regex = /\/\/\/.*<reference path=\"(.*)\".*\/>/gm;
        let m: RegExpExecArray;
        while ((m = regex.exec(contents)) !== null) {
          // This is necessary to avoid infinite loops with zero-width matches
          if (m.index === regex.lastIndex) {
            regex.lastIndex++;
          }
          const realpathref = join(__dirname, "dist/libs", m[1]);
          contents = contents.replace(m[0], readFileSync(realpathref).toString());
          console.log(realpathref);
        }
        chunk.contents = Buffer.from(contents);
        cb(null, chunk);
      })
    )
    .pipe(gulp.dest("./dist/release"));
});

exports.default = gulp.series("bundle-clean", "bundle-tsc", "bundle-js", "bundle-min-js", "bundle-dts");
