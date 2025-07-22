const fs = require('fs');
const path = require('upath');
const { runCommand } = require('./utils.cjs');
const { targetDir } = require('../pretest.cjs');

describe('Hexo Clean', () => {
  let publicIndexPath;

  let consoleSpy;
  beforeAll(async () => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    // Delete the posts directory to ensure clean state
    const postsPath = path.join(targetDir, 'source/_posts');
    if (fs.existsSync(postsPath)) {
      fs.rmSync(postsPath, { recursive: true, force: true });
    }
    publicIndexPath = path.join(targetDir, 'public/index.html');
  }, 120000); // Set timeout to 2 minutes for setup

  test('should remove public/index.html after hexo clean', async () => {
    await runCommand('npx', ['hexo', 'clean', '--silent'], { cwd: targetDir });

    const exists = fs.existsSync(publicIndexPath);
    expect(exists).toBe(false);
  }, 120000); // Set timeout to 2 minutes for this test

  test('Generating site for test setup', async () => {
    const sourcePath = path.join(targetDir, 'source');
    if (fs.existsSync(sourcePath)) {
      fs.rmSync(sourcePath, { recursive: true, force: true });
    }

    await runCommand('npx', ['hexo', 'generate', '--silent'], { cwd: targetDir });

    expect(fs.existsSync(publicIndexPath)).toBe(false);
  }, 120000); // Set timeout to 2 minutes for this test
  afterAll(() => {
    consoleSpy.mockRestore();
  });
});
