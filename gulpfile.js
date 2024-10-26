const Bluebird = require('bluebird');
const { execSync } = require('child_process');
const { existsSync, rmSync } = require('fs-extra');
const gulp = require('gulp');
const { join } = require('upath');

/**
 * Cleans up the directories 'dist' and 'docs'.
 * @returns {Promise<void[]>} A promise that resolves when all paths are cleaned.
 */
function clean() {
  const paths = ['dist', 'docs'].map((str) => join(__dirname, str)).filter((path) => existsSync(path));
  return Bluebird.all(paths).each((str) => {
    rmSync(str, { recursive: true, force: true });
  });
}

/**
 * Builds the project by copying files and preparing distribution.
 * @param {Function} _done A callback function to indicate the task is done.
 * @returns {Promise<void>} A promise that resolves when the build process is complete.
 */
function build(_done) {
  const exclude = ['!**/node_modules/**', '!**/.git**', '!**/.github/**', '!**.gitmodules**', '!**/tmp'];

  return Bluebird.all(exclude).then(() => {
    console.log('copy sitemaps xml/xsl to dist');
    return gulp.src('./src/sitemap/**/*.{xml,xsl}').pipe(gulp.dest('./dist'));
  });
}

gulp.task('git', () => {
  execSync('git');
});

gulp.task('default', build);
gulp.task('clean', clean);
