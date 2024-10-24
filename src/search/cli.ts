import Hexo from 'hexo';
import { Args } from 'hexo/dist/hexo/index-d';
import { NodeJSLikeCallback } from 'hexo/dist/types';
import path from 'path';
import { array_unique, md5, normalizePath, writefile } from 'sbg-utility';
import Document from 'warehouse/dist/document';
import getConfig from '../config';
import { getAuthorName } from '../utils/getAuthor';

const INDEXED_PROPERTIES = ['title', 'date', 'updated', 'slug', 'excerpt', 'permalink', 'layout', 'image'];

function pick(object: Document<any>, properties: any[]) {
  return properties.reduce(function (filteredObj, prop) {
    filteredObj[prop] = object[prop];
    return filteredObj;
  }, {});
}

export async function hexoSeoSearch(this: Hexo, args: Args, callback?: NodeJSLikeCallback<any>) {
  try {
    const hexo = this;
    const hexoConfig = hexo.config;
    const config = getConfig(hexo);
    config.search.type = array_unique(config.search.type);
    const searchConfig = config.search;
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
    const dataToSave = indexedPages.map((data) => {
      const storedPost = pick(data, INDEXED_PROPERTIES);
      storedPost.objectID = md5(data.path);
      storedPost.date_as_int = Date.parse(data.date) / 1000;
      storedPost.updated_as_int = Date.parse(data.updated) / 1000;
      storedPost.permalink = storedPost.permalink.replace(/\/index.html$/, '/');

      if (data.categories && (Array.isArray(data.categories) || typeof data.categories.toArray === 'function')) {
        storedPost.categories = (data.categories.toArray ? data.categories.toArray() : data.categories).map(function (
          item: Document<any>
        ) {
          return pick(item, ['name', 'path']);
        });
      }

      if (data.tags && (Array.isArray(data.tags) || typeof data.tags.toArray === 'function')) {
        storedPost.tags = (data.tags.toArray ? data.tags.toArray() : data.tags).map(function (item) {
          return pick(item, ['name', 'path']);
        });
      }

      storedPost.author = getAuthorName(data.author || hexoConfig.author);

      return storedPost;
    });
    const paths = [
      path.join(config.source_dir, 'hexo-seo-search.json'),
      path.join(config.public_dir, 'hexo-seo-search.json')
    ];
    hexo.log.info('[hexo-seo] %d records to index (%s).', indexedPages.length, searchConfig.type.join(', '));
    paths.forEach((file) => writefile(file, JSON.stringify(dataToSave)));
    hexo.log.info(
      `[hexo-seo] Local search saved to ${paths.map((file) => normalizePath(file).replace(normalizePath(hexo.base_dir), '')).join(', ')}.`
    );
    hexo.log.info('[hexo-seo] Local search indexing done.');
  } catch (error) {
    callback(error);
  }
}
