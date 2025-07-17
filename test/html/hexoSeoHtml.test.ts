import fs from 'fs';
import Hexo from 'hexo';
import path from 'path';
import { HexoSeo } from '../../src/html/schema/article';

let HexoSeoHtml: typeof import('../../src/html/index').default,
  getPagePath: typeof import('../../src/html/index').getPagePath;
let hexoInstance: Hexo;

// Set working directory for tests
const hexoSiteDir = path.resolve(__dirname, '../../tmp/site');
process.chdir(hexoSiteDir);
// Overwrite process.cwd to always return hexoSiteDir
process.cwd = () => hexoSiteDir;

beforeAll(async () => {
  hexoInstance = new Hexo(hexoSiteDir, { silent: true });
  await hexoInstance.init();
  await hexoInstance.load();
  // Always disable cache
  hexoInstance.config.seo.cache = false;
  (global as any).hexo = hexoInstance;
  const htmlModule = await import('../../src/html/index');
  HexoSeoHtml = htmlModule.default;
  getPagePath = htmlModule.getPagePath;
});

// Mocks
jest.mock('../../src/html/fixSchema.static', () => ({ __esModule: true, default: jest.fn() }));
jest.mock('../../src/html/fixHyperlinks.static', () => ({ identifyRels: jest.fn(() => ['nofollow']) }));
jest.mock('../../src/html/types', () => ({ isExternal: jest.fn(() => true) }));
jest.mock('../../src/html/schema/article', () => ({ HexoSeo: jest.fn() }));

const mockConfig = {
  links: { enable: true },
  html: { fix: true },
  img: { enable: true, broken: false, onerror: '', default: 'no-image.png' },
  js: { concat: false, enable: false, options: {} },
  theme_dir: '',
  source_dir: '',
  post_dir: ''
};

jest.mock('../../src/config', () => ({
  __esModule: true,
  default: () => mockConfig,
  cache_key_router: 'cache_key_router',
  coreCache: { getSync: jest.fn(() => []), setSync: jest.fn() },
  getMode: jest.fn(() => 'g')
}));
jest.mock('../../src/hexo-seo', () => ({ isDev: true }));

// Minimal HTML for testing
const html = fs.readFileSync(path.join(__dirname, '../fixtures/full.html'), 'utf-8');
const data: Partial<HexoSeo> = {
  page: { title: 'Test Title', full_source: 'test.html', path: 'test.html' },
  config: { title: 'Site Title' } as any
};

describe('HexoSeoHtml', () => {
  it('should process HTML and add SEO attributes', async () => {
    const result = await HexoSeoHtml.call(hexoInstance, html, data);
    expect(result).toContain('hexo-seo');
    expect(result).toContain('alt="Test Title"');
    expect(result).toContain('title="Test Title"');
  });

  it('should use getPagePath correctly', () => {
    expect(getPagePath(data as any)).toBe('test.html');
    expect(getPagePath({ path: 'other.html', config: { title: 'Site Title' } } as any)).toBe('other.html');
  });

  // it('should concat js files', async () => {
  //   hexoInstance.config.seo.js.concat = true;
  //   const result = await HexoSeoHtml.call(hexoInstance, html, data);
  //   writefile(path.join(__dirname, '__sample-test.html'), result);
  // });
});
