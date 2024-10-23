import Bluebird from 'bluebird';
import { execSync } from 'child_process';
import { existsSync, rmSync } from 'fs-extra';
import gulp from 'gulp';
import concat from 'gulp-concat';
import { join } from 'upath';

function clean() {
  const paths = ['dist', 'docs'].map((str) => join(__dirname, str)).filter((path) => existsSync(path));
  return Bluebird.all(paths).each((str) => {
    rmSync(str, { recursive: true, force: true });
  });
}

function build(done: CallableFunction) {
  const exclude = ['!**/node_modules/**', '!**/.git**', '!**/.github/**', '!**.gitmodules**', '!**/tmp'];

  return (
    Bluebird.all(exclude)
      .then(() => {
        console.log('copy sitemaps xml/xsl to dist');
        return gulp.src('./src/**/*.{xml,xsl}').pipe(gulp.dest('./dist/src'));
      })
      // .then(() => {
      //   console.log('copy package to dist');
      //   return gulp
      //     .src(['./package/**/*'].concat(exclude), {
      //       base: '.'
      //       //  dot: true
      //     })
      //     .pipe(gulp.dest('./dist'));
      // })
      .then(() => {
        console.log('copy dist to master build');
        return gulp.src(['./dist/**/*'].concat(exclude)).pipe(gulp.dest('./docs/dist'));
      })
      .then(() => {
        console.log('copy main js to master build');
        return gulp.src(['./index.*', './package.json']).pipe(gulp.dest('./docs'));
      })
      .then(() => {
        console.log('build readme master build');
        return gulp.src(['./readme.md', './CHANGELOG.md']).pipe(concat('readme.md')).pipe(gulp.dest('./docs'));
      })
      .then(() => {
        console.log('copy source to master build');
        gulp
          .src(['./*.json', './src/**/*', './package/**/*', './source/**/*'].concat(exclude), {
            base: '.'
            // dot: true
          })
          .pipe(gulp.dest('./docs'));
        return done();
      })
  );
}

gulp.task('git', () => {
  execSync('git');
});

gulp.task('default', build);
gulp.task('clean', clean);
