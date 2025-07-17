const fs = require('fs');
const path = require('upath');
const { runCommand } = require('./utils.cjs');
const { setupHexoSite } = require('./setup-hexo-site.cjs');

describe('Hexo Clean', () => {
  /**
   * @type {Awaited<ReturnType<typeof setupHexoSite>>}
   */
  let hexoSite;
  let publicIndexPath;

  let consoleSpy;
  beforeAll(async () => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    hexoSite = await setupHexoSite();
    publicIndexPath = path.join(hexoSite.targetDir, 'public/index.html');
  }, 30000); // Increased timeout for setup

  test('should remove public/index.html after hexo clean', async () => {
    await runCommand('npx', ['hexo', 'clean', '--silent'], { cwd: hexoSite.targetDir });

    const exists = fs.existsSync(publicIndexPath);
    expect(exists).toBe(false);
  }, 20000); // Increased timeout for this test

  test('Generating site for test setup', async () => {
    const sourcePath = path.join(hexoSite.targetDir, 'source');
    if (fs.existsSync(sourcePath)) {
      fs.rmSync(sourcePath, { recursive: true, force: true });
    }

    await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: hexoSite.targetDir });

    expect(fs.existsSync(publicIndexPath)).toBe(false);
  }, 20000); // Increased timeout for this test
  afterAll(() => {
    consoleSpy.mockRestore();
  });
});
