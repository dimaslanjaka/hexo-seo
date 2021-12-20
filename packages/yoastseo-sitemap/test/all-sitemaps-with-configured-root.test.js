const Hexo = require('hexo'),
  path = require('path'),
  _ = require('lodash'),
  moment = require('moment'),
  normalizeNewline = require('normalize-newline'),
  Promise = require('bluebird'),
  fs = Promise.promisifyAll(require('fs')),
  helper = require('./helper'),
  readFileOptions = {
    encoding: 'utf8'
  },
  hexo = new Hexo(__dirname, { silent: true }),
  Post = hexo.model('Post'),
  Page = hexo.model('Page'),
  Tag = hexo.model('Tag'),
  generator = require(path.join(__dirname, '../lib/generator')).bind(hexo),
  photos = ['/images/img01.jpg', '/images/img02.jpg', 'http://anotherdomain/images/img03.jpg'],
  posts = [
    { source: 'foo', slug: 'foo', path: 'foo', updated: moment.utc([2015, 0, 1, 8]).toDate(), photos: photos },
    { source: 'bar', slug: 'bar', path: 'bar', updated: moment.utc([2015, 0, 2, 14]).toDate(), photos: photos },
    { source: 'baz', slug: 'baz', path: 'baz', updated: moment.utc([2015, 0, 3, 16]).toDate(), photos: photos }
  ],
  pages = [
    { source: 'Page 1', slug: 'Page 1', updated: moment.utc([2014, 11, 10, 9]).toDate(), path: 'page1' },
    { source: 'Page 2', slug: 'Page 2', updated: moment.utc([2014, 11, 15, 10]).toDate(), path: 'page2' },
    { source: 'Page 3', slug: 'Page 3', updated: moment.utc([2014, 11, 20, 11]).toDate(), path: 'page3' }
  ],
  tags = [{ name: 'footag', path: 'footag' }],
  setPostCategories = function(post) {
    console.log('setPostCategories')
    return post.setCategories(['Cat1', 'Cat2', 'Cat3'])
  },
  setPostTags = function(post) {
    console.log('setPostTags')
    return post.setTags(['Tag1', 'Tag2', 'Tag3'])
  },
  setPostCategoriesAndTags = function(posts) {
    console.log('setPostCategoriesAndTags')
    const post = posts[0]
    return setPostCategories(post)
      .return(post)
      .then(setPostTags)
  },
  insertPosts = function() {
    console.log('insertPosts')
    return Post.insert(posts).then(setPostCategoriesAndTags)
  },
  insertPages = function() {
    console.log('insertPages')
    return Page.insert(pages)
  },
  insertTags = function() {
    console.log('insertTags')
    return Tag.insert(tags)
  },
  setHexoLocals = function() {
    console.log('setHexoLocals')
    locals = hexo.locals.toObject()
    return Promise.resolve(locals)
  }

let locals

describe('SEO-friendly sitemap generator: All Sitemaps with configured root', function() {
  beforeAll(function() {
    hexo.config.permalink = ':title'
    hexo.config.url = 'http://yoursite.com/rootpath'
    hexo.config.root = '/rootpath/'
    hexo.init()
    return insertPosts()
      .then(insertPages)
      .then(insertTags)
      .then(setHexoLocals)
  })

  it('should generate all sitemap files if posts, pages, categories and tags are defined', function() {
    hexo.config.sitemap = {
      path: 'sitemap.xml',
      beautify: false
    }

    const expectedDirectory = path.join(__dirname, 'expected'),
      expectedIndexFilePath = path.join(expectedDirectory, 'with-configured-root/full-index-sitemap.xml'),
      expectedPostFilePath = path.join(expectedDirectory, 'with-configured-root/full-post-sitemap.xml'),
      expectedPageFilePath = path.join(expectedDirectory, 'with-configured-root/full-page-sitemap.xml'),
      expectedCategoryFilePath = path.join(expectedDirectory, 'with-configured-root/full-category-sitemap.xml'),
      expectedTagFilePath = path.join(expectedDirectory, 'with-configured-root/full-tag-sitemap.xml'),
      expectedIndexSitemap = fs.readFileAsync(expectedIndexFilePath, readFileOptions),
      expectedPostSitemap = fs.readFileAsync(expectedPostFilePath, readFileOptions),
      expectedPageSitemap = fs.readFileAsync(expectedPageFilePath, readFileOptions),
      expectedCategorySitemap = fs.readFileAsync(expectedCategoryFilePath, readFileOptions),
      expectedTagSitemap = fs.readFileAsync(expectedTagFilePath, readFileOptions),
      checkAssertions = function(result) {
        expect(Array.isArray(result)).toBe(true)

        const indexSitemap = _.find(result, { path: 'sitemap.xml' }),
          postSitemap = _.find(result, { path: 'post-sitemap.xml' }),
          pageSitemap = _.find(result, { path: 'page-sitemap.xml' }),
          categorySitemap = _.find(result, { path: 'category-sitemap.xml' }),
          tagSitemap = _.find(result, { path: 'tag-sitemap.xml' })

        expect(indexSitemap).toBeDefined()
        expect(indexSitemap.data).toBeDefined()
        expect(postSitemap).toBeDefined()
        expect(postSitemap.data).toBeDefined()

        expect(pageSitemap).toBeDefined()
        expect(pageSitemap.data).toBeDefined()

        expect(categorySitemap).toBeDefined()
        expect(categorySitemap.data).toBeDefined()

        expect(tagSitemap).toBeDefined()
        expect(tagSitemap.data).toBeDefined()

        return Promise.all([
          expectedIndexSitemap.then(function(buffer) {
            expect(helper.removeEmptyLines(normalizeNewline(indexSitemap.data))).toEqual(
              helper.removeEmptyLines(normalizeNewline(buffer))
            )
          }),
          expectedPostSitemap.then(function(buffer) {
            expect(helper.removeEmptyLines(normalizeNewline(postSitemap.data))).toEqual(
              helper.removeEmptyLines(normalizeNewline(buffer))
            )
          }),
          expectedPageSitemap.then(function(buffer) {
            expect(helper.removeEmptyLines(normalizeNewline(pageSitemap.data))).toEqual(
              helper.removeEmptyLines(normalizeNewline(buffer))
            )
          }),
          expectedCategorySitemap.then(function(buffer) {
            expect(helper.removeEmptyLines(normalizeNewline(categorySitemap.data))).toEqual(
              helper.removeEmptyLines(normalizeNewline(buffer))
            )
          }),
          expectedTagSitemap.then(function(buffer) {
            expect(helper.removeEmptyLines(normalizeNewline(tagSitemap.data))).toEqual(
              helper.removeEmptyLines(normalizeNewline(buffer))
            )
          })
        ])
      }

    return generator(locals).then(checkAssertions)
  })
})
