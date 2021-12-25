import gulp from "gulp";
import concat from "gulp-concat";
import Promise from "bluebird";
import del from "del";
import { exec as sysexec } from "child_process";
const exec = Promise.promisify(sysexec);

function build(done) {
  const deletedDirectoryPaths = del(["dist", "docs"]);
  const exclude = ["!**/node_modules/**", "!**/.git**", "!**/.github/**", "!**.gitmodules**"];

  return Promise.all([deletedDirectoryPaths, exec("tsc")])
    .then(() => {
      console.log("copy xml to dist");
      return gulp.src("./src/**/*.xml").pipe(gulp.dest("./dist/src"));
    })
    .then(() => {
      console.log("copy dist to master build");
      return gulp.src("./dist/**/*").pipe(gulp.dest("./docs/dist"));
    })
    .then(() => {
      gulp
        .src(["./*.{json,js,md}", "./lib/**/*", "./src/**/*", "./packages/**/*", "./source/**/*"].concat(exclude), {
          base: ".",
          dot: true
        })
        .pipe(gulp.dest("./docs"));
    })
    .then(() => {
      return gulp.src(["./packages/**/*"].concat(exclude), { base: ".", dot: true }).pipe(gulp.dest("./dist"));
    })
    .finally(done);
}

function readme() {
  return gulp.src(["./README.md", "./CHANGELOG.md"]).pipe(concat("README.md")).pipe(gulp.dest("./docs"));
}

exports.default = gulp.series(build, readme);
exports.copy = gulp.series(build);
