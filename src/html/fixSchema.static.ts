import ansiColors from 'ansi-colors';
import { deepmerge } from 'deepmerge-ts';
import Hexo from 'hexo';
import { hexoIs } from 'hexo-is';
import { url_for } from 'hexo-util';
import { HexoLocalsData } from 'hexo/dist/hexo/locals-d';
import moment from 'moment-timezone';
import { HTMLElement } from 'node-html-parser';
import { BaseConfig } from '../config';
import { isDev } from '../hexo-seo';
import logger from '../log';
import { dump } from '../utils';
import { getAuthorName } from '../utils/getAuthor';
import model from './schema/article/model4.json';

const logname = `${ansiColors.magentaBright('hexo-seo')}(${ansiColors.blueBright('fixSchema.static')})`;

/**
 * Fix Schema Model 4
 * @param dom
 * @param hexoSeoConfig hexo-seo config (config_yml.seo)
 * @param data
 */
export default function fixSchemaStatic(this: Hexo, dom: HTMLElement, hexoSeoConfig: BaseConfig, data: HexoLocalsData) {
  if (!hexoSeoConfig.schema) {
    // skip when schema option is false
    return;
  }
  // assign default config
  const defaultConfig: Partial<typeof hexoSeoConfig> = {
    schema: {
      homepage: { enable: false },
      sitelink: { enable: false, searchUrl: '/search' },
      article: { enable: false },
      breadcrumb: { enable: false }
    },
    cache: false,
    sitemap: false,
    host: '',
    theme_dir: process.cwd() + '/theme',
    source_dir: process.cwd() + '/source',
    post_dir: process.cwd() + '/source/_posts'
  };
  try {
    defaultConfig.host = new URL(hexo.config.url).host;
  } catch (_error) {
    //
  }
  hexoSeoConfig = deepmerge(defaultConfig, hexoSeoConfig);
  const is = hexoIs(data);
  const breadcrumbs = model[0];
  const article = model[1];
  const sitelink = model[2];
  const homepage = model[3];
  // resolve title
  let title = '';
  if (data.page && data.page.title && data.page.title.trim().length > 0) {
    title = data.page.title;
  } else {
    title = data.config.title;
  }
  // resolve description
  let description = title;
  if (data.page.description) {
    description = data.page.description;
  } else if (data.page.subtitle) {
    description = data.page.subtitle;
  }
  // resolve url
  let url = data.config.url;
  if (data.page) {
    if (data.page.permalink) {
      url = data.page.permalink;
    } else if (data.page.url) {
      url = data.page.url;
    }
  }

  // console.log('fixing schema of ' + url);

  // resolve thumbnail
  let thumbnail =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png';
  if (data.page) {
    const photos = Array.isArray(data.page.photos) ? data.page.photos[0] : null;
    const cover = data.page.cover || data.page.thumbnail;
    if (cover) {
      thumbnail = cover;
    } else if (photos) {
      thumbnail = photos;
    }
  }

  // resolve author
  let author = getAuthorName(data.config.author);
  if (data.page) {
    if (data.page.author) {
      author = getAuthorName(data.page.author);
    }
  }

  const schema = [];

  // setup schema sitelink
  if (hexoSeoConfig.schema.sitelink && hexoSeoConfig.schema.sitelink.searchUrl) {
    sitelink.url = data.config.url || '';
    const term = '{search_term_string}';
    let urlTerm = (hexoSeoConfig.schema.sitelink.searchUrl || '').trim();
    // fix suffix term string
    if (urlTerm.length > 0) {
      if (!urlTerm.endsWith(term)) urlTerm = urlTerm + term;
      sitelink.potentialAction.target = urlTerm;
      schema.push(sitelink);
    }
  }

  if (is.post) {
    // setup schema breadcrumb for post
    if (hexoSeoConfig.schema.breadcrumb && hexoSeoConfig.schema.breadcrumb.enable) {
      const schemaBreadcrumbs: typeof breadcrumbs.itemListElement = [];
      if (data.page) {
        if (data.page.tags && data.page.tags.length > 0) {
          data.page.tags.forEach((tag) => {
            const o = {
              '@type': 'ListItem',
              position: schemaBreadcrumbs.length + 1,
              item: tag['permalink'],
              name: tag['name']
            };
            schemaBreadcrumbs.push(o);
          });
        }

        if (data.page.categories && data.page.categories.length > 0) {
          data.page.categories.forEach((category) => {
            const o = {
              '@type': 'ListItem',
              position: schemaBreadcrumbs.length + 1,
              item: category['permalink'],
              name: category['name']
            };
            schemaBreadcrumbs.push(<any>o);
          });
        }

        schemaBreadcrumbs.push({
          '@type': 'ListItem',
          position: schemaBreadcrumbs.length + 1,
          item: url,
          name: title
        });
      }

      if (schemaBreadcrumbs.length > 0) {
        breadcrumbs.itemListElement = schemaBreadcrumbs;
        schema.push(breadcrumbs);
      }
    }

    if (hexoSeoConfig.schema.article && hexoSeoConfig.schema.article.enable) {
      article.mainEntityOfPage['@id'] = url;
      article.headline = title;
      article.description = description;
      article.image.url = thumbnail;
      article.author.name = author;
      article.publisher.name = author;
      article.dateModified = moment(new Date(String(data.page.updated)))
        .tz(data.config.timezone || 'UTC')
        .format();
      article.datePublished = moment(new Date(String(data.page.date)))
        .tz(data.config.timezone || 'UTC')
        .format();
      schema.push(article);
    }
  } else if (is.home && hexoSeoConfig.schema.homepage.enable) {
    const posts = hexo.locals
      .get('posts')
      .data.map(({ title, keywords, description, subtitle, excerpt, raw, tags, categories, path, author }) => {
        return {
          title,
          author,
          keywords,
          description: description || subtitle || excerpt,
          raw,
          permalink: path,
          tags: tags.data.map((tag: { name: string }) => tag.name),
          categories: categories.data.map((category: { name: string }) => category.name)
        };
      }) as { title: string; description: string; permalink: string; author: any }[];
    // console.log(posts);
    homepage.mainEntity.itemListElement = [];
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      homepage.mainEntity.itemListElement.push({
        '@type': 'Article',
        position: '' + (i + 1),
        headline: post.title,
        author: {
          '@type': 'Person',
          image:
            'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/120px-No_image_available.svg.png',
          name: getAuthorName(post.author),
          sameAs: url_for.bind(this)(post.permalink)
        },
        image:
          'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/120px-No_image_available.svg.png'
      });
    }
    // push schema webpage for homepage
    schema.push(homepage);
  }

  if (schema.length > 0) {
    const JSONschema = JSON.stringify(schema, null, 2);
    const schemahtml = `\n\n<script type="application/ld+json" id="hexo-seo-schema">${JSONschema}</script>\n\n`;
    if (['archive', 'tags', data.config.title, 'categories', 'homepage'].includes(title.toLowerCase())) {
      logger.debug('schema created', title, url);
    }
    if (isDev) {
      dump('schema-' + title + '.json', schemahtml);
    }

    if (schemahtml) {
      const head = dom.getElementsByTagName('head')[0];
      if (head) {
        head.insertAdjacentHTML('beforeend', schemahtml);
      } else {
        const message = `Fail apply schema json on ${data.path}`;
        if (typeof hexo !== 'undefined') {
          hexo.log.error(logname, message);
        } else {
          console.error(logname, message);
        }
      }
    }
  }
}
