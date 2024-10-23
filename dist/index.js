// hexo-seo 2.0.0 by Dimas Lanjaka <dimaslanjaka@gmail.com> (https://github.com/dimaslanjaka)
'use strict';

var dotenv = require('dotenv');
var ansiColors = require('ansi-colors');
var fs = require('fs-extra');
var minimist = require('minimist');
var serveStatic = require('serve-static');
var sbgUtility = require('sbg-utility');
var path = require('upath');
var crypto = require('crypto');
var nodeHtmlParser = require('node-html-parser');
var parseUrl = require('url-parse');
var NodeCache = require('node-cache');
var hexoLog = require('hexo-log');
var require$$1 = require('fs');
var require$$2 = require('bluebird');
var require$$3 = require('underscore');
var assign = require('object-assign');
var terser = require('terser');
var minimatch = require('minimatch');
var rimraf = require('rimraf');
var sanitizeFilename = require('sanitize-filename');
var utils = require('util');
var GoogleNewsSitemap = require('google-news-sitemap');
var hexoIs = require('hexo-is');
var hexoUtil = require('hexo-util');
var moment = require('moment');
var xmlbuilder2 = require('xmlbuilder2');
var moment$1 = require('moment-timezone');
var CleanCSS = require('clean-css');

function _interopNamespaceDefault(e) {
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () { return e[k]; }
                });
            }
        });
    }
    n.default = e;
    return Object.freeze(n);
}

var fs__namespace = /*#__PURE__*/_interopNamespaceDefault(fs);
var path__namespace = /*#__PURE__*/_interopNamespaceDefault(path);
var hexoLog__namespace = /*#__PURE__*/_interopNamespaceDefault(hexoLog);
var GoogleNewsSitemap__namespace = /*#__PURE__*/_interopNamespaceDefault(GoogleNewsSitemap);

/**
 * Special values that tell deepmerge to perform a certain action.
 */
const actions = {
    defaultMerge: Symbol("deepmerge-ts: default merge"),
    skip: Symbol("deepmerge-ts: skip"),
};
/**
 * Special values that tell deepmergeInto to perform a certain action.
 */
({
    defaultMerge: actions.defaultMerge,
});

/**
 * The default function to update meta data.
 *
 * It doesn't update the meta data.
 */
function defaultMetaDataUpdater(previousMeta, metaMeta) {
    return metaMeta;
}
/**
 * The default function to filter values.
 *
 * It filters out undefined values.
 */
function defaultFilterValues(values, meta) {
    return values.filter((value) => value !== undefined);
}

/**
 * The different types of objects deepmerge-ts support.
 */
var ObjectType;
(function (ObjectType) {
    ObjectType[ObjectType["NOT"] = 0] = "NOT";
    ObjectType[ObjectType["RECORD"] = 1] = "RECORD";
    ObjectType[ObjectType["ARRAY"] = 2] = "ARRAY";
    ObjectType[ObjectType["SET"] = 3] = "SET";
    ObjectType[ObjectType["MAP"] = 4] = "MAP";
    ObjectType[ObjectType["OTHER"] = 5] = "OTHER";
})(ObjectType || (ObjectType = {}));
/**
 * Get the type of the given object.
 *
 * @param object - The object to get the type of.
 * @returns The type of the given object.
 */
function getObjectType(object) {
    if (typeof object !== "object" || object === null) {
        return 0 /* ObjectType.NOT */;
    }
    if (Array.isArray(object)) {
        return 2 /* ObjectType.ARRAY */;
    }
    if (isRecord(object)) {
        return 1 /* ObjectType.RECORD */;
    }
    if (object instanceof Set) {
        return 3 /* ObjectType.SET */;
    }
    if (object instanceof Map) {
        return 4 /* ObjectType.MAP */;
    }
    return 5 /* ObjectType.OTHER */;
}
/**
 * Get the keys of the given objects including symbol keys.
 *
 * Note: Only keys to enumerable properties are returned.
 *
 * @param objects - An array of objects to get the keys of.
 * @returns A set containing all the keys of all the given objects.
 */
function getKeys(objects) {
    const keys = new Set();
    for (const object of objects) {
        for (const key of [...Object.keys(object), ...Object.getOwnPropertySymbols(object)]) {
            keys.add(key);
        }
    }
    return keys;
}
/**
 * Does the given object have the given property.
 *
 * @param object - The object to test.
 * @param property - The property to test.
 * @returns Whether the object has the property.
 */
function objectHasProperty(object, property) {
    return typeof object === "object" && Object.prototype.propertyIsEnumerable.call(object, property);
}
/**
 * Get an iterable object that iterates over the given iterables.
 */
function getIterableOfIterables(iterables) {
    let m_iterablesIndex = 0;
    let m_iterator = iterables[0]?.[Symbol.iterator]();
    return {
        [Symbol.iterator]() {
            return {
                next() {
                    do {
                        if (m_iterator === undefined) {
                            return { done: true, value: undefined };
                        }
                        const result = m_iterator.next();
                        if (result.done === true) {
                            m_iterablesIndex += 1;
                            m_iterator = iterables[m_iterablesIndex]?.[Symbol.iterator]();
                            continue;
                        }
                        return {
                            done: false,
                            value: result.value,
                        };
                    } while (true);
                },
            };
        },
    };
}
// eslint-disable-next-line unicorn/prefer-set-has -- Array is more performant for a low number of elements.
const validRecordToStringValues = ["[object Object]", "[object Module]"];
/**
 * Does the given object appear to be a record.
 */
function isRecord(value) {
    // All records are objects.
    if (!validRecordToStringValues.includes(Object.prototype.toString.call(value))) {
        return false;
    }
    const { constructor } = value;
    // If has modified constructor.
    // eslint-disable-next-line ts/no-unnecessary-condition
    if (constructor === undefined) {
        return true;
    }
    const prototype = constructor.prototype;
    // If has modified prototype.
    if (prototype === null ||
        typeof prototype !== "object" ||
        !validRecordToStringValues.includes(Object.prototype.toString.call(prototype))) {
        return false;
    }
    // If constructor does not have an Object-specific method.
    // eslint-disable-next-line sonar/prefer-single-boolean-return, no-prototype-builtins
    if (!prototype.hasOwnProperty("isPrototypeOf")) {
        return false;
    }
    // Most likely a record.
    return true;
}

/**
 * The default strategy to merge records.
 *
 * @param values - The records.
 */
function mergeRecords$1(values, utils, meta) {
    const result = {};
    for (const key of getKeys(values)) {
        const propValues = [];
        for (const value of values) {
            if (objectHasProperty(value, key)) {
                propValues.push(value[key]);
            }
        }
        if (propValues.length === 0) {
            continue;
        }
        const updatedMeta = utils.metaDataUpdater(meta, {
            key,
            parents: values,
        });
        const propertyResult = mergeUnknowns(propValues, utils, updatedMeta);
        if (propertyResult === actions.skip) {
            continue;
        }
        if (key === "__proto__") {
            Object.defineProperty(result, key, {
                value: propertyResult,
                configurable: true,
                enumerable: true,
                writable: true,
            });
        }
        else {
            result[key] = propertyResult;
        }
    }
    return result;
}
/**
 * The default strategy to merge arrays.
 *
 * @param values - The arrays.
 */
function mergeArrays$1(values) {
    return values.flat();
}
/**
 * The default strategy to merge sets.
 *
 * @param values - The sets.
 */
function mergeSets$1(values) {
    return new Set(getIterableOfIterables(values));
}
/**
 * The default strategy to merge maps.
 *
 * @param values - The maps.
 */
function mergeMaps$1(values) {
    return new Map(getIterableOfIterables(values));
}
/**
 * Get the last non-undefined value in the given array.
 */
function mergeOthers$1(values) {
    return values.at(-1);
}
/**
 * The merge functions.
 */
const mergeFunctions = {
    mergeRecords: mergeRecords$1,
    mergeArrays: mergeArrays$1,
    mergeSets: mergeSets$1,
    mergeMaps: mergeMaps$1,
    mergeOthers: mergeOthers$1,
};

/**
 * Deeply merge objects.
 *
 * @param objects - The objects to merge.
 */
function deepmerge(...objects) {
    return deepmergeCustom({})(...objects);
}
function deepmergeCustom(options, rootMetaData) {
    const utils = getUtils(options, customizedDeepmerge);
    /**
     * The customized deepmerge function.
     */
    function customizedDeepmerge(...objects) {
        return mergeUnknowns(objects, utils, rootMetaData);
    }
    return customizedDeepmerge;
}
/**
 * The the utils that are available to the merge functions.
 *
 * @param options - The options the user specified
 */
function getUtils(options, customizedDeepmerge) {
    return {
        defaultMergeFunctions: mergeFunctions,
        mergeFunctions: {
            ...mergeFunctions,
            ...Object.fromEntries(Object.entries(options)
                .filter(([key, option]) => Object.hasOwn(mergeFunctions, key))
                .map(([key, option]) => (option === false ? [key, mergeFunctions.mergeOthers] : [key, option]))),
        },
        metaDataUpdater: (options.metaDataUpdater ?? defaultMetaDataUpdater),
        deepmerge: customizedDeepmerge,
        useImplicitDefaultMerging: options.enableImplicitDefaultMerging ?? false,
        filterValues: options.filterValues === false ? undefined : (options.filterValues ?? defaultFilterValues),
        actions,
    };
}
/**
 * Merge unknown things.
 *
 * @param values - The values.
 */
function mergeUnknowns(values, utils, meta) {
    const filteredValues = utils.filterValues?.(values, meta) ?? values;
    if (filteredValues.length === 0) {
        return undefined;
    }
    if (filteredValues.length === 1) {
        return mergeOthers(filteredValues, utils, meta);
    }
    const type = getObjectType(filteredValues[0]);
    if (type !== 0 /* ObjectType.NOT */ && type !== 5 /* ObjectType.OTHER */) {
        for (let m_index = 1; m_index < filteredValues.length; m_index++) {
            if (getObjectType(filteredValues[m_index]) === type) {
                continue;
            }
            return mergeOthers(filteredValues, utils, meta);
        }
    }
    switch (type) {
        case 1 /* ObjectType.RECORD */: {
            return mergeRecords(filteredValues, utils, meta);
        }
        case 2 /* ObjectType.ARRAY */: {
            return mergeArrays(filteredValues, utils, meta);
        }
        case 3 /* ObjectType.SET */: {
            return mergeSets(filteredValues, utils, meta);
        }
        case 4 /* ObjectType.MAP */: {
            return mergeMaps(filteredValues, utils, meta);
        }
        default: {
            return mergeOthers(filteredValues, utils, meta);
        }
    }
}
/**
 * Merge records.
 *
 * @param values - The records.
 */
function mergeRecords(values, utils, meta) {
    const result = utils.mergeFunctions.mergeRecords(values, utils, meta);
    if (result === actions.defaultMerge ||
        (utils.useImplicitDefaultMerging &&
            result === undefined &&
            utils.mergeFunctions.mergeRecords !== utils.defaultMergeFunctions.mergeRecords)) {
        return utils.defaultMergeFunctions.mergeRecords(values, utils, meta);
    }
    return result;
}
/**
 * Merge arrays.
 *
 * @param values - The arrays.
 */
function mergeArrays(values, utils, meta) {
    const result = utils.mergeFunctions.mergeArrays(values, utils, meta);
    if (result === actions.defaultMerge ||
        (utils.useImplicitDefaultMerging &&
            result === undefined &&
            utils.mergeFunctions.mergeArrays !== utils.defaultMergeFunctions.mergeArrays)) {
        return utils.defaultMergeFunctions.mergeArrays(values);
    }
    return result;
}
/**
 * Merge sets.
 *
 * @param values - The sets.
 */
function mergeSets(values, utils, meta) {
    const result = utils.mergeFunctions.mergeSets(values, utils, meta);
    if (result === actions.defaultMerge ||
        (utils.useImplicitDefaultMerging &&
            result === undefined &&
            utils.mergeFunctions.mergeSets !== utils.defaultMergeFunctions.mergeSets)) {
        return utils.defaultMergeFunctions.mergeSets(values);
    }
    return result;
}
/**
 * Merge maps.
 *
 * @param values - The maps.
 */
function mergeMaps(values, utils, meta) {
    const result = utils.mergeFunctions.mergeMaps(values, utils, meta);
    if (result === actions.defaultMerge ||
        (utils.useImplicitDefaultMerging &&
            result === undefined &&
            utils.mergeFunctions.mergeMaps !== utils.defaultMergeFunctions.mergeMaps)) {
        return utils.defaultMergeFunctions.mergeMaps(values);
    }
    return result;
}
/**
 * Merge other things.
 *
 * @param values - The other things.
 */
function mergeOthers(values, utils, meta) {
    const result = utils.mergeFunctions.mergeOthers(values, utils, meta);
    if (result === actions.defaultMerge ||
        (utils.useImplicitDefaultMerging &&
            result === undefined &&
            utils.mergeFunctions.mergeOthers !== utils.defaultMergeFunctions.mergeOthers)) {
        return utils.defaultMergeFunctions.mergeOthers(values);
    }
    return result;
}

/**
 * Temp folder
 */
const tmpFolder = path__namespace.join(process.cwd(), 'tmp/hexo-seo');
const buildFolder = path__namespace.join(tmpFolder, 'build');
/**
 * resolve dirname of file
 * @param filePath
 * @returns
 */
function resolveFile(filePath) {
  if (!fs__namespace.existsSync(path__namespace.dirname(filePath))) {
    fs__namespace.mkdirSync(path__namespace.dirname(filePath), {
      recursive: true
    });
  }
  return filePath;
}
/**
 * read file nested path
 * @param filePath
 * @param options
 * @returns
 */
function readFile(filePath, options, autocreate = undefined) {
  resolveFile(filePath);
  if (autocreate && !fs__namespace.existsSync(filePath)) {
    if (typeof autocreate === 'boolean') {
      sbgUtility.writefile(filePath, '');
    } else if (autocreate) {
      let text;
      if (Array.isArray(autocreate) || typeof autocreate === 'object') {
        text = JSON.stringify(autocreate);
      }
      sbgUtility.writefile(filePath, text);
    }
    return autocreate;
  }
  return fs__namespace.readFileSync(filePath, options);
}

//const cache = persistentCache({ persist: true, name: "hexo-seo", base: join(process.cwd(), "tmp") });
const getConfig = function (hexo, _key = 'config-hexo-seo') {
  const defaultOpt = {
    cache: true,
    js: {
      enable: false,
      concat: false,
      exclude: ['*.min.js']
    },
    css: {
      enable: false,
      exclude: ['*.min.css']
    },
    html: {
      enable: false,
      fix: false,
      exclude: [],
      collapseBooleanAttributes: true,
      collapseWhitespace: true,
      // Ignore '<!-- more -->' https://hexo.io/docs/tag-plugins#Post-Excerpt
      ignoreCustomComments: [/^\s*more/],
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true,
      minifyJS: true,
      minifyCSS: true
    },
    img: {
      enable: false,
      default: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1024px-No_image_available.svg.png',
      onerror: 'clientside'
    },
    host: new URL(hexo.config.url).host,
    links: {
      blank: true,
      enable: true,
      allow: ['webmanajemen.com']
    },
    schema: {
      sitelink: {
        enable: false
      },
      article: {
        enable: false
      },
      breadcrumb: {
        enable: false
      }
    },
    sitemap: false,
    theme_dir: path.join(process.cwd(), 'themes', String(hexo.config.theme || 'landscape')),
    source_dir: path.join(process.cwd(), String(hexo.config.source_dir || 'source')),
    post_dir: path.join(process.cwd(), String(hexo.config.source_dir || 'source'), '_posts')
  };
  const seo = hexo.config.seo;
  fs.writeFileSync(path.join(__dirname, '_config_data.json'), JSON.stringify(seo, null, 2));
  if (typeof seo === 'undefined') return defaultOpt;
  return deepmerge(defaultOpt, seo, {
    // disable cache on dev
    cache: isDev ? false : seo.cache || defaultOpt.cache
  });
};
/**
 * number to milliseconds
 * @param hrs
 * @param min
 * @param sec
 * @returns
 */
const toMilliseconds = (hrs, min = 0, sec = 0) => (hrs * 60 * 60 + min * 60 + sec) * 1000;
const coreCache = new sbgUtility.persistentCache({
  base: tmpFolder,
  persist: true,
  memory: false,
  duration: toMilliseconds(1)
});
const cache_key_router = 'jslib';
/**
 * hexo argument
 * - s = server
 * - c = clean
 * - g = generate
 */
let mode;
/**
 * set mode hexo argument
 * - s = server
 * - c = clean
 * - g = generate
 * @param m
 */
function setMode(m) {
  mode = m;
}
/**
 * get mode hexo argument
 * - s = server
 * - c = clean
 * - g = generate
 * @returns
 */
const getMode = () => mode;

const logger = hexoLog__namespace.logger({
  debug: false,
  silent: false
});

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var md5File$1 = {exports: {}};

var hasRequiredMd5File;
function requireMd5File() {
  if (hasRequiredMd5File) return md5File$1.exports;
  hasRequiredMd5File = 1;
  const crypto$1 = crypto;
  const fs = require$$1;
  const Promise = require$$2;
  const {
    memoize
  } = require$$3;
  const BUFFER_SIZE = 8192;
  function md5FileSync(path) {
    const fd = fs.openSync(path, 'r');
    const hash = crypto$1.createHash('md5');
    const buffer = Buffer.alloc(BUFFER_SIZE);
    try {
      let bytesRead;
      do {
        bytesRead = fs.readSync(fd, buffer, 0, BUFFER_SIZE);
        hash.update(buffer.slice(0, bytesRead));
      } while (bytesRead === BUFFER_SIZE);
    } finally {
      fs.closeSync(fd);
    }
    return hash.digest('hex');
  }
  function md5File(path) {
    return new Promise((resolve, reject) => {
      const output = crypto$1.createHash('md5');
      const input = fs.createReadStream(path);
      input.on('error', err => {
        reject(err);
      });
      output.once('readable', () => {
        resolve(output.read().toString('hex'));
      });
      input.pipe(output);
    });
  }
  /**
   * MD5
   */
  const md5 = memoize(
  /**
   * MD5
   * @param {string} data
   * @returns
   */
  data => {
    return crypto$1.createHash('md5').update(data).digest('hex');
  });
  md5File$1.exports = md5File;
  md5File$1.exports.sync = md5FileSync;
  md5File$1.exports.md5 = md5;
  return md5File$1.exports;
}

var md5FileExports = requireMd5File();
var md5File = /*@__PURE__*/getDefaultExportFromCjs(md5FileExports);

const myCache = new NodeCache({
  stdTTL: 500,
  checkperiod: 520
});
/**
 * @summary IN MEMORY CACHE
 * @description cache will be saved in memory/RAM
 */
class Cache {
  /**
   * Identifier Hash for cache
   */
  static md5Cache = {};
  /**
   * Set cache
   * @param key
   * @param value
   * @returns
   */
  set(key, value) {
    return this.setCache(key, value);
  }
  setCache(key, value) {
    if (!key || !value) return;
    if (!key) key = md5FileExports.md5(value);
    return myCache.set(key, value);
  }
  get(key, fallback) {
    return this.getCache(key, fallback);
  }
  /**
   * Get cache for given key
   * @param key
   * @param fallback fallback if key not in cache
   * @returns
   */
  getCache(key, fallback = null) {
    return myCache.get(key) || fallback;
  }
  isFileChanged(filePath) {
    return md5File(filePath).then(hash1 => {
      const hash = Cache.md5Cache[filePath];
      Cache.md5Cache[filePath] = hash1;
      if (!hash) {
        return true;
      }
      if (hash === hash1) {
        return false;
      }
      return true;
    }).catch(_err => {
      return true;
    });
  }
}
/**
 * @summary IN FILE CACHE.
 * @description Save cache to file (not in-memory), cache will be restored on next process restart.
 */
class CacheFile {
  md5Cache = {};
  dbFile;
  constructor(hash = null) {
    if (!hash) {
      const stack = new Error().stack.split('at')[2];
      hash = md5FileExports.md5(stack);
    }
    this.dbFile = path.join(tmpFolder, 'db-' + hash + '.json');
    let db = readFile(this.dbFile, {
      encoding: 'utf8'
    }, {});
    if (typeof db != 'object') {
      try {
        db = JSON.parse(db.toString());
      } catch (e) {
        logger.error('cache database lost');
        logger.error(e);
      }
    }
    if (typeof db == 'object') {
      this.md5Cache = db;
    }
  }
  setCache(key, value) {
    return this.set(key, value);
  }
  set(key, value) {
    this.md5Cache[key] = value;
    // save cache on process exit
    sbgUtility.bindProcessExit('writeCacheFile', () => {
      logger.log('saved cache', this.dbFile);
      sbgUtility.writefile(this.dbFile, JSON.stringify(this.md5Cache));
    });
  }
  has(key) {
    return typeof this.md5Cache[key] !== 'undefined';
  }
  /**
   * Get cache by key
   * @param key
   * @param fallback
   * @returns
   */
  get(key, fallback = null) {
    const Get = this.md5Cache[key];
    if (Get === undefined) return fallback;
    return Get;
  }
  /**
   * alias {get}
   * @param key
   * @param fallback
   * @returns
   */
  getCache(key, fallback = null) {
    return this.get(key, fallback);
  }
  /**
   * Check file is changed with md5 algorithm
   * @param path0
   * @returns
   */
  isFileChanged(path0) {
    if (typeof path0 != 'string') {
      //console.log("", typeof path0, path0);
      return true;
    }
    try {
      // get md5 hash from path0
      const pathMd5 = md5FileExports.sync(path0);
      // get index hash
      const savedMd5 = this.md5Cache[path0 + '-hash'];
      const result = savedMd5 != pathMd5;
      if (result) {
        // set, if file hash is not found
        this.md5Cache[path0 + '-hash'] = pathMd5;
      }
      return result;
    } catch (e) {
      return true;
    }
  }
}

var name = "hexo-seo";
var version = "2.0.0";
var description = "Automated Seo Optimizer For Hexo";
var main = "dist/index.js";
var types = "dist/index.d.ts";
var module$1 = "dist/index.mjs";
var files = [
	"dist/",
	"src/",
	"images/",
	"source/",
	"LICENSE",
	"readme.md",
	"index*.js",
	"tsconfig*.json"
];
var scripts = {
	lint: "eslint ./src --ext .ts",
	"lint-and-fix": "eslint ./src --ext .ts,.json --fix",
	"ts:normal": "tsc -p tsconfig.build.json",
	build: "yarn run ts:normal && rollup -c && gulp",
	clean: "rimraf dist && gulp clean && npm run build",
	"update:project": "curl https://github.com/dimaslanjaka/nodejs-package-types/raw/main/.gitattributes > .gitattributes && curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/changelog.js > changelog.js && curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/packer.js > packer.js",
	"update:ncu": "npm-check-updates -u",
	update: "yarn run update:project && yarn run update:ncu",
	"test:install": "cd test/demo && npm install",
	prepack: "node changelog.js && node package-switch.cjs production",
	prepublish: "npm run prepack",
	pack: "node packer.js --yarn",
	prepare: "husky"
};
var repository = "dimaslanjaka/hexo-seo";
var homepage = "https://www.webmanajemen.com/docs/hexo-seo";
var keywords = [
	"hexo",
	"seo",
	"search engine optimization",
	"hexo plugin",
	"blogging",
	"content optimization",
	"metadata",
	"social media",
	"analytics",
	"performance",
	"web development"
];
var engines = {
	node: ">=18"
};
var peerDependencies = {
	hexo: ">=6.3.0"
};
var author = {
	email: "dimaslanjaka@gmail.com",
	name: "Dimas Lanjaka",
	url: "https://github.com/dimaslanjaka"
};
var license = "ISC";
var dependencies = {
	"ansi-colors": "^4.1.3",
	axios: "^1.7.7",
	bluebird: "^3.7.2",
	cheerio: "^1.0.0",
	"clean-css": "^5.3.3",
	"deepmerge-ts": "7.1.3",
	dotenv: "^16.4.5",
	"file-type": "^19.6.0",
	"fs-extra": "^11.2.0",
	"google-news-sitemap": "^1.0.10",
	"hexo-is": "^1.0.5",
	"hexo-log": "^4.1.0",
	"hexo-util": "^3.3.0",
	"html-minifier-terser": "^7.2.0",
	jsdom: "^25.0.1",
	minimatch: "^10.0.1",
	minimist: "^1.2.8",
	moment: "^2.30.1",
	"moment-timezone": "^0.5.46",
	"node-cache": "^5.1.2",
	"node-html-parser": "^6.1.13",
	rimraf: "^6.0.1",
	"sanitize-filename": "^1.6.3",
	"sbg-utility": "^2.0.5",
	"serve-static": "^1.16.2",
	terser: "^5.36.0",
	underscore: "^1.13.7",
	upath: "^2.0.1",
	"url-parse": "^1.5.10",
	xmlbuilder2: "^3.1.1"
};
var devDependencies = {
	"@babel/core": "^7.25.9",
	"@babel/preset-env": "^7.25.9",
	"@babel/preset-typescript": "^7.25.9",
	"@eslint/eslintrc": "^3.1.0",
	"@eslint/js": "^9.13.0",
	"@rollup/plugin-babel": "^6.0.4",
	"@rollup/plugin-commonjs": "^28.0.1",
	"@rollup/plugin-json": "^6.1.0",
	"@rollup/plugin-node-resolve": "^15.3.0",
	"@rollup/plugin-terser": "^0.4.4",
	"@rollup/plugin-typescript": "^12.1.1",
	"@types/babel__core": "^7",
	"@types/babel__preset-env": "^7",
	"@types/bluebird": "^3.5.42",
	"@types/clean-css": "^4.2.11",
	"@types/fs-extra": "^11.0.4",
	"@types/hexo": "https://github.com/dimaslanjaka/hexo/raw/fc1f9b7/releases/hexo.tgz",
	"@types/minimist": "^1",
	"@types/node": "^22.7.9",
	"@types/object-assign": "^4.0.33",
	"@types/serve-static": "^1.15.7",
	"@types/through2": "https://github.com/dimaslanjaka/nodejs-package-types/raw/through2/release/types-through2.tgz",
	"@types/url-parse": "^1.4.11",
	"@typescript-eslint/eslint-plugin": "^8.11.0",
	"@typescript-eslint/parser": "^8.11.0",
	"cross-env": "^7.0.3",
	"cross-spawn": "https://github.com/dimaslanjaka/node-cross-spawn/raw/80999ac/release/cross-spawn.tgz",
	depcheck: "^1.4.7",
	eslint: "^9.13.0",
	"eslint-config-prettier": "^9.1.0",
	"eslint-plugin-import": "^2.31.0",
	"eslint-plugin-prettier": "^5.2.1",
	"git-command-helper": "^2.0.2",
	globals: "^15.11.0",
	gulp: "^5.0.0",
	"gulp-cli": "^3.0.0",
	"gulp-concat": "^2.6.1",
	husky: "^9.1.6",
	nodemon: "^3.1.7",
	"npm-check-updates": "^17.1.4",
	"npm-run-all": "^4.1.5",
	prettier: "^3.3.3",
	prompt: "^1.3.0",
	rollup: "^4.24.0",
	"rollup-plugin-dts": "^6.1.1",
	"ts-node": "^10.9.2",
	typescript: "^5.6.3"
};
var optionalDependencies = {
	"glob-parent": ">=6.0.2",
	"node.extend": ">=2.0.3",
	request: ">=2.88.2",
	uuid: ">=10.0.0"
};
var packageManager = "yarn@4.5.1";
var workspaces = [
	"site"
];
var pkg = {
	name: name,
	version: version,
	description: description,
	main: main,
	types: types,
	module: module$1,
	files: files,
	scripts: scripts,
	repository: repository,
	homepage: homepage,
	keywords: keywords,
	engines: engines,
	peerDependencies: peerDependencies,
	author: author,
	license: license,
	dependencies: dependencies,
	devDependencies: devDependencies,
	optionalDependencies: optionalDependencies,
	packageManager: packageManager,
	workspaces: workspaces
};

/* global hexo */
/**
 * is ignore pattern matching?
 */
const isIgnore = (path0, exclude, hexo) => {
  if (exclude && !Array.isArray(exclude)) exclude = [exclude];
  if (path0 && exclude && exclude.length) {
    for (let i = 0, len = exclude.length; i < len; i++) {
      const excludePattern = exclude[i];
      if (minimatch.minimatch(path0, excludePattern)) return true;
    }
  }
  return false;
};
/**
 * first initialization indicator
 */
const firstIndicator = {};
/**
 * Dump large objects
 * @param filename
 * @param obj
 */
function dump(filename, ...obj) {
  if (!isDev) return;
  const hash = sanitizeFilename(filename).toString().replace(/\s/g, '-');
  const filePath = path.join(process.cwd(), '/tmp/hexo-seo/dump', hash);
  // truncate directory on first time
  if (!('dump' in firstIndicator)) {
    rimraf.rimrafSync(filePath);
    firstIndicator['dump'] = true;
  }
  if (!fs__namespace.existsSync(path.dirname(filePath))) {
    fs__namespace.mkdirSync(path.dirname(filePath), {
      recursive: true
    });
  }
  let buildLog = '';
  for (let index = 0; index < obj.length; index++) {
    buildLog += utils.inspect(obj[index], {
      showHidden: true,
      depth: null
    }) + '\n\n';
  }
  fs__namespace.writeFileSync(filePath, buildLog);
  console.log(`dump results saved to ${path.resolve(filePath)}`);
}

const cache$1 = new Cache();
/**
 * minify js
 * @param this
 * @param str
 * @param data
 * @returns
 */
async function HexoSeoJs(str, data) {
  const path0 = data.path;
  if (!path0) {
    logger.error('%s(CSS) invalid path', pkg.name);
    return;
  }
  const hexoCfg = getConfig(this);
  const jsCfg = hexoCfg.js;
  // if option js is false, return original content
  if (typeof jsCfg == 'boolean' && !jsCfg) return str;
  // keep original js file when concatenate JS enabled
  if (jsCfg.concat) return str;
  const isChanged = await cache$1.isFileChanged(path0);
  const useCache = hexoCfg.cache;
  if (isChanged || !useCache) {
    // if original file is changed, re-minify js
    //const hexo: Hexo = this;
    let options = {
      exclude: ['*.min.js']
    };
    if (typeof jsCfg === 'boolean') {
      if (!jsCfg) return str;
    } else if (typeof jsCfg == 'object') {
      options = assign(options, jsCfg);
      if (isIgnore(path0, options.exclude)) return str;
    }
    let minifyOptions = {
      mangle: {
        toplevel: true,
        // to mangle names declared in the top level scope.
        properties: false,
        // disable mangle object and array properties
        safari10: true,
        // to work around the Safari 10 loop iterator
        keep_fnames: true,
        // keep function names
        keep_classnames: true // keep class name
      },
      compress: {
        dead_code: true //remove unreachable code
      }
    };
    if (typeof options.options == 'object') {
      minifyOptions = assign(minifyOptions, options.options);
    }
    try {
      const result = await terser.minify(str, minifyOptions);
      if (result.code && result.code.length > 0) {
        const saved = ((str.length - result.code.length) / str.length * 100).toFixed(2);
        logger.log('%s(JS): %s [%s saved]', pkg.name, path0, `${saved}%`);
        str = result.code;
        // set new minified js cache
        cache$1.setCache(path0, str);
      }
    } catch (e) {
      logger.error(`Minifying ${path0} error`, e);
      // minify error, return original js
      return str;
    }
  } else {
    // get cached minified js
    str = await cache$1.getCache(path0, str);
    logger.log('%s(JS) cached [%s]', pkg.name, path0.replace(this.base_dir, ''));
  }
  return str;
}
/**
 * minify js
 * @param str
 * @param options
 * @returns
 */
async function minifyJS(str, options) {
  let minifyOptions = {
    mangle: {
      toplevel: true,
      // to mangle names declared in the top level scope.
      properties: false,
      // disable mangle object and array properties
      safari10: true,
      // to work around the Safari 10 loop iterator
      keep_fnames: true,
      // keep function names
      keep_classnames: true // keep class name
    },
    compress: {
      dead_code: true //remove unreachable code
    }
  };
  if (typeof options == 'object') {
    minifyOptions = assign(minifyOptions, options);
  }
  const path0 = fs.existsSync(str) ? str : 'inline';
  if (path0 !== 'inline') {
    str = fs.readFileSync(path0).toString();
  }
  try {
    const result = await terser.minify(str, minifyOptions);
    if (result.code && result.code.length > 0) {
      const saved = ((str.length - result.code.length) / str.length * 100).toFixed(2);
      logger.log('%s(JS): %s [%s saved]', pkg.name, path0, `${saved}%`);
      str = result.code;
      // set new minified js cache
      if (path0 !== 'inline') cache$1.setCache(path0, str);
    }
  } catch (e) {
    logger.error(`Minifying ${path0} error`, e);
    // minify error, return original js
    return str;
  }
}

// const cache = new persistentCache({ name: 'authors', persist: true });
/**
 * get post author from post object
 * @param postObj post object like { title: '', permalink: '' } or author object
 * @param hexoConfig hexo.config object
 * @returns author name
 */
function getAuthorName(postObj, hexoConfig = {}) {
  if (postObj) {
    // validate post object not null or undefined
    const author = typeof postObj == 'string' ? postObj : postObj.author || hexoConfig.author;
    // validate author is not null or undefined
    if (author) {
      if (typeof author == 'string') return author;
      if ('nick' in author) return author.nick;
      if ('name' in author) return author.name;
      if ('nickname' in author) return author.nickname;
    }
  }
  // return unknown author
  return 'Unknown Author';
}

function getCategoryTags(hexo) {
  const groups = ['categories', 'tags'];
  const locals = hexo.locals;
  const groupfilter = {
    tags: [],
    categories: []
  };
  if (!locals) {
    return groupfilter;
  }
  groups.map(group => {
    const lastModifiedObject = locals.get(group).map(items => {
      if (items.posts) {
        const archives = items;
        const posts = archives.posts;
        const latest = getLatestFromArrayDates(posts.map(post => {
          return post.updated.toDate();
        }));
        const permalink = new URL(hexo.config.url);
        permalink.pathname = archives.path;
        return {
          permalink: permalink.toString(),
          name: archives.name,
          latest: moment(latest).format('YYYY-MM-DDTHH:mm:ssZ')
        };
      }
    });
    groupfilter[group] = lastModifiedObject;
  });
  return groupfilter;
}
/**
 * get latest date from array of date
 * @param arr
 * @returns
 */
function getLatestFromArrayDates(arr) {
  return new Date(Math.max.apply(null, arr.map(function (e) {
    return e instanceof Date ? e : moment(e).toDate();
  })));
}

const sitemapGroup = {
  post: undefined,
  page: undefined,
  tag: undefined,
  category: undefined
};
const googleNewsSitemap = new GoogleNewsSitemap__namespace.default();
function initSitemap(type) {
  if (!sitemapGroup[type]) {
    const sourceXML = path.join(__dirname, 'views/' + type + '-sitemap.xml');
    if (!fs.existsSync(sourceXML)) throw 'Source ' + sourceXML + ' Not Found';
    const doc = xmlbuilder2.create(fs.readFileSync(sourceXML).toString());
    sitemapGroup[type] = new Object(doc.end({
      format: 'object'
    }));
    sitemapGroup[type].urlset.url = [];
  }
}
/**
 * Extract Page Data
 * @param data
 * @returns
 */
function getPageData(data) {
  const is = hexoIs(data);
  if (data['page']) {
    const page = data['page'];
    page.is = is;
    return page;
  }
}
// init each sitemap
const groups = ['post', 'page', 'category', 'tag'];
groups.forEach(group => {
  if (!sitemapGroup[group]) initSitemap(group);
  if (sitemapGroup[group].urlset.url.length === 0) {
    sitemapGroup[group].urlset.url.push({
      loc: hexo.config.url,
      lastmod: moment(Date.now()).format('YYYY-MM-DDTHH:mm:ssZ'),
      priority: '1',
      changefreq: 'daily'
    });
  }
});
let categoryTagsInfo;
const postUpdateDates = [];
const pageUpdateDates = [];
// const cache = new CacheFile("sitemap");
let turnError = false;
/**
 * process sitemap of page
 */
function sitemap(dom, hexoSeoConfig, data) {
  if (!hexoSeoConfig.sitemap) {
    if (!turnError) {
      turnError = true;
      logger.error('[hexo-seo][sitemap] config sitemap not set');
    }
    return;
  }
  // set category and tag information of posts
  if (!categoryTagsInfo) {
    categoryTagsInfo = getCategoryTags(hexo);
  }
  // cast locals
  const locals = hexo.locals;
  // return if posts and pages empty
  if (['posts', 'pages'].every(info => locals.get(info).length === 0)) {
    return;
  }
  // resolve configs
  let isYoastActive = false;
  let isGnewsActive = false;
  const sitemapConfig = hexoSeoConfig.sitemap;
  if (sitemapConfig) {
    if (typeof sitemapConfig == 'boolean' && sitemapConfig === true) {
      isYoastActive = isGnewsActive = true;
    } else {
      isYoastActive = sitemapConfig.yoast;
      isGnewsActive = sitemapConfig.gnews;
    }
  }
  // TODO modify or add sitemap href in html
  const linksitemap = dom.querySelector('link[rel="sitemap"]');
  if (linksitemap) {
    linksitemap.setAttribute('href', '/sitemap.xml');
    linksitemap.setAttribute('type', 'application/xml');
    linksitemap.setAttribute('rel', 'sitemap');
    linksitemap.setAttribute('title', 'Sitemap');
  } else {
    // add the sitemap when not exist
    const head = dom.getElementsByTagName('head');
    if (head.length) head[0].innerHTML += '<link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />';
  }
  const post = getPageData(data);
  if (post) {
    const isPagePost = post.is.post || post.is.page;
    if (isPagePost) {
      // if post updated not found, get source file last modified time
      if (!post.updated) {
        const stats = fs.statSync(post.full_source);
        post.updated = moment(stats.mtime);
      }
    }
    if (post.is.post) {
      // YoastSeo Sitemap
      if (isYoastActive) {
        postUpdateDates.push(post.updated.format('YYYY-MM-DDTHH:mm:ssZ'));
        sitemapGroup['post'].urlset.url.push({
          loc: post.permalink,
          lastmod: post.updated.format('YYYY-MM-DDTHH:mm:ssZ'),
          changefreq: 'weekly',
          priority: '0.6'
        });
      }
      // Google News Sitemap
      if (isGnewsActive) {
        googleNewsSitemap.add({
          publication_name: getAuthorName(post.author),
          publication_language: post.lang || post.language || 'en',
          publication_date: post.date.format('YYYY-MM-DDTHH:mm:ssZ'),
          title: post.title || 'no title',
          location: hexoUtil.url_for(post.permalink)
        });
      }
    } else if (post.is.page) {
      // YoastSeo Sitemap
      if (isYoastActive) {
        pageUpdateDates.push(post.updated.format('YYYY-MM-DDTHH:mm:ssZ'));
        sitemapGroup['page'].urlset.url.push({
          loc: post.permalink,
          lastmod: post.updated.format('YYYY-MM-DDTHH:mm:ssZ'),
          changefreq: 'weekly',
          priority: '0.8'
        });
      }
    }
    if (isPagePost) {
      // write sitemap at Node process ends
      sbgUtility.bindProcessExit('writeSitemap', () => {
        if (isYoastActive) {
          // copy xsl
          const destXSL = path.join(hexo.public_dir, 'sitemap.xsl');
          if (!fs.existsSync(path.dirname(destXSL))) fs.mkdirSync(path.dirname(destXSL), {
            recursive: true
          });
          const sourceXSL = path.join(__dirname, 'views/sitemap.xsl');
          if (fs.existsSync(sourceXSL)) {
            fs.copyFileSync(sourceXSL, destXSL);
            logger.log('XSL sitemap copied to ' + destXSL);
          } else {
            logger.error('XSL sitemap not found');
          }
          // TODO write post-sitemap.xml
          const destPostSitemap = path.join(hexo.public_dir, 'post-sitemap.xml');
          sbgUtility.writefile(destPostSitemap, xmlbuilder2.create(sitemapGroup['post']).end({
            prettyPrint: true
          }));
          logger.log('post sitemap saved', destPostSitemap);
          // TODO write page-sitemap.xml
          const destPageSitemap = path.join(hexo.public_dir, 'page-sitemap.xml');
          sbgUtility.writefile(destPageSitemap, xmlbuilder2.create(sitemapGroup['page']).end({
            prettyPrint: true
          }));
          logger.log('page sitemap saved', destPageSitemap);
          generateSitemapIndex(hexo);
        }
        if (isGnewsActive) {
          // TODO write google-news-sitemap.xml
          const gnewsPageSitemap = path.join(hexo.public_dir, 'google-news-sitemap.xml');
          sbgUtility.writefile(gnewsPageSitemap, googleNewsSitemap.toString());
          logger.log('google news sitemap saved', gnewsPageSitemap);
        }
      });
    }
  }
}
/** generate YoastSeo index sitemap */
function generateSitemapIndex(hexoinstance = null) {
  const sourceIndexXML = path.join(__dirname, 'views/sitemap.xml');
  const sitemapIndexDoc = xmlbuilder2.create(fs.readFileSync(sourceIndexXML).toString());
  const sitemapIndex = new Object(sitemapIndexDoc.end({
    format: 'object'
  }));
  sitemapIndex.sitemapindex.sitemap = [];
  if (!hexoinstance && typeof hexo != 'undefined') {
    hexoinstance = hexo;
  }
  // push post-sitemap.xml to sitemapindex
  const latestPostDate = getLatestFromArrayDates(postUpdateDates);
  logger.log('latest updated post', latestPostDate);
  sitemapIndex.sitemapindex.sitemap.push({
    loc: hexo.config.url.toString() + '/post-sitemap.xml',
    lastmod: moment(latestPostDate).format('YYYY-MM-DDTHH:mm:ssZ')
  });
  // push page-sitemap.xml to sitemapindex
  const latestPageDate = getLatestFromArrayDates(pageUpdateDates);
  logger.log('latest updated page', latestPageDate);
  if (moment(latestPageDate).isValid()) sitemapIndex.sitemapindex.sitemap.push({
    loc: hexo.config.url.toString() + '/page-sitemap.xml',
    lastmod: moment(latestPageDate).format('YYYY-MM-DDTHH:mm:ssZ')
  });
  // build tag-sitemap.xml
  const tags = categoryTagsInfo.tags;
  tags.map(tag => {
    sitemapGroup['tag'].urlset.url.push({
      loc: tag.permalink.toString(),
      // set latest post updated from this tag
      lastmod: moment(tag.latest).format('YYYY-MM-DDTHH:mm:ssZ'),
      changefreq: 'weekly',
      priority: '0.2'
    });
  });
  const destTagSitemap = path.join(hexo.public_dir, 'tag-sitemap.xml');
  sbgUtility.writefile(destTagSitemap, xmlbuilder2.create(sitemapGroup['tag']).end({
    prettyPrint: true
  }));
  logger.log('tag sitemap saved', destTagSitemap);
  // push tag-sitemap.xml to sitemapindex
  const latestTagDate = getLatestFromArrayDates(tags.map(tag => {
    return tag.latest;
  }));
  logger.log('latest updated tag', latestTagDate);
  sitemapIndex.sitemapindex.sitemap.push({
    loc: hexo.config.url.toString() + '/tag-sitemap.xml',
    lastmod: moment(latestTagDate).format('YYYY-MM-DDTHH:mm:ssZ')
  });
  // build category-sitemap.xml
  const categories = categoryTagsInfo.categories;
  categories.map(category => {
    sitemapGroup['category'].urlset.url.push({
      loc: category.permalink.toString(),
      // set latest post updated from this tag
      lastmod: moment(category.latest).format('YYYY-MM-DDTHH:mm:ssZ'),
      changefreq: 'weekly',
      priority: '0.2'
    });
  });
  const destCategorySitemap = path.join(hexo.public_dir, 'category-sitemap.xml');
  sbgUtility.writefile(destCategorySitemap, xmlbuilder2.create(sitemapGroup['category']).end({
    prettyPrint: true
  }));
  logger.log('category sitemap saved', destCategorySitemap);
  // push category-sitemap.xml to sitemapindex
  const latestCategoryDate = getLatestFromArrayDates(categories.map(category => {
    return category.latest;
  }));
  logger.log('latest updated category', latestCategoryDate);
  sitemapIndex.sitemapindex.sitemap.push({
    loc: hexo.config.url.toString() + '/category-sitemap.xml',
    lastmod: moment(latestCategoryDate).format('YYYY-MM-DDTHH:mm:ssZ')
  });
  const destIndexSitemap = path.join(hexo.public_dir, 'sitemap.xml');
  sbgUtility.writefile(destIndexSitemap, xmlbuilder2.create(sitemapIndex).end({
    prettyPrint: true
  }));
  logger.log('index sitemap saved', destIndexSitemap);
}

/**
 * remove empties from array
 * @param arr
 * @returns
 */
function array_remove_empties(arr) {
  return arr.filter(item => {
    if (typeof item === 'string') return item.length > 0;
    if (Array.isArray(item)) return item.length > 0;
    return true;
  });
}
/**
 * Array unique
 * @param arrays
 */
function array_unique(arrays) {
  return arrays.filter(function (item, pos, self) {
    return self.indexOf(item) == pos;
  });
}
/**
 * Remove array item from another array
 * @param myArray
 * @param toRemove
 * @returns
 */
function remove_array_item_from(myArray, toRemove) {
  return myArray.filter(el => !toRemove.includes(el));
}

/**
 * is url external link
 * @param url
 * @param hexo
 * @returns
 */
function isExternal(url, hexo) {
  const site = typeof parseUrl(hexo.config.url).hostname == 'string' ? parseUrl(hexo.config.url).hostname : null;
  const cases = typeof url.hostname == 'string' ? url.hostname.trim() : null;
  const config = getConfig(hexo);
  const allowed = Array.isArray(config.links.allow) ? config.links.allow : [];
  const hosts = config.host;
  // if url hostname empty, its internal
  if (!cases) return false;
  // if url hostname same with site hostname, its internal
  if (cases == site) return false;
  // if arrays contains url hostname, its internal and allowed to follow
  if (hosts.includes(cases) || allowed.includes(cases)) return false;
  /*if (cases.includes("manajemen")) {
    logger.log({ site: site, cases: cases, allowed: allowed, hosts: hosts });
  }*/
  return true;
}

function identifyRels(el, external, HSconfig) {
  let rels = [];
  const externalArr = ['nofollow', 'noopener', 'noreferer', 'noreferrer', 'external'];
  const internalArr = ['internal', 'follow', 'bookmark'];
  // if external link, assign external rel attributes and remove items from internal attributes if exists, and will do the opposite if the internal link
  const newRels = array_unique(rels);
  if (external) {
    rels = remove_array_item_from(newRels.concat(externalArr), internalArr);
    if (typeof HSconfig.blank == 'boolean' && HSconfig.blank) {
      el.setAttribute('target', '_blank');
    }
  } else {
    rels = remove_array_item_from(newRels.concat(internalArr), externalArr);
  }
  return rels;
}

var model = [
	{
		"@context": "https://schema.org",
		"@type": "BreadcrumbList",
		"@id": "https://developers.google.com/search/docs/advanced/structured-data/breadcrumb",
		name: "breadcrumb",
		itemListElement: [
			{
				"@type": "ListItem",
				position: 1,
				name: "Tags",
				item: "https://webmanajemen.com/tags"
			},
			{
				"@type": "ListItem",
				position: 2,
				name: "Category",
				item: "https://webmanajemen.com/category"
			},
			{
				"@type": "ListItem",
				position: 3,
				name: "GitHub",
				item: "https://webmanajemen.com/GitHub"
			}
		]
	},
	{
		"@context": "https://schema.org/",
		"@type": "Article",
		mainEntityOfPage: {
			"@type": "WebPage",
			"@id": "https://www.webmanajemen.com/2022/01/04/frp-redmi-go-tiare-fix.html"
		},
		headline: "Fix FRP Redmi GO Latest Security Patch (Updated 2022)",
		description: "Fix FRP Redmi GO Latest Security Patch (Updated 2022)",
		image: {
			"@type": "ImageObject",
			url: "https://www.webmanajemen.com/2022/01/04/frp-redmi-go-tiare-fix/cover.jpg",
			width: "250",
			height: "250"
		},
		author: {
			"@type": "Person",
			name: "Dimas Lanjaka"
		},
		publisher: {
			"@type": "Organization",
			name: "Dimas Lanjaka",
			logo: {
				"@type": "ImageObject",
				url: "https://www.webmanajemen.com/2022/01/04/frp-redmi-go-tiare-fix/Bypass%20FRP%20Redmi%20Go%20Tiare%20M1903C3GG.jpg",
				width: "125",
				height: "125"
			}
		},
		datePublished: "2022-01-04",
		dateModified: "2022-01-05"
	},
	{
		"@context": "http://schema.org",
		"@type": "WebSite",
		url: "https://www.webmanajemen.com/",
		potentialAction: {
			"@type": "SearchAction",
			"@id": "https://developers.google.com/search/docs/advanced/structured-data/sitelinks-searchbox",
			target: "https://www.webmanajemen.com/search?q={search_term_string}",
			"query-input": "required name=search_term_string"
		}
	},
	{
		"@context": "http://schema.org",
		"@type": "WebPage",
		"@id": "https://google.com/webpage",
		title: "Website Title",
		mainEntity: {
			"@type": "ItemList",
			name: "Recent Articles",
			itemListOrder: "Descending",
			itemListElement: [
				{
					"@type": "Article",
					position: "1",
					headline: "I am recent Article",
					author: {
						"@type": "Person",
						image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/120px-No_image_available.svg.png",
						name: "Dimas Lanjaka",
						sameAs: "http://webmanajemen.com/"
					},
					image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/120px-No_image_available.svg.png"
				},
				{
					"@type": "Article",
					position: "2",
					headline: "I am recent Article 2",
					author: {
						"@type": "Person",
						image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/120px-No_image_available.svg.png",
						name: "Dimas Lanjaka",
						sameAs: "http://webmanajemen.com/"
					},
					image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/120px-No_image_available.svg.png"
				}
			]
		}
	}
];

/**
 * Fix Schema Model 4
 * @param dom
 * @param hexoSeoConfig hexo-seo config (config_yml.seo)
 * @param data
 */
function fixSchemaStatic(dom, hexoSeoConfig, data) {
  if (!hexoSeoConfig.schema) {
    // skip when schema option is false
    return;
  }
  // assign default config
  const defaultConfig = {
    schema: {
      homepage: {
        enable: false
      },
      sitelink: {
        enable: false,
        searchUrl: '/search'
      },
      article: {
        enable: false
      },
      breadcrumb: {
        enable: false
      }
    },
    cache: false,
    sitemap: false,
    host: '',
    theme_dir: process.cwd() + '/theme',
    source_dir: process.cwd() + '/source',
    post_dir: process.cwd() + '/source/_posts'
  };
  try {
    defaultConfig.host = new URL(hexo.config.url).host;
  } catch (_error) {
    //
  }
  hexoSeoConfig = deepmerge(defaultConfig, hexoSeoConfig);
  const is = hexoIs(data);
  const breadcrumbs = model[0];
  const article = model[1];
  const sitelink = model[2];
  const homepage = model[3];
  // resolve title
  let title = '';
  if (data.page && data.page.title && data.page.title.trim().length > 0) {
    title = data.page.title;
  } else {
    title = data.config.title;
  }
  // resolve description
  let description = title;
  if (data.page.description) {
    description = data.page.description;
  } else if (data.page.subtitle) {
    description = data.page.subtitle;
  }
  // resolve url
  let url = data.config.url;
  if (data.page) {
    if (data.page.permalink) {
      url = data.page.permalink;
    } else if (data.page.url) {
      url = data.page.url;
    }
  }
  // console.log('fixing schema of ' + url);
  // resolve thumbnail
  let thumbnail = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/1200px-No_image_available.svg.png';
  if (data.page) {
    const photos = Array.isArray(data.page.photos) ? data.page.photos[0] : null;
    const cover = data.page.cover || data.page.thumbnail;
    if (cover) {
      thumbnail = cover;
    } else if (photos) {
      thumbnail = photos;
    }
  }
  // resolve author
  let author = getAuthorName(data.config.author);
  if (data.page) {
    if (data.page.author) {
      author = getAuthorName(data.page.author);
    }
  }
  const schema = [];
  // setup schema sitelink
  if (hexoSeoConfig.schema.sitelink && hexoSeoConfig.schema.sitelink.searchUrl) {
    sitelink.url = data.config.url || '';
    const term = '{search_term_string}';
    let urlTerm = (hexoSeoConfig.schema.sitelink.searchUrl || '').trim();
    // fix suffix term string
    if (urlTerm.length > 0) {
      if (!urlTerm.endsWith(term)) urlTerm = urlTerm + term;
      sitelink.potentialAction.target = urlTerm;
      schema.push(sitelink);
    }
  }
  if (is.post) {
    // setup schema breadcrumb for post
    if (hexoSeoConfig.schema.breadcrumb && hexoSeoConfig.schema.breadcrumb.enable) {
      const schemaBreadcrumbs = [];
      if (data.page) {
        if (data.page.tags && data.page.tags.length > 0) {
          data.page.tags.forEach(tag => {
            const o = {
              '@type': 'ListItem',
              position: schemaBreadcrumbs.length + 1,
              item: tag['permalink'],
              name: tag['name']
            };
            schemaBreadcrumbs.push(o);
          });
        }
        if (data.page.categories && data.page.categories.length > 0) {
          data.page.categories.forEach(category => {
            const o = {
              '@type': 'ListItem',
              position: schemaBreadcrumbs.length + 1,
              item: category['permalink'],
              name: category['name']
            };
            schemaBreadcrumbs.push(o);
          });
        }
        schemaBreadcrumbs.push({
          '@type': 'ListItem',
          position: schemaBreadcrumbs.length + 1,
          item: url,
          name: title
        });
      }
      if (schemaBreadcrumbs.length > 0) {
        breadcrumbs.itemListElement = schemaBreadcrumbs;
        schema.push(breadcrumbs);
      }
    }
    if (hexoSeoConfig.schema.article && hexoSeoConfig.schema.article.enable) {
      article.mainEntityOfPage['@id'] = url;
      article.headline = title;
      article.description = description;
      article.image.url = thumbnail;
      article.author.name = author;
      article.publisher.name = author;
      article.dateModified = moment$1(new Date(String(data.page.updated))).tz(data.config.timezone || 'UTC').format();
      article.datePublished = moment$1(new Date(String(data.page.date))).tz(data.config.timezone || 'UTC').format();
      schema.push(article);
    }
  } else if (is.home && hexoSeoConfig.schema.homepage.enable) {
    const posts = hexo.locals.get('posts').data.map(({
      title,
      keywords,
      description,
      subtitle,
      excerpt,
      raw,
      tags,
      categories,
      path,
      author
    }) => {
      return {
        title,
        author,
        keywords,
        description: description || subtitle || excerpt,
        raw,
        permalink: path,
        tags: tags.data.map(tag => tag.name),
        categories: categories.data.map(category => category.name)
      };
    });
    // console.log(posts);
    homepage.mainEntity.itemListElement = [];
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      homepage.mainEntity.itemListElement.push({
        '@type': 'Article',
        position: '' + (i + 1),
        headline: post.title,
        author: {
          '@type': 'Person',
          image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/120px-No_image_available.svg.png',
          name: getAuthorName(post.author),
          sameAs: hexoUtil.url_for(post.permalink)
        },
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/120px-No_image_available.svg.png'
      });
    }
    // push schema webpage for homepage
    schema.push(homepage);
  }
  if (schema.length > 0) {
    const JSONschema = JSON.stringify(schema, null, 2);
    const schemahtml = `\n\n<script type="application/ld+json" id="hexo-seo-schema">${JSONschema}</script>\n\n`;
    logger.log('schema created', title, url);
    dump('schema-' + title + '.json', schemahtml);
    if (schemahtml) {
      const head = dom.getElementsByTagName('head')[0];
      head.insertAdjacentHTML('beforeend', schemahtml);
    }
  }
}

/**
 * get page full source
 * @param data
 * @returns
 */
function getPagePath(data) {
  if (data.page) {
    if (data.page.full_source) return data.page.full_source;
    if (data.page.path) return data.page.path;
  }
  if (data.path) return data.path;
}
async function HexoSeoHtml(content, data) {
  const logname = ansiColors.magentaBright('hexo-seo(html)');
  const logconcatname = ansiColors.magentaBright('hexo-seo(html-concat)');
  const cache = new CacheFile('html');
  const concatRoutes = coreCache.getSync('jslibs', []);
  const hexo = this;
  let path0 = getPagePath(data);
  let allowCache = true;
  if (!path0) {
    allowCache = false;
    path0 = content;
  }
  // setup page title as default value for missing attributes
  let title = '';
  if (data.page && data.page.title && data.page.title.trim().length > 0) {
    title = data.page.title;
  } else {
    title = data.config.title;
  }
  if (cache.isFileChanged(md5FileExports.md5(path0)) || isDev) {
    const root = nodeHtmlParser.parse(content);
    const cfg = getConfig(this);
    //** fix hyperlink */
    if (cfg.links.enable) {
      const a = root.querySelectorAll('a[href]');
      a.forEach(el => {
        let href = String(el.getAttribute('href')).trim();
        if (href.startsWith('//')) href = 'http:' + href;
        if (/^https?:\/\//.test(href)) {
          let rels = el.getAttribute('rel') ? el.getAttribute('rel').split(' ') : [];
          //rels = rels.removeEmpties().unique();
          rels = array_unique(array_remove_empties(rels));
          const parseHref = parseUrl(href);
          const external = isExternal(parseHref, hexo);
          rels = identifyRels(el, external, cfg.links);
          el.setAttribute('rel', rels.join(' '));
          // set indicator
          el.setAttribute('hexo-seo', 'true');
          if (!el.hasAttribute('alt')) el.setAttribute('alt', title);
          if (!el.hasAttribute('title')) el.setAttribute('title', title);
        }
      });
    }
    if (cfg.html.fix) {
      //** fix invalid html */
      const inv = root.querySelectorAll('[href="/.css"],[src="/.js"]');
      if (inv.length > 0) {
        logger.log('invalid html found', inv.length, inv.length > 1 ? 'items' : 'item');
        inv.forEach(el => {
          el.remove();
        });
      }
    }
    // TODO fix images attributes
    if (cfg.img.enable) {
      root.querySelectorAll('img[src]').forEach(element => {
        const imgAlt = element.getAttribute('alt') || title;
        const imgTitle = element.getAttribute('title') || imgAlt;
        if (!element.hasAttribute('title')) {
          //logger.log("%s(img[title]) fix %s", pkg.name, data.title);
          element.setAttribute('title', imgTitle);
        }
        if (!element.hasAttribute('alt')) {
          element.setAttribute('alt', imgAlt);
        }
        if (!element.getAttribute('itemprop')) {
          element.setAttribute('itemprop', 'image');
        }
        if (cfg.img.broken) {
          if (cfg.img.onerror === 'clientside') {
            element.setAttribute('onerror', "this.src='" + cfg.img.default + "';");
          }
        }
        if (isDev) element.setAttribute('hexo-seo', 'true');
      });
    }
    // TODO process schema
    fixSchemaStatic(root, cfg, data);
    // TODO process sitemap
    sitemap(root, cfg, data);
    // START concatenate javascripts
    if (cfg.js.concat === true) {
      //const { dom, window, document } = parseJSDOM(content);
      const scripts = Array.from(root.getElementsByTagName('script')).filter(function (el) {
        return (el.getAttribute('type') || '') !== 'application/ld+json';
      });
      const filename = 'concat-' + md5FileExports.md5(path.basename(path0));
      const scriptContents = [];
      hexo.log.debug(logname, 'concatenate', scripts.length + ' javascripts');
      for (let i = 0; i < scripts.length; i++) {
        const script = scripts[i];
        const src = script.getAttribute('src');
        const textContent = script.textContent;
        const srcIsUrl = typeof src === 'string' && (src.startsWith('//') || src.startsWith('http:') || src.startsWith('https:'));
        /*
        // download external javascript
        if (srcIsUrl) {
          // exclude download external js from these domains
          const includes = ['-adnow.com/', '.googlesyndication.com/'];
          if (includes.some((str) => src.includes(str))) continue;
          const cachedExternal = cache.getCache('donwload-' + src, null as string | null);
          if (src.startsWith('//')) {
            src = 'http:' + src;
          }
          try {
            let data: string;
            if (cachedExternal === null) {
              data = (await axios.get(src)).data;
            } else {
              data = cachedExternal;
            }
            // replace text content (inner) string with response data
            textContent = data;
            // assign src as null
            src = null;
            // save downloaded js to cache
            cache.setCache('download-' + src, data);
          } catch (error) {
            hexo.log.error(logconcatname, 'download failed', error.message);
          }
        }
        */
        /**
         * indicator
         */
        const separator = `/*--- ${typeof src === 'string' && src.trim().length > 0 ? src : 'inner-' + i} --*/\n\n`;
        /**
         * add to scripts container
         * @param text javascript text
         */
        const addScript = function (text) {
          scriptContents.push(separator, text, '\n\n');
          // delete current script tag
          script.parentNode.removeChild(script);
        };
        // parse javascript
        if (typeof src === 'string' && src.trim().length > 0) {
          // skip external js
          if (srcIsUrl) continue;
          /**
           * find js file from theme, source, post directories
           */
          const originalSources = [
          // find from theme source directory
          path.join(cfg.theme_dir, 'source'),
          // find from node_modules directory
          path.join(process.cwd(), 'node_modules'),
          // find from our plugins directory
          path.join(process.cwd(), 'node_modules/hexo-shortcodes'),
          // find from source directory
          cfg.source_dir,
          // find from post directory
          cfg.post_dir,
          // find from asset post folder
          path.join(cfg.post_dir, path.basename(path0))].map(dir => path.join(dir, src));
          const sources = originalSources.filter(fs.existsSync);
          if (sources.length > 0) {
            try {
              const rendered = await hexo.render.render({
                path: sources[0],
                engine: 'js'
              });
              // push src
              addScript(rendered);
            } catch (e) {
              hexo.log.error(logconcatname, 'failed', src, e.message);
            }
          } else {
            hexo.log.error(logconcatname, 'failed, not found', src, path0);
            hexo.log.error(logconcatname, 'log', sbgUtility.writefile(path.join(tmpFolder, 'logs', filename + '.log'), originalSources).file);
          }
        } else {
          // push inner
          addScript(textContent);
        }
      }
      const filePathWithoutExt = path.join(tmpFolder, 'html', filename);
      const jsFilePath = path.join(buildFolder, 'hexo-seo-js', filename) + '.js';
      let scriptContent = scriptContents.join('\n');
      // minify only on generate
      if (getMode() === 'g' && cfg.js.enable) {
        scriptContent = await minifyJS(scriptContent, cfg.js.options);
      }
      // write js
      sbgUtility.writefile(jsFilePath, scriptContent).file;
      // show log
      hexo.log.debug(logname, jsFilePath);
      content = root.toString();
      // create new script and append to closing body
      const newsrc = `/hexo-seo-js/${filename}.js`;
      const newScript = `<script src="${newsrc}"></script>`;
      content = content.replace('</body>', newScript + '</body>');
      // cache router
      concatRoutes.push({
        path: newsrc,
        absolute: jsFilePath
      });
      coreCache.setSync(cache_key_router, concatRoutes);
      // write to public directory
      hexo.log.debug(logconcatname, 'written', sbgUtility.writefile(path.join(process.cwd(), hexo.config.public_dir, newsrc), scriptContent).file);
      hexo.log.debug(logname, sbgUtility.writefile(filePathWithoutExt + '.html', content).file);
      //window.close();
    }
    // END concatenate javascripts
    // modify html content
    content = root.toString();
    if (allowCache) cache.set(md5FileExports.md5(path0), content);
    hexo.log.debug(logname, 'no-cache content');
  } else {
    hexo.log.debug(logname, 'cached content');
    content = cache.getCache(md5FileExports.md5(path0), content);
  }
  return content;
}

const cache = new Cache();
async function HexoSeoCss(str, data) {
  const path0 = data.path;
  const isChanged = await cache.isFileChanged(path0);
  const useCache = this.config.seo.cache;
  if (isChanged || !useCache) {
    logger.log('%s is changed %s', path0, isChanged ? ansiColors.red(String(isChanged)) : ansiColors.green(String(isChanged)));
    // if original file is changed, re-minify css
    const hexo = this;
    const options = getConfig(hexo).css;
    // if option css is false, return original content
    if (typeof options == 'boolean' && !options) return str;
    const exclude = typeof options.exclude == 'object' ? options.exclude : [];
    if (path0 && exclude && exclude.length > 0) {
      const ignored = isIgnore(path0, exclude);
      logger.log('%s(CSS:exclude) %s %s %s', pkg.name, ignored ? ansiColors.red(String(ignored)) : ansiColors.green(String(ignored)), path0, exclude.join(', '));
      if (ignored) return str;
    }
    if (typeof options == 'object') {
      try {
        const {
          styles
        } = await new CleanCSS(options).minify(str);
        const saved = ((str.length - styles.length) / str.length * 100).toFixed(2);
        logger.log('%s(CSS): %s [%s saved]', pkg.name, path0, saved + '%');
        str = styles;
        cache.set(path0, str);
      } catch (err) {
        logger.log('%d(CSS) %s %s', pkg.name, path0 + ansiColors.redBright('failed'));
        logger.error(err);
      }
    }
  } else {
    logger.log('%s(CSS) cached [%s]', pkg.name, path0.replace(this.base_dir, ''));
    str = cache.get(path0, '');
  }
  return str;
}

const argv = minimist(process.argv.slice(2));
// --development
const arg = typeof argv['development'] == 'boolean' && argv['development'];
// set NODE_ENV = "development"
const env = process.env.NODE_ENV && process.env.NODE_ENV.toString().toLowerCase() === 'development';
// define is development
const isDev = arg || env;
const logname = ansiColors.magentaBright('hexo-seo');
// core
function HexoSeo(hexo) {
  //console.log("hexo-seo starting", { dev: env });
  // return if hexo-seo configuration unavailable
  if (typeof hexo.config.seo == 'undefined') {
    hexo.log.error(logname, 'seo options not found');
    return;
  }
  if (hexo.env.args._ && hexo.env.args._.length > 0) {
    for (let i = 0; i < hexo.env.args._.length; i++) {
      if (hexo.env.args._[i] == 's' || hexo.env.args._[i] == 'server') {
        setMode('s');
        break;
      }
      if (hexo.env.args._[i] == 'd' || hexo.env.args._[i] == 'deploy') {
        break;
      }
      if (hexo.env.args._[i] == 'g' || hexo.env.args._[i] == 'generate') {
        setMode('g');
        break;
      }
      if (hexo.env.args._[i] == 'c' || hexo.env.args._[i] == 'clean') {
        setMode('c');
        break;
      }
    }
  }
  // clean build and temp folder on `hexo clean`
  hexo.extend.filter.register('after_clean', function () {
    // remove some other temporary files
    hexo.log.debug(logname + '(clean)', 'cleaning build and temp folder');
    if (fs.existsSync(tmpFolder)) fs.rmSync(tmpFolder, {
      recursive: true,
      force: true
    });
    if (fs.existsSync(buildFolder)) fs.rmSync(buildFolder, {
      recursive: true,
      force: true
    });
  });
  // bind configuration
  const config = getConfig(hexo);
  hexo.config.seo = config;
  // Registers serving of the lib used by the plugin with Hexo.
  hexo.extend.generator.register('hexo-seo-js', () => {
    const concatRoutes = coreCache.getSync(cache_key_router, []);
    const wrap = [];
    for (let i = 0; i < concatRoutes.length; i++) {
      const {
        path,
        absolute
      } = concatRoutes[i];
      hexo.log.debug(logname, 'register', path);
      wrap.push({
        path,
        data: () => fs.createReadStream(absolute)
      });
    }
    return wrap;
  });
  // Register build folder to serving statically
  if (!fs.existsSync(buildFolder)) fs.mkdirSync(buildFolder, {
    recursive: true
  });
  // register when hexo server running
  hexo.extend.filter.register('server_middleware', function (app) {
    app.use(serveStatic(buildFolder, {
      index: ['index.html', 'index.htm'],
      extensions: ['js', 'css']
    }));
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

dotenv.config({
  override: true
});
if (typeof hexo !== 'undefined') {
  HexoSeo(hexo);
}
