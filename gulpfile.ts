import gulp from "gulp";
import concat from "gulp-concat";

function copy(src, dest, opt = { base: "." }) {
  return gulp.src(src, opt).pipe(gulp.dest(dest));
}

function build() {
  return gulp
    .src(
      [
        "./.gitmodules",
        "./*.{json,js,md}",
        "./lib/**/*",
        "./src/**/*",
        "./packages/**/*",
        "./dist/**/*",
        "./source/**/*"
      ],
      { base: ".", dot: true }
    )
    .pipe(gulp.dest("./docs"));
}

function readme() {
  return gulp
    .src(["./README.md", "./CHANGELOG.md"])
    .pipe(concat("README.md"))
    .pipe(gulp.dest("./docs"));
}

exports.default = gulp.series(build);
