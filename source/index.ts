import * as fs from "fs";
import path from "path";

export = {
  img: {
    fallback: {
      buffer: fs.readFileSync(path.join(__dirname, "img", "no-image.png")),
      public: "/hexo-seo/img/no-image.png"
    }
  }
};
