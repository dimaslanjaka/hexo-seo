import Hexo from 'hexo';
import { HTMLElement } from 'node-html-parser';
import { envHexo } from '../env.cjs';

jest.setTimeout(120000);

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

describe('Sitemap Module Integration (Hexo)', () => {
  beforeAll(async () => {
    hexo = await envHexo(config);
    (global as any).hexo = hexo;
    // Dynamically import sitemapModule after global hexo is set
    sitemapModule = await import('../../src/sitemap/index');
  });

  beforeEach(async () => {
    await hexo.init();
    await hexo.call('clean');
  });

  afterAll(async () => {
    await hexo.exit();
  });

  describe('sitemap', () => {
    it('does not throw when called with a real hexo instance and valid DOM', async () => {
      const { parse } = await import('node-html-parser');
      const dom = parse('<div><span></span></div>');
      const hexoSeoConfig = { sitemap: true };
      const posts = hexo.locals.get('posts');
      const data = { page: posts.data ? posts.data[0] : posts[0] };
      expect(() => sitemapModule.sitemap.call(hexo, dom, hexoSeoConfig, data)).not.toThrow();
    });

    it('does not throw when DOM is missing required methods', () => {
      const dom = {} as HTMLElement;
      const hexoSeoConfig = { sitemap: true };
      const posts = hexo.locals.get('posts');
      const data = { page: posts.data ? posts.data[0] : posts[0] };
      expect(() => sitemapModule.sitemap.call(hexo, dom, hexoSeoConfig, data)).not.toThrow();
    });

    it('does not throw when hexoSeoConfig is undefined', () => {
      const dom = {
        querySelector: jest.fn().mockReturnValue(null),
        getElementsByTagName: jest.fn().mockReturnValue([{ innerHTML: '' }])
      } as unknown as HTMLElement;
      const posts = hexo.locals.get('posts');
      const data = { page: posts.data ? posts.data[0] : posts[0] };
      expect(() => sitemapModule.sitemap.call(hexo, dom, undefined, data)).not.toThrow();
    });

    it('does not throw when data is missing page property', async () => {
      const { parse } = await import('node-html-parser');
      const dom = parse('<div><span></span></div>');
      const hexoSeoConfig = { sitemap: true };
      const data = {};
      expect(() => sitemapModule.sitemap.call(hexo, dom, hexoSeoConfig, data)).not.toThrow();
    });
  });
});
