/* eslint-disable no-useless-escape */
const { spawn } = require("cross-spawn");
const { readdirSync, createReadStream } = require("fs");
const { existsSync, renameSync, rmSync, mkdirpSync, writeFileSync } = require("fs-extra");
const GulpClient = require("gulp");
const { join, dirname } = require("upath");
const packagejson = require("./package.json");

// auto create tarball (tgz) on release folder
// raw: https://raw.githubusercontent.com/dimaslanjaka/static-blog-generator-hexo/master/packages/gulp-sbg/packer.js
// github: https://github.com/dimaslanjaka/static-blog-generator-hexo/blob/master/packages/gulp-sbg/packer.js
// update: curl https://raw.githubusercontent.com/dimaslanjaka/static-blog-generator-hexo/master/packages/gulp-sbg/packer.js > packer.js
// usage: node packer.js

console.log("=".repeat(19));
console.log("= packing started =");
console.log("=".repeat(19));

const releaseDir = join(__dirname, "release");
const child = spawn("npm", ["pack"], { cwd: __dirname, stdio: "ignore" });
let version = (function () {
  const v = parseVersion(packagejson.version);
  return `${v.major}.${v.minor}.${v.patch}`;
})();

child.on("exit", function () {
  const filename = slugifyPkgName(`${packagejson.name}-${version}.tgz`);
  const tgz = join(__dirname, filename);

  if (!existsSync(tgz)) {
    const filename2 = slugifyPkgName(`${packagejson.name}-${packagejson.version}.tgz`);
    const origintgz = join(__dirname, filename2);
    renameSync(origintgz, tgz);
  }
  const tgzlatest = join(releaseDir, slugifyPkgName(`${packagejson.name}.tgz`));

  const getPackageHashes = function () {
    return new Promise(function (resolve) {
      let data = {};
      let pkglock = [join(__dirname, "package-lock.json"), join(__dirname, "yarn.lock")].filter((str) =>
        existsSync(str)
      )[0];
      const readDir = readdirSync(releaseDir)
        .filter((path) => path.endsWith("tgz"))
        .map((path) => join(releaseDir, path));

      if (typeof pkglock === "string" && existsSync(pkglock)) {
        readDir.push(pkglock);
      }
      readDir.forEach((file, index, all) => {
        const crypto = require("crypto");

        const sha1 = (path) =>
          new Promise((resolve, reject) => {
            const hash = crypto.createHash("sha1");
            const rs = createReadStream(path);
            rs.on("error", reject);
            rs.on("data", (chunk) => hash.update(chunk));
            rs.on("end", () => resolve(hash.digest("hex")));
          });

        sha1(file)
          .then((hash) => {
            data = Object.assign({}, data, {
              [file]: {
                hash
              }
            });
          })
          .catch((err) => {
            throw new Error(err);
          })
          .finally(() => {
            if (index === all.length - 1) {
              //console.log("Last callback call at index " + index + " with value " + file);
              resolve(data);
            }
          });
      });
    });
  };

  if (!existsSync(dirname(tgzlatest))) {
    mkdirpSync(dirname(tgzlatest));
  }

  if (existsSync(tgz)) {
    GulpClient.src(tgz)
      .pipe(GulpClient.dest(releaseDir))
      .once("end", function () {
        if (existsSync(tgzlatest)) {
          rmSync(tgzlatest);
        }
        renameSync(tgz, tgzlatest);
        addReadMe();
        if (existsSync(tgz)) rmSync(tgz);

        // write hashes info
        getPackageHashes().then((hashes) => {
          writeFileSync(join(releaseDir, "metadata.json"), JSON.stringify(hashes));
        });

        console.log("=".repeat(20));
        console.log("= packing finished =");
        console.log("=".repeat(20));
      });
  }
});

function slugifyPkgName(str) {
  return str.replace(/\//g, "-").replace(/@/g, "");
}

/**
 * Parse Version
 * @param {string} versionString
 * @returns
 */
function parseVersion(versionString) {
  var vparts = versionString.split(".");
  const version = {
    major: parseInt(vparts[0]),
    minor: parseInt(vparts[1]),
    patch: parseInt(vparts[2].split("-")[0]),
    build: parseInt(vparts[3] || null),
    range: parseInt(vparts[2].split("-")[1]),
    commit: vparts[2].split("-")[2]
  };

  return version;
}

function addReadMe() {
  writeFileSync(
    join(releaseDir, "readme.md"),
    `
# Release \`${packagejson.name}\` Tarball

## Get URL of \`${packagejson.name}\` Release Tarball
- select tarball file
![gambar](https://user-images.githubusercontent.com/12471057/203216375-8af4b5d9-00c2-40fb-8d3d-d220beaabd46.png)
- copy raw url
![gambar](https://user-images.githubusercontent.com/12471057/203216508-7590cbb9-a1ce-47d6-96ca-8d82149f0762.png)
- or copy download url
![gambar](https://user-images.githubusercontent.com/12471057/203216541-3807d2c3-5213-49f3-b93d-c626dbae3b2e.png)
- then run installation from command line
\`\`\`bash
npm i https://....url-tgz
\`\`\`
for example
\`\`\`bash
npm i https://github.com/dimaslanjaka/static-blog-generator-hexo/raw/master/packages/gulp-sbg/release/static-blog-generator.tgz
\`\`\`

## URL Parts Explanations
> https://github.com/github-username/github-repo-name/raw/github-branch-name/path-to-file-with-extension
  `.trim()
  );
}
