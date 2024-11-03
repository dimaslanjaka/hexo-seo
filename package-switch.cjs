const fs = require('fs');
const pkg = require('./package.json');
const path = require('path');
const axios = require('axios').default;
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
  'google-news-sitemap': 'file:../google-news-sitemap/release/google-news-sitemap.tgz',
  'hexo-is': 'file:../hexo-is/release/hexo-is.tgz'
};

const production = {
  'binary-collections': 'https://github.com/dimaslanjaka/bin/raw/fcd1121/releases/bin.tgz',
  '@types/hexo': 'https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo.tgz',
  hexo: 'https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo.tgz',
  'hexo-asset-link': 'https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-asset-link.tgz',
  'hexo-cli': 'https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-cli.tgz',
  'hexo-front-matter': 'https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-front-matter.tgz',
  'hexo-log': 'https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-log.tgz',
  'hexo-util': 'https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-util.tgz',
  'hexo-server': 'https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-server.tgz',
  warehouse: 'https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/warehouse.tgz',
  'hexo-seo': 'https://github.com/dimaslanjaka/hexo-seo/raw/pre-release/release/hexo-seo.tgz',
  'hexo-is': 'https://github.com/dimaslanjaka/hexo-is/raw/master/release/hexo-is.tgz',
  'markdown-it': 'https://github.com/dimaslanjaka/markdown-it/raw/17ccc82/release/markdown-it.tgz',
  'hexo-renderers': 'https://github.com/dimaslanjaka/hexo-renderers/raw/3f727de/release/hexo-renderers.tgz',
  'hexo-shortcodes': 'https://github.com/dimaslanjaka/hexo-shortcodes/raw/f70a1c0/release/hexo-shortcodes.tgz',
  'static-blog-generator':
    'https://github.com/dimaslanjaka/static-blog-generator/raw/master/packages/static-blog-generator/release/static-blog-generator.tgz',
  'instant-indexing':
    'https://github.com/dimaslanjaka/static-blog-generator/raw/master/packages/instant-indexing/release/instant-indexing.tgz',
  'sbg-utility':
    'https://github.com/dimaslanjaka/static-blog-generator/raw/sbg-utility/packages/sbg-utility/release/sbg-utility.tgz',
  'sbg-api': 'https://github.com/dimaslanjaka/static-blog-generator/raw/sbg-api/packages/sbg-api/release/sbg-api.tgz',
  'sbg-cli': 'https://github.com/dimaslanjaka/static-blog-generator/raw/master/packages/sbg-cli/release/sbg-cli.tgz',
  'sbg-server':
    'https://github.com/dimaslanjaka/static-blog-generator/raw/master/packages/sbg-server/release/sbg-server.tgz',
  'nodejs-package-types':
    'https://github.com/dimaslanjaka/nodejs-package-types/raw/a2e797bc27975cba20ef4c87547841e6341bfcf4/release/nodejs-package-types.tgz',
  'hexo-post-parser': 'https://github.com/dimaslanjaka/hexo-post-parser/raw/pre-release/release/hexo-post-parser.tgz',
  'cross-spawn': 'https://github.com/dimaslanjaka/node-cross-spawn/raw/private/release/cross-spawn.tgz',
  'git-command-helper':
    'https://github.com/dimaslanjaka/git-command-helper/raw/pre-release/release/git-command-helper.tgz',
  '@types/git-command-helper':
    'https://github.com/dimaslanjaka/git-command-helper/raw/pre-release/release/git-command-helper.tgz',
  'hexo-generator-redirect':
    'https://github.com/dimaslanjaka/hexo-generator-redirect/raw/0885394/release/hexo-generator-redirect.tgz'
};

/**
 * Fetches the latest commit from a specified GitHub repository and branch.
 *
 * @param {string} repoOwner - The owner of the repository.
 * @param {string} repoName - The name of the repository.
 * @param {string|null|undefined} [branch] - The branch to fetch the latest commit from (default is 'pre-release').
 * @returns {Promise<Record<string, any>|null>} - The latest commit object or null if an error occurs.
 */
async function getLatestCommit(repoOwner, repoName, branch = '') {
  const githubToken = process.env.ACCESS_TOKEN || process.env.GH_TOKEN;
  let url;
  if (typeof branch === 'string' && branch.length > 0) {
    url = `https://api.github.com/repos/${repoOwner}/${repoName}/commits/${branch}`;
  } else {
    url = `https://api.github.com/repos/${repoOwner}/${repoName}/commits`;
  }

  try {
    /**
     * @type {import("axios").AxiosResponse<any, any>}
     */
    let response;
    if (githubToken) {
      response = await axios.get(url, {
        headers: {
          Authorization: `token ${githubToken}`,
          Accept: 'application/vnd.github.v3+json'
        }
      });
    } else {
      response = await axios.get(url);
    }
    const latestCommit = response.data; // The latest commit for the specified branch
    if (!Array.isArray(latestCommit)) {
      return latestCommit;
    } else {
      return latestCommit[0];
    }
  } catch (error) {
    // retry fetch default branch
    // if (branch === "pre-release") return getLatestCommit(repoOwner, repoName, null);
    console.error('Error fetching the latest commit:', repoOwner, repoName, branch, error.message);
    return null;
  }
}

/**
 * Fetches the latest commit SHA and updates the production URL for the specified repository.
 * @param {string} repoOwner - The owner of the repository.
 * @param {string} repoName - The name of the repository.
 * @param {string} branch - The branch to fetch from.
 * @param {string} packageName - The name of the package in production.
 * @param {string} urlFormat - Custom URL format for the .tgz file.
 */
async function updatePackageSha(repoOwner, repoName, branch, packageName, urlFormat) {
  try {
    const { sha } = (await getLatestCommit(repoOwner, repoName, branch)) || {};
    if (sha) {
      const url = urlFormat.replace('{sha}', sha);

      const res = await axios.get(url, { maxRedirects: 10 });
      if (res.status === 200) {
        if (res.headers['content-type'] === 'application/octet-stream') {
          production[packageName] = url;
        } else {
          throw new Error(
            `Error updating package SHA for ${packageName}: Unexpected content-type "${res.headers['content-type']}" at ${url}`
          );
        }
      }
    }
  } catch (error) {
    const errorUrl = error.config?.url;
    const message = error.response?.data?.message || error.message;
    throw new Error(`Error updating package SHA for ${packageName}:`, message, errorUrl);
  }
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('local')) {
    pkg.resolutions = Object.assign(production, local);
    pkg.overrides = Object.assign(production, local);
  } else {
    // Update specific packages with their latest commit SHA
    await updatePackageSha(
      'dimaslanjaka',
      'hexo-post-parser',
      'pre-release',
      'hexo-post-parser',
      'https://github.com/dimaslanjaka/hexo-post-parser/raw/{sha}/release/hexo-post-parser.tgz'
    );
    await updatePackageSha(
      'dimaslanjaka',
      'markdown-it',
      'master',
      'markdown-it',
      'https://github.com/dimaslanjaka/markdown-it/raw/{sha}/release/markdown-it.tgz'
    );
    await updatePackageSha(
      'dimaslanjaka',
      'hexo-is',
      'master',
      'hexo-is',
      'https://github.com/dimaslanjaka/hexo-is/raw/{sha}/release/hexo-is.tgz'
    );
    await updatePackageSha(
      'dimaslanjaka',
      'hexo-seo',
      'pre-release',
      'hexo-seo',
      'https://github.com/dimaslanjaka/hexo-seo/raw/{sha}/release/hexo-seo.tgz'
    );
    await updatePackageSha(
      'dimaslanjaka',
      'hexo-adsense',
      'master',
      'hexo-adsense',
      'https://github.com/dimaslanjaka/hexo-adsense/raw/{sha}/release/hexo-adsense.tgz'
    );
    await updatePackageSha(
      'dimaslanjaka',
      'hexo-renderers',
      'pre-release',
      'hexo-renderers',
      'https://github.com/dimaslanjaka/hexo-renderers/raw/{sha}/release/hexo-renderers.tgz'
    );
    await updatePackageSha(
      'dimaslanjaka',
      'static-blog-generator',
      'sbg-api',
      'sbg-api',
      'https://github.com/dimaslanjaka/static-blog-generator/raw/{sha}/packages/sbg-api/release/sbg-api.tgz'
    );
    await updatePackageSha(
      'dimaslanjaka',
      'static-blog-generator',
      'sbg-utility',
      'sbg-utility',
      'https://github.com/dimaslanjaka/static-blog-generator/raw/{sha}/packages/sbg-utility/release/sbg-utility.tgz'
    );
    await updatePackageSha(
      'dimaslanjaka',
      'static-blog-generator',
      'master',
      'sbg-cli',
      'https://github.com/dimaslanjaka/static-blog-generator/raw/{sha}/packages/sbg-cli/release/sbg-cli.tgz'
    );

    const hexoFamily = ['hexo', 'hexo-util', 'warehouse', 'hexo-server', 'hexo-log', 'hexo-front-matter', 'hexo-cli'];
    const hexoFamilyMap = hexoFamily.map((pkgName) => {
      return updatePackageSha(
        'dimaslanjaka',
        'hexo',
        'monorepo-v7',
        pkgName,
        `https://github.com/dimaslanjaka/hexo/raw/{sha}/releases/${pkgName}.tgz`
      );
    });
    await Promise.all(hexoFamilyMap);

    pkg.resolutions = production;
    // npm overrides sometimes give you error installation
    // pkg.overrides = production;
  }

  // Sort by keys
  if (pkg.dependencies) {
    pkg.dependencies = Object.fromEntries(Object.entries(pkg.dependencies).sort());
    if (pkg.dependencies[pkg.name]) delete pkg.dependencies[pkg.name];
    if (pkg.dependencies[`@types/${pkg.name}`]) delete pkg.dependencies[`@types/${pkg.name}`];
  }
  if (pkg.devDependencies) {
    pkg.devDependencies = Object.fromEntries(Object.entries(pkg.devDependencies).sort());
    if (pkg.devDependencies[pkg.name]) delete pkg.devDependencies[pkg.name];
    if (pkg.devDependencies[`@types/${pkg.name}`]) delete pkg.devDependencies[`@types/${pkg.name}`];
  }
  if (pkg.resolutions) {
    pkg.resolutions = Object.fromEntries(Object.entries(pkg.resolutions).sort());
    if (pkg.resolutions[pkg.name]) delete pkg.resolutions[pkg.name];
    if (pkg.resolutions[`@types/${pkg.name}`]) delete pkg.resolutions[`@types/${pkg.name}`];
  }
  if (pkg.overrides) {
    pkg.overrides = Object.fromEntries(Object.entries(pkg.overrides).sort());
    if (pkg.overrides[pkg.name]) delete pkg.overrides[pkg.name];
    if (pkg.overrides[`@types/${pkg.name}`]) delete pkg.overrides[`@types/${pkg.name}`];
  }

  fs.writeFileSync(path.join(__dirname, 'package.json'), JSON.stringify(pkg, null, 2) + '\n');
}

main();
