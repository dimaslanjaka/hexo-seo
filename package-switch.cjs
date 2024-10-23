const fs = require('fs');
const pkg = require('./package.json');
const path = require('path');

try {
  require.resolve('dotenv'); // Check if dotenv is installed
  require('dotenv').config({ override: true }); // Load environment variables if installed
  console.log('dotenv loaded successfully');
} catch (_e) {
  console.log('dotenv is not installed, skipping loading .env file');
}

// node package-switch.cjs [local|production]

const local = {
  'sbg-api': 'file:../sbg-api/packages/sbg-api/release/sbg-api.tgz',
  'sbg-utility': 'file:../sbg-utility/packages/sbg-utility/release/sbg-utility.tgz',
  'sbg-server': 'file:../static-blog-generator/packages/sbg-server/release/sbg-server.tgz',
  'sbg-cli': 'file:../static-blog-generator/packages/sbg-cli/release/sbg-cli.tgz',
  'hexo-asset-link': 'file:../hexo/releases/hexo-asset-link.tgz',
  hexo: 'file:../hexo/releases/hexo.tgz',
  'hexo-cli': 'file:../hexo/releases/hexo-cli.tgz',
  'hexo-server': 'file:../hexo/releases/hexo-server.tgz',
  'hexo-front-matter': 'file:../hexo/releases/hexo-front-matter.tgz',
  'hexo-log': 'file:../hexo/releases/hexo-log.tgz',
  'hexo-util': 'file:../hexo/releases/hexo-util.tgz',
  warehouse: 'file:../hexo/releases/warehouse.tgz',
  'hexo-post-parser': 'file:../hexo-post-parser/release/hexo-post-parser.tgz',
  'git-command-helper': 'file:../git-command-helper/release/git-command-helper.tgz',
  'markdown-it': 'file:../markdown-it/release/markdown-it.tgz',
  'hexo-renderers': 'file:../hexo-renderers/release/hexo-renderers.tgz',
  'hexo-shortcodes': 'file:../hexo-shortcodes/release/hexo-shortcodes.tgz',
  'hexo-seo': 'file:../hexo-seo/release/hexo-seo.tgz',
  'google-news-sitemap': 'file:../google-news-sitemap/release/google-news-sitemap.tgz'
};

if (local[pkg.name]) delete local[pkg.name];
if (local[`@types/${pkg.name}`]) delete local[`@types/${pkg.name}`];

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('local')) {
    pkg.resolutions = local;
    pkg.resolutions = Object.fromEntries(
      Object.entries(pkg.resolutions).sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );
  } else if (pkg.resolutions) {
    delete pkg.resolutions;
  }

  fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
}

main();
