import dotenv from 'dotenv';
import path from 'path';
import HexoSeo from './hexo-seo';

let envPath = path.join(process.cwd(), '.env');
if (typeof hexo !== 'undefined') {
  envPath = path.join(hexo.base_dir, '.env');
}
dotenv.config({ override: true, path: envPath });

if (typeof hexo !== 'undefined') {
  HexoSeo(hexo);
}
