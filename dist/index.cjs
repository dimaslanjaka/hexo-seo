// hexo-seo 2.0.1 by Dimas Lanjaka <dimaslanjaka@gmail.com> (https://github.com/dimaslanjaka)
'use strict';

var dotenv = require('dotenv');
var ansiColors = require('ansi-colors');
var fs = require('fs-extra');
var minimist = require('minimist');
var serveStatic = require('serve-static');
var Bluebird = require('bluebird');
var he = require('he');
var moment = require('moment');
var nunjucks = require('nunjucks');
var path$1 = require('path');
var sbgUtility = require('sbg-utility');
var path = require('upath');
var crypto = require('crypto');
var nodeHtmlParser = require('node-html-parser');
var parseUrl = require('url-parse');
var NodeCache = require('node-cache');
var hexoLog = require('hexo-log');
var fs$1 = require('fs');
var require$$3 = require('underscore');
var assign = require('object-assign');
var terser = require('terser');
var minimatch = require('minimatch');
var rimraf = require('rimraf');
var sanitizeFilename = require('sanitize-filename');
var utils = require('util');
var googleNewsSitemap$1 = require('google-news-sitemap');
var hexoUtil = require('hexo-util');
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

var hexoLog__namespace = /*#__PURE__*/_interopNamespaceDefault(hexoLog);

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
    let mut_iterablesIndex = 0;
    let mut_iterator = iterables[0]?.[Symbol.iterator]();
    return {
        [Symbol.iterator]() {
            return {
                next() {
                    do {
                        if (mut_iterator === undefined) {
                            return { done: true, value: undefined };
                        }
                        const result = mut_iterator.next();
                        if (result.done === true) {
                            mut_iterablesIndex += 1;
                            mut_iterator = iterables[mut_iterablesIndex]?.[Symbol.iterator]();
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
 * Get the last value in the given array.
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
        for (let mut_index = 1; mut_index < filteredValues.length; mut_index++) {
            if (getObjectType(filteredValues[mut_index]) === type) {
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
const tmpFolder = path.join(process.cwd(), 'tmp/hexo-seo');
const buildFolder = path.join(tmpFolder, 'build');
/**
 * resolve dirname of file
 * @param filePath
 * @returns
 */
function resolveFile(filePath) {
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), {
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
  if (autocreate && !fs.existsSync(filePath)) {
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
  return fs.readFileSync(filePath, options);
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
    public_dir: path.join(process.cwd(), String(hexo.config.public_dir || 'public')),
    post_dir: path.join(process.cwd(), String(hexo.config.source_dir || 'source'), '_posts'),
    search: {
      type: ['post', 'page']
    },
    feed: {
      type: ['post', 'page'],
      icon: 'https://w7.pngwing.com/pngs/745/306/png-transparent-gallery-image-images-photo-picture-pictures-set-app-incredibles-icon-thumbnail.png'
    }
  };
  const seo = hexo.config.seo;
  sbgUtility.writefile(path.join(__dirname, '_config_data.json'), JSON.stringify(seo, null, 2));
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

/**
 * Checks if the provided string is a valid email address.
 *
 * @param email - The string to validate as an email address.
 * @returns True if the string is a valid email address, otherwise false.
 *
 * @example
 * ```typescript
 * const email1 = "example@example.com";
 * const email2 = "invalid-email.com";
 *
 * console.log(isValidEmail(email1)); // true
 * console.log(isValidEmail(email2)); // false
 * ```
 */
function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
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
/**
 * Retrieves the author's email from a post object or hexo configuration.
 *
 * @param postObj - The post object which may contain the author's information.
 * This can be either a string representing the author's email or an object containing author details.
 *
 * @param hexoConfig - The Hexo configuration object, which may contain default author information.
 * Defaults to an empty object if not provided.
 *
 * @returns The author's email address if valid; otherwise, returns a default email address ('noreply@blogger.com').
 *
 * @example
 * ```typescript
 * const post = { author: { email: "author@example.com" } };
 * const email = getAuthorEmail(post);
 * console.log(email); // Outputs: "author@example.com"
 * ```
 *
 * @example
 * ```typescript
 * const email = getAuthorEmail("author@example.com");
 * console.log(email); // Outputs: "author@example.com"
 * ```
 *
 * @example
 * ```typescript
 * const invalidPost = {};
 * const email = getAuthorEmail(invalidPost);
 * console.log(email); // Outputs: "noreply@blogger.com"
 * ```
 */
function getAuthorEmail(postObj, hexoConfig = {}) {
  let result = 'noreply@blogger.com';
  // Check if postObj is provided
  if (postObj) {
    // Determine the author from the post object or hexo config
    const author = typeof postObj === 'string' ? postObj : postObj.author || hexoConfig.author;
    // Validate author is not null or undefined
    if (author) {
      if (typeof author === 'string') {
        result = author; // Use the string author directly
      } else {
        if ('email' in author) {
          result = author.email;
        } else if ('mail' in author) {
          result = author.mail;
        } else if (hexoConfig.email) {
          // get _config_yml.email
          result = hexoConfig.email;
        }
      }
    }
  }
  // Validate the email address
  if (!isValidEmail(result)) return 'noreply@blogger.com';
  return result; // Return the valid email address
}

const INDEXED_PROPERTIES = ['title', 'date', 'updated', 'slug',
// jekyll front-matter
'excerpt', 'permalink', 'layout', 'image', 'categories', 'tags', 'subtitle',
// NextJS front-matter
'updated', 'description',
// jekyll front-matter
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
function pickPostObjectData(object, properties, fix = false) {
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
async function hexoSeoSearch(args, callback) {
  try {
    const hexo = this;
    const hexoConfig = hexo.config;
    const config = getConfig(hexo);
    config.search.type = sbgUtility.array_unique(config.search.type);
    const searchConfig = config.search;
    await hexo.load();
    const indexedPages = [];
    if (searchConfig.type.includes('post')) {
      const posts = hexo.database.model('Post').find({
        published: true
      }).toArray();
      indexedPages.push(...posts);
    }
    if (searchConfig.type.includes('page')) {
      const pages = hexo.database.model('Page').toArray(); //.find({ published: true }).toArray();
      // .find({
      //   layout: { $in: pageLayouts }
      // });
      indexedPages.push(...pages);
    }
    const dataToSave = indexedPages.map(data => {
      const storedPost = pickPostObjectData(data, INDEXED_PROPERTIES, true);
      storedPost.objectID = sbgUtility.md5(data.path);
      storedPost.date_as_int = Date.parse(data.date) / 1000;
      storedPost.updated_as_int = Date.parse(data.updated) / 1000;
      storedPost.permalink = storedPost.permalink.replace(/\/index.html$/, '/');
      if (data.categories && (Array.isArray(data.categories) || typeof data.categories.toArray === 'function')) {
        storedPost.categories = (data.categories.toArray ? data.categories.toArray() : data.categories).map(function (item) {
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
    const paths = [path$1.join(config.source_dir, 'hexo-seo-search.json'), path$1.join(config.public_dir, 'hexo-seo-search.json')];
    hexo.log.info('[hexo-seo] %d records to index (%s).', indexedPages.length, searchConfig.type.join(', '));
    paths.forEach(file => sbgUtility.writefile(file, JSON.stringify(dataToSave)));
    hexo.log.info(`[hexo-seo] Local search saved to ${paths.map(file => sbgUtility.normalizePathUnix(file).replace(sbgUtility.normalizePathUnix(hexo.base_dir), '')).join(', ')}.`);
    hexo.log.info('[hexo-seo] Local search indexing done.');
  } catch (error) {
    callback(error);
  }
}

async function generateFeeds(_args, callback) {
  try {
    const hexoConfig = this.config;
    const config = getConfig(hexo);
    const feedConfig = config.feed;
    await hexo.load();
    const indexedPages = [];
    if (feedConfig.type.includes('post')) {
      const posts = hexo.database.model('Post').find({
        published: true
      }).toArray();
      indexedPages.push(...posts);
    }
    if (feedConfig.type.includes('page')) {
      const pages = hexo.database.model('Page').toArray(); //.find({ published: true }).toArray();
      // .find({
      //   layout: { $in: pageLayouts }
      // });
      indexedPages.push(...pages);
    }
    const pageItems = indexedPages.map(data => {
      const storedPost = pickPostObjectData(data, INDEXED_PROPERTIES, true);
      if (!storedPost.layout || storedPost.layout === 'false') return undefined;
      storedPost.permalink = storedPost.permalink.replace(/\/index.html$/, '/');
      if (data.categories && (Array.isArray(data.categories) || typeof data.categories.toArray === 'function')) {
        storedPost.categories = (data.categories.toArray ? data.categories.toArray() : data.categories).map(function (item) {
          return pickPostObjectData(item, ['name', 'path']);
        });
      }
      if (data.tags && (Array.isArray(data.tags) || typeof data.tags.toArray === 'function')) {
        storedPost.tags = (data.tags.toArray ? data.tags.toArray() : data.tags).map(function (item) {
          return pickPostObjectData(item, ['name', 'path']);
        });
      }
      storedPost.authorName = getAuthorName(data.author || hexoConfig.author);
      storedPost.authorEmail = getAuthorEmail(data.author || hexoConfig.author);
      storedPost.link = storedPost.permalink;
      storedPost.guid = storedPost.permalink;
      // use site description when empty
      if (!storedPost.description) storedPost.description = hexoConfig.description;
      if (Array.isArray(storedPost.categories)) {
        storedPost.category = storedPost.categories.map(item => item.name);
      }
      // empty category, will mapped into uncategorized
      if (!storedPost.categories || storedPost.categories.length === 0) {
        storedPost.categories = [{
          name: 'uncategorized'
        }];
      }
      storedPost.title = he.encode(storedPost.title || '');
      storedPost.description = he.encode(storedPost.description || storedPost.title);
      storedPost.updatedDate = storedPost.updated.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      storedPost.pubDate = storedPost.date.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      storedPost.createdDate = storedPost.date.utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
      // skip empty page title
      if (storedPost.title.length === 0) return undefined;
      // trim string values
      for (const key in storedPost) {
        if (Object.prototype.hasOwnProperty.call(storedPost, key)) {
          const value = storedPost[key];
          if (typeof value === 'string') storedPost[key] = (value || '').trim();
        }
      }
      // if (storedPost.layout === 'post') {
      //   console.log(storedPost);
      // }
      // {
      //   title: 'Example Post Title',
      //   link: 'https://www.yoursite.com/example-post',
      //   description: 'This is an example description for the post.',
      //   authorEmail: 'author@example.com',
      //   authorName: 'Author Name',
      //   category: 'Category Name',
      //   pubDate: 'Sat, 26 Oct 2024 09:00:00 +0000',
      //   guid: 'https://www.yoursite.com/example-post'
      // }
      return storedPost;
    }).filter(o => typeof o === 'object');
    const latestDate = moment(Math.max(...pageItems.map(o => o.date).map(date => date.valueOf()))).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const latestUpdated = moment(Math.max(...pageItems.map(o => o.updated).map(date => date.valueOf()))).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
    const templateDir = path$1.join(__dirname, 'views');
    const env = nunjucks.configure(templateDir, {
      noCache: true,
      autoescape: false,
      // set autoescape to false
      throwOnUndefined: false,
      trimBlocks: false,
      lstripBlocks: false
    });
    const context = {
      config: hexoConfig,
      siteTitle: hexoConfig.title,
      siteUrl: hexoConfig.url,
      feedUrl: `${hexoConfig.url}/rss.xml`,
      iconUrl: config.feed.icon,
      siteDescription: hexoConfig.description,
      language: Array.isArray(hexoConfig.language) ? hexoConfig.language[0] : hexoConfig.language || 'en-us',
      authorName: getAuthorName(hexoConfig.author),
      authorEmail: getAuthorEmail(hexoConfig.author),
      // lastBuildDate: 'Sat, 26 Oct 2024 10:00:00 +0000',
      lastBuildDate: latestUpdated,
      updatedDate: latestUpdated,
      // pubDate: 'Sat, 26 Oct 2024 10:00:00 +0000',
      pubDate: latestDate,
      ttl: 1800,
      entries: pageItems
    };
    const RSSContent = env.render('rss.xml', context);
    const RSS = Bluebird.all([path$1.join(config.source_dir, 'rss.xml'), path$1.join(config.public_dir, 'rss.xml')]).each(file => {
      // Split the file content into lines and filter out empty lines
      const cleanedData = RSSContent.split('\n') // Split by new lines
      .filter(line => line.trim() !== '') // Remove empty lines
      .join('\n'); // Join back into a single string
      sbgUtility.writefile(file, cleanedData);
      hexo.log.info(`[hexo-seo] RSS 2.0 saved to ${file}.`);
    }).catch(callback);
    const ATOMContent = env.render('atom.xml', context);
    const ATOM = Bluebird.all([path$1.join(config.source_dir, 'atom.xml'), path$1.join(config.public_dir, 'atom.xml')]).each(file => {
      // Split the file content into lines and filter out empty lines
      const cleanedData = ATOMContent.split('\n') // Split by new lines
      .filter(line => line.trim() !== '') // Remove empty lines
      .join('\n'); // Join back into a single string
      sbgUtility.writefile(file, cleanedData);
      hexo.log.info(`[hexo-seo] ATOM saved to ${file}.`);
    }).catch(callback);
    return Bluebird.all([RSS, ATOM]);
  } catch (error) {
    callback(error);
  }
}

/**
 * Initialize CLI utilities
 * @param hexo Hexo instance
 */
function initCLI(hexo) {
  hexo.extend.console.register('seo-search', `Index your content and save as hexo-seo-search.json to ${hexo.config.public_dir} and ${hexo.config.source_dir} directory`, {}, hexoSeoSearch);
  hexo.extend.console.register('seo-feed', `Index your content and save as rss.xml to ${hexo.config.public_dir} and ${hexo.config.source_dir} directory`, {}, generateFeeds);
  hexo.extend.console.register('seo', 'hexo-seo all in one generation', async function (args, callback) {
    await Bluebird.promisify(hexoSeoSearch).call(this, args, callback);
    await Bluebird.promisify(generateFeeds).call(this, args, callback);
  });
}

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
  const fs = fs$1;
  const Promise = Bluebird;
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
var version = "2.0.1";
var description = "Automated Seo Optimizer For Hexo";
var main = "dist/index.js";
var types = "dist/index.d.ts";
var module$1 = "dist/index.mjs";
var exports$1 = {
	".": {
		"import": "./dist/index.mjs",
		require: "./dist/index.js",
		types: "./dist/index.d.ts"
	},
	"./src/*": {
		"import": "./src/*.ts",
		require: "./src/*.ts",
		types: "./src/*.ts"
	}
};
var files = [
	"dist/",
	"src/",
	"images/",
	"source/"
];
var scripts = {
	lint: "eslint ./src",
	"lint-and-fix": "eslint ./src --fix",
	"ts:normal": "tsc -p tsconfig.build.json",
	build: "yarn run ts:normal && rollup -c && gulp",
	clean: "rimraf dist && gulp clean && npm run build",
	"update:project": "curl https://github.com/dimaslanjaka/nodejs-package-types/raw/main/.gitattributes > .gitattributes && curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/changelog.js > changelog.js && curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/packer.js > packer.js",
	"update:ncu": "npm-check-updates -u",
	update: "yarn run update:project && yarn run update:ncu",
	"test:generate": "npm run build && cd site && hexo g",
	test: "run-s test:** && node test/index.cjs",
	prepack: "node package-switch.cjs production",
	prepublish: "npm run prepack",
	pack: "node packer.js --yarn",
	prepare: "husky"
};
var repository = "dimaslanjaka/hexo-seo";
var homepage = "https://www.webmanajemen.com/docs/hexo-seo";
var keywords = [
	"hexo",
	"hexo plugin",
	"seo",
	"search engine optimization",
	"hexo seo",
	"meta tags",
	"open graph",
	"twitter cards",
	"structured data",
	"sitemap",
	"robots.txt",
	"json-ld",
	"blog seo",
	"content optimization",
	"blogging",
	"hexo site",
	"seo tools",
	"seo automation",
	"web development",
	"page performance",
	"hexo themes"
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
	axios: "^1.10.0",
	bluebird: "^3.7.2",
	cheerio: "^1.1.0",
	"clean-css": "^5.3.3",
	"deepmerge-ts": "7.1.5",
	dotenv: "^16.5.0",
	"file-type": "^21.0.0",
	"fs-extra": "^11.3.0",
	"google-news-sitemap": "^1.1.1",
	he: "^1.2.0",
	"hexo-is": "^2.0.1",
	"hexo-log": "^4.1.0",
	"hexo-util": "^3.3.0",
	"html-minifier-terser": "^7.2.0",
	jsdom: "^26.1.0",
	minimatch: "^10.0.3",
	minimist: "^1.2.8",
	moment: "^2.30.1",
	"moment-timezone": "^0.6.0",
	"node-cache": "^5.1.2",
	"node-html-parser": "^7.0.1",
	nunjucks: "^3.2.4",
	"object-assign": "^4.1.1",
	rimraf: "^6.0.1",
	"sanitize-filename": "^1.6.3",
	"sbg-utility": "^2.0.8",
	"serve-static": "^2.2.0",
	terser: "^5.43.0",
	underscore: "^1.13.7",
	upath: "^2.0.1",
	"url-parse": "^1.5.10",
	xmlbuilder2: "^3.1.1"
};
var devDependencies = {
	"@babel/core": "^7.27.4",
	"@babel/preset-env": "^7.27.2",
	"@babel/preset-typescript": "^7.27.1",
	"@eslint/eslintrc": "^3.3.1",
	"@eslint/js": "^9.29.0",
	"@rollup/plugin-babel": "^6.0.4",
	"@rollup/plugin-commonjs": "^28.0.6",
	"@rollup/plugin-json": "^6.1.0",
	"@rollup/plugin-node-resolve": "^16.0.1",
	"@rollup/plugin-terser": "^0.4.4",
	"@rollup/plugin-typescript": "^12.1.3",
	"@types/babel__core": "^7",
	"@types/babel__preset-env": "^7",
	"@types/bluebird": "^3",
	"@types/clean-css": "^4.2.11",
	"@types/fs-extra": "^11.0.4",
	"@types/gulp": "^4.0.17",
	"@types/he": "^1",
	"@types/hexo": "https://github.com/dimaslanjaka/hexo/raw/fc1f9b7/releases/hexo.tgz",
	"@types/jsdom": "^21.1.7",
	"@types/minimist": "^1",
	"@types/node": "^24.0.3",
	"@types/nunjucks": "^3",
	"@types/object-assign": "^4.0.33",
	"@types/serve-static": "^1.15.8",
	"@types/through2": "https://github.com/dimaslanjaka/nodejs-package-types/raw/through2/release/types-through2.tgz",
	"@types/url-parse": "^1.4.11",
	"@typescript-eslint/eslint-plugin": "^8.34.1",
	"@typescript-eslint/parser": "^8.34.1",
	"binary-collections": "https://github.com/dimaslanjaka/bin/raw/refs/heads/master/releases/bin.tgz",
	"cross-env": "^7.0.3",
	"cross-spawn": "https://github.com/dimaslanjaka/node-cross-spawn/raw/80999ac/release/cross-spawn.tgz",
	depcheck: "^1.4.7",
	eslint: "^9.29.0",
	"eslint-config-prettier": "^10.1.5",
	"eslint-plugin-import": "^2.31.0",
	"eslint-plugin-prettier": "^5.5.0",
	"git-command-helper": "^2.0.2",
	globals: "^16.2.0",
	gulp: "^5.0.1",
	"gulp-cli": "^3.1.0",
	husky: "^9.1.7",
	nodemon: "^3.1.10",
	"npm-check-updates": "^18.0.1",
	prettier: "^3.5.3",
	prompt: "^1.3.0",
	rollup: "^4.43.0",
	"rollup-plugin-dts": "^6.2.1",
	"ts-node": "^10.9.2",
	typescript: "^5.8.3"
};
var optionalDependencies = {
	"glob-parent": ">=6.0.2",
	"node.extend": ">=2.0.3",
	request: ">=2.88.2",
	uuid: ">=11.1.0"
};
var packageManager = "yarn@4.9.2";
var workspaces = [
	"site"
];
var resolutions = {
	"@types/git-command-helper": "https://github.com/dimaslanjaka/git-command-helper/raw/pre-release/release/git-command-helper.tgz",
	"@types/hexo": "https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo.tgz",
	"binary-collections": "https://github.com/dimaslanjaka/bin/raw/fcd1121/releases/bin.tgz",
	"cross-spawn": "https://github.com/dimaslanjaka/node-cross-spawn/raw/private/release/cross-spawn.tgz",
	"git-command-helper": "https://github.com/dimaslanjaka/git-command-helper/raw/pre-release/release/git-command-helper.tgz",
	hexo: "https://github.com/dimaslanjaka/hexo/raw/7026ac85e44d3fc77c7d7fa38561260e5afa9bc9/releases/hexo.tgz",
	"hexo-adsense": "https://github.com/dimaslanjaka/hexo-adsense/raw/f1bc48e54bd804e0afae0088e622905b052bc91a/release/hexo-adsense.tgz",
	"hexo-asset-link": "https://github.com/dimaslanjaka/hexo/raw/monorepo-v7/releases/hexo-asset-link.tgz",
	"hexo-cli": "https://github.com/dimaslanjaka/hexo/raw/7026ac85e44d3fc77c7d7fa38561260e5afa9bc9/releases/hexo-cli.tgz",
	"hexo-front-matter": "https://github.com/dimaslanjaka/hexo/raw/7026ac85e44d3fc77c7d7fa38561260e5afa9bc9/releases/hexo-front-matter.tgz",
	"hexo-generator-redirect": "https://github.com/dimaslanjaka/hexo-generator-redirect/raw/0885394/release/hexo-generator-redirect.tgz",
	"hexo-is": "https://github.com/dimaslanjaka/hexo-is/raw/9fd9da881b70f79405b799e1dea61e3e4657c077/release/hexo-is.tgz",
	"hexo-log": "https://github.com/dimaslanjaka/hexo/raw/7026ac85e44d3fc77c7d7fa38561260e5afa9bc9/releases/hexo-log.tgz",
	"hexo-post-parser": "https://github.com/dimaslanjaka/hexo-post-parser/raw/65f1dab05012fe5ab106197f2052d8ff8451884c/release/hexo-post-parser.tgz",
	"hexo-renderers": "https://github.com/dimaslanjaka/hexo-renderers/raw/873a4ec83b59502368eaa8ddf564a7b3a2d7397b/release/hexo-renderers.tgz",
	"hexo-server": "https://github.com/dimaslanjaka/hexo/raw/7026ac85e44d3fc77c7d7fa38561260e5afa9bc9/releases/hexo-server.tgz",
	"hexo-shortcodes": "https://github.com/dimaslanjaka/hexo-shortcodes/raw/f70a1c0/release/hexo-shortcodes.tgz",
	"hexo-util": "https://github.com/dimaslanjaka/hexo/raw/7026ac85e44d3fc77c7d7fa38561260e5afa9bc9/releases/hexo-util.tgz",
	"instant-indexing": "https://github.com/dimaslanjaka/static-blog-generator/raw/master/packages/instant-indexing/release/instant-indexing.tgz",
	"markdown-it": "https://github.com/dimaslanjaka/markdown-it/raw/17ccc825cbb3e4c6d59edada5f6d93f27075d752/release/markdown-it.tgz",
	"nodejs-package-types": "https://github.com/dimaslanjaka/nodejs-package-types/raw/a2e797bc27975cba20ef4c87547841e6341bfcf4/release/nodejs-package-types.tgz",
	"sbg-api": "https://github.com/dimaslanjaka/static-blog-generator/raw/95400dd87106542a640092fa2073ee7d5c9b83e6/packages/sbg-api/release/sbg-api.tgz",
	"sbg-cli": "https://github.com/dimaslanjaka/static-blog-generator/raw/b4ea999f96ed7382b567d24ad39c92a9ba60005b/packages/sbg-cli/release/sbg-cli.tgz",
	"sbg-server": "https://github.com/dimaslanjaka/static-blog-generator/raw/master/packages/sbg-server/release/sbg-server.tgz",
	"sbg-utility": "https://github.com/dimaslanjaka/static-blog-generator/raw/840f63d269216f134b84414cf300499703090071/packages/sbg-utility/release/sbg-utility.tgz",
	"static-blog-generator": "https://github.com/dimaslanjaka/static-blog-generator/raw/master/packages/static-blog-generator/release/static-blog-generator.tgz",
	warehouse: "https://github.com/dimaslanjaka/hexo/raw/7026ac85e44d3fc77c7d7fa38561260e5afa9bc9/releases/warehouse.tgz"
};
var pkg = {
	name: name,
	version: version,
	description: description,
	main: main,
	types: types,
	module: module$1,
	exports: exports$1,
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
	workspaces: workspaces,
	resolutions: resolutions
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
  if (!(hash in firstIndicator)) {
    rimraf.rimrafSync(filePath);
    firstIndicator[hash] = true;
  }
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), {
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
  fs.writeFileSync(filePath, buildLog);
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

/* eslint-disable @typescript-eslint/no-this-alias */
// source of https://github.com/hexojs/hexo/blob/master/lib/plugins/helper/is.js

function isCurrentHelper(path = "/", strict) {
  const currentPath = this.path.replace(/^[^/].*/, "/$&");
  if (strict) {
    if (path.endsWith("/")) path += "index.html";
    path = path.replace(/^[^/].*/, "/$&");
    return currentPath === path;
  }
  path = path.replace(/\/index\.html$/, "/");
  if (path === "/") return currentPath === "/index.html";
  path = path.replace(/^[^/].*/, "/$&");
  return currentPath.startsWith(path);
}
function isHomeHelper() {
  return Boolean(this.page.__index);
}
function isPostHelper() {
  if (this.page) {
    const src = this.page["full_source"] || "";
    const layout = this.page.layout || "";
    if (layout.startsWith("post")) return true;
    if (layout.startsWith("page")) return false;
    if (src !== "") {
      return Boolean(this.page.__post) && src.includes("_posts");
    }
  }
  return Boolean(this.page.__post);
}
function isPageHelper() {
  if (this.page) {
    const src = this.page["full_source"] || "";
    const layout = this.page.layout || "";
    if (layout.startsWith("post")) return false;
    if (layout.startsWith("page")) return true;
    if (src !== "") {
      return Boolean(this.page.__post) && !src.includes("_posts");
    }
  }
  return Boolean(this.page.__page);
}
function isArchiveHelper() {
  return Boolean(this.page.archive);
}
function isYearHelper(year) {
  const {
    page
  } = this;
  if (!page.archive) return false;
  if (year) {
    return page.year === year;
  }
  return Boolean(page.year);
}
function isMonthHelper(year, month) {
  const {
    page
  } = this;
  if (!page.archive) return false;
  if (year) {
    if (month) {
      return page.year === year && page.month === month;
    }
    return page.month === year;
  }
  return Boolean(page.year && page.month);
}
function isCategoryHelper(category) {
  if (category) {
    return this.page.category === category;
  }
  return Boolean(this.page.category);
}
function isTagHelper(tag) {
  if (tag) {
    return this.page.tag === tag;
  }
  return Boolean(this.page.tag);
}
const current = isCurrentHelper;
const home = isHomeHelper;
const post = isPostHelper;
const page = isPageHelper;
const archive = isArchiveHelper;
const year = isYearHelper;
const month = isMonthHelper;
const category = isCategoryHelper;
const tag = isTagHelper;
/**
 * Custom function
 * @param hexo
 * @returns
 */
function internalIs(hexo) {
  const obj = {
    current: false,
    home: false,
    post: false,
    page: false,
    archive: false,
    year: false,
    month: false,
    category: false,
    tag: false,
    message: "try using second argument"
  };
  if (typeof hexo["page"] == "undefined") return obj;
  return {
    current: current.bind(hexo)(),
    home: home.bind(hexo)(),
    post: post.bind(hexo)(),
    page: page.bind(hexo)(),
    archive: archive.bind(hexo)(),
    year: year.bind(hexo)(),
    month: month.bind(hexo)(),
    category: category.bind(hexo)(),
    tag: tag.bind(hexo)()
  };
}

/* eslint-disable prefer-rest-params */
typeof hexo !== "undefined" ? hexo.log : hexoLog.logger({
  debug: false,
  silent: false
});
/**
 * @example
 * // run inside plugin or theme event
 * import hexoIs from 'hexo-is';
 * const hexo = this;
 * console.log(hexoIs(hexo)); // object or string
 * @param hexo
 * @returns
 */
const hexoIs = function (hexo) {
  if (typeof hexo === "undefined") return;
  if (typeof hexo["page"] != "undefined") return internalIs(hexo);
  if (typeof hexo["type"] != "undefined") {
    const ix = internalIs(hexo);
    if (typeof ix[hexo["type"]] != "undefined") ix[hexo["type"]] = true;
    return ix;
  }
};

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
const googleNewsSitemap = new googleNewsSitemap$1.GoogleNewsSitemap();
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
          location: hexoUtil.url_for.bind(this)(post.permalink)
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

const logname$1 = `${ansiColors.magentaBright('hexo-seo')}(${ansiColors.blueBright('fixSchema.static')})`;
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
          sameAs: hexoUtil.url_for.bind(this)(post.permalink)
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
    if (['archive', 'tags', data.config.title, 'categories', 'homepage'].includes(title.toLowerCase())) {
      logger.debug('schema created', title, url);
    }
    if (isDev) {
      dump('schema-' + title + '.json', schemahtml);
    }
    if (schemahtml) {
      const head = dom.getElementsByTagName('head')[0];
      if (head) {
        head.insertAdjacentHTML('beforeend', schemahtml);
      } else {
        const message = `Fail apply schema json on ${data.path}`;
        if (typeof hexo !== 'undefined') {
          hexo.log.error(logname$1, message);
        } else {
          console.error(logname$1, message);
        }
      }
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
    fixSchemaStatic.bind(this)(root, cfg, data);
    // TODO process sitemap
    sitemap.bind(this)(root, cfg, data);
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
      sbgUtility.writefile(jsFilePath, scriptContent);
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
  // detect hexo arguments
  let hexoCmd;
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
  hexo.log.debug(logname, 'command', hexoCmd || 'unknown');
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
  // init CLI
  initCLI(hexo);
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
