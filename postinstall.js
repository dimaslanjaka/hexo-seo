// postinstall scripts
// run this script after `npm install`
// required	: cross-spawn axios ansi-colors
// update		: curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/postinstall.js > postinstall.js
// repo			: https://github.com/dimaslanjaka/nodejs-package-types/blob/main/postinstall.js
// raw			: https://github.com/dimaslanjaka/nodejs-package-types/raw/main/postinstall.js
// usages		: node postinstall.js

const pjson = require('./package.json');
const fs = require('fs');
const path = require('path');

//// CHECK REQUIRED PACKAGES

const scriptname = `[postinstall]`;
const isAllPackagesInstalled = ['cross-spawn', 'axios', 'ansi-colors', 'glob'].map((name) => {
  return {
    name,
    installed: isPackageInstalled(name)
  };
});
if (!isAllPackagesInstalled.every((o) => o.installed === true)) {
  const names = isAllPackagesInstalled.filter((o) => o.installed === false).map((o) => o.name);
  console.log(scriptname, 'package', names.join(', '), 'is not installed', 'skipping postinstall script');
  process.exit(0);
}

//// POSTINSTALL START

// imports start
const { spawn } = require('cross-spawn');
const Axios = require('axios');
const glob = require('glob');
const upath = require('upath');
const crypto = require('crypto');
const colors = require('ansi-colors');
// const persistentCache = require('persistent-cache');
// imports ends

let isYarn = fs.existsSync(path.join(__dirname, 'yarn.lock'));
const argv = process.argv.slice('2');
if (argv.includes('--yarn') || argv.includes('-yarn')) {
  isYarn = true;
}

// cache file
const cacheJSON = path.join(__dirname, 'node_modules/.cache/npm-install.json');
console.log('cache json', cacheJSON);
if (!fs.existsSync(path.dirname(cacheJSON))) {
  fs.mkdirSync(path.dirname(cacheJSON), { recursive: true });
}
if (!fs.existsSync(cacheJSON)) {
  fs.writeFileSync(cacheJSON, '{}');
}

/**
 * Get cache
 * @returns {import('./node_modules/cache/npm-install.json')}
 */
const getCache = () => JSON.parse(readfile(cacheJSON, 'utf-8'));

/**
 * Save cache
 * @param {any} data
 * @returns
 * @example
 * const data = getCache()
 * data['key']='value';
 * saveCache(data)
 */
const saveCache = (data) => writefile(cacheJSON, JSON.stringify(data, null, 2));

// @todo clear cache local packages
const packages = [pjson.dependencies || {}, pjson.devDependencies || {}, pjson.optionalDependencies || {}];

/**
 * list packages to update
 * @type {Set<string>}
 */
const toUpdate = new Set();
let hasNotInstalled = false;
const coloredScriptName = colors.grey(scriptname);

(async () => {
  try {
    const node_modules_dir = path.join(__dirname, 'node_modules');
    const yarnVersion = (await summon('yarn', ['--version'])).stdout.trim();
    if (isYarn) {
      console.log('yarn version', yarnVersion);
    }

    // skip if project not yet installed
    if (!fs.existsSync(node_modules_dir)) {
      console.log(coloredScriptName, 'project not yet installed');
      return;
    }

    for (let i = 0; i < packages.length; i++) {
      const pkgs = packages[i];
      // detect index
      const isDevPkg = i === 1;
      const isOptionalPkg = i === 2;
      for (const pkgname in pkgs) {
        /**
         * @type {string}
         */
        const version = pkgs[pkgname];
        /**
         * colored package name
         */
        const coloredPkgname = colors.magenta(pkgname);

        /**
         * is remote url package
         */
        let isTarballPkg = /^(https?)|.(tgz|zip|tar|tar.gz)$|\/tarball\//i.test(version);

        /**
         * is github package
         */
        let isGitPkg = /^(git+|github:|https?:\/\/github.com\/)/i.test(version);

        // fix conflict type package url and git
        if (/^https?:\/\/github.com\//i.test(version)) {
          // is tarball path
          const isTarball = /\/tarball\//i.test(version) || /.(tgz|zip|tar|tar.gz)$/i.test(version);
          isGitPkg = isGitPkg && !isTarball;
          if (isTarballPkg) {
            // is link to github directly
            let isPkgGit = /.git$/i.test(version);
            try {
              const lock = require('./package-lock.json');
              /**
               * @type {import('./package-lock.json')['packages']['node_modules/prettier']['dependencies']}
               */
              const lockdeps = lock.packages['node_modules/' + pkgname].dependencies;
              const { /*integrity,*/ resolved } = lockdeps;
              isPkgGit = isPkgGit || /^git\+ssh:\/\/git@github.com\//i.test(String(resolved));
            } catch {
              //
            }
            isTarballPkg = isTarballPkg && !isPkgGit;
          }
        }

        /**
         * is local package
         */
        const isLocalPkg = /^(file):/i.test(version);

        /**
         * is local tarball package
         */
        const isLocalTarballpkg = isLocalPkg && /.(tgz|zip|tar|tar.gz)$/i.test(version);

        // delete package from npm registry from index
        if (!isLocalPkg && !isGitPkg && !isTarballPkg) {
          delete pkgs[pkgname];
          continue;
        }

        // add all monorepos and private ssh packages to be updated without checking
        if (/^((file|github):|(git|ssh)\+|http)/i.test(version)) {
          console.log(
            coloredScriptName,
            'updating',
            coloredPkgname,
            isGitPkg
              ? colors.blueBright('git')
              : isLocalTarballpkg
              ? colors.bold(colors.greenBright('local tarball'))
              : isLocalPkg
              ? colors.greenBright('local')
              : isTarballPkg
              ? colors.yellowBright('tarball')
              : ''
          );
          if (isLocalPkg && !isLocalTarballpkg) {
            const arg = [version, isDevPkg ? '-D' : isOptionalPkg ? '-O' : '--save'].filter((str) => str.length > 0);
            /**
             * @type {Parameters<typeof folder_to_hash>[2]}
             */
            const hoption = {
              ignored: [
                '**/.*',
                '**/_*.json',
                '**/tmp/**',
                '**/build/**',
                '**/test*/**',
                '**/dist/**',
                '**/docs/**',
                '**/.cache/**',
                '**/temp/**'
              ],
              pattern: '**/{src,dist,lib}/**'
            };
            if (pkgname.startsWith('@types/')) {
              hoption.pattern = '**/*.d.ts';
            }
            if (pkgname.startsWith('hexo-theme-')) {
              hoption.pattern = '**/{package,package-lock}.json';
            }
            const folderHash = await folder_to_hash('sha1', version, hoption);
            const existingHash = ((getCache().folder || {})[pkgname] || {}).hash;
            if (!existingHash || folderHash.hash !== existingHash) {
              saveCache({
                folder: {
                  [pkgname]: {
                    hash: folderHash.hash
                  }
                }
              });
              console.log(
                'uninstalling',
                coloredPkgname,
                'and reinstalling with argument',
                colors.blueBright(...arg.filter((str) => str.startsWith('-')))
              );
              await summon('npm', ['un', pkgname], { cwd: __dirname });
              await summon('npm', ['install', ...arg], { cwd: __dirname, stdio: 'inherit' });
            } else {
              //console.log(folderHash.hash, existingHash, folderHash.hash == existingHash);
              console.log(coloredScriptName, 'no changes found', coloredPkgname);
            }
          } else {
            toUpdate.add(`${pkgname}@${version}`);
          }
        }
      }
    }

    // do update

    /**
     * Internal update cache
     * @returns {Promise<ReturnType<typeof getCache>>}
     */
    const updateCache = () => {
      return new Promise((resolve) => {
        // save to cache
        const data = getCache();
        for (let i = 0; i < toUpdate.length; i++) {
          const pkgname = toUpdate[i];
          data[pkgname] = Object.assign(data[pkgname] || {}, {
            lastInstall: new Date().getTime()
          });
        }

        saveCache(data);
        resolve(data);
      });
    };

    if (checkNodeModules()) {
      // filter duplicates package names
      const filterUpdates = Array.from(toUpdate).filter((item, index) => Array.from(toUpdate).indexOf(item) === index);

      if (filterUpdates.length > 0) {
        // do update
        try {
          if (isYarn) {
            if (typeof yarnVersion === 'string') {
              if (yarnVersion.includes('3.2.4')) {
                filterUpdates.push('--check-cache');
              }
            }
            // yarn cache clean
            if (filterUpdates.find((str) => str.startsWith('file:'))) {
              await summon('yarn', ['cache', 'clean'], {
                cwd: __dirname,
                stdio: 'inherit'
              });
            }
            // yarn upgrade package
            const yarnArgs = [yarnVersion.startsWith('3') ? 'up' : 'upgrade'].concat(...filterUpdates);
            console.log(yarnArgs);
            await summon('yarn', yarnArgs, {
              cwd: __dirname,
              stdio: 'inherit'
            });
          } else {
            // npm cache clean package
            if (filterUpdates.find((str) => str.startsWith('file:'))) {
              const localPkg = filterUpdates.filter((str) => str.startsWith('file:'));
              await summon('npm', ['cache', 'clean'].concat(...localPkg), {
                cwd: __dirname,
                stdio: 'inherit'
              });
              console.log(
                coloredScriptName,
                'local package cache cleaned',
                ...localPkg.map((str) => colors.yellow(str))
              );
            }
            // npm update package
            await summon('npm', ['update'].concat(...filterUpdates), {
              cwd: __dirname,
              stdio: 'inherit'
            });
          }

          // update cache
          await updateCache();

          const argv = process.argv;
          // node postinstall.js --commit
          if (fs.existsSync(path.join(__dirname, '.git')) && argv.includes('--commit')) {
            await summon('git', ['add', 'package.json'], { cwd: __dirname });
            await summon('git', ['add', 'package-lock.json'], {
              cwd: __dirname
            });
            const status = await summon('git', ['status', '--porcelain'], {
              cwd: __dirname
            });

            if (
              status.stdout &&
              (status.stdout.includes('package.json') || status.stdout.includes('package-lock.json'))
            ) {
              await summon('git', ['add', 'package.json', 'package-lock.json'], {
                cwd: __dirname
              });
              await summon('git', ['commit', '-m', 'Update dependencies', '-m', 'Date: ' + new Date()], {
                cwd: __dirname
              });
            }
          }
        } catch (e) {
          if (e instanceof Error) console.error(e.message);
        }
      } else {
        if (hasNotInstalled) {
          console.log(coloredScriptName, colors.green('some packages not yet installed'));
        } else {
          console.log(coloredScriptName, 'all monorepo packages already at latest version');
        }
      }
    } else {
      if (hasNotInstalled) {
        console.log(coloredScriptName, 'some packages not yet installed');
      } else {
        console.log(coloredScriptName, 'some packages deleted from node_modules');
      }
    }
  } catch (e) {
    console.log(e.message);
  }
})();

/**
 * spawn command prompt
 * @param {string} cmd
 * @param {string[]} args
 * @param {Parameters<typeof spawn>[2]} opt
 * @returns {Promise<Error|{stdout:string,stderr:string}>}
 */
function summon(cmd, args = [], opt = {}) {
  const spawnopt = Object.assign({ cwd: __dirname }, opt || {});
  // *** Return the promise
  return new Promise(function (resolve) {
    if (typeof cmd !== 'string' || cmd.trim().length === 0) return resolve(new Error('cmd empty'));
    let stdout = '';
    let stderr = '';
    const child = spawn(cmd, args, spawnopt);
    // if (spawnopt.stdio === 'ignore') child.unref();

    if (child.stdout && 'on' in child.stdout) {
      child.stdout.setEncoding('utf8');
      child.stdout.on('data', (data) => {
        stdout += data;
      });
    }

    if (child.stderr && 'on' in child.stdout) {
      child.stderr.setEncoding('utf8');
      child.stderr.on('data', (data) => {
        stderr += data;
      });
    }

    // silence errors
    child.on('error', (err) => {
      console.log('got error', err);
    });

    child.on('close', function (code) {
      // Should probably be 'exit', not 'close'
      if (code !== 0) console.log('[ERROR]', cmd, ...args, 'dies with code', code);
      // *** Process completed
      resolve({ stdout, stderr });
    });
    child.on('error', function (err) {
      // *** Process creation failed
      resolve(err);
    });
  });
}

/**
 * No Operation
 * @param  {...any} _
 * @returns {undefined}
 */
function _noop(..._) {
  return;
}

/**
 * convert file to hash
 * @param {'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5'} alogarithm
 * @param {string} path
 * @param {import('crypto').BinaryToTextEncoding} encoding
 * @returns
 */
function file_to_hash(alogarithm, path, encoding = 'hex') {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash(alogarithm);
    const rs = fs.createReadStream(path);
    rs.on('error', reject);
    rs.on('data', (chunk) => hash.update(chunk));
    rs.on('end', () => resolve(hash.digest(encoding)));
  });
}

/**
 * convert data to hash
 * @param {'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5'} alogarithm
 * @param {string} path
 * @param {import('crypto').BinaryToTextEncoding} encoding
 * @returns
 */
function data_to_hash(alogarithm = 'sha1', data, encoding = 'hex') {
  return new Promise((resolve, reject) => {
    try {
      const hash = crypto.createHash(alogarithm).update(data).digest(encoding);
      resolve(hash);
    } catch (e) {
      reject(e);
    }
  });
}

/**
 * convert data to hash
 * @param {'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5'} alogarithm
 * @param {string} url
 * @param {import('crypto').BinaryToTextEncoding} encoding
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function url_to_hash(alogarithm = 'sha1', url, encoding = 'hex') {
  return new Promise((resolve, reject) => {
    let outputLocationPath = path.join(__dirname, 'node_modules/.cache/postinstall', path.basename(url));
    // remove slashes when url ends with slash
    if (!path.basename(url).endsWith('/')) {
      outputLocationPath = outputLocationPath.replace(/\/$/, '');
    }
    // add extension when dot not exist
    if (!path.basename(url).includes('.')) {
      outputLocationPath += '.tgz';
    }
    if (!fs.existsSync(path.dirname(outputLocationPath))) {
      fs.mkdirSync(path.dirname(outputLocationPath), { recursive: true });
    }
    const writer = fs.createWriteStream(outputLocationPath, { flags: 'w' });
    Axios.default(url, { responseType: 'stream' }).then((response) => {
      response.data.pipe(writer);
      let error = null;
      writer.on('error', (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on('close', async () => {
        if (!error) {
          // console.log('package downloaded', outputLocationPath.replace(__dirname, ''));
          file_to_hash(alogarithm, outputLocationPath, encoding).then((checksum) => {
            resolve(checksum);
          });
        }
      });
    });
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
    return modules.indexOf('NativeModule ' + packageName) >= 0 || fs.existsSync(require.resolve(packageName));
  } catch (e) {
    return false;
  }
}

/**
 * check if all packages exists
 * @returns
 */
function checkNodeModules() {
  const exists = Array.from(toUpdate).map(
    (pkgname) =>
      fs.existsSync(path.join(__dirname, 'node_modules', pkgname)) &&
      fs.existsSync(path.join(__dirname, 'node_modules', pkgname, 'package.json'))
  );
  //console.log({ exists });
  return exists.every((exist) => exist === true);
}

/**
 * read file with validation
 * @param {string} str
 * @param {import('fs').EncodingOption} encoding
 * @returns
 */
function readfile(str, encoding = 'utf-8') {
  if (fs.existsSync(str)) {
    if (fs.statSync(str).isFile()) {
      return fs.readFileSync(str, encoding);
    } else {
      throw str + ' is directory';
    }
  } else {
    throw str + ' not found';
  }
}

/**
 * write to file recursively
 * @param {string} dest
 * @param {any} data
 */
function writefile(dest, data) {
  if (!fs.existsSync(path.dirname(dest))) fs.mkdirSync(path.dirname(dest), { recursive: true });
  if (fs.existsSync(dest)) {
    if (fs.statSync(dest).isDirectory()) throw dest + ' is directory';
  }
  fs.writeFileSync(dest, data);
}

/**
 * get hashes from folder
 * @param {'sha1' | 'sha256' | 'sha384' | 'sha512' | 'md5'} alogarithm
 * @param {string} folder
 * @param {{ ignored: string[], encoding: import('crypto').BinaryToTextEncoding, pattern: string }} options
 * @returns {Promise<{ filesWithHash: Record<string, string>, hash: string }>}
 */
async function folder_to_hash(alogarithm, folder, options) {
  return new Promise((resolve, reject) => {
    options = Object.assign({ encoding: 'hex', ignored: [] }, options || {});
    if (folder.startsWith('file:')) folder = folder.replace('file:', '');
    // fix non exist
    if (!fs.existsSync(folder)) folder = path.join(__dirname, folder);
    // run only if exist
    if (fs.existsSync(folder)) {
      glob(
        options.pattern || '**/*',
        {
          cwd: folder,
          ignore: (
            options.ignored || [
              '**/tmp/**',
              '**/build/**',
              '**/.cache/**',
              '**/dist/**',
              '**/.vscode/**',
              '**/coverage/**',
              '**/release/**',
              '**/bin/**',
              '**/*.json'
            ]
          ).concat('**/.git*/**', '**/node_modules/**'),
          dot: true,
          noext: true
        },
        async function (err, matches) {
          if (!err) {
            const filesWithHash = {};
            for (let i = 0; i < matches.length; i++) {
              const item = matches[i];
              const fullPath = upath.join(folder, item);
              const statInfo = fs.statSync(fullPath);
              if (statInfo.isFile()) {
                const fileInfo = `${fullPath}:${statInfo.size}:${statInfo.mtimeMs}`;
                const hash = await data_to_hash(alogarithm, fileInfo, options.encoding);
                filesWithHash[fullPath] = hash;
              }
            }
            resolve({
              filesWithHash,
              hash: await data_to_hash(alogarithm, Object.values(filesWithHash).join(''), options.encoding)
            });
          } else {
            reject(err);
          }
        }
      );
    } else {
      console.log(coloredScriptName, folder + ' not found');
    }
  });
}
