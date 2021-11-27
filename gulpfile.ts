import gulp from "gulp";

function copy(src, dest) {
  return gulp.src(src, { base: "." }).pipe(gulp.dest(dest));
}

function build() {
  return gulp
    .src([
      "./*.{json,js}",
      "./lib/**/*",
      "./src/**/*",
      "./packages/**/*",
      "./dist/**/*",
      "./source/**/*"
    ])
    .pipe(gulp.dest("./docs"));
}

exports.default = gulp.series(build);
