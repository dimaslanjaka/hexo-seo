import dotenv from 'dotenv';
import path from 'path';

// Determine .env path based on hexo context
const getEnvPath = () => {
  if (typeof hexo !== 'undefined' && hexo.base_dir) {
    return path.join(hexo.base_dir, '.env');
  }
  return path.join(process.cwd(), '.env');
};

dotenv.config({ override: true, path: getEnvPath() });

// define global hexo if not already defined
if (typeof hexo !== 'undefined') {
  (global as any).hexo = hexo;
}

// import module
import { HexoSeo } from './hexo-seo';

if (typeof hexo !== 'undefined') {
  HexoSeo(hexo);
}
