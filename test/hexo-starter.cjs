const path = require('path');
const fs = require('fs');
const { runCommand } = require('./utils.cjs');
const yaml = require('yaml');

(async () => {
  const repoUrl = 'https://github.com/hexojs/hexo-starter.git';
  const targetDir = path.join(__dirname, '..', 'tmp', 'site');
  const currentWorkspace = process.cwd();

  try {
    // Clone only if not already cloned
    if (!fs.existsSync(targetDir)) {
      console.log('📦\tCloning repository...');
      await runCommand('git', ['clone', repoUrl, targetDir]);
      console.log('✅\tRepository cloned successfully.');
    } else {
      console.log('ℹ️\tTarget directory already exists. Skipping clone.');
    }

    // Build current workspace
    console.log('🛠️\tBuilding current workspace...');
    await runCommand('npm', ['run', 'build'], {
      cwd: currentWorkspace
    });
    console.log('✅\tWorkspace built successfully.');

    // Install workspace package into the cloned repo
    console.log('📦\tInstalling local workspace into target site...');
    await runCommand('npm', ['install', currentWorkspace], {
      cwd: targetDir
    });
    console.log('✅\tWorkspace package installed.');

    // Delete source folder in the cloned site
    const sourceDir = path.join(targetDir, 'source');
    if (fs.existsSync(sourceDir)) {
      console.log('🗑️\tDeleting existing source folder...');
      fs.rmSync(sourceDir, { recursive: true, force: true });
      console.log('✅\tSource folder deleted.');
    } else {
      console.log('ℹ️\tNo source folder found to delete.');
    }

    // Modify _config.yml in the cloned site
    const configPath = path.join(targetDir, '_config.yml');
    if (fs.existsSync(configPath)) {
      console.log('✏️\tModifying _config.yml...');
      const configContent = fs.readFileSync(configPath, 'utf8');
      let config = yaml.parse(configContent);

      config.title = 'Hexo SEO Test Site';
      config.description = 'A test site for Hexo SEO plugin';
      config.seo = {
        html: {
          enable: true,
          fix: true,
          exclude: ['*.min.{htm,html}']
        },
        css: {
          enable: true,
          exclude: ['**/*.min.css']
        },
        js: {
          enable: true,
          concat: false,
          exclude: ['**/*.min.js'],
          options: {
            compress: {
              dead_code: true
            },
            mangle: {
              toplevel: true,
              safari10: true
            }
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
        sitemap: {
          yoast: true,
          gnews: true
        },
        search: {
          type: ['page', 'post']
        },
        feed: {
          type: ['page', 'post'],
          icon: 'https://w7.pngwing.com/pngs/745/306/png-transparent-gallery-image-images-photo-picture-pictures-set-app-incredibles-icon-thumbnail.png'
        }
      };

      const modifiedContent = yaml.stringify(config);
      fs.writeFileSync(configPath, modifiedContent, 'utf8');
      console.log('✅\t_config.yml modified successfully.');
    } else {
      console.error('❌\t_config.yml not found in the cloned site.');
      process.exit(1);
    }

    // Run `hexo generate` in the cloned site
    console.log('⚙️\tGenerating static site with Hexo...');
    await runCommand('npx', ['hexo', 'generate'], {
      cwd: targetDir
    });
    console.log('✅\tSite generated.');
  } catch (err) {
    console.error('❌\tError:', err.message);
    process.exit(1);
  }
})();
