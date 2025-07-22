import { spawnSync } from 'cross-spawn';
import { deepmerge } from 'deepmerge-ts';
import Hexo from 'hexo';
import { baseSite } from '../env.cjs';

const targetDir = baseSite;
let hexo: Hexo;
let sitemapModule: typeof import('../../src/sitemap/index');
const config = {
  seo: {
    sitemap: {
      yoast: true,
      txt: true,
      gnews: true
    }
  }
};

beforeAll(async () => {
  spawnSync('git', ['restore', 'source'], { cwd: targetDir, stdio: 'ignore' });
  hexo = new Hexo(targetDir, { silent: true });
  hexo.config = deepmerge(hexo.config, config) as any;
  (global as any).hexo = hexo;
  // Dynamically import sitemapModule after global hexo is set
  sitemapModule = await import('../../src/sitemap/index');
});

afterAll(async () => {
  await hexo.exit();
});

// Set Jest timeout for all tests in this file to 2 minutes (120000 ms)
jest.setTimeout(120000);

describe('generateSitemapIndex', () => {
  it('throws when called with null', () => {
    expect(() => sitemapModule.generateSitemapIndex(null as any)).toThrow(TypeError);
  });

  it('returns a string when called with a valid hexo instance', async () => {
    await hexo.init();
    await hexo.call('clean');
    await hexo.call('generate');
    const result = sitemapModule.generateSitemapIndex(hexo);
    expect(typeof result).toBe('string');
    expect(result).toContain('tag-sitemap.xml');
    expect(result).toContain('category-sitemap.xml');
  });
});
