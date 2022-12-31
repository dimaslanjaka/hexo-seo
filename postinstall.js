// postinstall scripts
// run this script after `npm install`
// required	: cross-spawn upath axios-cache-interceptor axios hpagent persistent-cache
// update		: curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/postinstall.js > postinstall.js
// repo			: https://github.com/dimaslanjaka/nodejs-package-types/blob/main/postinstall.js
// raw			: https://github.com/dimaslanjaka/nodejs-package-types/raw/main/postinstall.js
// usages		: node postinstall.js

const pjson = require('./package.json');
const fs = require('fs');
const path = require('path');

//// CHECK REQUIRED PACKAGES

const scriptname = `[postinstall]`;
const isAllPackagesInstalled = [
  'cross-spawn',
  'upath',
  'axios-cache-interceptor',
  'axios',
  'hpagent',
  'persistent-cache',
  'ansi-colors'
].map((name) => {
  return {
    name,
    installed: isPackageInstalled(name)
  };
});
if (!isAllPackagesInstalled.every((o) => o.installed === true)) {
  const names = isAllPackagesInstalled.filter((o) => o.installed === false).map((o) => o.name);
  console.log(scriptname, 'package', names.join(', '), 'is not installed', 'skipping postinstall script');
  return;
}

//// POSTINSTALL START

// imports start
const { spawn } = require('cross-spawn');
const Axios = require('axios');
// const upath = require('upath');
const crypto = require('crypto');
const { setupCache } = require('axios-cache-interceptor');
const axios = setupCache(Axios);
const { HttpProxyAgent, HttpsProxyAgent } = require('hpagent');
const colors = require('ansi-colors');
// const persistentCache = require('persistent-cache');
// imports ends

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
const getCache = () => require('./node_modules/.cache/npm-install.json');

/**
 * Save cache
 * @param {any} data
 * @returns
 * @example
 * const data = getCache()
 * data['key']='value';
 * saveCache(data)
 */
const saveCache = (data) => fs.writeFileSync(cacheJSON, JSON.stringify(data, null, 2));

// @todo clear cache local packages
const packages = [pjson.dependencies, pjson.devDependencies];

/**
 * list packages to update
 * @type {string[]}
 */
const toUpdate = [];
let hasNotInstalled = false;
const coloredScriptName = colors.grey(scriptname);
/**
 * argument value
 */
const argv = process.argv.slice(2);

(async () => {
  try {
    const node_modules_dir = path.join(__dirname, 'node_modules');
    // skip if project not yet installed
    if (!fs.existsSync(node_modules_dir)) {
      console.log(coloredScriptName, 'project not yet installed');
      return;
    }

    if (!fs.accessSync(path.join(node_modules_dir))) {
      console.log(coloredScriptName, 'cannot access node_modules');
      console.log(coloredScriptName, 'probably you still run `npm install`');
      return;
    }

    // dump file
    const jsonfile = path.join(__dirname, 'tmp/postinstall/monorepos.json');
    if (!fs.existsSync(path.dirname(jsonfile))) {
      fs.mkdirSync(path.dirname(jsonfile), { recursive: true });
    }
    const json = {};

    for (let i = 0; i < packages.length; i++) {
      const pkgs = packages[i];
      //const isDev = i === 1; // <-- index devDependencies
      for (const pkgname in pkgs) {
        /**
         * @type {string}
         */
        const version = pkgs[pkgname];
        /**
         * colored package name
         */
        const coloredPkgname = colors.magenta(pkgname);

        // node postinstall.js --simple
        // add all monorepos packages to be updated without checking
        if (argv.includes('--simple')) {
          // push update local and monorepo package
          if (/^((file|github):|(git|ssh)\+|http)/i.test(version)) {
            //const arg = [version, isDev ? '-D' : ''].filter((str) => str.trim().length > 0);
            toUpdate.push(pkgname);
            continue;
          }
        }

        // push update for private ssh package
        if (/^(ssh+|git+ssh)/i.test(version)) {
          toUpdate.push(pkgname);
          continue;
        }

        const locks = ['./node_modules/.package-lock.json', './package-lock.json']
          .map((str) => path.join(__dirname, str))
          .filter(fs.existsSync)[0];
        /**
         * @type {import('./package-lock.json')}
         */
        const lockfile = fs.existsSync(locks) ? JSON.parse(fs.readFileSync(locks, 'utf-8')) : {};

        // parse existing lock file
        const installedLock = lockfile.packages['node_modules/' + pkgname];
        installedLock.name = pkgname;
        const { integrity, resolved } = installedLock;
        let original = typeof resolved === 'string' && !/^https?/i.test(String(resolved)) ? resolved : null;
        if (typeof original === 'string') {
          original = String(original).replace(/^file:/, '');
          original = path.resolve(path.join(__dirname, original));
        }

        const node_modules_path = path.join(__dirname, 'node_modules', pkgname);
        /**
         * is remote url package
         */
        let isUrlPkg = /^(https?)|.(tgz|zip|tar|tar.gz)$|\/tarball\//i.test(version);

        /**
         * is github package
         */
        let isGitPkg = /^(git+|github:|https?:\/\/github.com\/)/i.test(version);

        // fix conflict type package url and git
        if (/^https?:\/\/github.com\//i.test(version)) {
          // is tarball path
          const isTarball = /\/tarball\//i.test(version);
          isGitPkg = isGitPkg && !isTarball;
          if (isUrlPkg) {
            // is link to github directly
            const isPkgGit = /.git$/i.test(version) || /^git\+ssh:\/\/git@github.com\//i.test(resolved);
            isUrlPkg = isUrlPkg && !isPkgGit;
          }
        }

        /**
         * is local package
         */
        const isLocalPkg = /^(file):/i.test(version);
        if (!isLocalPkg && !isGitPkg && !isUrlPkg) {
          delete pkgs[pkgname];
          continue;
        }

        // dump
        json[pkgname] = Object.assign(json[pkgname] ? json[pkgname] : {}, {
          isLocalPkg,
          isGitPkg,
          isUrlPkg,
          resolved,
          version
        });

        // skip checking when not exist in node_modules
        // npm will automate installing these packages
        if (!fs.existsSync(path.join(__dirname, 'node_modules', pkgname))) {
          hasNotInstalled = true;
          console.log(coloredScriptName, coloredPkgname, colors.red('not installed.'), 'skipping...');
          continue;
        }

        // checksum remote package
        if (isUrlPkg) {
          // console.log({ pkgname, integrity, resolved, original });
          const hash = 'sha512-' + (await url_to_hash('sha512', resolved, 'base64'));
          if (integrity !== hash) {
            console.log(coloredScriptName, 'remote package', pkgname, 'has different integrity');
            // fs.rmSync(node_modules_path, { recursive: true, force: true });
            toUpdate.push(pkgname);
            continue;
          }
        }

        // checksum local package
        if (original && isLocalPkg) {
          let originalHash = 'sha512-' + (await file_to_hash('sha512', original, 'base64'));

          // check sum tarball
          if (/\/tarball\/|.(tgz|zip|tar|tar.gz)$/i.test(version)) {
            // console.log(value);
            if (originalHash !== integrity && fs.existsSync(node_modules_path)) {
              console.log(coloredScriptName, 'local package', pkgname, 'has different integrity');
              // fs.rmSync(node_modules_path, { recursive: true, force: true });
              toUpdate.push(pkgname);
              continue;
            }
          }
        }

        // checksum github package
        if (isGitPkg) {
          const githubPathHash = String(resolved)
            .replace(/git\+ssh:\/\/git@github.com\/|.git/gim, '')
            .split('#')
            .map((str) => str.trim());
          const githubPath = githubPathHash[0];
          const githubHash = githubPathHash[1];
          const isBranchPkg = String(version).includes('#');

          const apiRoot = 'https://api.github.com/repos/' + githubPath;

          try {
            if (isBranchPkg) {
              const branch = String(version).split('#')[1];
              const api = 'https://api.github.com/repos/' + githubPath + '/commits/' + branch;
              const getApi = await axiosGet(api);
              // skip when get api failure
              if (!getApi) continue;
              if (getApi.data.sha != githubHash && fs.existsSync(node_modules_path)) {
                console.log(
                  coloredScriptName,
                  'github package',
                  pkgname,
                  'from branch',
                  branch,
                  'has different commit hash'
                );
                // fs.rmSync(node_modules_path, { recursive: true, force: true });
                toUpdate.push(pkgname);
                continue;
              }
            } else {
              const getApiRoot = await axiosGet(apiRoot);
              // skip when get api failure
              if (!getApiRoot) continue;
              const branch = getApiRoot.data.default_branch;
              const api = 'https://api.github.com/repos/' + githubPath + '/commits/' + branch;
              const getApi = await axiosGet(api);
              // skip when get api failure
              if (!getApi) continue;
              console.log({ version, githubPathHash, data: getApi.data.sha });
              if (getApi.data.sha != githubHash && fs.existsSync(node_modules_path)) {
                console.log(
                  coloredScriptName,
                  'github package',
                  pkgname,
                  'from branch',
                  branch,
                  'has different commit hash'
                );
                // fs.rmSync(node_modules_path, { recursive: true, force: true });
                toUpdate.push(pkgname);
                continue;
              }
            }
          } catch (e) {
            if (e instanceof Error) console.log(e.code, e.message);
          }
        }
      }
    }

    // dump write
    fs.writeFileSync(jsonfile, JSON.stringify(json, null, 2));

    // do update

    const isYarn = fs.existsSync(path.join(__dirname, 'yarn.lock'));

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
      const filterUpdates = toUpdate.filter((item, index) => toUpdate.indexOf(item) === index);
      if (filterUpdates.length > 0) {
        // do update
        try {
          if (isYarn) {
            const version = await summon('yarn', ['--version']);
            console.log('yarn version', version);

            if (typeof version.stdout === 'string') {
              if (version.stdout.includes('3.2.4')) {
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
            await summon('yarn', ['upgrade'].concat(...filterUpdates), {
              cwd: __dirname,
              stdio: 'inherit'
            });
          } else {
            // npm cache clean package
            if (filterUpdates.find((str) => str.startsWith('file:'))) {
              await summon('npm', ['cache', 'clean'].concat(...filterUpdates), {
                cwd: __dirname,
                stdio: 'inherit'
              });
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
    console.trace(e);
  }
})();

/**
 * axios.get with cache ability
 * @param {string} url
 * @returns {Promise<import('axios').AxiosResponse<any, any>|undefined>}
 */
async function axiosGet(url) {
  Array.prototype.sample = function () {
    return this[Math.floor(Math.random() * this.length)];
  };

  /**
   * @type {import('hpagent').HttpsProxyAgentOptions}
   */
  const agentConfig = {
    // proxy: '',
    keepAlive: true
    // keepAliveMsecs: 2000,
    // maxSockets: 256,
    // maxFreeSockets: 256,
  };
  const proxy = ['51.158.154.173:3128', '20.121.184.238:9401'].sample();
  if (url.includes('//api.github.com')) {
    agentConfig.proxy = 'http://' + proxy;
  }
  try {
    return await axios.get(url, {
      cache: {
        cachePredicate: {
          // Only cache if the response comes with a "good" status code
          statusCheck: (status_1) => status_1 === 200,

          // Check custom response body
          responseMatch: ({ data }) => {
            // Sample that only caches if the response contains condition
            if (url.includes('//api.github.com')) {
              return typeof data.sha === 'string';
            }
            // skip cache
            return false;
          }
        }
      },
      timeout: 10000,
      maxRedirects: 5,
      httpAgent: new HttpProxyAgent(agentConfig),
      httpsAgent: new HttpsProxyAgent(agentConfig)
    });
  } catch (_) {
    return _noop(_);
  }
}

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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
async function url_to_hash(alogarithm = 'sha1', url, encoding = 'hex') {
  return new Promise((resolve, reject) => {
    let outputLocationPath = path.join(__dirname, 'tmp/postinstall', path.basename(url));
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
  const exists = toUpdate.map(
    (pkgname) =>
      fs.existsSync(path.join(__dirname, 'node_modules', pkgname)) &&
      fs.existsSync(path.join(__dirname, 'node_modules', pkgname, 'package.json'))
  );
  //console.log({ exists });
  return exists.every((exist) => exist === true);
}
