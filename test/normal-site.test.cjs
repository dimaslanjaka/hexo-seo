const fs = require('fs');
const path = require('upath');
const { runCommand, generateMarkdownPost } = require('./utils.cjs');
const { setupHexoSite } = require('./setup-hexo-site.cjs');
const { spawnAsync } = require('cross-spawn');
const sbgUtil = require('sbg-utility');

describe('Hexo Clean', () => {
  /**
   * @type {Awaited<ReturnType<typeof setupHexoSite>>}
   */
  let hexoSite;
  let publicIndexPath;
  let postPath;
  let sourcePath;
  let consoleSpy;

  beforeAll(async () => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // Setting up Hexo site for testing...
    hexoSite = await setupHexoSite();
    publicIndexPath = path.join(hexoSite.targetDir, 'public/index.html');
    sourcePath = path.join(hexoSite.targetDir, 'source');
  }, 120000); // Set timeout to 2 minutes for setup

  test('generate post', async () => {
    postPath = path.join(hexoSite.targetDir, 'source/_posts/hello-world.md');
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
    expect(consoleSpy).not.toBeNull(); // Ensure spy is set
  }, 120000); // Set timeout to 2 minutes for post generation

  test('generate site', async () => {
    if (!fs.existsSync(sourcePath)) {
      await spawnAsync('git', ['restore', 'source'], { cwd: hexoSite.targetDir, stdio: 'ignore' });
    }

    // Generating site for test setup...
    await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: hexoSite.targetDir });

    expect(fs.existsSync(publicIndexPath)).toBe(true);
    expect(consoleSpy).not.toBeNull(); // Ensure spy is set
  }, 120000); // Set timeout to 2 minutes for site generation

  afterAll(() => {
    if (consoleSpy) consoleSpy.mockRestore();
  });
});
