import gulp from "gulp";
import concat from "gulp-concat";
import Promise from "bluebird";
import del from "del";

function clean() {
  return del(["dist", "docs"]);
}

function build(done: gulp.TaskFunctionCallback) {
  const exclude = ["!**/node_modules/**", "!**/.git**", "!**/.github/**", "!**.gitmodules**"];

  return Promise.all(exclude)
    .then(() => {
      console.log("copy sitemaps xml to dist");
      return gulp.src("./src/**/*.{xml,xsl}").pipe(gulp.dest("./dist/src"));
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
        .src(["./*.{json}", "./src/**/*", "./packages/**/*", "./source/**/*"].concat(exclude), {
          base: ".",
          dot: true
        })
        .pipe(gulp.dest("./docs"));
      return done();
    });
}

gulp.task("default", build);
gulp.task("clean", clean);
