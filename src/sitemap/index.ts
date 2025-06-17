import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'fs-extra';
import { GoogleNewsSitemap } from 'google-news-sitemap';
import Hexo from 'hexo';
import { hexoIs } from 'hexo-is';
import { url_for } from 'hexo-util';
import { HexoLocalsData } from 'hexo/dist/hexo/locals-d';
import moment from 'moment';
import { HTMLElement } from 'node-html-parser';
import { bindProcessExit, writefile } from 'sbg-utility';
import { dirname, join } from 'upath';
import { create as createXML } from 'xmlbuilder2';
import { BaseConfig } from '../config';
import log from '../log';
import { getAuthorName } from '../utils/getAuthor';
import getCategoryTags, { getLatestFromArrayDates } from './archive';

interface sitemapItem {
  loc: string;
  lastmod: string;
  changefreq: string;
  priority: string;
}
interface sitemapObj {
  urlset: {
    url: sitemapItem[];
  };
}
interface sitemapGroup {
  post: sitemapObj;
  page: sitemapObj;
  tag: sitemapObj;
  category: sitemapObj;
}
const sitemapGroup: sitemapGroup = {
  post: undefined,
  page: undefined,
  tag: undefined,
  category: undefined
};
interface SitemapIndex {
  sitemapindex: {
    sitemap: SitemapIndexItem[];
  };
}
interface SitemapIndexItem {
  loc: string;
  lastmod: string;
}

const googleNewsSitemap = new GoogleNewsSitemap();

function initSitemap(type: string | 'post' | 'page' | 'category' | 'tag') {
  if (!sitemapGroup[type]) {
    const sourceXML = join(__dirname, 'views/' + type + '-sitemap.xml');
    if (!existsSync(sourceXML)) throw 'Source ' + sourceXML + ' Not Found';
    const doc = createXML(readFileSync(sourceXML).toString());
    sitemapGroup[type] = <sitemapObj>new Object(doc.end({ format: 'object' }));
    sitemapGroup[type].urlset.url = [];
  }
}

export interface returnPageData extends HexoLocalsData {
  [key: string]: any;
  is: ReturnType<typeof hexoIs>;
  // id?: string;
  // _id?: string;
  title?: string;
  date?: moment.Moment;
  updated?: moment.Moment;
  // comments?: boolean;
  // layout?: string;
  // _content?: string;
  // source?: string;
  // slug?: string;
  // photos?: string[];
  // raw?: string;
  published?: boolean;
  // content?: string;
  // excerpt?: string;
  // more?: string;
  // author?: string;
  // asset_dir?: string;
  // full_source?: string;
  // path?: string;
  // permalink?: string;
  // categories?: any;
  // tags?: any;
  // __permalink?: string;
  // __post?: boolean;
  canonical_path?: string;
  lang?: string;
  language?: string;
}

/**
 * Extract Page Data
 * @param data
 * @returns
 */
export function getPageData(data: HexoLocalsData) {
  const is = hexoIs(data);
  if (data['page']) {
    const page = <returnPageData>data['page'];
    page.is = is;
    return page;
  }
}

// init each sitemap
const groups = ['post', 'page', 'category', 'tag'];
groups.forEach((group) => {
  if (!sitemapGroup[group]) initSitemap(group);
  if (sitemapGroup[group].urlset.url.length === 0) {
    sitemapGroup[group].urlset.url.push({
      loc: hexo.config.url,
      lastmod: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
      priority: '1',
      changefreq: 'daily'
    });
  }
});

let categoryTagsInfo: ReturnType<typeof getCategoryTags>;
const postUpdateDates: string[] = [];
const pageUpdateDates: string[] = [];
// const cache = new CacheFile("sitemap");
let turnError = false;

/**
 * process sitemap of page
 */
export function sitemap(this: Hexo, dom: HTMLElement, hexoSeoConfig: BaseConfig, data: HexoLocalsData) {
  if (!hexoSeoConfig.sitemap) {
    if (!turnError) {
      turnError = true;
      log.error('[hexo-seo][sitemap] config sitemap not set');
    }
    return;
  }
  // set category and tag information of posts
  if (!categoryTagsInfo) {
    categoryTagsInfo = getCategoryTags(hexo);
  }
  // cast locals
  const locals = hexo.locals;
  // return if posts and pages empty
  if (['posts', 'pages'].every((info) => locals.get(info).length === 0)) {
    return;
  }

  // resolve configs
  let isYoastActive = false;
  let isGnewsActive = false;
  const sitemapConfig = hexoSeoConfig.sitemap;
  if (sitemapConfig) {
    if (typeof sitemapConfig == 'boolean' && sitemapConfig === true) {
      isYoastActive = isGnewsActive = true;
    } else {
      isYoastActive = sitemapConfig.yoast;
      isGnewsActive = sitemapConfig.gnews;
    }
  }

  // TODO modify or add sitemap href in html
  const linksitemap = dom.querySelector('link[rel="sitemap"]');
  if (linksitemap) {
    linksitemap.setAttribute('href', '/sitemap.xml');
    linksitemap.setAttribute('type', 'application/xml');
    linksitemap.setAttribute('rel', 'sitemap');
    linksitemap.setAttribute('title', 'Sitemap');
  } else {
    // add the sitemap when not exist
    const head = dom.getElementsByTagName('head');
    if (head.length)
      head[0].innerHTML += '<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />';
  }

  const post = getPageData(data);
  if (post) {
    const isPagePost = post.is.post || post.is.page;
    if (isPagePost) {
      // if post updated not found, get source file last modified time
      if (!post.updated) {
        const stats = statSync(post.full_source);
        post.updated = moment(stats.mtime);
      }
    }
    if (post.is.post) {
      // YoastSeo Sitemap
      if (isYoastActive) {
        postUpdateDates.push(post.updated.format('YYYY-MM-DDTHH:mm:ssZ'));
        sitemapGroup['post'].urlset.url.push({
          loc: post.permalink,
          lastmod: post.updated.format('YYYY-MM-DDTHH:mm:ssZ'),
          changefreq: 'weekly',
          priority: '0.6'
        });
      }

      // Google News Sitemap
      if (isGnewsActive) {
        googleNewsSitemap.add({
          publication_name: getAuthorName(post.author),
          publication_language: post.lang || post.language || 'en',
          publication_date: post.date.format('YYYY-MM-DDTHH:mm:ssZ'),
          title: post.title || 'no title',
          location: url_for.bind(this)(post.permalink)
        });
      }
    } else if (post.is.page) {
      // YoastSeo Sitemap
      if (isYoastActive) {
        pageUpdateDates.push(post.updated.format('YYYY-MM-DDTHH:mm:ssZ'));
        sitemapGroup['page'].urlset.url.push({
          loc: post.permalink,
          lastmod: post.updated.format('YYYY-MM-DDTHH:mm:ssZ'),
          changefreq: 'weekly',
          priority: '0.8'
        });
      }
    }

    if (isPagePost) {
      // write sitemap at Node process ends
      bindProcessExit('writeSitemap', () => {
        if (isYoastActive) {
          // copy xsl
          const destXSL = join(hexo.public_dir, 'sitemap.xsl');
          if (!existsSync(dirname(destXSL))) mkdirSync(dirname(destXSL), { recursive: true });
          const sourceXSL = join(__dirname, 'views/sitemap.xsl');
          if (existsSync(sourceXSL)) {
            copyFileSync(sourceXSL, destXSL);
            log.log('XSL sitemap copied to ' + destXSL);
          } else {
            log.error('XSL sitemap not found');
          }

          // TODO write post-sitemap.xml
          const destPostSitemap = join(hexo.public_dir, 'post-sitemap.xml');
          writefile(destPostSitemap, createXML(sitemapGroup['post']).end({ prettyPrint: true }));
          log.log('post sitemap saved', destPostSitemap);

          // TODO write page-sitemap.xml
          const destPageSitemap = join(hexo.public_dir, 'page-sitemap.xml');
          writefile(destPageSitemap, createXML(sitemapGroup['page']).end({ prettyPrint: true }));
          log.log('page sitemap saved', destPageSitemap);

          generateSitemapIndex(hexo);
        }

        if (isGnewsActive) {
          // TODO write google-news-sitemap.xml
          const gnewsPageSitemap = join(hexo.public_dir, 'google-news-sitemap.xml');
          writefile(gnewsPageSitemap, googleNewsSitemap.toString());
          log.log('google news sitemap saved', gnewsPageSitemap);
        }
      });
    }
  }
}

export default sitemap;

/** generate YoastSeo index sitemap */
export function generateSitemapIndex(hexoinstance: Hexo = null) {
  const sourceIndexXML = join(__dirname, 'views/sitemap.xml');
  const sitemapIndexDoc = createXML(readFileSync(sourceIndexXML).toString());
  const sitemapIndex = <SitemapIndex>new Object(sitemapIndexDoc.end({ format: 'object' }));
  sitemapIndex.sitemapindex.sitemap = [];
  if (!hexoinstance && typeof hexo != 'undefined') {
    hexoinstance = hexo;
  }

  // push post-sitemap.xml to sitemapindex
  const latestPostDate = getLatestFromArrayDates(postUpdateDates);
  log.log('latest updated post', latestPostDate);
  sitemapIndex.sitemapindex.sitemap.push({
    loc: hexo.config.url.toString() + '/post-sitemap.xml',
    lastmod: moment(latestPostDate).format('YYYY-MM-DDTHH:mm:ssZ')
  });

  // push page-sitemap.xml to sitemapindex
  const latestPageDate = getLatestFromArrayDates(pageUpdateDates);
  log.log('latest updated page', latestPageDate);
  if (moment(latestPageDate).isValid())
    sitemapIndex.sitemapindex.sitemap.push({
      loc: hexo.config.url.toString() + '/page-sitemap.xml',
      lastmod: moment(latestPageDate).format('YYYY-MM-DDTHH:mm:ssZ')
    });

  // build tag-sitemap.xml
  const tags = categoryTagsInfo.tags;
  tags.map((tag) => {
    sitemapGroup['tag'].urlset.url.push({
      loc: tag.permalink.toString(),
      // set latest post updated from this tag
      lastmod: moment(tag.latest).format('YYYY-MM-DDTHH:mm:ssZ'),
      changefreq: 'weekly',
      priority: '0.2'
    });
  });
  const destTagSitemap = join(hexo.public_dir, 'tag-sitemap.xml');
  writefile(destTagSitemap, createXML(sitemapGroup['tag']).end({ prettyPrint: true }));
  log.log('tag sitemap saved', destTagSitemap);

  // push tag-sitemap.xml to sitemapindex
  const latestTagDate = getLatestFromArrayDates(
    tags.map((tag) => {
      return tag.latest;
    })
  );
  log.log('latest updated tag', latestTagDate);
  sitemapIndex.sitemapindex.sitemap.push({
    loc: hexo.config.url.toString() + '/tag-sitemap.xml',
    lastmod: moment(latestTagDate).format('YYYY-MM-DDTHH:mm:ssZ')
  });

  // build category-sitemap.xml
  const categories = categoryTagsInfo.categories;
  categories.map((category) => {
    sitemapGroup['category'].urlset.url.push({
      loc: category.permalink.toString(),
      // set latest post updated from this tag
      lastmod: moment(category.latest).format('YYYY-MM-DDTHH:mm:ssZ'),
      changefreq: 'weekly',
      priority: '0.2'
    });
  });
  const destCategorySitemap = join(hexo.public_dir, 'category-sitemap.xml');
  writefile(destCategorySitemap, createXML(sitemapGroup['category']).end({ prettyPrint: true }));
  log.log('category sitemap saved', destCategorySitemap);

  // push category-sitemap.xml to sitemapindex
  const latestCategoryDate = getLatestFromArrayDates(
    categories.map((category) => {
      return category.latest;
    })
  );
  log.log('latest updated category', latestCategoryDate);
  sitemapIndex.sitemapindex.sitemap.push({
    loc: hexo.config.url.toString() + '/category-sitemap.xml',
    lastmod: moment(latestCategoryDate).format('YYYY-MM-DDTHH:mm:ssZ')
  });

  const destIndexSitemap = join(hexo.public_dir, 'sitemap.xml');
  writefile(destIndexSitemap, createXML(sitemapIndex).end({ prettyPrint: true }));
  log.log('index sitemap saved', destIndexSitemap);
}
