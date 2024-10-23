import dotenv from 'dotenv';
import HexoSeo from './hexo-seo';

dotenv.config({ override: true });

if (typeof hexo !== 'undefined') {
  HexoSeo(hexo);
}
