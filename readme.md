# hexo-seo
Automated Hexo Seo Optimizer.
[![Post Update](https://github.com/dimaslanjaka/source-posts/actions/workflows/build-site-reusable.yml/badge.svg)](https://github.com/dimaslanjaka/source-posts/actions/workflows/build-site-reusable.yml)
<!--
[![Test Demo](https://github.com/dimaslanjaka/hexo-seo/actions/workflows/test-demo.yml/badge.svg)](https://github.com/dimaslanjaka/hexo-seo/actions/workflows/test-demo.yml)
[![Build Release](https://github.com/dimaslanjaka/hexo-seo/actions/workflows/build-release.yml/badge.svg)](https://github.com/dimaslanjaka/hexo-seo/actions/workflows/build-release.yml)
-->

# Features

- Auto add anchor title (if not exists)
- Auto determine anchor external link and nofollow them
- ~Auto replace broken images~
- Auto compress CSS JS HTML
- Auto add alternate and title of images
- Auto add sitemap (forked from **yoast seo wordpress plugin**)
- Tested on hexo instances with 1000 more posts and pages
- Concatenate all javascripts into one file
- Rich snippets (breadcrumbs, website, article)

> ## The reason why some features are removed
> Separated due to very high memory usage and risk of HEAP MEMORY errors. so I will merge it to https://github.com/dimaslanjaka/static-blog-generator as a specific task


# demo
demo site generated with `hexo-seo`
- [YoastSEO sitemap](https://www.webmanajemen.com/sitemap.xml)
- [Rich Snippet](https://search.google.com/test/rich-results?hl=en&url=https%3A%2F%2Fwww.webmanajemen.com%2Fchimeraland%2Fblacklist-player.html)

# Installation

Using NPM Repository (Production)
```shell
npm i hexo-seo
```

Using Git Repository (Development)
```shell
npm i git+https://github.com/dimaslanjaka/hexo-seo.git#pre-release
```

### Packages Links
> Using tarball is useful for git which not installed properly or for you in chinese mainland

| description | link |
| :--- | :--- |
| full link tarball (recommended) | https://github.com/dimaslanjaka/hexo-seo/raw/master/release/hexo-seo.tgz |
| repository tarball | https://github.com/dimaslanjaka/hexo-seo/tarball/master |
| git repository | [git+https://github.com/dimaslanjaka/hexo-seo.git](https://github.com/dimaslanjaka/hexo-seo.git) |

# Usage
**Configuration**

[config full example](https://github.com/dimaslanjaka/site/blob/hexo-seo/_config.yml#L138)

```yaml
# https://github.com/dimaslanjaka/hexo-seo
seo:
  # minify html
  html:
    enable: true
    # fix invalid html
    fix: true
    # exclude from minify
    exclude:
      - "*.min.{htm,html}"
  # minify css
  css:
    enable: true
    # If you want to customize the css minifier settings, you can put below
    # exclude css from minifying, multiple supported
    exclude:
      - "**/*.min.css"
  # minify js
  js:
    enable: true
    # concatenate all js into one tag
    ## WARNING: DO NOT USING ANOTHER MINIFIER PLUGIN
    concat: false
    # If you want to customize the js minifier settings, you can put below
    # exclude css from minifying, multiple supported
    exclude:
      - "**/*.min.js"
    # this is terser options, you can customize minifier with terser options https://github.com/terser/terser
    # below is config example
    options:
      compress:
        dead_code: true
      mangle:
        toplevel: true
        safari10: true
  # add rich snippets on every posts and pages
  schema:
    article:
      enable: true
    breadcrumb:
      enable: true
    sitelink:
      enable: true
      searchUrl: https://www.webmanajemen.com/search?q={search_term_string}
  # this function still under development because JAVASCRIPT HEAP MEMORY and my device is 8GB RAM
  img:
    enable: true
    # fix broken images
    broken: false
    # default broken images
    default: https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg
    # broken images methods
    # serverside : process broken images from server side (caused javascript heap out of memory, if your post large and your device has insufficient memory)
    # clientside : process broken image from client side browser with webjs
    onerror: serverside
  # external links fix
  links:
    # enable or false
    enable: true
    # allowed following links, otherwise nofollow others
    exclude:
      - webmanajemen.com
      - web-manajemen.blogspot.com
  # auto generate seo friendly sitemap on http://yoursite.com/sitemap.xml
  # forked from yoast seo
  sitemap: true
```
> ~this plugin will run the functions based on development mode or production mode~

**development mode**
```shell
set NODE_ENV=development && hexo server
```

# Preview

![Google Rich Snippets using schema markup v4](https://github.com/dimaslanjaka/hexo-seo/assets/12471057/4851e1e8-cfc6-474c-903d-fdd9c19061aa "Google Rich Snippets using schema markup v4")
![Schema Article](https://user-images.githubusercontent.com/12471057/142891853-7c00a941-26b6-4a69-9fcd-59b61505e920.png)
![Yoast SEO Sitemap](https://github.com/dimaslanjaka/hexo-seo/assets/12471057/c9bb6b8b-9aeb-4b83-b4cd-d86bafd33d50)

# Issues
- `hexo.on('exit')` not called at end of process
> no more issue [Hexo On Exit Event](https://github.com/hexojs/hexo/issues/4822)
> this plugin already have schedule function

# Troubleshoot

- node_libcurl binding not found
```shell
sudo apt-get install libcurl4-openssl-dev -y
# run below codes only if above package already installed
rm -rf node_modules/node-libcurl
npm install node-libcurl --build-from-source
```

- Fix javascript heap out of memory
```shell
# POSIX
export NODE_OPTIONS=--max_old_space_size=8096
# windows
set NODE_OPTIONS=--max_old_space_size=8096
```

- **important** after you update this plugin, you could cleaning the temp folders with:
```shell
hexo clean # this will cleaning temporarily folders of this plugin
```

# Status
[![Available](https://img.shields.io/github/issues/dimaslanjaka/hexo-seo/Status:%20Available.svg?color=brightgreen)](https://github.com/dimaslanjaka/hexo-seo/issues?q=is%3Aopen+is%3Aissue+label%3A%22Status%3A+Available%22) [![In Progress](https://img.shields.io/github/issues/dimaslanjaka/hexo-seo/Status:%20In%20Progress.svg)](https://github.com/dimaslanjaka/hexo-seo/labels/Status:%20In%20Progress) [![Review Needed](https://img.shields.io/github/issues/dimaslanjaka/hexo-seo/Status:%20Review%20Needed.svg)](https://github.com/dimaslanjaka/hexo-seo/labels/Status%3A%20Review%20Needed)

[![Critical](https://img.shields.io/github/issues/dimaslanjaka/hexo-seo/Priority:%20Critical.svg?color=critical
)](https://github.com/dimaslanjaka/hexo-seo/labels/Priority%3A%20Critical) [![High](https://img.shields.io/github/issues/dimaslanjaka/hexo-seo/Priority:%20High.svg?color=important)](https://github.com/dimaslanjaka/hexo-seo/labels/Priority%3A%20High) [![Medium](https://img.shields.io/github/issues/dimaslanjaka/hexo-seo/Priority:%20Medium.svg)](https://github.com/dimaslanjaka/hexo-seo/labels/Priority%3A%20Medium) [![Low](https://img.shields.io/github/issues/dimaslanjaka/hexo-seo/Priority:%20Low.svg)](https://github.com/dimaslanjaka/hexo-seo/labels/Priority%3A%20Low)

# Website using Hexo NodeJS Blogging System

[![Build And Tests](https://github.com/dimaslanjaka/dimaslanjaka.github.io/actions/workflows/page.yml/badge.svg?branch=compiler)](https://github.com/dimaslanjaka/dimaslanjaka.github.io/actions/workflows/page.yml)
[![GitHub](https://badgen.net/badge/icon/github?icon=github&label&style=flat-square)](https://github.com/dimaslanjaka/dimaslanjaka.github.io/tree/compiler)
[![webmanajemen.com](https://img.shields.io/website.svg?down_color=red&down_message=down&style=flat-square&up_color=green&up_message=up&label=webmanajemen.com&url=https://webmanajemen.com)](https://webmanajemen.com)

## hexo-adsense
[![npm version](https://badge.fury.io/js/hexo-adsense.svg?style=flat-square)](https://badge.fury.io/js/hexo-adsense)
[![Npm package yearly downloads](https://badgen.net/npm/dy/hexo-adsense?style=flat-square)](https://npmjs.com/package/hexo-adsense)
[![Minimum node.js version](https://badgen.net/npm/node/hexo-adsense?style=flat-square)](https://npmjs.com/package/hexo-adsense)
![GitHub repo size](https://img.shields.io/github/repo-size/dimaslanjaka/hexo-adsense?label=Repository%20Size&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/dimaslanjaka/hexo-adsense?color=blue&label=Last%20Commit&style=flat-square)

## hexo-seo
[![npm version](https://badge.fury.io/js/hexo-seo.svg?style=flat-square)](https://badge.fury.io/js/hexo-seo)
[![Npm package yearly downloads](https://badgen.net/npm/dy/hexo-seo?style=flat-square)](https://npmjs.com/package/hexo-seo)
[![Minimum node.js version](https://badgen.net/npm/node/hexo-seo?style=flat-square)](https://npmjs.com/package/hexo-seo)
![GitHub repo size](https://img.shields.io/github/repo-size/dimaslanjaka/hexo-seo?label=Repository%20Size&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/dimaslanjaka/hexo-seo?color=blue&label=Last%20Commit&style=flat-square)

## hexo-blogger-xml
[![npm version](https://badge.fury.io/js/hexo-blogger-xml.svg?style=flat-square)](https://badge.fury.io/js/hexo-blogger-xml)
[![Npm package yearly downloads](https://badgen.net/npm/dy/hexo-blogger-xml?style=flat-square)](https://npmjs.com/package/hexo-blogger-xml)
[![Minimum node.js version](https://badgen.net/npm/node/hexo-blogger-xml?style=flat-square)](https://npmjs.com/package/hexo-blogger-xml)
![GitHub repo size](https://img.shields.io/github/repo-size/dimaslanjaka/hexo-blogger-xml?label=Repository%20Size&style=flat-square)
![GitHub last commit](https://img.shields.io/github/last-commit/dimaslanjaka/hexo-blogger-xml?color=blue&label=Last%20Commit&style=flat-square)
