import Hexo from 'hexo';
import { envHexo } from '../env.cjs';

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
  hexo = await envHexo(config);
  await hexo.call('clean');
  (global as any).hexo = hexo;
  // Dynamically import sitemapModule after global hexo is set
  sitemapModule = await import('../../src/sitemap/index');
});

// Set Jest timeout for all tests in this file to 2 minutes (120000 ms)
jest.setTimeout(120000);

describe('generateSitemapIndex', () => {
  it('throws when called with null', () => {
    expect(() => sitemapModule.generateSitemapIndex(null as any)).toThrow(TypeError);
  });

  it('returns a string when called with a valid hexo instance', async () => {
    // Add a post with a tag and a category to the Hexo instance
    await hexo.model('Post').insert({
      title: 'Test Post',
      slug: 'test-post',
      source: 'test-post.md',
      date: new Date(),
      tags: ['test-tag'],
      categories: ['test-category'],
      content: 'Test content',
      permalink: '/test-post/'
    });
    await hexo.init();
    await hexo.call('generate');
    const result = sitemapModule.generateSitemapIndex(hexo);
    expect(typeof result).toBe('string');
    expect(result).toContain('tag-sitemap.xml');
    expect(result).toContain('category-sitemap.xml');
  });
});
