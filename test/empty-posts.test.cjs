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

  beforeAll(async () => {
    console.log('📦\tSetting up Hexo site for testing...');
    hexoSite = await setupHexoSite();
    publicIndexPath = path.join(hexoSite.targetDir, 'public/index.html');
  });

  test('should remove public/index.html after hexo clean', async () => {
    console.log('🧹\tRunning hexo clean...');
    await runCommand('npx', ['hexo', 'clean', '--silent'], { cwd: hexoSite.targetDir });

    const exists = fs.existsSync(publicIndexPath);
    expect(exists).toBe(false);
  });

  test('generate on empty site', async () => {
    const sourcePath = path.join(hexoSite.targetDir, 'source');
    if (fs.existsSync(sourcePath)) {
      fs.rmSync(sourcePath, { recursive: true, force: true });
    }

    console.log('⚙️\tGenerating site for test setup...');
    await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: hexoSite.targetDir });

    expect(fs.existsSync(publicIndexPath)).toBe(false);
  });
});
