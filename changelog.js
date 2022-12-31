const { writeFileSync } = require('fs');
const { EOL } = require('os');
const { join } = require('path');
const pkg = require('./package.json');
const spawn = require('child_process').spawn;

/*
 * Generate CHANGELOG.md from commits and tags
 * repo: https://github.com/dimaslanjaka/nodejs-package-types/blob/main/changelog.js
 * raw: https://github.com/dimaslanjaka/nodejs-package-types/raw/main/changelog.js
 * update: curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/changelog.js > changelog.js
 */

/**
 * git
 * @param {string[]} command
 * @returns {Promise<string>}
 */
const gitExec = (command) =>
  new Promise((resolve, reject) => {
    const thread = spawn('git', command, { stdio: ['inherit', 'pipe', 'pipe'] });
    const stdOut = [];
    const stdErr = [];

    thread.stdout.on('data', (data) => {
      stdOut.push(data.toString('utf8'));
    });

    thread.stderr.on('data', (data) => {
      stdErr.push(data.toString('utf8'));
    });

    thread.on('close', () => {
      if (stdErr.length) {
        reject(stdErr.join(''));
        return;
      }
      resolve(stdOut.join());
    });
  });

let markdown = ``;

// git log reference https://www.edureka.co/blog/git-format-commit-history/
// git log date format reference https://stackoverflow.com/questions/7853332/how-to-change-git-log-date-formats
// custom --pretty=format:"%h %ad | %s %d [%an]" --date=short v1.1.4...v1.1.8
// default --pretty=oneline v1.1.4...v1.1.8
gitExec(['log', '--pretty=format:%h !|! %ad !|! %s %d', `--date=format:%Y-%m-%d %H:%M:%S`]).then(function (commits) {
  commits
    .split(/\r?\n/gm)
    .slice()
    .reverse()
    .forEach((str, index, all) => {
      const splitx = str.split('!|!').map((str) => str.trim());
      const o = {
        hash: splitx[0],
        date: splitx[1],
        message: splitx[2]
      };
      if (o.message.includes('tag: v')) {
        markdown += `\n**${o.message.replace(/\(.*\),?/, '').trim()}**\n` + EOL;
      } else {
        markdown +=
          `- [ _${o.date}_ ] [${o.hash}](https://github.com/dimaslanjaka/safelink/commit/${o.hash}) ${o.message.replace(
            /,$/,
            ''
          )}` + EOL;
      }
      if (index === all.length - 1) {
        if (!markdown.trim().startsWith('**')) {
          markdown = '**0.0.1** - _init project_\n' + markdown;
        }
        writeFileSync(join(__dirname, 'CHANGELOG.md'), markdown);
      }
    });
});
