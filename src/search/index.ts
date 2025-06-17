import Hexo from 'hexo';
import { Args } from 'hexo/dist/hexo/index-d';
import { NodeJSLikeCallback } from 'hexo/dist/types';
import path from 'path';
import { array_unique, md5, normalizePathUnix, writefile } from 'sbg-utility';
import Document from 'warehouse/dist/document';
import getConfig from '../config';
import { getAuthorName } from '../utils/getAuthor';

export const INDEXED_PROPERTIES = [
  'title',
  'date',
  'updated',
  'slug', // jekyll front-matter
  'excerpt',
  'permalink',
  'layout',
  'image',
  'categories',
  'tags',
  'subtitle', // NextJS front-matter
  'updated',
  'description', // jekyll front-matter
  'thumbnail' // jekyll front-matter
];

/**
 * Picks specified properties from a Document object and optionally fixes missing properties.
 *
 * @param object - The Document object from which to pick properties.
 * @param properties - An array of property names to extract from the Document.
 * @param fix - A boolean flag indicating whether to add default values for missing properties.
 *               If true, the function will attempt to assign default values to properties that are undefined in the result.
 *               Defaults to false.
 * @returns An object containing the picked properties and their values. If `fix` is true, any missing properties will be assigned
 *          default values (if available).
 */
export function pickPostObjectData(object: Document<any>, properties: any[], fix: boolean = false) {
  const result = properties.reduce(function (filteredObj, prop) {
    filteredObj[prop] = object[prop];
    return filteredObj;
  }, {});

  // fix labels
  if (result.category && !result.categories) result.categories = result.category;
  if (result.tag && !result.tags) result.tags = result.tag;

  if (fix) {
    // Fix missing properties
    if (!result.description && result.excerpt) result.description = result.excerpt;
    if (!result.excerpt && result.description) result.excerpt = result.description;
    if (!result.description && result.subtitle) result.description = result.subtitle;
    if (!result.thumbnail && result.image) result.thumbnail = result.image;
    if (!result.image && result.thumbnail) result.image = result.thumbnail;
    if (!result.image && !result.thumbnail) {
      // no image in this page/post
      // get from config.seo.img.default
      if (typeof hexo !== 'undefined' && hexo.config.seo.img.default) {
        result.image = hexo.config.seo.img.default;
        result.thumbnail = hexo.config.seo.img.default;
      }
    }
  }

  return result;
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
      const storedPost = pickPostObjectData(data, INDEXED_PROPERTIES, true);
      storedPost.objectID = md5(data.path);
      storedPost.date_as_int = Date.parse(data.date) / 1000;
      storedPost.updated_as_int = Date.parse(data.updated) / 1000;
      storedPost.permalink = storedPost.permalink.replace(/\/index.html$/, '/');

      if (data.categories && (Array.isArray(data.categories) || typeof data.categories.toArray === 'function')) {
        storedPost.categories = (data.categories.toArray ? data.categories.toArray() : data.categories).map(function (
          item: Document<any>
        ) {
          return pickPostObjectData(item, ['name', 'path']);
        });
      }

      if (data.tags && (Array.isArray(data.tags) || typeof data.tags.toArray === 'function')) {
        storedPost.tags = (data.tags.toArray ? data.tags.toArray() : data.tags).map(function (item) {
          return pickPostObjectData(item, ['name', 'path']);
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
      `[hexo-seo] Local search saved to ${paths.map((file) => normalizePathUnix(file).replace(normalizePathUnix(hexo.base_dir), '')).join(', ')}.`
    );
    hexo.log.info('[hexo-seo] Local search indexing done.');
  } catch (error) {
    callback(error);
  }
}
