const path = require('upath');
const fs = require('fs');
const yaml = require('yaml');
const { spawnSync } = require('cross-spawn');
const { checksum } = require('./src/utils/file-checksum.cjs');

function runCmd(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (result.error) {
    console.error(`❌\tError running ${cmd} ${args.join(' ')}:`, result.error);
  }
  return result;
}

function log(...args) {
  console.log(...args);
}

const srcDir = path.resolve(__dirname, 'src');
const currentChecksum = checksum({ patterns: [srcDir, path.resolve(__dirname, 'package.json')] });
log(`🔑\tChecksum for src: ${currentChecksum}`);
const checksumFile = path.resolve(__dirname, 'tmp/.src-checksum');
let prevChecksum = null;
if (fs.existsSync(checksumFile)) {
  prevChecksum = fs.readFileSync(checksumFile, 'utf8').trim();
  log(prevChecksum === currentChecksum ? '✅\tSource checksum unchanged.' : '⚠️\tSource checksum changed.');
} else {
  log('ℹ️\tNo previous checksum found.');
}

const targetDir = path.resolve(__dirname, 'tmp/site');
const workspaceDir = path.toUnix(__dirname);
const repoUrl = 'https://github.com/dimaslanjaka/site.git';
module.exports = { repoUrl, targetDir, workspaceDir };

const targetGitDir = path.join(targetDir, '.git');
if (!fs.existsSync(targetGitDir)) {
  log(`📦\tCloning repo into ${targetDir}...`);
  runCmd('git', ['clone', '-b', 'hexo-seo', repoUrl, targetDir]);
} else {
  log('🔄\tPulling latest changes...');
  const pull = runCmd('git', ['pull'], { cwd: targetDir });
  if (pull.error) {
    log('❌\tFailed to pull latest changes, resetting to HEAD...');
    runCmd('git', ['reset', '--hard', 'HEAD'], { cwd: targetDir });
  }
}

const configPath = path.join(targetDir, '_config.yml');
log(`✏️\tModifying ${configPath}...`);
let config = {};
if (fs.existsSync(configPath)) {
  config = yaml.parse(fs.readFileSync(configPath, 'utf8'));
}
Object.assign(config, {
  title: 'Hexo SEO Test Site',
  description: 'A test site for Hexo SEO plugin',
  permalink: ':title.html',
  seo: {
    html: { enable: true, fix: true, exclude: ['*.min.{htm,html}'] },
    css: { enable: true, exclude: ['**/*.min.css'] },
    js: {
      enable: true,
      concat: false,
      exclude: ['**/*.min.js'],
      options: {
        compress: { dead_code: true },
        mangle: { toplevel: true, safari10: true }
      }
    },
    schema: {
      article: { enable: true },
      breadcrumb: { enable: true },
      sitelink: {
        enable: true,
        searchUrl: 'https://www.webmanajemen.com/search?q={search_term_string}'
      },
      homepage: { enable: true }
    },
    img: {
      enable: true,
      broken: false,
      default: 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg',
      onerror: 'serverside'
    },
    links: {
      enable: true,
      exclude: ['webmanajemen.com', 'web-manajemen.blogspot.com']
    },
    sitemap: { yoast: true, gnews: true, txt: true },
    search: { type: ['page', 'post'] },
    feed: {
      type: ['page', 'post'],
      icon: 'https://w7.pngwing.com/pngs/745/306/png-transparent-gallery-image-images-photo-picture-pictures-set-app-incredibles-icon-thumbnail.png'
    }
  }
});
fs.writeFileSync(configPath, yaml.stringify(config), 'utf8');

if (currentChecksum !== prevChecksum) {
  log('🔨\tBuilding hexo-seo workspace...');
  runCmd('yarn', ['run', 'build'], { cwd: __dirname, stdio: 'ignore' });
  log('🔨\tPacking hexo-seo workspace...');
  runCmd('yarn', ['run', 'pack'], { cwd: __dirname, stdio: 'ignore' });
} else {
  log('ℹ️\tSkipping build and pack due to unchanged source checksum.');
}

// Install workspace tarball to target directory
const packageJsonPath = path.join(targetDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const needsInstall =
  currentChecksum !== prevChecksum ||
  !packageJson.dependencies['hexo-seo'] ||
  !packageJson.dependencies['hexo-seo'].includes('file:');
if (needsInstall) {
  log('📦\tInstalling hexo-seo from tarball...');
  const yarnLockPath = path.join(targetDir, 'yarn.lock');
  if (!fs.existsSync(yarnLockPath)) {
    fs.writeFileSync(yarnLockPath, '', 'utf8');
    log('ℹ️\tCreated empty yarn.lock in target directory.');
  }
  const tarballPath = path.resolve(__dirname, 'release/hexo-seo.tgz');
  runCmd('yarn', ['add', `hexo-seo@file:${tarballPath}`], {
    cwd: targetDir,
    stdio: 'ignore'
  });
} else {
  log('ℹ️\tSkipping installation of hexo-seo tarball due to unchanged source checksum.');
}

if (currentChecksum !== prevChecksum) {
  fs.writeFileSync(checksumFile, currentChecksum, 'utf8');
  log('✅\tNew checksum saved.');
}
