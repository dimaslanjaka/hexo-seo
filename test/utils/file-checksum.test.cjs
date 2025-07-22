const path = require('path');
const fs = require('fs');
const fileChecksum = require('../../src/utils/file-checksum.cjs');

describe('file-checksum', () => {
  const testFile = path.join(__dirname, 'test.txt');
  const testDir = path.join(__dirname, 'testdir');

  beforeAll(() => {
    fs.writeFileSync(testFile, 'hello world');
    if (!fs.existsSync(testDir)) fs.mkdirSync(testDir);
    fs.writeFileSync(path.join(testDir, 'a.txt'), 'A');
    fs.writeFileSync(path.join(testDir, 'b.txt'), 'B');
  });

  afterAll(() => {
    fs.unlinkSync(testFile);
    fs.unlinkSync(path.join(testDir, 'a.txt'));
    fs.unlinkSync(path.join(testDir, 'b.txt'));
    fs.rmdirSync(testDir);
  });

  test('md5FileSync returns correct md5', () => {
    const md5 = fileChecksum.sync(testFile);
    expect(md5).toMatch(/^[a-f0-9]{32}$/);
  });

  test('md5File returns correct md5 (async)', async () => {
    const md5 = await fileChecksum(testFile);
    expect(md5).toMatch(/^[a-f0-9]{32}$/);
  });

  test('md5 returns correct md5 for string', () => {
    const md5 = fileChecksum.md5('hello world');
    expect(md5).toBe('5eb63bbbe01eeed093cb22bb8f5acdc3');
  });

  test('fileChecksum returns sha256 for file', () => {
    const sha = fileChecksum.fileChecksum(testFile);
    expect(sha).toMatch(/^[a-f0-9]{64}$/);
  });

  test('checksumFolder returns all files in folder', () => {
    const files = fileChecksum.checksumFolder(testDir);
    expect(files).toEqual(expect.arrayContaining([path.join(testDir, 'a.txt'), path.join(testDir, 'b.txt')]));
  });

  test('checksum returns sha256 for files and folders', () => {
    const sha = fileChecksum.checksum(testFile, testDir);
    expect(sha).toMatch(/^[a-f0-9]{64}$/);
  });
});
