const pjson = require('./package.json');
const fs = require('fs');
const path = require('upath');
const { spawn } = require('cross-spawn');

// postinstall scripts
// run this script after `npm install`
// required	: npm i -D cross-spawn && npm i upath
// update		: curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/postinstall.js > postinstall.js
// repo			: https://github.com/dimaslanjaka/nodejs-package-types/blob/main/postinstall.js
// raw			: https://github.com/dimaslanjaka/nodejs-package-types/raw/main/postinstall.js
// usages		: node postinstall.js

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
const saveCache = (data) =>
  fs.writeFileSync(cacheJSON, JSON.stringify(data, null, 2));

(async () => {
  // @todo clear cache local packages
  const packages = [pjson.dependencies, pjson.devDependencies];
  /**
   * list packages to update
   * @type {string[]}
   */
  const toUpdate = [];

  for (let i = 0; i < packages.length; i++) {
    const pkgs = packages[i];
    //const isDev = i === 1; // <-- index devDependencies
    for (const pkgname in pkgs) {
      /**
       * @type {string}
       */
      const version = pkgs[pkgname];
      // re-installing local and monorepo package
      if (/^((file|github):|(git|ssh)\+|http)/i.test(version)) {
        //const arg = [version, isDev ? '-D' : ''].filter((str) => str.trim().length > 0);
        toUpdate.push(pkgname);
      }
    }
  }

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

  /**
   * check if all packages exists
   * @returns
   */
  const checkNodeModules = () => {
    const exists = toUpdate.map(
      (pkgname) =>
        fs.existsSync(path.join(__dirname, 'node_modules', pkgname)) &&
        fs.existsSync(
          path.join(__dirname, 'node_modules', pkgname, 'package.json')
        )
    );
    //console.log({ exists });
    return exists.every((exist) => exist === true);
  };

  if (checkNodeModules()) {
    try {
      if (isYarn) {
        const version = await summon('yarn', ['--version']);
        console.log('yarn version', version);

        if (typeof version.stdout === 'string') {
          if (version.stdout.includes('3.2.4')) {
            toUpdate.push('--check-cache');
          }
        }
        // yarn cache clean
        if (toUpdate.find((str) => str.startsWith('file:'))) {
          await summon('yarn', ['cache', 'clean'], {
            cwd: __dirname,
            stdio: 'inherit'
          });
        }
        // yarn upgrade package
        await summon('yarn', ['upgrade'].concat(...toUpdate), {
          cwd: __dirname,
          stdio: 'inherit'
        });
      } else {
        // npm cache clean package
        if (toUpdate.find((str) => str.startsWith('file:'))) {
          await summon('npm', ['cache', 'clean'].concat(...toUpdate), {
            cwd: __dirname,
            stdio: 'inherit'
          });
        }
        // npm update package
        await summon('npm', ['update'].concat(...toUpdate), {
          cwd: __dirname,
          stdio: 'inherit'
        });
      }

      // update cache
      await updateCache();

      const argv = process.argv;
      // node postinstall.js --commit
      if (
        fs.existsSync(path.join(__dirname, '.git')) &&
        argv.includes('--commit')
      ) {
        await summon('git', ['add', 'package.json'], { cwd: __dirname });
        await summon('git', ['add', 'package-lock.json'], { cwd: __dirname });
        const status = await summon('git', ['status', '--porcelain'], {
          cwd: __dirname
        });
        console.log({ status });
        if (
          status.stdout &&
          (status.stdout.includes('package.json') ||
            status.stdout.includes('package-lock.json'))
        ) {
          await summon(
            'git',
            ['commit', '-m', 'Update dependencies\nDate: ' + new Date()],
            {
              cwd: __dirname
            }
          );
        }
      }
    } catch (e) {
      if (e instanceof Error) console.error(e.message);
    }
  } else {
    console.log('some packages already deleted from node_modules');
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
    if (typeof cmd !== 'string' || cmd.trim().length === 0)
      return resolve(new Error('cmd empty'));
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
      if (code !== 0)
        console.log('[ERROR]', cmd, ...args, 'dies with code', code);
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
 * @returns
 */
function _noop(..._) {
  return;
}
