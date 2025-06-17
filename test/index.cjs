const path = require('upath');
const { runCommand } = require('./utils.cjs');

const cwd = path.resolve(__dirname, '..');
process.cwd = () => cwd;

runCommand('node', ['test/hexo-starter.cjs'], {
  stdio: 'inherit',
  cwd
});
