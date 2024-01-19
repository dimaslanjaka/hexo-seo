import * as fs from 'fs';
import path from 'path';

/**
 * Default image fallback if no image exists and not set on _config.yml
 */
let imgfallback = path.join(__dirname, 'images', 'no-image.png');
if (!fs.existsSync(imgfallback)) {
  imgfallback = path.join(__dirname, '../../../source/images', 'no-image.png');
}
if (!fs.existsSync(imgfallback)) {
  imgfallback = path.join(__dirname, '../../source/images', 'no-image.png');
}
if (!fs.existsSync(imgfallback)) {
  imgfallback = path.join(__dirname, '../source/images', 'no-image.png');
}

const defaultObject = {
  img: {
    fallback: {
      buffer: fs.readFileSync(imgfallback),
      public: '/images/no-image.png'
    }
  }
};

export default defaultObject;
