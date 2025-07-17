import path from 'path';
import fs from 'fs';

const defaultConfig = {
  cache: true,
  js: {
    enable: true,
    concat: {
      enable: true
    }
  },
  css: {
    enable: false,
    exclude: ['*.min.css', '**/*.min.css']
  },
  html: {
    enable: false,
    fix: false,
    exclude: ['*.min.{htm,html}'],
    collapseBooleanAttributes: true,
    collapseWhitespace: true,
    ignoreCustomComments: [{}, {}],
    removeComments: true,
    removeEmptyAttributes: true,
    removeScriptTypeAttributes: true,
    removeStyleLinkTypeAttributes: true,
    minifyJS: true,
    minifyCSS: true
  },
  img: {
    enable: false,
    default:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png',
    onerror: 'clientside',
    broken: false
  },
  host: 'example.com',
  links: {
    blank: true,
    enable: true,
    allow: ['webmanajemen.com'],
    exclude: ['webmanajemen.com', 'web-manajemen.blogspot.com']
  },
  schema: {
    sitelink: {
      enable: false,
      searchUrl: 'https://www.webmanajemen.com/hexo-seo/search?q='
    },
    article: {
      enable: false
    },
    breadcrumb: {
      enable: false
    },
    homepage: {
      enable: true
    }
  },
  sitemap: false,
  theme_dir: 'D:/Repositories/hexo-seo/tmp/site/themes/landscape',
  source_dir: 'D:/Repositories/hexo-seo/tmp/site',
  public_dir: 'D:/Repositories/hexo-seo/tmp/site/public',
  post_dir: 'D:/Repositories/hexo-seo/tmp/site/_posts',
  search: {
    type: ['post', 'page']
  },
  feed: {
    type: ['post', 'page'],
    icon: 'https://w7.pngwing.com/pngs/745/306/png-transparent-gallery-image-images-photo-picture-pictures-set-app-incredibles-icon-thumbnail.png'
  }
};

fs.writeFileSync(path.join(__dirname, 'src/_config_data.json'), JSON.stringify(defaultConfig, null, 2), 'utf8');
