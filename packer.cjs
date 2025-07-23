/* eslint-disable no-useless-escape */
const { spawn, async: spawnAsync } = require('cross-spawn');
const fs = require('fs-extra');
const { resolve, join, dirname, toUnix, basename } = require('upath');
const packagejson = require('./package.json');
const crypto = require('crypto');

// const os = require('os');

// auto create tarball (tgz) on release folder
// requred        : npm i -D https://github.com/dimaslanjaka/node-cross-spawn/tarball/private upath fs-extra
// raw            : https://github.com/dimaslanjaka/nodejs-package-types/raw/main/packer.js
// github         : https://github.com/dimaslanjaka/nodejs-package-types/blob/main/packer.js
// update         : curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/packer.js > packer.js
// usage          : node packer.js
// github actions : https://github.com/dimaslanjaka/nodejs-package-types/blob/main/.github/workflows/build-release.yml

//// CHECK REQUIRED PACKAGES

const scriptname = `[packer]`;
const isAllPackagesInstalled = ['cross-spawn', 'ansi-colors', 'glob', 'upath', 'minimist'].map((name) => ({
  name,
  installed: isPackageInstalled(name)
}));
if (!isAllPackagesInstalled.every((o) => o.installed === true)) {
  const names = isAllPackagesInstalled.filter((o) => o.installed === false).map((o) => o.name);
  console.log(scriptname, 'package', names.join(', '), 'is not installed', 'skipping postinstall script');
  process.exit(0);
}

const args = process.argv.slice(2);
const argv = require('minimist')(args);

const verbose = args.includes('-d') || args.includes('--verbose');
let log = console.log;
if (!verbose) {
  log = (..._args) => {
    //
  };
}

const withYarn = args.includes('-yarn') || args.includes('--yarn');
const withFilename = argv['fn'] || argv['filename'] ? true : false;
const releaseDir1 = join(__dirname, 'release');
const releaseDir2 = join(__dirname, 'releases');
const releaseDir = !fs.existsSync(releaseDir2) ? releaseDir1 : releaseDir2;

// create released directory when not exist
if (!fs.existsSync(releaseDir)) {
  fs.mkdirpSync(releaseDir);
}

log('='.repeat(19));
log('= packing started =');
log('='.repeat(19));

/**
 * is current device is Github Actions
 */
const _isCI = process.env.GITHUB_ACTION && process.env.GITHUB_ACTIONS;

const child = !withYarn
  ? spawn('npm', ['pack'], { cwd: __dirname, stdio: 'ignore' })
  : spawn('yarn', ['pack'], { cwd: __dirname, stdio: 'ignore' });

const version = (function () {
  const v = parseVersion(packagejson.version);
  return `${v.major}.${v.minor}.${v.patch}`;
})();

child.on('exit', withYarn ? bundleWithYarn : bundleWithNpm);

const getPackageHashes = async function () {
  let hashes = {};
  const metafile = join(releaseDir, 'metadata.json');
  // read old meta
  if (fs.existsSync(metafile)) {
    try {
      hashes = Object.assign(hashes, JSON.parse(fs.readFileSync(metafile, 'utf-8')));
    } catch {
      hashes = {};
    }
  }
  const pkglock = [join(__dirname, 'package-lock.json'), join(__dirname, 'yarn.lock')].filter((str) =>
    fs.existsSync(str)
  )[0];
  const readDir = fs
    .readdirSync(releaseDir)
    .filter((path) => path.endsWith('tgz'))
    .map((path) => join(releaseDir, path));

  if (typeof pkglock === 'string' && fs.existsSync(pkglock)) {
    readDir.push(pkglock);
  }
  for (let i = 0; i < readDir.length; i++) {
    const file = readDir[i];
    const stat = fs.statSync(file);
    const size = `${parseFloat(stat.size / Math.pow(1024, 1)).toFixed(2)} KB`;
    // assign to existing object
    hashes = Object.assign({}, hashes, {
      [toUnix(file).replace(toUnix(__dirname), '')]: {
        integrity: {
          sha1: await file_to_hash('sha1', file),
          sha256: await file_to_hash('sha256', file, 'base64'),
          md5: await file_to_hash('md5', file),
          sha512: await file_to_hash('sha512', file, 'base64')
        },
        size
      }
    });
    //log("Last callback call at index " + index + " with value " + file);

    //hashes = { [os.type()]: { [os.arch()]: hashes } };
    fs.writeFileSync(metafile, JSON.stringify(hashes, null, 2));
    log(hashes);
  }
};

function bundleWithYarn() {
  // create readme
  addReadMe();

  // start bundle
  let filename = 'package.tgz';
  let tgz = join(__dirname, filename);
  const targetFname =
    argv['fn'] || argv['filename'] || slugifyPkgName(`${packagejson.name}-${packagejson.version}.tgz`);
  if (!fs.existsSync(tgz)) {
    filename = slugifyPkgName(`${packagejson.name}-v${packagejson.version}.tgz`);
    tgz = join(__dirname, filename);
  }

  if (withFilename) {
    const tgzlatest = join(releaseDir, targetFname + '.tgz');
    if (fs.existsSync(tgz)) {
      fs.copySync(tgz, tgzlatest, { overwrite: true });
    }
  } else {
    const tgzlatest = join(releaseDir, slugifyPkgName(`${packagejson.name}.tgz`));
    const tgzversion = join(releaseDir, targetFname);

    if (fs.existsSync(tgz)) {
      fs.copySync(tgz, tgzlatest, { overwrite: true });
      fs.copySync(tgz, tgzversion, { overwrite: true });
    }
  }

  if (fs.existsSync(tgz)) {
    // remove package.tgz
    fs.rmSync(tgz, { recursive: true, force: true });
  }

  // write hashes info
  getPackageHashes().then(() => {
    log('='.repeat(20));
    log('= packing finished =');
    log('='.repeat(20));
  });
}

function bundleWithNpm() {
  const filename = slugifyPkgName(`${packagejson.name}-${version}.tgz`);
  const tgz = join(__dirname, filename);
  const tgzversion = join(releaseDir, filename);

  if (!fs.existsSync(tgz)) {
    const filename2 = slugifyPkgName(`${packagejson.name}-${packagejson.version}.tgz`);
    const origintgz = join(__dirname, filename2);
    fs.renameSync(origintgz, tgz);
  }
  const tgzlatest = join(releaseDir, slugifyPkgName(`${packagejson.name}.tgz`));

  // create dir when not exist
  if (!fs.existsSync(dirname(tgzlatest))) {
    fs.mkdirpSync(dirname(tgzlatest));
  }

  // create readme
  addReadMe();

  if (fs.existsSync(tgz)) {
    fs.copySync(tgz, tgzlatest);
    fs.copySync(tgz, tgzversion);
    if (fs.existsSync(tgz)) fs.rmSync(tgz);

    // write hashes info
    getPackageHashes().then(() => {
      log('='.repeat(20));
      log('= packing finished =');
      log('='.repeat(20));
    });
  }
}

function slugifyPkgName(str) {
  return str.replace(/\//g, '-').replace(/@/g, '');
}

/**
 * Parse Version
 * @param {string} versionString
 * @returns
 */
function parseVersion(versionString) {
  const vparts = versionString.split('.');
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

/**
 * create release/readme.md
 */
async function addReadMe() {
  // set username and email on CI
  if (_isCI) {
    await spawnAsync('git', ['config', '--global', 'user.name', 'dimaslanjaka'], {
      cwd: __dirname,
      stdio: 'inherit'
    });
    await spawnAsync('git', ['config', '--global', 'user.email', 'dimaslanjaka@gmail.com'], {
      cwd: __dirname,
      stdio: 'inherit'
    });
  }

  /**
   * @type {typeof import('git-command-helper')}
   */
  const gch = packagejson.name !== 'git-command-helper' ? require('git-command-helper') : require('./dist');

  const git = new gch.default(__dirname);
  const branch = (await git.getbranch()).filter((o) => o.active)[0].branch;
  const gitlatest = await git.latestCommit();

  const tarballs = fs
    .readdirSync(releaseDir)
    .filter((str) => str.endsWith('tgz'))
    .map((str) => {
      return {
        absolute: resolve(releaseDir, str),
        relative: resolve(releaseDir, str).replace(toUnix(__dirname), '')
      };
    })
    .filter((o) => fs.statSync(o.absolute).isFile());

  let md = `# Release \`${packagejson.name}\` tarball\n`;

  md += '## Releases\n';
  md += '| version | tarball url |\n';
  md += '| :--- | :--- |\n';
  for (let i = 0; i < tarballs.length; i++) {
    const tarball = tarballs[i];
    const relativeTarball = tarball.relative.replace(/^\/+/, '');
    // skip file not exist
    if (!fs.existsSync(tarball.absolute)) {
      console.log(tarball.relative, 'not found');
      continue;
    }
    // update index untracked
    await spawnAsync('git', ['update-index', '--untracked-cache']);
    // run `git fsck` fix long time getting git status
    // await spawnAsync('git', ['fsck']);
    // skip index tarball which ignored by .gitignore

    if (argv['commit']) {
      const checkIgnore = await git.isIgnored(relativeTarball, { cwd: __dirname });
      if (checkIgnore) {
        console.log(relativeTarball, 'ignored by .gitignore');
        continue;
      } else {
        await git.add(relativeTarball);
        const args = ['status', '-uno', '--porcelain', '--', relativeTarball, '|', 'wc', '-l'];
        const isChanged =
          parseInt(
            (
              await spawnAsync('git', args, {
                cwd: __dirname,
                shell: true
              })
            ).output.trim()
          ) > 0;
        if (isChanged) {
          //  commit tarball
          await git.commit('chore(tarball): update ' + gitlatest, '-m', { stdio: 'pipe' });
        }
      }
    }

    const hash = await git.latestCommit(tarball.relative.replace(/^\/+/, ''));
    const raw = await git.getGithubRepoUrl(tarball.relative.replace(/^\/+/, ''));
    let tarballUrl;
    const dev = raw.rawURL;
    const prod = raw.rawURL.replace('/raw/' + branch, '/raw/' + hash);
    let ver = basename(tarball.relative, '.tgz').replace(`${packagejson.name}-`, '');
    if (typeof hash === 'string') {
      if (isNaN(parseFloat(ver))) {
        ver = 'latest';
        tarballUrl = dev;
        md += `| ${ver} | ${prod} |\n`;
      } else {
        tarballUrl = prod;
      }
      md += `| ${ver} | ${tarballUrl} |\n`;
    }
  }

  md += `
use this tarball with \`resolutions\`:
\`\`\`json
{
  "resolutions": {
    "${packagejson.name}": "<url of tarball>"
  }
}
\`\`\`

## Releases

    `;

  fs.writeFileSync(
    join(releaseDir, 'readme.md'),
    md +
      `

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

/**
 * convert file to hash
 * @param {'sha1' | 'sha256' | 'sha384' | 'sha512', 'md5'} alogarithm
 * @param {string} path
 * @param {import('crypto').BinaryToTextEncoding} encoding
 * @returns
 */
function file_to_hash(alogarithm = 'sha1', path, encoding = 'hex') {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(alogarithm);
    const rs = fs.createReadStream(path);
    rs.on('error', reject);
    rs.on('data', (chunk) => hash.update(chunk));
    rs.on('end', () => resolve(hash.digest(encoding)));
  });
}

/**
 * check package installed
 * @param {string} packageName
 * @returns
 */
function isPackageInstalled(packageName) {
  try {
    const modules = Array.from(process.moduleLoadList).filter((str) => !str.startsWith('NativeModule internal/'));
    return modules.indexOf(`NativeModule ${packageName}`) >= 0 || fs.existsSync(require.resolve(packageName));
  } catch (e) {
    return false;
  }
}
