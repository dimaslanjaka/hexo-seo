const path = require('upath');
const fs = require('fs');
const yaml = require('yaml');
const { spawnSync } = require('cross-spawn');
const crypto = require('crypto');

function runCmd(cmd, args, opts = {}) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', ...opts });
  if (result.error) {
    console.error(`❌\tError running ${cmd} ${args.join(' ')}:`, result.error);
  }
  return result;
}

function folderChecksum(dir) {
  const files = [];
  function walk(current) {
    for (const file of fs.readdirSync(current)) {
      const fullPath = path.join(current, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        files.push(fullPath);
      }
    }
  }
  walk(dir);
  files.sort();
  const hash = crypto.createHash('sha256');
  for (const file of files) {
    hash.update(file.replace(dir, ''));
    hash.update(fs.readFileSync(file));
  }
  return hash.digest('hex');
}

function log(...args) {
  console.log(...args);
}

const srcDir = path.resolve(__dirname, 'src');
const checksum = folderChecksum(srcDir);
log(`🔑\tChecksum for src: ${checksum}`);
const checksumFile = path.resolve(__dirname, 'tmp/.src-checksum');
let prevChecksum = null;
if (fs.existsSync(checksumFile)) {
  prevChecksum = fs.readFileSync(checksumFile, 'utf8').trim();
  if (prevChecksum === checksum) {
    log('✅\tSource checksum unchanged.');
  } else {
    log('⚠️\tSource checksum changed.');
  }
} else {
  log('ℹ️\tNo previous checksum found.');
}

const targetDir = path.resolve(__dirname, 'tmp/site');
const workspaceDir = path.toUnix(__dirname);
const repoUrl = 'https://github.com/dimaslanjaka/site.git';
module.exports.repoUrl = repoUrl;
module.exports.targetDir = targetDir;
module.exports.workspaceDir = workspaceDir;

const targetGitDir = path.join(targetDir, '.git');
if (!fs.existsSync(targetGitDir)) {
  log(`📦\tCloning repo into ${targetDir}...`);
  runCmd('git', ['clone', '-b', 'hexo-seo', repoUrl, targetDir]);
} else {
  log('🔄\tPulling latest changes...');
  runCmd('git', ['pull'], { cwd: targetDir });
}

let themeShouldInstall = false;
const themeDir = path.join(targetDir, 'themes', 'light');
const themeGitDir = path.join(themeDir, '.git');
if (!fs.existsSync(themeDir) || !fs.existsSync(themeGitDir)) {
  log('📦\tCloning hexo-theme-light into themes/light...');
  runCmd('git', ['clone', '--depth', '1', 'https://github.com/hexojs/hexo-theme-light', themeDir]);
  themeShouldInstall = true;
} else {
  log('ℹ️\tTheme "light" already exists. Skipping clone.');
}

if (checksum !== prevChecksum || themeShouldInstall) {
  const themeLightNodeModules = path.join(targetDir, 'node_modules/hexo-theme-light');
  if (!fs.existsSync(themeLightNodeModules)) {
    log('📦\tInstalling hexo-theme-light...');
    runCmd('npm', ['install', 'hexo-theme-light@file:./themes/light', 'nib', 'stylus'], {
      cwd: targetDir
    });
  } else {
    log('ℹ️\thexo-theme-light already installed. Skipping install.');
  }
} else {
  log('ℹ️\tSkipping theme installation due to unchanged source checksum.');
}

const configPath = path.join(targetDir, '_config.yml');
log(`✏️\tModifying ${configPath}...`);
let config = {};
if (fs.existsSync(configPath)) {
  const configContent = fs.readFileSync(configPath, 'utf8');
  config = yaml.parse(configContent);
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
  },
  theme: 'light'
});
fs.writeFileSync(configPath, yaml.stringify(config), 'utf8');

if (checksum !== prevChecksum) {
  // Build workspace
  log('🔨\tBuilding hexo-seo workspace...');
  runCmd('npm', ['run', 'build'], { cwd: __dirname, stdio: 'ignore' });
  log('🔨\tPacking hexo-seo workspace...');
  runCmd('npm', ['run', 'pack'], { cwd: __dirname, stdio: 'ignore' });
} else {
  log('ℹ️\tSkipping build and pack due to unchanged source checksum.');
}

// Install workspace tarball to target directory
log('📦\tInstalling hexo-seo from tarball...');
const tarballPath = path.resolve(__dirname, 'release/hexo-seo.tgz');
runCmd('npm', ['install', `hexo-seo@file:${tarballPath}`], {
  cwd: targetDir,
  stdio: 'ignore'
});

// Save the current checksum
if (checksum !== prevChecksum) {
  fs.writeFileSync(checksumFile, checksum, 'utf8');
  log('✅\tNew checksum saved.');
}
