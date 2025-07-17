import fs from 'fs';
import Hexo from 'hexo';
import { parse as nodeHtmlParser } from 'node-html-parser';
import path from 'path';
import { setupHexoSite } from '../setup-hexo-site.cjs';

describe('jsConcat', () => {
  let hexo: Hexo;
  let logname: string;
  let logconcatname: string;
  let hexoSite: Awaited<ReturnType<typeof setupHexoSite>>;
  let jsConcat: (typeof import('../../src/html/jsConcat'))['jsConcat'];
  let consoleLogSpy: jest.SpyInstance;

  beforeAll(async () => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    hexoSite = await setupHexoSite({ spawnOptions: { stdio: 'ignore' } });
    // Change working directory
    process.chdir(hexoSite.targetDir);
    // Overwrite process.cwd to always return hexoSiteDir
    process.cwd = () => hexoSite.targetDir;
    hexo = new Hexo(hexoSite.targetDir);
    (global as any).hexo = hexo;
    // Set config for Hexo instance
    if (!hexo.config.seo) {
      hexo.config.seo = await import('../../src/config').then((mod) => mod.defaultOpt);
    }
    hexo.config.seo.js = { enable: true, concat: { enable: true } };
    logname = 'test-log';
    logconcatname = 'test-log-concat';
    jsConcat = (await import('../../src/html/jsConcat')).jsConcat;
  }, 120000);

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  it('should concatenate inline scripts and append output script tag', async () => {
    const html = `<!DOCTYPE html><html><head></head><body><script>console.log('a');</script><script>console.log('b');</script></body></html>`;
    const root = nodeHtmlParser(html);
    const filePath = 'test.html';
    const result = await jsConcat.call(hexo, {
      root,
      logname,
      logconcatname,
      filePath
    });
    expect(result).toMatch(/<script src="\/hexo-seo-js\/concat-[a-f0-9]+\.js"><\/script>/);
    expect(result).not.toContain('<script>console.log(');
  }, 120000);

  it('should skip external scripts', async () => {
    const html = `<!DOCTYPE html><html><body><script src="https://cdn.jsdelivr.net/npm/js-sample@0.1.6-beta1/lib/index.min.js"></script><script>console.log('c');</script></body></html>`;
    const root = nodeHtmlParser(html);
    const filePath = 'external.html';
    const result = await jsConcat.call(hexo, {
      root,
      logname,
      logconcatname,
      filePath
    });
    expect(result).toMatch(/<script src="\/hexo-seo-js\/concat-[a-f0-9]+\.js"><\/script>/);
    expect(result).not.toContain('<script>console.log(');
  }, 120000);

  it('should log error for missing script src', async () => {
    const html = `<!DOCTYPE html><html><body><script src="missing.js"></script></body></html>`;
    const root = nodeHtmlParser(html);
    const filePath = 'missing.html';
    const result = await jsConcat.call(hexo, {
      root,
      logname,
      logconcatname,
      filePath
    });
    expect(result).toMatch(/<script src="\/hexo-seo-js\/concat-[a-f0-9]+\.js"><\/script>/);
    // Should not contain the missing script tag
    expect(result).not.toContain('<script src="missing.js"');
  }, 120000);

  it('should handle empty script tags', async () => {
    const html = `<!DOCTYPE html><html><body><script></script><script>console.log('d');</script></body></html>`;
    const root = nodeHtmlParser(html);
    const filePath = 'empty.html';
    const result = await jsConcat.call(hexo, {
      root,
      logname,
      logconcatname,
      filePath
    });
    expect(result).toMatch(/<script src="\/hexo-seo-js\/concat-[a-f0-9]+\.js"><\/script>/);
    expect(result).not.toContain('<script>console.log(');
  }, 120000);

  it('should download external scripts when configured', async () => {
    hexo.config.seo.js.concat.download_external = true; // Enable download_external for this test
    const html = `<!DOCTYPE html><html><body><script src="https://cdn.jsdelivr.net/npm/js-sample@0.1.6-beta1/lib/index.min.js"></script></body></html>`;
    const root = nodeHtmlParser(html);
    const filePath = 'download.html';
    const result = await jsConcat.call(hexo, {
      root,
      logname,
      logconcatname,
      filePath
    });
    expect(result).toMatch(/<script src="\/hexo-seo-js\/concat-[a-f0-9]+\.js"><\/script>/);
    hexo.config.seo.js.concat.download_external = false; // Reset download_external for other tests
  }, 120000);

  it('should skip scripts matching exclude patterns', async () => {
    hexo.config.seo.js.concat.download_external = true; // Enable download_external for this test
    hexo.config.seo.js.exclude = ['*.min.js', '**/*.min.js'];
    const html = `<!DOCTYPE html><html><body><script src="https://cdn.jsdelivr.net/npm/js-sample@0.1.6-beta1/lib/index.js"></script><script>console.log('e');</script><script src="https://cdn.jsdelivr.net/npm/js-sample@0.1.6-beta1/lib/index.min.js"></script></body></html>`;
    const root = nodeHtmlParser(html);
    const filePath = 'exclude.html';
    const result = await jsConcat.call(hexo, {
      root,
      logname,
      logconcatname,
      filePath
    });
    expect(result).toMatch(/<script src="\/hexo-seo-js\/concat-[a-f0-9]+\.js"><\/script>/);
    expect(result).not.toContain('<script>console.log(');
    expect(result).not.toContain('https://cdn.jsdelivr.net/npm/js-sample@0.1.6-beta1/lib/index.js');
    expect(result).toContain('https://cdn.jsdelivr.net/npm/js-sample@0.1.6-beta1/lib/index.min.js');

    hexo.config.seo.js.exclude = []; // Reset exclude patterns for other tests
    hexo.config.seo.js.concat.download_external = false; // Reset download_external for other tests
  }, 120000);

  it('should not concatenate excluded local js files', async () => {
    const jsDir = path.join(hexoSite.targetDir, 'source/js');
    fs.mkdirSync(jsDir, { recursive: true });
    const files = ['file1.js', 'file2.js', 'file3.js'];
    const contents = ["console.log('file1');", "console.log('file2');", "console.log('file3');"];
    for (let i = 0; i < files.length; i++) {
      fs.writeFileSync(path.join(jsDir, files[i]), contents[i]);
    }
    // Exclude file2.js
    hexo.config.seo.js.exclude = ['file2.js'];
    hexo.config.seo.js.concat.download_external = false;
    // Build html referencing all three local js files
    const html = `<!DOCTYPE html><html><body>
      <script src="/js/file1.js"></script>
      <script src="/js/file2.js"></script>
      <script src="/js/file3.js"></script>
    </body></html>`;
    const root = nodeHtmlParser(html);
    const filePath = 'local-exclude.html';
    const result = await jsConcat.call(hexo, {
      root,
      logname,
      logconcatname,
      filePath
    });
    // Should not concatenate file2.js
    expect(result).not.toContain('file2.js');
    // Should concatenate file1.js and file3.js
    expect(result).toMatch(/<script src="\/hexo-seo-js\/concat-[a-f0-9]+\.js"><\/script>/);
    // Clean up
    for (let i = 0; i < files.length; i++) {
      fs.unlinkSync(path.join(jsDir, files[i]));
    }
    hexo.config.seo.js.exclude = [];
  }, 120000);
});
