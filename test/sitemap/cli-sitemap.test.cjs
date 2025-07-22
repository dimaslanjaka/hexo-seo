const fs = require('fs');
const path = require('upath');
const { runCommand } = require('../utils.cjs');
const { targetDir } = require('../../pretest.cjs');
const yaml = require('yaml');
const { deepMerge } = require('hexo-util');

describe('CLI sitemap test', () => {
  let consoleSpy;

  /**
   * Helper to modify Hexo config YAML file
   * @param {object} obj - Object to deep merge into config
   */
  function modifyConfig(obj) {
    const configPath = path.join(targetDir, '_config.yml');
    const config = yaml.parse(fs.readFileSync(configPath, 'utf8'));
    const modified = deepMerge(config, obj);
    fs.writeFileSync(configPath, yaml.stringify(modified), 'utf8');
  }

  beforeAll(async () => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
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

  afterAll(() => {
    if (consoleSpy) consoleSpy.mockRestore();
  });

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
    await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: targetDir });
    const publicDir = path.join(targetDir, 'public');
    expect(fs.existsSync(path.join(publicDir, 'sitemap.txt'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'sitemap.xml'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'google-news-sitemap.xml'))).toBe(true);
  }, 60000);

  test('should generate only sitemap.txt', async () => {
    const publicDir = path.join(targetDir, 'public');
    modifyConfig({
      seo: {
        sitemap: { yoast: false, gnews: false, txt: true }
      }
    });
    await runCommand('npx', ['hexo', 'clean', '--silent'], { cwd: targetDir });
    await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: targetDir });
    expect(fs.existsSync(path.join(publicDir, 'sitemap.txt'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'sitemap.xml'))).toBe(false);
    expect(fs.existsSync(path.join(publicDir, 'google-news-sitemap.xml'))).toBe(false);
  }, 60000);

  test('should generate only sitemap.xml (yoast)', async () => {
    const publicDir = path.join(targetDir, 'public');
    modifyConfig({ seo: { sitemap: { yoast: true, gnews: false, txt: false } } });
    await runCommand('npx', ['hexo', 'clean', '--silent'], { cwd: targetDir });
    await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: targetDir });
    expect(fs.existsSync(path.join(publicDir, 'sitemap.xml'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'sitemap.txt'))).toBe(false);
    expect(fs.existsSync(path.join(publicDir, 'google-news-sitemap.xml'))).toBe(false);
  }, 60000);

  test('should generate only google-news-sitemap.xml (gnews)', async () => {
    const publicDir = path.join(targetDir, 'public');
    modifyConfig({ seo: { sitemap: { yoast: false, gnews: true, txt: false } } });
    await runCommand('npx', ['hexo', 'clean', '--silent'], { cwd: targetDir });
    await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: targetDir });
    expect(fs.existsSync(path.join(publicDir, 'google-news-sitemap.xml'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'sitemap.xml'))).toBe(false);
    expect(fs.existsSync(path.join(publicDir, 'sitemap.txt'))).toBe(false);
  }, 60000);

  test('should generate sitemap.xml and google-news-sitemap.xml (yoast + gnews)', async () => {
    const publicDir = path.join(targetDir, 'public');
    modifyConfig({ seo: { sitemap: { yoast: true, gnews: true, txt: false } } });
    await runCommand('npx', ['hexo', 'clean', '--silent'], { cwd: targetDir });
    await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: targetDir });
    expect(fs.existsSync(path.join(publicDir, 'sitemap.xml'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'google-news-sitemap.xml'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'sitemap.txt'))).toBe(false);
  }, 60000);

  test('should generate sitemap.xml and sitemap.txt (yoast + txt)', async () => {
    const publicDir = path.join(targetDir, 'public');
    modifyConfig({ seo: { sitemap: { yoast: true, gnews: false, txt: true } } });
    await runCommand('npx', ['hexo', 'clean', '--silent'], { cwd: targetDir });
    await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: targetDir });
    expect(fs.existsSync(path.join(publicDir, 'sitemap.xml'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'sitemap.txt'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'google-news-sitemap.xml'))).toBe(false);
  }, 60000);

  test('should generate google-news-sitemap.xml and sitemap.txt (gnews + txt)', async () => {
    const publicDir = path.join(targetDir, 'public');
    modifyConfig({ seo: { sitemap: { yoast: false, gnews: true, txt: true } } });
    await runCommand('npx', ['hexo', 'clean', '--silent'], { cwd: targetDir });
    await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: targetDir });
    expect(fs.existsSync(path.join(publicDir, 'google-news-sitemap.xml'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'sitemap.txt'))).toBe(true);
    expect(fs.existsSync(path.join(publicDir, 'sitemap.xml'))).toBe(false);
  }, 60000);

  test('should generate no sitemap files (all false)', async () => {
    const publicDir = path.join(targetDir, 'public');
    modifyConfig({ seo: { sitemap: { yoast: false, gnews: false, txt: false } } });
    await runCommand('npx', ['hexo', 'clean', '--silent'], { cwd: targetDir });
    await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: targetDir });
    expect(fs.existsSync(path.join(publicDir, 'sitemap.xml'))).toBe(false);
    expect(fs.existsSync(path.join(publicDir, 'sitemap.txt'))).toBe(false);
    expect(fs.existsSync(path.join(publicDir, 'google-news-sitemap.xml'))).toBe(false);
  }, 60000);
});
