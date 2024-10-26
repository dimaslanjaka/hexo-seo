import Bluebird from 'bluebird';
import fs from 'fs-extra';
import he from 'he';
import Hexo from 'hexo';
import { Args } from 'hexo/dist/hexo/index-d';
import { NodeJSLikeCallback } from 'hexo/dist/types';
import nunjucks from 'nunjucks';
import path from 'path';
import { writefile } from 'sbg-utility';
import Document from 'warehouse/dist/document';
import getConfig from '../config';
import { INDEXED_PROPERTIES, pickPostObjectData } from '../search/cli';
import { getAuthorEmail, getAuthorName } from '../utils/getAuthor';

export async function generateFeeds(this: Hexo, _args: Args, callback?: NodeJSLikeCallback<any>) {
  try {
    const hexoConfig = this.config;
    const config = getConfig(hexo);
    const searchConfig = config.feed;
    await hexo.load();
    const indexedPages = [];
    if (searchConfig.type.includes('post')) {
      const posts = hexo.database.model('Post').find({ published: true }).toArray();
      indexedPages.push(...posts);
    }
    if (searchConfig.type.includes('page')) {
      const pages = hexo.database.model('Page').toArray(); //.find({ published: true }).toArray();
      // .find({
      //   layout: { $in: pageLayouts }
      // });
      indexedPages.push(...pages);
    }

    const pageItems = indexedPages
      .map((data) => {
        const storedPost = pickPostObjectData(data, INDEXED_PROPERTIES, true);
        if (!storedPost.layout || storedPost.layout === 'false') return undefined;

        storedPost.permalink = storedPost.permalink.replace(/\/index.html$/, '/');
        if (data.categories && (Array.isArray(data.categories) || typeof data.categories.toArray === 'function')) {
          storedPost.categories = (data.categories.toArray ? data.categories.toArray() : data.categories).map(function (
            item: Document<any>
          ) {
            return pickPostObjectData(item, ['name', 'path']);
          });
        }

        if (data.tags && (Array.isArray(data.tags) || typeof data.tags.toArray === 'function')) {
          storedPost.tags = (data.tags.toArray ? data.tags.toArray() : data.tags).map(function (item: Document<any>) {
            return pickPostObjectData(item, ['name', 'path']);
          });
        }

        storedPost.authorName = getAuthorName(data.author || hexoConfig.author);
        storedPost.authorEmail = getAuthorEmail(data.author || hexoConfig.author);
        storedPost.pubDate = storedPost.date.utc().format('ddd, DD MMM YYYY HH:mm:ss +0000');
        storedPost.link = storedPost.permalink;
        storedPost.guid = storedPost.permalink;

        // use site description when empty
        if (!storedPost.description) storedPost.description = hexoConfig.description;

        if (Array.isArray(storedPost.categories)) {
          storedPost.category = storedPost.categories.map((item: { name: string }) => item.name);
        }

        // empty category, will mapped into uncategorized
        if (!storedPost.categories || storedPost.categories.length === 0) {
          storedPost.categories = [{ name: 'uncategorized' }];
        }

        storedPost.title = he.encode(storedPost.title || '');
        storedPost.description = he.encode(storedPost.description || storedPost.title);

        // skip empty page title
        if (storedPost.title.length === 0) return undefined;

        // trim string values
        for (const key in storedPost) {
          if (Object.prototype.hasOwnProperty.call(storedPost, key)) {
            const value = storedPost[key];
            if (typeof value === 'string') storedPost[key] = (value || '').trim();
          }
        }

        if (storedPost.layout === 'post') {
          console.log(storedPost);
        }

        // {
        //   title: 'Example Post Title',
        //   link: 'https://www.yoursite.com/example-post',
        //   description: 'This is an example description for the post.',
        //   authorEmail: 'author@example.com',
        //   authorName: 'Author Name',
        //   category: 'Category Name',
        //   pubDate: 'Sat, 26 Oct 2024 09:00:00 +0000',
        //   guid: 'https://www.yoursite.com/example-post'
        // }
        return storedPost;
      })
      .filter((o) => typeof o === 'object');

    const templateDir = path.join(__dirname, 'views');
    const env = nunjucks.configure(templateDir, {
      noCache: true,
      autoescape: false, // set autoescape to false
      throwOnUndefined: false,
      trimBlocks: false,
      lstripBlocks: false
    });

    // Use render, ensuring the correct file path is referenced.
    const result = env.renderString(fs.readFileSync(path.join(templateDir, 'rss.xml'), 'utf-8'), {
      siteTitle: hexoConfig.title,
      siteUrl: hexoConfig.url,
      siteDescription: hexoConfig.description,
      language: Array.isArray(hexoConfig.language) ? hexoConfig.language[0] : hexoConfig.language || 'en-us',
      lastBuildDate: 'Sat, 26 Oct 2024 10:00:00 +0000',
      pubDate: 'Sat, 26 Oct 2024 10:00:00 +0000',
      ttl: 1800,
      items: pageItems
    });

    const paths = [path.join(config.source_dir, 'rss.xml'), path.join(config.public_dir, 'rss.xml')];
    return Bluebird.all(paths)
      .each((file) => {
        // Split the file content into lines and filter out empty lines
        const cleanedData = result
          .split('\n') // Split by new lines
          .filter((line) => line.trim() !== '') // Remove empty lines
          .join('\n'); // Join back into a single string
        writefile(file, cleanedData);
        hexo.log.info(`[hexo-seo] RSS 2.0 saved to ${file}.`);
      })
      .catch(callback);
  } catch (error) {
    callback(error);
  }
}
