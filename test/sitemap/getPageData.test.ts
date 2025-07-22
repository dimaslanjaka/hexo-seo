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

describe('getPageData', () => {
  it('returns page data with "is" and "title" properties for a valid post', () => {
    const posts = hexo.locals.get('posts');
    const page = posts.data ? posts.data[0] : posts[0];
    const data = { page };
    const result = sitemapModule.getPageData.call(hexo, data);
    expect(result).toHaveProperty('is');
    expect(result).toHaveProperty('title');
    if (result && page && page.title) expect(result.title).toBe(page.title);
  });

  it('returns undefined when data does not contain a page property', () => {
    const mockData: any = { notPage: {} };
    const result = sitemapModule.getPageData.call(hexo, mockData);
    expect(result).toBeUndefined();
  });

  it('returns undefined when page is null', () => {
    const data = { page: null };
    const result = sitemapModule.getPageData.call(hexo, data);
    expect(result).toBeUndefined();
  });

  it('returns undefined when page is undefined', () => {
    const data = { page: undefined };
    const result = sitemapModule.getPageData.call(hexo, data);
    expect(result).toBeUndefined();
  });
});
