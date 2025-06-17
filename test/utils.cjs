const { spawn } = require('cross-spawn');

/**
 * Runs a shell command with live output
 * @param {string} command
 * @param {string[]} args
 * @param {object} [options]
 * @returns {Promise<void>}
 */
function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options
    });

    child.on('error', reject);

    child.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Command failed: ${command} ${args.join(' ')}`));
      }
      resolve();
    });
  });
}

module.exports = {
  runCommand
};
