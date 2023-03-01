'use strict';

import ansiColors from 'ansi-colors';
import fs from 'fs-extra';
import Hexo from 'hexo';
import minimist from 'minimist';
import serveStatic from 'serve-static';
import getConfig, { cache_key_router, coreCache, setMode } from './config';
import { buildFolder, tmpFolder } from './fm';
import HexoSeoHtml from './html';
import HexoSeoCss from './minifier/css';
import HexoSeoJs from './minifier/js';
import scheduler from './scheduler';
import bindProcessExit from './utils/cleanup';

const argv = minimist(process.argv.slice(2));

// --development
const arg = typeof argv['development'] == 'boolean' && argv['development'];

// set NODE_ENV = "development"
const env = process.env.NODE_ENV && process.env.NODE_ENV.toString().toLowerCase() === 'development';

// define is development
export const isDev = arg || env;

const logname = ansiColors.magentaBright('hexo-seo');

// core
export default function HexoSeo(hexo: Hexo) {
  //console.log("hexo-seo starting", { dev: env });
  // return if hexo-seo configuration unavailable
  if (typeof hexo.config.seo == 'undefined') {
    hexo.log.error(logname, 'seo options not found');
    return;
  }

  // detect hexo arguments
  let hexoCmd: string;
  if (hexo.env.args._ && hexo.env.args._.length > 0) {
    for (let i = 0; i < hexo.env.args._.length; i++) {
      if (hexo.env.args._[i] == 's' || hexo.env.args._[i] == 'server') {
        hexoCmd = 'server';
        setMode('s');
        break;
      }
      if (hexo.env.args._[i] == 'd' || hexo.env.args._[i] == 'deploy') {
        hexoCmd = 'deploy';
        break;
      }
      if (hexo.env.args._[i] == 'g' || hexo.env.args._[i] == 'generate') {
        hexoCmd = 'generate';
        setMode('g');
        break;
      }
      if (hexo.env.args._[i] == 'c' || hexo.env.args._[i] == 'clean') {
        hexoCmd = 'clean';
        setMode('c');
        break;
      }
    }
  }

  // clean build and temp folder on `hexo clean`
  hexo.extend.filter.register('after_clean', function () {
    // remove some other temporary files
    hexo.log.info(logname + '(clean)', 'cleaning build and temp folder');
    if (fs.existsSync(tmpFolder)) fs.rmSync(tmpFolder, { recursive: true, force: true });
    if (fs.existsSync(buildFolder)) fs.rmSync(buildFolder, { recursive: true, force: true });
  });

  // execute scheduled functions before process exit
  if (hexoCmd != 'clean') {
    bindProcessExit('scheduler_on_exit', function () {
      hexo.log.info(logname, 'executing scheduled functions');
      scheduler.executeAll();
    });
  }

  // bind configuration
  const config = getConfig(hexo);
  hexo.config.seo = config;

  // Registers serving of the lib used by the plugin with Hexo.
  const concatRoutes = coreCache.getSync(cache_key_router, [] as { path: string; absolute: string }[]);

  for (let i = 0; i < concatRoutes.length; i++) {
    const { path, absolute } = concatRoutes[i];
    hexo.log.debug(logname, 'register', path);
    hexo.extend.generator.register('js', () => {
      return {
        path,
        data: () => fs.createReadStream(absolute)
      };
    });
  }

  // Register build folder to used statically
  if (!fs.existsSync(buildFolder)) fs.mkdirSync(buildFolder, { recursive: true });
  // register when hexo server running
  hexo.extend.filter.register('server_middleware', function (app) {
    app.use(serveStatic(buildFolder, { index: ['index.html', 'index.htm'], extensions: ['js', 'css'] }));
  });

  if (config.js && config.js.enable) {
    // minify javascripts
    hexo.extend.filter.register('after_render:js', HexoSeoJs);
  }
  if (config.css && config.css.enable) {
    // minify css
    hexo.extend.filter.register('after_render:css', HexoSeoCss);
  }
  if (config.html && config.html.enable) {
    // all in one html fixer
    hexo.extend.filter.register('after_render:html', HexoSeoHtml);
  }
}
