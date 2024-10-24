import fs from 'node:fs';
import pathFn from 'node:path';
import readline from 'node:readline';

export function generatorURLs(locals) {
  const log = this.log;
  const config = this.config;
  let count = config.hexo_indexnow.count;
  const urlsPath = config.hexo_indexnow.txt_name;
  const linkReplace = config.hexo_indexnow.replace;
  if (count === 'latest') {
    count = 1;
  } else if (!count) {
    return;
  }
  log.info(`Generating urls for last ${count} posts`);
  const urls = []
    .concat(locals.posts.toArray())
    .map((post) => {
      return {
        date: post.updated || post.date,
        permalink: post.permalink
      };
    })
    .sort((a, b) => {
      return b.date - a.date;
    })
    .slice(0, count)
    .join('\n');
  log.info(`Posts urls generated in ${urlsPath} \n ${urls}`);
  return {
    path: urlsPath,
    data: urls
  };
}

export function apiKey(locals) {
  const log = this.log;
  const apiKey = this.config.hexo_indexnow.apikey;
  log.info('Indexnow apikey generated');
  return {
    path: apiKey,
    data: apiKey
  };
}

function FileReadline(ReadName: string, callback: (arr: any[]) => void) {
  const fRead = fs.createReadStream(ReadName, 'utf8');
  const objReadline = readline.createInterface({
    input: fRead
  });
  const arr = [];
  objReadline.on('line', function (line) {
    arr.push(line);
  });
  objReadline.on('close', function () {
    callback(arr);
  });
}

export function submitURLs(args) {
  const log = this.log;
  const config = this.config;
  const publicDir = this.public_dir;
  const urlsPath = config.hexo_indexnow.txt_name;
  const site = config.url;
  let IndexServer = config.hexo_indexnow.server;
  switch (IndexServer) {
    case 'bing':
      IndexServer = 'https://www.bing.com/indexnow';
      break;
    case 'yandex':
      IndexServer = 'https://yandex.com/indexnow';
      break;
    case 'indexnow':
      IndexServer = 'https://api.indexnow.org/indexnow';
      break;
    case 'seznam.cz':
      IndexServer = 'https://search.seznam.cz/indexnow';
      break;
    default:
      log.info('Unknown search engine,use indexnow.org');
      IndexServer = 'https://api.indexnow.org/indexnow';
  }
  const apiKey = config.hexo_indexnow.apikey;
  const UrlsFile = pathFn.join(publicDir, urlsPath);
  FileReadline(UrlsFile, (data) => {
    log.info('Submitting indexnow urls');
    const submitData = {
      host: site,
      key: apiKey,
      keyLocation: `${site}/${apiKey}`,
      urlList: data
    };
    fetch(IndexServer, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(submitData)
    })
      .then((r) => {
        if (r.ok) {
          log.info('indexnow submitted');
        } else {
          log.info('indexnow error');
          log.info(r);
        }
      })
      .catch((e) => {
        throw Error(e);
      });
  });
}

hexo.extend.generator.register('indexnow_url_generator', generatorURLs);
hexo.extend.generator.register('indexnow_key_generator', apiKey);
hexo.extend.deployer.register('indexnow_url_submitter', submitURLs);

// hexo_indexnow:
//   count: 1 # number or "latest"
//   txt_name: indexnow.txt # links file name
//   apikey: xxxxxx # indexNow Apikey
//   server: bing # The server that received the request
// # For example: bing, yandex, indexnow

// deploy:
//   - type: indexnow_url_submitter
