/* eslint-disable no-useless-escape */
const { spawn } = require('cross-spawn');
const { readdirSync, createReadStream, readFileSync } = require('fs');
const { existsSync, renameSync, rmSync, mkdirpSync, writeFileSync } = require('fs-extra');
const GulpClient = require('gulp');
const { join, dirname, toUnix } = require('upath');
const packagejson = require('./package.json');
const crypto = require('crypto');
// const os = require('os');

// auto create tarball (tgz) on release folder
// raw            : https://github.com/dimaslanjaka/nodejs-package-types/raw/main/packer.js
// github         : https://github.com/dimaslanjaka/nodejs-package-types/blob/main/packer.js
// update         : curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/packer.js > packer.js
// usage          : node packer.js
// github actions : https://github.com/dimaslanjaka/nodejs-package-types/blob/main/.github/workflows/build-release.yml

console.log('='.repeat(19));
console.log('= packing started =');
console.log('='.repeat(19));

const releaseDir = join(__dirname, 'release');
const child = spawn('npm', ['pack'], { cwd: __dirname, stdio: 'ignore' });
let version = (function () {
  const v = parseVersion(packagejson.version);
  return `${v.major}.${v.minor}.${v.patch}`;
})();

child.on('exit', function () {
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
      let hashes = {};
      const metafile = join(releaseDir, 'metadata.json');
      // read old meta
      if (existsSync(metafile)) {
        hashes = Object.assign(hashes, JSON.parse(readFileSync(metafile, 'utf-8')));
      }
      let pkglock = [join(__dirname, 'package-lock.json'), join(__dirname, 'yarn.lock')].filter((str) =>
        existsSync(str)
      )[0];
      const readDir = readdirSync(releaseDir)
        .filter((path) => path.endsWith('tgz'))
        .map((path) => join(releaseDir, path));

      if (typeof pkglock === 'string' && existsSync(pkglock)) {
        readDir.push(pkglock);
      }
      readDir.forEach((file, index, all) => {
        sha1(file)
          .then((hash) => {
            hashes = Object.assign({}, hashes, {
              [toUnix(file).replace(toUnix(__dirname), '')]: {
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

              //hashes = { [os.type()]: { [os.arch()]: hashes } };
              writeFileSync(metafile, JSON.stringify(hashes, null, 2));
              console.log(hashes);

              resolve(hashes);
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
      .once('end', function () {
        if (existsSync(tgzlatest)) {
          rmSync(tgzlatest);
        }
        renameSync(tgz, tgzlatest);
        addReadMe();
        if (existsSync(tgz)) rmSync(tgz);

        // write hashes info
        getPackageHashes().then(function () {
          console.log('='.repeat(20));
          console.log('= packing finished =');
          console.log('='.repeat(20));
        });
      });
  }
});

function slugifyPkgName(str) {
  return str.replace(/\//g, '-').replace(/@/g, '');
}

/**
 * Parse Version
 * @param {string} versionString
 * @returns
 */
function parseVersion(versionString) {
  var vparts = versionString.split('.');
  const version = {
    major: parseInt(vparts[0]),
    minor: parseInt(vparts[1]),
    patch: parseInt(vparts[2].split('-')[0]),
    build: parseInt(vparts[3] || null),
    range: parseInt(vparts[2].split('-')[1]),
    commit: vparts[2].split('-')[2]
  };

  return version;
}

function addReadMe() {
  writeFileSync(
    join(releaseDir, 'readme.md'),
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
npm i https://github.com/dimaslanjaka/nodejs-package-types/raw/main/release/nodejs-package-types.tgz
\`\`\`

## URL Parts Explanations
> https://github.com/github-username/github-repo-name/raw/github-branch-name/path-to-file-with-extension
  `.trim()
  );
}

function sha1(path) {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha1');
    const rs = createReadStream(path);
    rs.on('error', reject);
    rs.on('data', (chunk) => hash.update(chunk));
    rs.on('end', () => resolve(hash.digest('hex')));
  });
}
