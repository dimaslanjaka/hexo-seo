import fs from 'fs';
import Hexo from 'hexo';
import path from 'path';
import type { DeepPartial } from 'ts-essentials';
import { targetDir } from '../../pretest.cjs';

jest.mock('hexo-is', () => {
  const mockIs = jest.fn(() => ({})) as any;
  mockIs.post = jest.fn(() => false);
  mockIs.page = jest.fn(() => false);
  mockIs.home = jest.fn(() => false);
  mockIs.archive = jest.fn(() => false);
  mockIs.category = jest.fn(() => false);
  mockIs.tag = jest.fn(() => false);
  return {
    __esModule: true,
    default: mockIs,
    post: mockIs.post,
    page: mockIs.page,
    home: mockIs.home,
    archive: mockIs.archive,
    category: mockIs.category,
    tag: mockIs.tag,
    hexoIs: mockIs
  };
});

describe('HexoSeoHtml', () => {
  let hexo: Hexo;
  let HexoSeoHtml: typeof import('../../src/html/index').HexoSeoHtml;
  let getPagePath: typeof import('../../src/html/index').getPagePath;
  let mockConfig: DeepPartial<typeof import('../../src/config').defaultOpt>;

  beforeAll(async () => {
    try {
      // Set working directory for tests
      process.chdir(targetDir);
      process.cwd = () => targetDir;

      // Dynamically import defaultOpt after chdir
      mockConfig = {
        links: { enable: true },
        html: { fix: true },
        img: { enable: true, broken: false, onerror: undefined, default: 'no-image.png' },
        js: { concat: false as any, enable: false, options: {} }
      };

      hexo = new Hexo(targetDir, { silent: true });
      // Always disable cache
      hexo.config.seo = {
        ...(hexo.config.seo || {}),
        ...mockConfig,
        cache: false
      };
      await hexo.init();
      // await hexo.load();
      (global as any).hexo = hexo;
      const htmlModule = await import('../../src/html/index');
      HexoSeoHtml = htmlModule.default;
      getPagePath = htmlModule.getPagePath;
    } catch (e) {
      console.error('beforeAll error:', e);
      throw e;
    }
  }, 120000);

  it('should use getPagePath correctly', () => {
    expect(getPagePath({ page: { full_source: 'test.md' } } as any)).toBe('test.md');
    expect(getPagePath({ path: 'other.html', config: { title: 'Site Title' } } as any)).toBe('other.html');
  }, 120000);

  it('should process HTML and add SEO attributes', async () => {
    const html = fs.readFileSync(path.join(__dirname, '/../fixtures/full.html'), 'utf-8');
    const data: DeepPartial<import('../../src/html/schema/article').HexoSeo> = {
      page: {
        title: 'Test Title',
        full_source: 'test.md',
        path: 'test.html',
        source: 'test.md'
      },
      config: { title: 'Site Title' }
    };
    const result = await HexoSeoHtml.call(hexo, html, data);
    expect(result).toContain('hexo-seo');
    expect(result).toContain('alt="Test Title"');
    expect(result).toContain('title="Test Title"');
  }, 120000);
});
