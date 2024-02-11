import { bindProcessExit, fs, path } from 'sbg-utility';
import { baseSite, envHexo } from '../env';

// test only activate yoastseo sitemap

const config = {
  seo: {
    sitemap: {
      yoast: true
    }
  }
};

envHexo(config).then(async (hexo) => {
  await hexo.call('clean');
  await hexo.call('generate');
});

bindProcessExit('validate', () => {
  console.log(fs.existsSync(path.join(baseSite, 'public/google-news-sitemap.xml')) == false);
  // FIXME the file exist but detected not found
  console.log(fs.existsSync(path.join(baseSite, 'public/post-sitemap.xml')));
  console.log(fs.existsSync(path.join(baseSite, 'public/page-sitemap.xml')));
  console.log(fs.existsSync(path.join(baseSite, 'public/tag-sitemap.xml')));
  console.log(fs.existsSync(path.join(baseSite, 'public/category-sitemap.xml')));
});
