const Bluebird = require('bluebird');
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
 * copy and process files using gulp
 * @param {string|string[]} src
 * @param {string} dest
 * @param {Parameters<typeof gulp['src']>[1]} options
 * @returns {Promise<void>}
 */
async function gulpCopyAsync(src, dest, options) {
  return new Promise((resolve, reject) => {
    gulp.src(src, options).pipe(gulp.dest(dest)).on('end', resolve).on('error', reject);
  });
}

/**
 * Builds the project by copying files and preparing distribution.
 * @param {Function} _done A callback function to indicate the task is done.
 * @returns {Promise<void>} A promise that resolves when the build process is complete.
 */
async function build(_done) {
  const ignore = ['**/node_modules/**', '**/.git**', '**/.github/**', '**.gitmodules**', '**/tmp/**'];
  console.log('copy sitemaps xml/xsl to dist');
  await gulpCopyAsync('./src/sitemap/**/*.{xml,xsl}', './dist', { ignore });
  console.log('copy feed/atom xml to dist');
  await gulpCopyAsync('./src/feeds/**/*.{xml,xsl}', './dist', { ignore });
}

gulp.task('default', build);
gulp.task('clean', clean);
