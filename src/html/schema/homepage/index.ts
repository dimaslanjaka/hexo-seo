import { HexoLocalsData } from 'hexo/dist/hexo/locals-d';
import { SchemaArticleOptions } from '../article';
import data from './data-index.json';

type articleListElement = (typeof data.mainEntity.itemListElement)[0];
export interface homepageArticle extends ObjectConstructor, articleListElement {
  [key: string]: any;
}

class schemaHomepage {
  schema = data;
  options: SchemaArticleOptions;
  hexo: HexoLocalsData;
  constructor(options?: SchemaArticleOptions) {
    this.options = options;
    this.hexo = options.hexo;
    // remove default articles
    this.schema.mainEntity.itemListElement = [];
  }

  addArticle(article: { author?: { name?: string; image?: string; url?: string }; title: string; image?: string }) {
    // get sample data
    const item = data.mainEntity.itemListElement[0];

    // set metadata
    item.headline = article.title;
    if (typeof article.image == 'string') item.image = article.image;
    item.position = this.schema.mainEntity.itemListElement.length.toString();

    // set author data
    if (typeof article.author == 'object') {
      if (typeof article.author.image == 'string') {
        item.author.image = article.author.image;
      }
      if (typeof article.author.name == 'string') {
        item.author.name = article.author.name;
      }
      if (typeof article.author.url == 'string' || Array.isArray(article.author.url)) {
        item.author.sameAs = article.author.url;
      }
    }
  }

  /**
   * Set custom property and value
   * @param key
   * @param value
   */
  set(key: string, value: any) {
    this.schema[key] = value;
  }

  /**
   * get schema property
   */
  get(key: string | number) {
    return this.schema[key];
  }

  toString() {
    if (this.options.pretty) {
      return JSON.stringify(this.schema, null, 2);
    }
    return JSON.stringify(this.schema);
  }
}

export default schemaHomepage;
