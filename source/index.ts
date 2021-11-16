import * as fs from "fs";
import path from "path";

/**
 * Default image fallback if no image exists and not set on _config.yml
 */
let imgfallback = path.join(__dirname, "img", "no-image.png");
if (!fs.existsSync(imgfallback)) {
  imgfallback = path.join(__dirname, "../../../source/img", "no-image.png");
}
if (!fs.existsSync(imgfallback)) {
  imgfallback = path.join(__dirname, "../../source/img", "no-image.png");
}
if (!fs.existsSync(imgfallback)) {
  imgfallback = path.join(__dirname, "../source/img", "no-image.png");
}

const defaultObject = {
  img: {
    fallback: {
      buffer: fs.readFileSync(imgfallback),
      public: "/img/no-image.png"
    }
  }
};

if (typeof hexo != "undefined") {
  console.log("setup route");
  hexo.route.set(
    defaultObject.img.fallback.public,
    defaultObject.img.fallback.buffer
  );
}

export default defaultObject;
