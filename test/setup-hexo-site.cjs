const path = require('path');
const fs = require('fs');
const yaml = require('yaml');
const { runCommand } = require('./utils.cjs');

/**
 * Sets up a Hexo test site for plugin development and testing.
 *
 * Steps performed:
 * 1. Clones a Hexo starter repository (if not already present).
 * 2. Builds the current workspace (plugin project).
 * 3. Installs the local workspace as a dependency in the test site.
 * 4. Deletes the default 'source' folder in the test site.
 * 5. Modifies the test site's _config.yml with SEO and plugin options.
 * 6. (Optional) Cleans Hexo cache and generates the static site.
 *
 * @async
 * @function setupHexoSite
 * @param {Object} [options] - Configuration options
 * @param {string} [options.repoUrl] - Git repository URL to clone (default: 'https://github.com/hexojs/hexo-starter.git')
 * @param {string} [options.targetDir] - Directory to clone repo into (default: '../tmp/site')
 * @param {string} [options.workspaceDir] - Directory of the current project (default: '../')
 * @param {import('child_process').SpawnOptions} [options.spawnOptions] - Options for process spawning
 * @returns {Promise<{repoUrl: string, targetDir: string, workspaceDir: string}>} - Paths used for setup
 */
async function setupHexoSite({
  repoUrl = 'https://github.com/hexojs/hexo-starter.git',
  targetDir = path.resolve(__dirname, '../tmp/site'),
  workspaceDir = path.join(__dirname, '../'),
  spawnOptions = {}
} = {}) {
  try {
    if (!fs.existsSync(targetDir)) {
      console.log('📦\tCloning repository...');
      await runCommand('git', ['clone', repoUrl, targetDir]);
    } else {
      console.log('ℹ️\tTarget directory already exists. Skipping clone.');
    }

    console.log('🛠️\tBuilding current workspace...');
    await runCommand('npm', ['run', 'build'], { cwd: workspaceDir, ...spawnOptions });

    console.log(`📦\tInstalling local workspace (hexo-seo@${workspaceDir}) into target site...`);
    await runCommand('npm', ['install', `hexo-seo@${workspaceDir}`], { cwd: targetDir, ...spawnOptions });

    const sourceDir = path.join(targetDir, 'source');
    if (fs.existsSync(sourceDir)) {
      console.log('🗑️\tDeleting existing source folder...');
      fs.rmSync(sourceDir, { recursive: true, force: true });
    }

    // Populate the source directory with a sample post
    if (!fs.existsSync(path.join(sourceDir, '_posts/.git'))) {
      if (path.join(sourceDir, '_posts')) {
        fs.rmSync(path.join(sourceDir, '_posts'), { recursive: true, force: true });
      }
      console.log('📦\tCloning sample posts into source/_posts...');
      await runCommand('git', [
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
    }

    const configPath = path.join(targetDir, '_config.yml');
    if (!fs.existsSync(configPath)) {
      throw new Error('_config.yml not found in the cloned site.');
    }

    console.log('✏️\tModifying _config.yml...');
    const config = yaml.parse(fs.readFileSync(configPath, 'utf8'));
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
        sitemap: { yoast: true, gnews: true },
        search: { type: ['page', 'post'] },
        feed: {
          type: ['page', 'post'],
          icon: 'https://w7.pngwing.com/pngs/745/306/png-transparent-gallery-image-images-photo-picture-pictures-set-app-incredibles-icon-thumbnail.png'
        }
      }
    });

    fs.writeFileSync(configPath, yaml.stringify(config), 'utf8');

    // console.log('🧹\tCleaning Hexo cache and files...');
    // await runCommand('npx', ['hexo', 'clean'], { cwd: targetDir });

    // console.log('⚙️\tGenerating static site with Hexo...');
    // await runCommand('npx', ['hexo', 'generate'], { cwd: targetDir });

    // console.log('✅\tSite generated.');
  } catch (err) {
    console.error('❌\tError:', err.message);
    process.exit(1);
  }
  return { repoUrl, targetDir, workspaceDir };
}

// If called directly from CLI
if (require.main === module) {
  setupHexoSite();
}

module.exports = { setupHexoSite };
