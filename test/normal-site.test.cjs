const fs = require('fs');
const path = require('upath');
const { runCommand, generateMarkdownPost } = require('./utils.cjs');
const { spawnAsync } = require('cross-spawn');
const sbgUtil = require('sbg-utility');
const yaml = require('yaml');
const { deepMerge } = require('hexo-util');
const { targetDir } = require('../pretest.cjs');

describe('CLI common test', () => {
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

  test('should generate a post file', async () => {
    const postPath = path.join(targetDir, 'source/_posts/hello-world.md');
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
    const sourcePath = path.join(targetDir, 'source');
    const publicDir = path.join(targetDir, 'public');
    const publicIndexPath = path.join(targetDir, 'public/index.html');
    if (!fs.existsSync(sourcePath)) {
      await spawnAsync('git', ['restore', 'source'], { cwd: targetDir, stdio: 'ignore' });
    }
    await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: targetDir });
    expect(fs.existsSync(publicIndexPath)).toBe(true);
    expect(consoleSpy).not.toBeNull();
    expect(fs.existsSync(publicDir)).toBe(true);
  }, 120000);
});
