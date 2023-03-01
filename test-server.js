const { spawn } = require('git-command-helper');
const path = require('path');

const cwd = path.join(__dirname, '../..');
(async function () {
  // await spawn('yarn', ['workspace', 'wmi', 'exec', '"hexo clean"'], { cwd, stdio: 'inherit', shell: true });
  await spawn('yarn', ['workspace', 'wmi', 'exec', '"hexo server"'], { cwd, stdio: 'inherit', shell: true });
})();
