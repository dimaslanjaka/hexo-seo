import gulp from "gulp";
import concat from "gulp-concat";
import Promise from "bluebird";
import del from "del";
import { exec as sysexec } from "child_process";
const exec = Promise.promisify(sysexec);

function build(done) {
  const deletedDirectoryPaths = del(["dist", "docs"]);
  const exclude = ["!**/node_modules/**", "!**/.git**", "!**/.github/**", "!**.gitmodules**"];

  return Promise.all([deletedDirectoryPaths, exec("npx tsc")])
    .then(() => {
      console.log("copy sitemaps xml to dist");
      return gulp.src("./src/**/*.xml").pipe(gulp.dest("./dist/src"));
    })
    .then(() => {
      console.log("copy packages to dist");
      return gulp.src(["./packages/**/*"].concat(exclude), { base: ".", dot: true }).pipe(gulp.dest("./dist"));
    })
    .then(() => {
      console.log("copy dist to master build");
      return gulp.src(["./dist/**/*"].concat(exclude)).pipe(gulp.dest("./docs/dist"));
    })
    .then(() => {
      console.log("copy main js to master build");
      return gulp.src("./index.*").pipe(gulp.dest("./docs"));
    })
    .then(() => {
      console.log("build readme master build");
      return gulp.src(["./README.md", "./CHANGELOG.md"]).pipe(concat("README.md")).pipe(gulp.dest("./docs"));
    })
    .then(() => {
      console.log("copy source to master build");
      gulp
        .src(["./*.{json,md}", "./src/**/*", "./packages/**/*", "./source/**/*"].concat(exclude), {
          base: ".",
          dot: true
        })
        .pipe(gulp.dest("./docs"));
      return done();
    });
}

exports.default = gulp.series(build);
