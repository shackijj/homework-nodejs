const { spawn } = require('child_process');

/**
 *
 * @param {string} cmd
 * @param {Array<string>} args
 */
function runCommand (cmd, args) {
  return new Promise((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const ps = spawn(cmd, args);
    ps.stdout.on('data', (data) => {
      stdout += data;
    });
    ps.stderr.on('data', (data) => {
      stderr += data;
    });

    ps.on('close', (code) => {
      if(code !== 0) {
        reject(stderr, code);
      }
      resolve(stdout, stderr);
    });
  });
};

module.exports = runCommand;
