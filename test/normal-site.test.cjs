const fs = require('fs');
const path = require('upath');
const { runCommand, generateMarkdownPost } = require('./utils.cjs');
const { setupHexoSite } = require('./setup-hexo-site.cjs');
const { spawnAsync } = require('cross-spawn');
const sbgUtil = require('sbg-utility');
const yaml = require('yaml');
const { deepMerge } = require('hexo-util');

describe('Hexo Clean', () => {
  /** @type {Awaited<ReturnType<typeof setupHexoSite>>} */
  let hexoSite;
  let consoleSpy;

  /**
   * Helper to modify Hexo config YAML file
   * @param {object} obj - Object to deep merge into config
   */
  function modifyConfig(obj) {
    if (!hexoSite || !hexoSite.targetDir) throw new Error('Hexo site directory not available');
    const configPath = path.join(hexoSite.targetDir, '_config.yml');
    const config = yaml.parse(fs.readFileSync(configPath, 'utf8'));
    const modified = deepMerge(config, obj);
    fs.writeFileSync(configPath, yaml.stringify(modified), 'utf8');
  }

  beforeAll(async () => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    hexoSite = await setupHexoSite();
    modifyConfig({
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
  }, 120000);

  test('should generate a post file', async () => {
    const postPath = path.join(hexoSite.targetDir, 'source/_posts/hello-world.md');
    const { content } = generateMarkdownPost({
      title: 'Hello world',
      date: '2024-05-10T00:00:00+07:00',
      tags: ['sample'],
      categories: ['sample'],
      body: 'This is body'
    });
    sbgUtil.writefile(postPath, content);
    expect(fs.existsSync(postPath)).toBe(true);
    const fileContent = fs.readFileSync(postPath, 'utf8');
    expect(fileContent.trim().length).toBeGreaterThan(0);
    expect(consoleSpy).not.toBeNull();
  }, 120000);

  test('should generate site output', async () => {
    const sourcePath = path.join(hexoSite.targetDir, 'source');
    const publicDir = path.join(hexoSite.targetDir, 'public');
    const publicIndexPath = path.join(hexoSite.targetDir, 'public/index.html');
    if (!fs.existsSync(sourcePath)) {
      await spawnAsync('git', ['restore', 'source'], { cwd: hexoSite.targetDir, stdio: 'ignore' });
    }
    await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: hexoSite.targetDir });
    expect(fs.existsSync(publicIndexPath)).toBe(true);
    expect(consoleSpy).not.toBeNull();
    expect(fs.existsSync(publicDir)).toBe(true);
  }, 120000);

  describe('Sitemap', () => {
    test('should generate all sitemap files', async () => {
      modifyConfig({
        seo: {
          sitemap: { yoast: true, gnews: true, txt: true },
          feed: {
            type: ['page', 'post'],
            icon: 'https://w7.pngwing.com/pngs/745/306/png-transparent-gallery-image-images-photo-picture-pictures-set-app-incredibles-icon-thumbnail.png'
          }
        }
      });
      await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: hexoSite.targetDir });
      const publicDir = path.join(hexoSite.targetDir, 'public');
      expect(fs.existsSync(path.join(publicDir, 'sitemap.txt'))).toBe(true);
      expect(fs.existsSync(path.join(publicDir, 'sitemap.xml'))).toBe(true);
      expect(fs.existsSync(path.join(publicDir, 'google-news-sitemap.xml'))).toBe(true);
    }, 60000);

    test('should generate only sitemap.txt', async () => {
      const publicDir = path.join(hexoSite.targetDir, 'public');
      modifyConfig({
        seo: {
          sitemap: { yoast: false, gnews: false, txt: true }
        }
      });
      await runCommand('npx', ['hexo', 'clean', '--silent'], { cwd: hexoSite.targetDir });
      await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: hexoSite.targetDir });
      expect(fs.existsSync(path.join(publicDir, 'sitemap.txt'))).toBe(true);
      expect(fs.existsSync(path.join(publicDir, 'sitemap.xml'))).toBe(false);
      expect(fs.existsSync(path.join(publicDir, 'google-news-sitemap.xml'))).toBe(false);
    }, 60000);
  });

  afterAll(() => {
    if (consoleSpy) consoleSpy.mockRestore();
  });
});
