const path = require('upath');
const fs = require('fs');
const yaml = require('yaml');
const { spawnSync } = require('cross-spawn');

const targetDir = path.resolve(__dirname, 'tmp/site');
const workspaceDir = path.toUnix(__dirname);
const repoUrl = 'https://github.com/hexojs/hexo-starter.git';
module.exports.repoUrl = repoUrl;
module.exports.targetDir = targetDir;
module.exports.workspaceDir = workspaceDir;

if (!fs.existsSync(path.join(targetDir, '.git'))) {
  spawnSync('git', ['clone', repoUrl, targetDir], {
    stdio: 'inherit'
  });
} else {
  console.log('ℹ️\tTarget directory already exists and is a git repo. Skipping clone.');
}

const sourceDir = path.join(targetDir, 'source');
if (!fs.existsSync(path.join(sourceDir, '_posts/.git'))) {
  if (path.join(sourceDir, '_posts')) {
    fs.rmSync(path.join(sourceDir, '_posts'), { recursive: true, force: true });
  }
  console.log('📦\tCloning sample posts into source/_posts...');
  spawnSync('git', [
    'clone',
    'https://github.com/frontendweb3/Demo-markdown-posts.git',
    path.join(sourceDir, '_posts')
  ]);
  // Remove unnecessary files
  const filesToRemoveRegex = [/^readme\.md$/i, /^license$/i, /^contributing\.md$/i, /^code_of_conduct\.md$/i];
  const postsDir = path.join(sourceDir, '_posts');
  if (fs.existsSync(postsDir)) {
    fs.readdirSync(postsDir).forEach((file) => {
      if (filesToRemoveRegex.some((regex) => regex.test(file))) {
        const filePath = path.join(postsDir, file);
        console.log(`🗑️\tRemoving ${file}...`);
        fs.unlinkSync(filePath);
      }
    });
  }
} else {
  console.log('ℹ️\tSample posts already exist in source/_posts. Skipping clone.');
}

const themeDir = path.join(targetDir, 'themes', 'light');
if (!fs.existsSync(themeDir) || !fs.existsSync(path.join(themeDir, '.git'))) {
  console.log('📦\tCloning hexo-theme-light into themes/light...');
  spawnSync('git', ['clone', '--depth', '1', 'https://github.com/hexojs/hexo-theme-light', themeDir]);
} else {
  console.log('ℹ️\tTheme "light" already exists. Skipping clone.');
}

const themeLightNodeModules = path.join(targetDir, 'node_modules/hexo-theme-light');
if (!fs.existsSync(themeLightNodeModules)) {
  console.log('📦\tInstalling hexo-theme-light...');
  spawnSync('npm', ['install', 'hexo-theme-light@file:./themes/light', 'nib', 'stylus'], {
    cwd: targetDir
  });
} else {
  console.log('ℹ️\thexo-theme-light already installed. Skipping install.');
}

const configPath = path.join(targetDir, '_config.yml');
console.log(`✏️\tModifying ${configPath}...`);
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

// Build workspace
console.log('🔨\tBuilding hexo-seo workspace...');
spawnSync('npm', ['run', 'build'], {
  cwd: __dirname,
  stdio: 'ignore'
});
console.log('🔨\tPacking hexo-seo workspace...');
spawnSync('npm', ['run', 'pack'], {
  cwd: __dirname,
  stdio: 'ignore'
});

// Install workspace tarball to target directory
console.log('📦\tInstalling hexo-seo from tarball...');
const tarballPath = path.resolve(__dirname, 'release/hexo-seo.tgz');
spawnSync('npm', ['install', `hexo-seo@file:${tarballPath}`], {
  cwd: targetDir,
  stdio: 'ignore'
});
