import lodash from 'lodash'
import urljoin from 'url-join'

const postInSitemap = function (post) {
  return post.sitemap !== false && post.published
}

const post = function (locals: HexoLocals, config) {
  const get = function () {
    if (locals.posts.length === 0) {
      return
    }
    const posts = lodash(locals.posts.toArray())
      .filter(postInSitemap)
      .orderBy('updated', 'desc')
      .value()

    let sitemaps = []
    if (config.sitemap.urlLimit > 0) {
      const chunk = lodash.chunk(posts, config.sitemap.urlLimit)
      sitemaps = lodash.map(chunk, (chunkPosts, index) => {
        const lastUpdatedPost = lodash.chain(chunkPosts)
          .first()
          .get('updated')
          .value()
        return {
          template: 'post-sitemap.ejs',
          filename: `post-sitemap-${index + 1}.xml`,
          data: {
            items: chunkPosts,
            urljoin
          },
          lastModification: lastUpdatedPost,
          isInIndexSitemap: true
        }
      })
    } else {
      const lastUpdatedPost = lodash.chain(posts)
        .first()
        .get('updated')
        .value()
      sitemaps.push({
        template: 'post-sitemap.ejs',
        filename: 'post-sitemap.xml',
        data: {
          items: posts,
          urljoin
        },
        lastModification: lastUpdatedPost,
        isInIndexSitemap: true
      })
    }

    return sitemaps
  }

  return {
    get: get
  }
}

export default post;
