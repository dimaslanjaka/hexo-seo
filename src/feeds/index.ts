import { readFileSync } from 'fs-extra';
import Hexo from 'hexo';
import { Args } from 'hexo/dist/hexo/index-d';
import { NodeJSLikeCallback } from 'hexo/dist/types';
import nunjucks from 'nunjucks';
import path from 'path';
import { normalizePathUnix, writefile } from 'sbg-utility';

export function generateFeeds(this: Hexo, _args: Args, callback?: NodeJSLikeCallback<any>) {
  try {
    const config = this.config;
    const templateDir = path.join(__dirname, 'views');
    const env = nunjucks.configure(templateDir, {
      noCache: true,
      autoescape: false, // set autoescape to false
      throwOnUndefined: false,
      trimBlocks: false,
      lstripBlocks: false
    });

    // Use render, ensuring the correct file path is referenced.
    const result = env.renderString(readFileSync(path.join(templateDir, 'rss.xml'), 'utf-8'), {
      siteTitle: config.title,
      siteUrl: config.url,
      siteDescription: config.description,
      language: Array.isArray(config.language) ? config.language[0] : config.language || 'en-us',
      lastBuildDate: 'Sat, 26 Oct 2024 10:00:00 +0000',
      pubDate: 'Sat, 26 Oct 2024 10:00:00 +0000',
      ttl: 1800,
      items: [
        {
          title: 'Example Post Title',
          link: 'https://www.yoursite.com/example-post',
          description: 'This is an example description for the post.',
          authorEmail: 'author@example.com',
          authorName: 'Author Name',
          category: 'Category Name',
          pubDate: 'Sat, 26 Oct 2024 09:00:00 +0000',
          guid: 'https://www.yoursite.com/example-post'
        }
      ]
    });

    const paths = [path.join(config.source_dir, 'rss.xml'), path.join(config.public_dir, 'rss.xml')];
    paths.forEach((file) => writefile(file, result));
    hexo.log.info(
      `[hexo-seo] Local search saved to ${paths.map((file) => normalizePathUnix(file).replace(normalizePathUnix(hexo.base_dir), '')).join(', ')}.`
    );
    callback(null);
  } catch (error) {
    callback(error);
  }
}
