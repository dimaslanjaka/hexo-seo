/* eslint-disable no-undef */
/* eslint-disable no-shadow */
/* eslint-disable no-console */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-var-requires */
/** npm run publish with auto changelog **/

const { exec } = require('child_process');
const { writeFileSync } = require('fs');
const versionParser = require('./src/versionParser');
const readline = require('readline');

const rl = readline.createInterface(process.stdin, process.stdout);
const packages = require('./package.json');

const version = new versionParser(packages.version);

function updateChangelog(callback) {
  exec('node changelog.js', (err, _stdout, _stderr) => {
    if (!err) {
      if (typeof callback === 'function') callback();
    }
    throw err;
  });
}

if (typeof version === 'object') {
  rl.question('Overwrite? [yes]/no: ', function (answer) {
    if (answer.toLowerCase() === 'no' || answer.toLowerCase() === 'n') {
      console.log('Publish Cancel');
    } else {
      packages.version = version.toString();
      writeFileSync('./package.json', JSON.stringify(packages, null, 2));
      console.log('Compiling...');
      exec('npm run build', (err, _stdout, stderr) => {
        if (!err) {
          console.log('Build Typescript Successfully');
          console.log('Publishing...');
          exec('npm publish', (_err, _stdout, _stderr) => {
            console.log('Packages Published Successfully');

            // add to git
            updateChangelog(() => {
              exec('git add .', (err) => {
                if (!err) {
                  console.log('Updating version');
                  version.result.build++;
                  exec(`git commit -m "Update release ${version.toString()}"`);
                }
              });
            });
          });
        } else {
          console.log('Publish Failed, Rollback version');
          version.result.build--;
          packages.version = version.toString();
          writeFileSync('./package.json', JSON.stringify(packages, null, 2));

          console.log(stderr);
          throw err;
        }
      });
    }
    rl.close();
  });
}
