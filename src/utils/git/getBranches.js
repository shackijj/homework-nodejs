const execShell = require('../execShell');

/**
 * @param {string} repoPath
 * @return {Promise}
 */
function getBranches (repoPath) {
  const cmd = `
    cd ${repoPath};
    git for-each-ref --format='%(refname:short)' refs/heads/;
  `;
  return execShell(cmd)
    .then((stdout) => stdout.trim().split('\n'));
};

module.exports = getBranches;
