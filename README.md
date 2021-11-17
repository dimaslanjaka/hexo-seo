# hexo-seo
Automated Hexo Seo Optimizer (under development)

[![npm version](https://badge.fury.io/js/hexo-seo.svg)](https://badge.fury.io/js/hexo-seo)
[![Npm package yearly downloads](https://badgen.net/npm/dy/hexo-seo)](https://npmjs.com/package/hexo-seo)
[![Minimum node.js version](https://badgen.net/npm/node/hexo-seo)](https://npmjs.com/package/hexo-seo)

> this plugin builded with typescript

# Installation
Using Git Repository (Development)
```shell
npm i git+https://github.com/dimaslanjaka/hexo-seo.git
```
Using NPM Repository (Production)
```shell
npm i hexo-seo
```

# Features

- Auto add anchor title (if not exists)
- Auto determine anchor external link and nofollow them
- Auto replace broken images
- CSS JS HTML minifier
- Auto add alternate and title of images

# Usage
> this plugin will run the functions based on development mode or production mode

**development mode**
```shell
set NODE_ENV=development && hexo server
# or
hexo server --development
```

# Preview

![](./images/rich-snippets-result.png)

# Troubleshoot

- node_libcurl binding not found
```shell
sudo apt-get install libcurl4-openssl-dev -y
# run below codes only if above package already installed
rm -rf node_modules
npm install node-libcurl --build-from-source
```
- Fix javascript heap out of memory
```shell
export NODE_OPTIONS=--max_old_space_size=8096
```

## Project with this package

<a href="https://github.com/dimaslanjaka/dimaslanjaka.github.io/tree/compiler" alt="github">Github <img src="https://cdn-icons-png.flaticon.com/512/25/25231.png" width="20px" height="20px" /></a> |
[dimaslanjaka.github.io](https://dimaslanjaka.github.io)

