import gulp from "gulp";
import concat from "gulp-concat";
import Promise from "bluebird";
import { rmSync } from "fs";
import { join } from "path";

function build(done) {
  rmSync(join(__dirname, "docs"), { recursive: true, force: true });
  rmSync(join(__dirname, "dist"), { recursive: true, force: true });
  const exclude = ["!**/node_modules/**", "!**/.git**", "!**/.github/**"];
  return Promise.resolve(
    gulp
      .src(
        [
          //"./.gitmodules",
          "./*.{json,js,md}",
          "./lib/**/*",
          "./src/**/*",
          "./packages/**/*",
          "./dist/**/*",
          "./source/**/*"
        ].concat(exclude),
        { base: ".", dot: true }
      )
      .pipe(gulp.dest("./docs"))
  )
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
