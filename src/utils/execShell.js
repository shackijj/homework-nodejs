const { exec } = require('child_process');

function execShell (cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error, stderr);
      }
      resolve(stdout, stderr);
    });
  });
};

module.exports = execShell;
