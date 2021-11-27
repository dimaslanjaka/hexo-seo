import gulp from "gulp";

function copy(src, dest) {
  return gulp.src(src, { base: "." }).pipe(gulp.dest(dest));
}

function build() {
  return copy("./lib", "./build/lib").pipe(copy("./src", "./build/src"));
}

exports.default = gulp.series(build);
