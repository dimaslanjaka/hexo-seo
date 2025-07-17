/*
 * Generate CHANGELOG.md from commits and tags
 * repo: https://github.com/dimaslanjaka/nodejs-package-types/blob/main/changelog.js
 * raw: https://github.com/dimaslanjaka/nodejs-package-types/raw/main/changelog.js
 * update: curl -L https://github.com/dimaslanjaka/nodejs-package-types/raw/main/changelog.js > changelog.js
 */

const fs = require('fs');
const { EOL } = require('os');
const { join } = require('path');
const spawn = require('child_process').spawn;
const { default: conventionalChangelog } = require('conventional-changelog-core');
const angularPreset = require('conventional-changelog-angular');
const { spawnAsync } = require('cross-spawn');

function _getChangelogMarkdown() {
  return new Promise((resolve, reject) => {
    let output = '';
    // npx conventional-changelog -p angular -i CHANGELOG.md -s -r 1
    // npx conventional-changelog -p angular -s -o CHANGELOG.md

    conventionalChangelog(
      { preset: angularPreset },
      null, // package.json (null = auto)
      null, // git-raw-commits options
      null, // parser options
      null // writer options
    )
      .on('data', (chunk) => {
        output += chunk.toString();
      })
      .on('end', () => {
        resolve(output);
      })
      .on('error', reject);
  });
}

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

// git log reference https://www.edureka.co/blog/git-format-commit-history/
// git log date format reference https://stackoverflow.com/questions/7853332/how-to-change-git-log-date-formats
// custom --pretty=format:"%h %ad | %s %d [%an]" --date=short v1.1.4...v1.1.8
// default --pretty=oneline v1.1.4...v1.1.8
(async () => {
  try {
    let markdown = ``;

    fs.writeFileSync(join(__dirname, 'CHANGELOG.md'), markdown); // reset

    const commits = await gitExec(['log', '--pretty=format:%h !|! %ad !|! %s %d', `--date=format:%Y-%m-%d %H:%M:%S`]);
    const commitList = commits.split(/\r?\n/gm).slice().reverse();
    for (let index = 0; index < commitList.length; index++) {
      const str = commitList[index];
      const splitx = str.split('!|!').map((s) => s.trim());
      const o = {
        hash: splitx[0],
        date: splitx[1],
        message: splitx[2]
      };
      if (o.message.includes('tag: v')) {
        console.log(`Found tag: ${o.message}`);
        const regex = /(.+)\s+\(tag:.+((0|[1-9][0-9]*).(0|[1-9][0-9]*).(0|[1-9][0-9]*))\)/im;
        const m = o.message.match(regex);
        let versionTitle;
        let versionMessage;
        if (m && m.length > 0) {
          versionTitle = m[2];
          versionMessage = m[1];
          markdown += `\n**${versionTitle}**\n\n${versionMessage}\n` + EOL;
        } else {
          markdown +=
            `\n**${o.message
              .replace(/\(.*\),?/, '')
              .replace(/tag:?\s/, '')
              .trim()}**\n` + EOL;
        }
      } else {
        markdown +=
          `- [ _${o.date}_ ] [${o.hash}](https://github.com/dimaslanjaka/safelink/commit/${o.hash}) ${o.message.replace(
            /,$/,
            ''
          )}` + EOL;
      }
      if (index === commitList.length - 1) {
        if (!markdown.trim().startsWith('**')) {
          markdown = '**0.0.1** - _init project_\n' + markdown;
        }
        try {
          const prettier = await import('prettier');
          const result = await prettier.format(markdown, { parser: 'markdown' });
          fs.writeFileSync(join(__dirname, 'CHANGELOG.md'), result);
        } catch {
          fs.writeFileSync(join(__dirname, 'CHANGELOG.md'), markdown);
        }
      }
    }
  } catch (err) {
    console.error(err);
  }

  await spawnAsync('npx', ['conventional-changelog', '-p', 'angular', '-s', '-o', 'CHANGELOG.md'], {
    stdio: 'inherit',
    cwd: __dirname
  });
})();
