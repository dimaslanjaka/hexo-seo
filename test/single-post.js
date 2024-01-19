const Hexo = require('hexo');
const { path } = require('sbg-utility');

const base = path.join(__dirname, "../site");
const hexo = new Hexo(base, { silent: true });

hexo.init().then(() => {
  hexo.load().then(() => {
    const Post = hexo.model('Post');
    // console.log(Post);
  })
})