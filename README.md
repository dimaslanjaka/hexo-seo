# hexo-seo
Automated Hexo Seo Optimizer (under development)

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

![](./images/rich-snippets-result.png)

# Troubleshoot

- node_libcurl binding not found
```sh
sudo apt-get install libcurl4-openssl-dev -y
rm -rf node_modules
npm install node-libcurl --build-from-source
```