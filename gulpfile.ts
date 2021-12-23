import gulp from "gulp";
import concat from "gulp-concat";
import Promise from "bluebird";
import del from "del";

function build(done) {
  const deletedDirectoryPaths = del(["dist", "docs"]);
  const exclude = ["!**/node_modules/**", "!**/.git**", "!**/.github/**", "!**.gitmodules**"];
  return Promise.resolve(deletedDirectoryPaths)
    .then(() => {
      gulp
        .src(
          ["./*.{json,js,md}", "./lib/**/*", "./src/**/*", "./packages/**/*", "./dist/**/*", "./source/**/*"].concat(
            exclude
          ),
          { base: ".", dot: true }
        )
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
